mod core;
mod utils;
use core::ws;
use walkdir::WalkDir;
use utils::read;
use std::collections::HashSet;
use serde::Serialize;
use rayon::prelude::*;

use std::io::Cursor;

#[derive(Debug, Serialize)]
pub struct GpolResult {
    // pub point: Vec<f32>,         
    // pub voltage: Vec<f32>,     
    pub vs: Option<Vec<Vec<f32>>>,       
}


#[tauri::command]
fn run_gpol(path_list: Vec<String>) -> Option<String> {
    for path in &path_list {
        for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
            if entry.file_type().is_file() && entry.file_name().to_string_lossy() == "g.dat" {
                if let Some(parent) = entry.path().parent() {
                    let dir = parent.to_path_buf();
                    let gdat_path = dir.join("g.dat");

                    if let Ok((_point_raw, _voltage_raw, (_m, _w, _h))) = read::read_gpol(&gdat_path) {
                        let low_txt = read::read_txt(&dir.join("低温均值_V.txt"));
                        let high_txt = read::read_txt(&dir.join("高温均值_V.txt"));

                        if let (Ok(high), Ok(low)) = (high_txt, low_txt) {
                            let diff: Vec<Vec<f32>> = high.iter().zip(low.iter())
                                .map(|(h_row, l_row)| {
                                    h_row.iter().zip(l_row.iter()).map(|(h, l)| (h - l).abs()).collect()
                                })
                                .collect();

                            return Some(read::vs_to_base64(diff));
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
