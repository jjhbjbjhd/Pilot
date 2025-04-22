use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{accept_async, tungstenite::protocol::Message};
use walkdir::WalkDir;

#[derive(Debug, Deserialize)]
#[warn(dead_code)]
struct Job {
    folder_path: String,          // 字符串，稍后手动解析成 Vec<PathItem>
    filter: String,
    time_filter_range: String,     // 字符串，稍后手动解析成 Vec<String> 或类似
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
                        Err(e) => {
                            continue;
                        }
                    };

                    let time_range_vec: Vec<String> = match serde_json::from_str(&job.time_filter_range) {
                        Ok(v) => v,
                        Err(e) => {
                            continue;
                        }
                    };

                    let _ = write
                        .send(Message::Text("📦 Starting task with folders".into()))
                        .await;


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
                                        if file_name.contains("ExcelReport"){
                                            let _ = write.send(Message::Text(format!("📄 Processing file: {}", file_name).into())).await;

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
