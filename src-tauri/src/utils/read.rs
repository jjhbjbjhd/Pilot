use std::fs::File;
use std::io::{Read, BufRead, BufReader};
use std::path::Path;
use image::codecs::png::PngEncoder;
use image::{GrayImage, Luma, ColorType};
use image::ImageEncoder; // 👈 关键 trait
use std::io::Cursor;
use base64::Engine;
// 定义一个函数，用于读取gpol文件
pub fn read_gpol<P: AsRef<Path>>(filename: P) -> Result<(Vec<f32>, Vec<f32>, (usize, usize, usize)), Box<dyn std::error::Error>> {
    // 打开文件
    let mut file = File::open(filename)?;
    // 创建一个空的向量，用于存储文件内容
    let mut data = Vec::new();
    // 将文件内容读入向量
    file.read_to_end(&mut data)?;

    // 判断文件类型是否为GVCF
    if &data[0..4] != b"GVCF" {
        // 如果不是，则返回错误
        return Err("文件类型错误".into());
    }

    // 将文件内容的前12个字节转换为i16类型的向量
    let shape: Vec<i16> = data[4..16]
        .chunks(2)
        .map(|b| i16::from_le_bytes([b[0], b[1]]))
        .collect();

    // 将shape向量中的元素转换为usize类型
    let h = shape[0] as usize;
    let w = shape[2] as usize;
    let m = shape[4] as usize;

    // 将文件内容的前16个字节之后的部分转换为f32类型的向量
    let float_data: Vec<f32> = data[16..]
        .chunks(4)
        .map(|b| f32::from_le_bytes([b[0], b[1], b[2], b[3]]))
        .collect();

    // 将float_data向量中的前m个元素转换为point向量
    let point = float_data[0..m].to_vec();
    // 将float_data向量中的后m个元素转换为voltage向量
    let voltage = float_data[m..].to_vec();

    // 返回point、voltage和(m, w, h)
    Ok((point, voltage, (m, w, h)))
}

pub fn read_txt<P: AsRef<Path>>(filename: P) -> Result<Vec<Vec<f32>>, Box<dyn std::error::Error>> {
    let file = File::open(filename)?;
    let reader = BufReader::new(file);

    let mut data = Vec::new();
    for line in reader.lines() {
        let line = line?;
        let row: Vec<f32> = line
            .split_whitespace()
            .filter_map(|token| token.parse::<f32>().ok())
            .collect();
        if !row.is_empty() {
            data.push(row);
        }
    }

    Ok(data)
}


pub fn vs_to_base64(vs: Vec<Vec<f32>>) -> String {
    let height = vs.len();
    let width = if height > 0 { vs[0].len() } else { return String::new(); };

    let mut image = GrayImage::new(width as u32, height as u32);

    // 找最小最大值进行归一化
    let min_val = vs.iter().flatten().cloned().fold(f32::INFINITY, f32::min);
    let max_val = vs.iter().flatten().cloned().fold(f32::NEG_INFINITY, f32::max);

    for (y, row) in vs.iter().enumerate() {
        for (x, val) in row.iter().enumerate() {
            let norm = if max_val > min_val {
                ((val - min_val) / (max_val - min_val) * 255.0).round() as u8
            } else {
                0
            };
            image.put_pixel(x as u32, y as u32, Luma([norm]));
        }
    }

    let mut buffer = Cursor::new(Vec::new());
    let encoder = PngEncoder::new(&mut buffer);

    // ✅ 使用新 API：write_image（替代已废弃的 encode）
    encoder
        .write_image(
            &image,
            width as u32,
            height as u32,
            ColorType::L8.into(),
        )
        .expect("Failed to encode PNG image");

    let encoded = base64::engine::general_purpose::STANDARD.encode(buffer.get_ref());
    format!("data:image/png;base64,{}", encoded)
}