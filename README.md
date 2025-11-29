# 💕 Düğün Fotoğraf Sitesi - Google Drive Versiyonu

Google Drive ile çalışan, tamamen ücretsiz düğün fotoğraf paylaşım uygulaması!

## ⭐ Neden Bu Versiyon?

- ✅ **Tamamen Ücretsiz**: Firebase gerektirmez
- ✅ **Direkt Drive'a Yükleme**: Fotoğraflar otomatik olarak Google Drive klasörüne kaydedilir
- ✅ **Kolay Kurulum**: Sadece 10 dakika
- ✅ **Kolay İndirme**: Tüm fotoğrafları Drive'dan tek tıkla indirebilirsiniz
- ✅ **Sınırsız Depolama**: Google Drive kotanız kadar (ücretsiz 15GB)

## 🚀 Hızlı Başlangıç

### 1. Google Apps Script Kurulumu (5 dk)
1. https://script.google.com/ → "New Project"
2. `Code.gs` dosyasındaki kodu yapıştırın
3. Çift isimlerini, tarihi ve şifreyi düzenleyin
4. Kaydedin ve Deploy → New deployment → Web app
5. URL'i kopyalayın

### 2. React Uygulaması (3 dk)
```bash
cd dugun-drive
npm install
```

`src/WeddingPhotoApp.jsx` dosyasında:
```javascript
const SCRIPT_URL = 'APPS_SCRIPT_URL_BURAYA';
```

Test:
```bash
npm run dev
```

### 3. Canlıya Alma (2 dk)
```bash
npm run build
```

`dist` klasörünü Netlify veya Vercel'e yükleyin.

### 4. QR Kod
URL'inizi https://www.qr-code-generator.com/ ile QR koda çevirin.

## 📁 Proje Yapısı

```
dugun-drive/
├── Code.gs                        # Google Apps Script (backend)
├── src/
│   ├── main.jsx                   # React giriş noktası
│   ├── WeddingPhotoApp.jsx        # Ana uygulama
│   └── index.css                  # Stiller
├── package.json
├── vite.config.js
└── KURULUM-REHBERI.md            # Detaylı kurulum adımları
```

## 🎯 Özellikler

### Misafirler İçin
- 📸 QR kod ile kolay erişim
- 📤 Çoklu fotoğraf yükleme
- 🎬 Otomatik slideshow

### Sizin İçin (Admin)
- 🔒 Şifre korumalı admin paneli
- 📁 Google Drive'da otomatik klasör
- ⬇️ Tek tıkla tüm fotoğrafları Drive'dan indirme
- 📊 Toplam fotoğraf sayısı

## 💻 Kullanım

### Fotoğraf Yükleme
1. QR kodu tarat
2. "Fotoğraf Yükle" → Fotoğraf seç
3. Yükle!

### Fotoğrafları İndirme (Admin)
1. Kilit ikonuna tıkla
2. Şifreyi gir
3. "Drive'ı Aç" butonuna tıkla
4. Google Drive klasöründen tüm fotoğrafları indir

## 🔧 Özelleştirme

### Google Apps Script (Code.gs)
```javascript
const ADMIN_PASSWORD = "dugun2024";      // Şifrenizi değiştirin
const COUPLE_NAMES = "Ayşe & Mehmet";    // İsimlerinizi yazın
const WEDDING_DATE = "15 Haziran 2024";  // Tarihinizi yazın
```

### React App (WeddingPhotoApp.jsx)
```javascript
const SCRIPT_URL = 'GOOGLE_APPS_SCRIPT_URL';  // Script URL'inizi yapıştırın
```

## 📊 Limitler

**Google Apps Script (Günlük)**
- URL istekleri: 20,000 istek/gün
- Execution time: 6 dakika/script
- Depolama: Google Drive kotanız (15GB ücretsiz)

**Yeterli mi?**
- 100-300 misafirli düğün için: ✅ Fazlasıyla yeterli
- 500+ misafir: ✅ Hala yeterli
- 1000+ misafir: ⚠️ Limit kontrol edin

## ❓ Sorun Giderme

**Fotoğraf yüklenmiyor**
- Script URL'ini doğru yapıştırdınız mı?
- Apps Script deployment "Anyone" erişime açık mı?
- Browser console'da hata var mı? (F12)

**Admin şifresi çalışmıyor**
- Code.gs'teki şifreyi kontrol edin
- Script'i tekrar deploy ettiniz mi?

**Drive klasörü görünmüyor**
- Apps Script'te `testScript` fonksiyonunu çalıştırın
- Google Drive'da "Düğün Fotoğrafları" araması yapın

## 💡 İpuçları

✅ Düğünden önce 10 arkadaşınızla test edin  
✅ Drive klasörünü aile üyeleriyle paylaşabilirsiniz  
✅ Fotoğraflar otomatik yedeklenir (Google Drive)  
✅ Slideshow'u büyük ekranda gösterebilirsiniz  
✅ WiFi bağlantısı sağlayın (mobil data masraflı olabilir)

## 📞 Destek

Detaylı kurulum için: **KURULUM-REHBERI.md**

Sorunlarınız için issue açabilirsiniz!

---

**Mutlu düğünler dileriz!** 💕
