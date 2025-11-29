// ============================================
// GOOGLE APPS SCRIPT - BACKEND KODU
// ============================================
// Bu kodu Google Apps Script'e yapıştıracaksınız

// AYARLAR - Buradan düzenleyin
const ADMIN_PASSWORD = "dugun2024"; // Admin şifrenizi buraya yazın
const COUPLE_NAMES = "Ayşe & Mehmet"; // Çift isimlerini buraya
const WEDDING_DATE = "15 Haziran 2024"; // Düğün tarihini buraya

// Google Drive klasör ID'si - Script çalıştığında otomatik oluşturulacak
let DRIVE_FOLDER_ID = null;

// Klasörü oluştur veya bul
function getOrCreateFolder() {
  const folderName = `Düğün Fotoğrafları - ${COUPLE_NAMES}`;
  
  // Klasör var mı kontrol et
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  
  // Yoksa oluştur
  return DriveApp.createFolder(folderName);
}

// POST isteği - Fotoğraf yükleme
function doPost(e) {
  try {
    const folder = getOrCreateFolder();
    
    // Gelen veriyi parse et
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'upload') {
      // Base64 fotoğrafı çöz
      const fileBlob = Utilities.newBlob(
        Utilities.base64Decode(data.fileData),
        data.mimeType,
        data.fileName
      );
      
      // Drive'a yükle
      const file = folder.createFile(fileBlob);
      
      // Yükleme bilgilerini kaydet (opsiyonel)
      file.setDescription(`Yükleyen: ${data.uploaderName || 'Misafir'} - ${new Date().toLocaleString('tr-TR')}`);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileName: file.getName(),
        fileUrl: file.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'getPhotos') {
      // Tüm fotoğrafları listele
      const files = folder.getFiles();
      const photos = [];
      
      while (files.hasNext()) {
        const file = files.next();
        const mimeType = file.getMimeType();
        
        // Sadece resimleri al
        if (mimeType.startsWith('image/')) {
          photos.push({
            id: file.getId(),
            name: file.getName(),
            url: file.getUrl(),
            thumbnailUrl: file.getThumbnailUrl(),
            downloadUrl: file.getDownloadUrl(),
            createdDate: file.getDateCreated().toISOString(),
            size: file.getSize()
          });
        }
      }
      
      // En yeniden eskiye sırala
      photos.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        photos: photos,
        folderUrl: folder.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'adminLogin') {
      // Admin şifre kontrolü
      const isValid = data.password === ADMIN_PASSWORD;
      return ContentService.createTextOutput(JSON.stringify({
        success: isValid
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'getConfig') {
      // Uygulama ayarlarını gönder
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        coupleNames: COUPLE_NAMES,
        weddingDate: WEDDING_DATE
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Geçersiz işlem'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// GET isteği - Basit kontrol
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Düğün Fotoğraf API çalışıyor!',
    coupleNames: COUPLE_NAMES,
    weddingDate: WEDDING_DATE
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test fonksiyonu
function testScript() {
  const folder = getOrCreateFolder();
  Logger.log('Klasör oluşturuldu: ' + folder.getName());
  Logger.log('Klasör URL: ' + folder.getUrl());
  Logger.log('Klasör ID: ' + folder.getId());
}
