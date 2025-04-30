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
    pub path: String,
    // pub point: Vec<f32>,         
    // pub voltage: Vec<f32>,     
    pub vs: Option<Vec<Vec<f32>>>,       
}

#[derive(Serialize)]
pub struct GpolPointChannel {
    pub x: usize,
    pub y: usize,
    pub values: Vec<f32>, // 所有通道的值
}

#[derive(Serialize)]
pub struct GpolSliceResult {
    pub width: usize,
    pub height: usize,
    pub m: usize,
    pub points: Vec<GpolPointChannel>,
    pub point: Vec<f32>,
}


#[tauri::command]
fn run_gpol(path_list: Vec<String>) -> Option<GpolResult> {
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

                                return Some(GpolResult {
                                    path: dir.to_string_lossy().to_string(),
                                    vs: Some(diff),
                                });
                        }
                    }
                }
            }
        }
    }

    None
}

#[tauri::command]
fn get_gpol(range: Vec<u32>, path: String) -> Result<GpolSliceResult, String> {
    if range.len() != 4 {
        return Err("Range 应该是 [col_start, col_end, row_start, row_end]".into());
    }

    let col_start = range[0] as usize;
    let col_end = range[1] as usize;
    let row_start = range[2] as usize;
    let row_end = range[3] as usize;

    let gdat_path = std::path::Path::new(&path).join("g.dat");
    let (point, voltage, (m, w, h)) = read::read_gpol(gdat_path)
        .map_err(|e| format!("读取 g.dat 失败: {}", e))?;
    let x_range = col_start.min(w - 1)..=col_end.min(w - 1);
    let y_range = row_start.min(h - 1)..=row_end.min(h - 1);

    let x_count = x_range.clone().count();
    let y_count = y_range.clone().count();
    
    let mut points = Vec::with_capacity(x_count * y_count);

    for y in y_range.clone() {
        for x in x_range.clone() {
            let mut values = Vec::with_capacity(m);
            for c in 0..m {
                let idx = c * w * h + y * w + x;
                values.push(unsafe { *voltage.get_unchecked(idx) });
            }
            points.push(GpolPointChannel { x, y, values });
        }
    }

    Ok(GpolSliceResult {
        width: w,
        height: h,
        m,
        points,
        point
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::async_runtime::spawn(ws::start_server());
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![run_gpol,get_gpol])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
