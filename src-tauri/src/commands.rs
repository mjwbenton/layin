use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn save_image(path: String, data: Vec<u8>) -> Result<(), String> {
    let path = PathBuf::from(&path);

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    fs::write(&path, &data).map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn test_save_image_creates_file() {
        let dir = std::env::temp_dir().join("layin_test_save");
        let path = dir.join("test.jpg");
        let _ = fs::remove_dir_all(&dir);

        let data = vec![0xFF, 0xD8, 0xFF, 0xE0]; // JPEG header bytes
        let result = save_image(path.to_string_lossy().to_string(), data.clone());

        assert!(result.is_ok());
        assert!(path.exists());
        assert_eq!(fs::read(&path).unwrap(), data);

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_save_image_creates_parent_directories() {
        let dir = std::env::temp_dir().join("layin_test_nested").join("a").join("b");
        let path = dir.join("test.jpg");
        let _ = fs::remove_dir_all(std::env::temp_dir().join("layin_test_nested"));

        let data = vec![1, 2, 3, 4];
        let result = save_image(path.to_string_lossy().to_string(), data);

        assert!(result.is_ok());
        assert!(path.exists());

        let _ = fs::remove_dir_all(std::env::temp_dir().join("layin_test_nested"));
    }

    #[test]
    fn test_save_image_preserves_binary_content() {
        let dir = std::env::temp_dir().join("layin_test_binary");
        let path = dir.join("test.bin");
        let _ = fs::remove_dir_all(&dir);

        let data: Vec<u8> = (0..=255).collect();
        let result = save_image(path.to_string_lossy().to_string(), data.clone());

        assert!(result.is_ok());
        assert_eq!(fs::read(&path).unwrap(), data);

        let _ = fs::remove_dir_all(&dir);
    }
}
