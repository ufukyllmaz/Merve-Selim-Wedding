// ============================================
// GOOGLE APPS SCRIPT - BACKEND KODU
// ============================================
// Bu kodu Google Apps Script'e yapıştıracaksınız

// AYARLAR - Buradan düzenleyin
const ADMIN_PASSWORD = "dugun2026"; // Admin şifrenizi buraya yazın
const COUPLE_NAMES = "Merve & Selim"; // Çift isimlerini buraya
const WEDDING_DATE = "17 Temmuz 2026"; // Düğün tarihini buraya

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
      
      // Fotoğrafın herkese açık (linki olan herkes görebilir) olmasını sağla
      // Bu olmadan yüklenen fotoğraflar sitede görüntülenemez!
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (shareErr) {
        // Bazı hesaplarda alan kısıtlaması olabilir; yine de devam et
      }
      
      // Yükleme bilgilerini kaydet (opsiyonel)
      file.setDescription(`Yükleyen: ${data.uploaderName || 'Misafir'} - ${new Date().toLocaleString('tr-TR')}`);
      
      const uid = file.getId();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        fileId: uid,
        fileName: file.getName(),
        fileUrl: file.getUrl(),
        displayUrl: 'https://drive.google.com/thumbnail?id=' + uid + '&sz=w1600',
        altUrl: 'https://lh3.googleusercontent.com/d/' + uid + '=w1600'
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
          const fid = file.getId();
          
          // Fotoğrafı herkese açık yap (eski yüklemeler için de garanti)
          try {
            if (file.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) {
              file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            }
          } catch (shareErr) {
            // Paylaşım ayarlanamazsa devam et
          }
          
          photos.push({
            id: fid,
            name: file.getName(),
            url: file.getUrl(),
            // <img> ile görüntülenebilen direkt resim URL'leri
            displayUrl: 'https://drive.google.com/thumbnail?id=' + fid + '&sz=w1600',
            altUrl: 'https://lh3.googleusercontent.com/d/' + fid + '=w1600',
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

// Fotoğrafları listeleyen ortak yardımcı fonksiyon
function listPhotos() {
  const folder = getOrCreateFolder();
  const files = folder.getFiles();
  const photos = [];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();

    if (mimeType && mimeType.indexOf('image/') === 0) {
      const fid = file.getId();

      // Fotoğrafı herkese açık yap (eski yüklemeler için de garanti)
      try {
        if (file.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        }
      } catch (shareErr) {
        // Paylaşım ayarlanamazsa devam et
      }

      photos.push({
        id: fid,
        name: file.getName(),
        url: file.getUrl(),
        displayUrl: 'https://drive.google.com/thumbnail?id=' + fid + '&sz=w1600',
        altUrl: 'https://lh3.googleusercontent.com/d/' + fid + '=w1600',
        thumbnailUrl: file.getThumbnailUrl(),
        downloadUrl: file.getDownloadUrl(),
        createdDate: file.getDateCreated().toISOString(),
        size: file.getSize()
      });
    }
  }

  photos.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  return { photos: photos, folderUrl: folder.getUrl() };
}

// GET isteği - Okuma işlemleri (getPhotos / getConfig) buradan da çalışır.
// Bu, statik siteden yapılan isteklerin daha güvenilir çalışmasını sağlar
// ve endpoint'i tarayıcıdan test edilebilir yapar.
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';

    if (action === 'getPhotos') {
      const result = listPhotos();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        photos: result.photos,
        folderUrl: result.folderUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'getConfig') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        coupleNames: COUPLE_NAMES,
        weddingDate: WEDDING_DATE
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Varsayılan: basit sağlık kontrolü
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Düğün Fotoğraf API çalışıyor!',
      coupleNames: COUPLE_NAMES,
      weddingDate: WEDDING_DATE
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test fonksiyonu
function testScript() {
  const folder = getOrCreateFolder();
  Logger.log('Klasör oluşturuldu: ' + folder.getName());
  Logger.log('Klasör URL: ' + folder.getUrl());
  Logger.log('Klasör ID: ' + folder.getId());
}
