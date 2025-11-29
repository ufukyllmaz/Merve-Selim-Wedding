# ⚡ HIZLI BAŞLANGIÇ - 10 DAKİKA

Google Drive ile düğün fotoğraf sitesi kurulumu - adım adım!

---

## ✅ ADIM 1: Google Apps Script (3 dk)

### 1. Script Oluştur
- https://script.google.com/ aç
- **New Project** tıkla

### 2. Kodu Yapıştır
- `Code.gs` dosyasındaki **TÜM KODU** kopyala
- Script editörüne yapıştır

### 3. Bilgileri Düzenle
```javascript
const ADMIN_PASSWORD = "dugun2024";      // ← ŞİFRENİZİ YAZIN
const COUPLE_NAMES = "Ayşe & Mehmet";    // ← İSİMLERİNİZİ YAZIN
const WEDDING_DATE = "15 Haziran 2024";  // ← TARİHİNİZİ YAZIN
```

### 4. Kaydet ve Deploy
- 💾 **Save** (Ctrl+S)
- Proje adı: `Düğün Fotoğraf API`
- **Deploy** → **New deployment**
- ⚙️ **Select type** → **Web app**
- **Execute as**: `Me`
- **Who has access**: **Anyone** ⚠️
- **Deploy** tıkla
- İzin iste → Hesap seç → Advanced → Allow

### 5. URL'i Kopyala
```
https://script.google.com/macros/s/AKfycby.../exec
```
👆 Bu URL'i bir yere **KAYDET**!

---

## ✅ ADIM 2: React Projesi (3 dk)

### 1. Script URL'ini Yapıştır
`src/WeddingPhotoApp.jsx` dosyasını aç (satır 19):

```javascript
const SCRIPT_URL = 'BURAYA_URL_YAPIŞTIR';
```

Kopyaladığın URL'i yapıştır:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

### 2. Kurulum
Terminal'de:
```bash
cd dugun-drive
npm install
npm run dev
```

### 3. Test Et
- http://localhost:5173 aç
- Fotoğraf yüklemeyi dene
- Admin girişini test et

---

## ✅ ADIM 3: Canlıya Al (2 dk)

### Netlify (ÖNERİLEN)

1. **Build et:**
```bash
npm run build
```

2. **Netlify'a git:**
- https://www.netlify.com/
- Sign up (GitHub ile)
- **Add new site** → **Deploy manually**
- `dist` klasörünü sürükle-bırak
- Bekle (30 saniye)

3. **URL'i kopyala:**
```
https://super-site-12345.netlify.app
```

---

## ✅ ADIM 4: QR Kod (1 dk)

1. https://www.qr-code-generator.com/ aç
2. **URL** seç
3. Netlify URL'ini yapıştır
4. **Generate QR Code**
5. **Download PNG**
6. Yazdır → Düğün masalarına koy

---

## 🎉 HAZIR!

### Test Et:
1. ✅ QR kodu tarat
2. ✅ Site açılıyor mu?
3. ✅ Fotoğraf yükle
4. ✅ Admin giriş yap
5. ✅ Drive'ı aç butonuna tıkla

### Düğünde:
- Masalara QR kod koy
- WiFi şifresini paylaş
- Slideshow'u TV'de göster (opsiyonel)

---

## 🔥 Sorun mu var?

### "Site çalışmıyor"
➡️ Script URL'ini doğru yapıştırdın mı?

### "Fotoğraf yüklenmiyor"
➡️ Apps Script deployment "Anyone" olmalı

### "Admin şifresi hatalı"
➡️ Code.gs'teki şifreyi kontrol et

### "Drive klasörü yok"
➡️ Script editöründe `testScript` çalıştır

---

## 📞 Yardım

Detaylı rehber: **KURULUM-REHBERI.md**

---

**Kolay gelsin! 💕**
