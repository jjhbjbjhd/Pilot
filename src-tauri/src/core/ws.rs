use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{accept_async, tungstenite::protocol::Message};
use walkdir::WalkDir;
use calamine::{Reader, open_workbook_auto, DataType};
use zip::ZipArchive;
use base64::encode;
use std::fs::File;
use std::io::Read;
use serde_json::json;


#[derive(Debug, Deserialize)]
#[warn(dead_code)]
struct Job {
    folder_path: String,          // 字符串，稍后手动解析成 Vec<PathItem>
    filter: String,
    time_filter_range: String,     // 字符串，稍后手动解析成 Vec<String> 或类似
}

#[derive(Serialize)]
struct ExcelData {
    project_name: String,
    p_1: String,
    p_2: String,
    s_time: String,
    resp_avg: String,
    resp_rate_precent: String,
    noise_avg: String,
    sign_avg: String,
    resp_rate_avg: String,
    fixed_noise: String,
    netd: String,
    bad_pixes: String,
    bad_pixes_resp_rate: String,
    bad_pixes_netd: String,
    bad_pixes_noise: String,
    bad_pixes_number: String,
    bad_pixes_rate: String,
    detect_rate_avg: String,
    blind: String,
    image:  Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type", content = "payload")]
enum ClientMessage {
    #[serde(rename = "ping")]
    Ping,
    #[serde(rename = "task")]
    Task { job: Job }, 
    #[serde(other)]
    Unknown,
}

#[derive(Debug, Deserialize)]
struct PathItem {
    path: String,
    disabled: bool,
}

#[derive(Debug, Serialize)]
struct ServerMessage {
    msg: String,
    payload: Option<String>,
}

pub async fn start_server() {
    let addr = "127.0.0.1:8080";
    let listener = TcpListener::bind(&addr).await.expect("Failed to bind");

    println!("🟢 WebSocket server started on {}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(handle_connection(stream));
    }
}

async fn handle_connection(stream: TcpStream) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            eprintln!("❌ WebSocket handshake failed: {}", e);
            return;
        }
    };

    let (mut write, mut read) = ws_stream.split();

    while let Some(Ok(msg)) = read.next().await {
        if let Message::Text(text) = msg {
            // 尝试解析 JSON 消息
            match serde_json::from_str::<ClientMessage>(&text) {
                Ok(ClientMessage::Ping) => {
                    let response = ServerMessage {
                        msg: "pong".to_string(),
                        payload: None, // 这里可以根据需求增加 payload
                    };

                    let _ = write
                        .send(Message::Text(
                            serde_json::to_string(&response).unwrap().into(),
                        ))
                        .await;
                }
                Ok(ClientMessage::Task { job }) => {

                    let folder_path_vec: Vec<PathItem> = match serde_json::from_str(&job.folder_path) {
                        Ok(v) => v,
                        Err(_e) => {
                            continue;
                        }
                    };

                    let _time_range_vec: Vec<String> = match serde_json::from_str(&job.time_filter_range) {
                        Ok(v) => v,
                        Err(_e) => {
                            continue;
                        }
                    };

                    let _ = write
                        .send(Message::Text("📦 Starting task with folders".into()))
                        .await;

                    let mut excel_data: Vec<ExcelData> = Vec::new();
                    for folder in folder_path_vec {
                        if folder.disabled {
                            continue;
                        };

                        let _ = write.send(Message::Text(format!("📂 Processing folder: {}", folder.path).into())).await;

                        for entry in WalkDir::new(&folder.path).into_iter().filter_map(|e| e.ok()) {
                            if entry.file_type().is_file() {
                                if let Some (ext) = entry.path().extension() {
                                    if ext == "xlsx" {
                                        let file_name = entry.file_name().to_string_lossy().to_string();
                                        if file_name.starts_with("~$") {
                                            continue; // 🚫 跳过 Excel 临时文件
                                        }
                                        if file_name.contains("ExcelReport"){
                                            let _ = write.send(Message::Text(format!("📄 Processing file: {}", file_name).into())).await;

                                            let mut excel_data_item: ExcelData = ExcelData {
                                                project_name: String::new(),
                                                p_1:String::new(),
                                                p_2: String::new(),
                                                s_time: String::new(),
                                                resp_avg: String::new(),
                                                resp_rate_precent: String::new(),
                                                noise_avg: String::new(),
                                                sign_avg: String::new(),
                                                resp_rate_avg: String::new(),
                                                fixed_noise: String::new(),
                                                netd: String::new(),
                                                bad_pixes: String::new(),
                                                bad_pixes_resp_rate: String::new(),
                                                bad_pixes_netd: String::new(),
                                                bad_pixes_noise: String::new(),
                                                bad_pixes_number: String::new(),
                                                bad_pixes_rate: String::new(),
                                                detect_rate_avg: String::new(),
                                                blind: String::new(),
                                                image:  Vec::new(),
                                            };

                                            if let Ok(mut workbook) = open_workbook_auto(entry.path()) {
                                                if let Some((_, range)) = workbook.worksheets().first() {
                                                    if let Some(cell) = range.get_value((13, 4)){
                                                        excel_data_item.p_1 = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((14, 4)){
                                                        excel_data_item.p_2 = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((51, 3)){
                                                        excel_data_item.project_name = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((11, 4)){
                                                        excel_data_item.s_time = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((22, 4)){
                                                        excel_data_item.resp_avg = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((23, 4)){
                                                        excel_data_item.resp_rate_precent = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((24, 4)){
                                                        excel_data_item.noise_avg = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((25, 4)){
                                                        excel_data_item.sign_avg = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((26, 4)){
                                                        excel_data_item.resp_rate_avg = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((27, 4)){
                                                        excel_data_item.fixed_noise = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((28, 4)){
                                                        excel_data_item.netd = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((29, 4)){
                                                        excel_data_item.bad_pixes = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((30, 4)){
                                                        excel_data_item.bad_pixes_resp_rate = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((31, 4)){
                                                        excel_data_item.bad_pixes_netd = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((32, 4)){
                                                        excel_data_item.bad_pixes_noise = cell.to_string();
                                                    }
                                                    if let Some(cell) = range.get_value((33, 4)){
                                                        excel_data_item.bad_pixes_number = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((36, 6)){
                                                        excel_data_item.blind = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((45, 4)){
                                                        excel_data_item.detect_rate_avg = cell.to_string();
                                                    }

                                                    if let Some(cell) = range.get_value((34, 4)){
                                                        excel_data_item.bad_pixes_rate = cell.to_string();
                                                    }
                                                    
                                                }
                                               
                                                if let Ok(file) = File::open(entry.path()) {
                                                    if let Ok(mut archive) = ZipArchive::new(file) {
                                                        for i in 0..archive.len() {
                                                            let mut zip_file = archive.by_index(i).unwrap(); // ✅ 改名，避免冲突
                                                            let name = zip_file.name().to_string(); // ✅ 没问题了
                                            
                                                            if name.starts_with("xl/media/") && (name.ends_with(".png") || name.ends_with(".jpg") || name.ends_with(".jpeg")) {
                                                                let mut buf = Vec::new();
                                                                zip_file.read_to_end(&mut buf).unwrap(); // ✅ 使用 zip_file 读取
                                                                let mime = if name.ends_with(".png") {
                                                                    "image/png"
                                                                } else {
                                                                    "image/jpeg"
                                                                };
                                                                let data_uri = format!("data:{};base64,{}", mime, encode(&buf));
                                                                excel_data_item.image.push(data_uri);
                                                            }
                                                        }
                                                    }
                                                }

                                            }
                                            
                                            excel_data.push(excel_data_item);
                                            let _ = write.send(Message::Text(format!("✅ Processed Success..........").into())).await;
                                        }
                                    }
                                }  
                            }
                        }

                        let _ = write
                            .send(Message::Text(format!("📁 Done: {}", folder.path).into()))
                            .await;
                    }

                    let _ = write
                        .send(Message::Text("🎉 All tasks completed.".to_string().into()))
                        .await;

                    let json_payload = json!({
                        "type": "excel_data_batch",
                        "data": excel_data
                    });
                    
                    let _ = write.send(Message::Text(json_payload.to_string().into())).await;

                }
                Ok(ClientMessage::Unknown) | Err(_) => {
                    eprintln!("⚠️ Unknown or invalid message: {}", text);
                    let _ = write
                        .send(Message::Text("error: invalid message".to_string().into()))
                        .await;
                }
            }
        }
    }
}
