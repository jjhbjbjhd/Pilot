use std::fs::File;
use std::io::{Read, BufRead, BufReader};
use std::path::Path;

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