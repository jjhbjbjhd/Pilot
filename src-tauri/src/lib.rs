mod core;
mod utils;
use core::ws;
use walkdir::WalkDir;
use utils::read;
use std::collections::HashSet;
use serde::Serialize;
use rayon::prelude::*;

#[derive(Debug, Serialize)]
pub struct GpolResult {
    // pub point: Vec<f32>,         
    // pub voltage: Vec<f32>,     
    pub vs: Option<Vec<Vec<f32>>>,       
}


#[tauri::command]
fn run_gpol(path_list: Vec<String>) -> Option<GpolResult> {
    // 只需要第一个包含 g.dat 的目录
    for path in &path_list {
        for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
            if entry.file_type().is_file() {
                if let Some(ext) = entry.path().extension() {
                    if ext == "dat" && entry.file_name().to_string_lossy() == "g.dat" {
                        if let Some(parent) = entry.path().parent() {
                            let dir = parent.to_path_buf();
                            
                            // 找到第一个符合条件的目录后，直接开始处理
                            let gdat_path = dir.join("g.dat");

                            if let Ok((point_raw, voltage_raw, (_m, _w, _h))) = read::read_gpol(&gdat_path) {
                                // let point: Vec<f32> = point_raw.into_iter().map(|v| v as f32).collect();
                                // let voltage: Vec<f32> = voltage_raw.into_iter().map(|v| v as f32).collect();

                                let low_txt = read::read_txt(&dir.join("低温均值_V.txt"));
                                let high_txt = read::read_txt(&dir.join("高温均值_V.txt"));

                                let vs = match (high_txt, low_txt) {
                                    (Ok(high), Ok(low)) => {
                                        let diff: Vec<Vec<f32>> = high.iter().zip(low.iter())
                                            .map(|(h_row, l_row)| {
                                                h_row.iter().zip(l_row.iter()).map(|(h, l)| (h - l).abs()).collect()
                                            })
                                            .collect();
                                        Some(diff)
                                    }
                                    _ => None,
                                };

                                return Some(GpolResult {
                                    // point,
                                    // voltage,
                                    vs,
                                });
                            } else {
                                continue;
                            }
                        }
                    }
                }
            }
        }
    }
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::async_runtime::spawn(ws::start_server());
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![run_gpol])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
