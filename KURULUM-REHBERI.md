# 🚀 GOOGLE DRIVE VERSİYONU - KURULUM REHBERİ

## ⭐ Avantajlar
- ✅ Firebase'e gerek yok - tamamen ücretsiz
- ✅ Fotoğraflar direkt Google Drive'ınızda
- ✅ Kurulum çok basit (10 dakika)
- ✅ Tüm fotoğrafları Drive'dan kolayca indirebilirsiniz

---

## 📋 ADIM 1: GOOGLE APPS SCRIPT OLUŞTURMA (5 Dakika)

### 1.1 Google Apps Script'e Gidin
1. https://script.google.com/ adresine gidin
2. "New Project" (Yeni Proje) butonuna tıklayın

### 1.2 Kodu Yapıştırın
1. Açılan editörde varsayılan kodu silin
2. **Code.gs** dosyasındaki tüm kodu kopyalayıp yapıştırın

### 1.3 Ayarları Düzenleyin
Kod içinde şu satırları düzenleyin:

```javascript
const ADMIN_PASSWORD = "dugun2026"; // ŞİFRENİZİ BURAYA YAZIN!
const COUPLE_NAMES = "Merve & Selim"; // İSİMLERİNİZİ YAZIN
const WEDDING_DATE = "17 Temmuz 2026"; // TARİHİNİZİ YAZIN
```

### 1.4 Projeyi Kaydedin
1. Üstteki **💾 simgesine** tıklayın veya `Ctrl+S` basın
2. Proje adı verin: `Düğün Fotoğraf API`

### 1.5 Test Edin (Opsiyonel)
1. Üstten `testScript` fonksiyonunu seçin
2. **▶️ Run** (Çalıştır) butonuna tıklayın
3. İlk kez çalıştırdığınızda izin isteyecek:
   - "Review Permissions" butonuna tıklayın
   - Google hesabınızı seçin
   - "Advanced" → "Go to Düğün Fotoğraf API (unsafe)" tıklayın
   - "Allow" butonuna tıklayın
4. Hata yoksa Google Drive'ınızda "Düğün Fotoğrafları - [İsimleriniz]" klasörü oluşacak

---

## 📋 ADIM 2: WEB APP OLARAK YAYINLAMA (2 Dakika)

### 2.1 Deploy (Yayınla)
1. Sağ üstteki **Deploy** → **New deployment** seçin
2. **⚙️ Select type** → **Web app** seçin
3. Ayarlar:
   - **Description**: `Düğün Fotoğraf v1`
   - **Execute as**: `Me (sizin-email@gmail.com)`
   - **Who has access**: **Anyone** (Herkes) ⚠️ ÖNEMLİ!
4. **Deploy** butonuna tıklayın

### 2.2 URL'i Kopyalayın
Deployment tamamlandığında:
1. **Web app URL** görünecek
2. Bu URL'i kopyalayın - örnek:
   ```
   https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXXXXX/exec
   ```
3. Bu URL'i bir yere kaydedin - **ÇOK ÖNEMLİ!**

---

## 📋 ADIM 3: REACT UYGULAMASINI AYARLAMA (3 Dakika)

### 3.1 Script URL'ini Yapıştırın
`src/WeddingPhotoApp.jsx` dosyasını açın ve:

```javascript
// Satır 19 civarında:
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Bu satırı bulun ve Google Apps Script'ten kopyaladığınız URL'i yapıştırın:

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXXXXXXXX/exec';
```

### 3.2 Projeyi Kurun

Terminal/Komut İstemcisinde:

```bash
# 1. Proje klasörüne gidin
cd dugun-drive

# 2. Paketleri yükleyin
npm install

# 3. Test edin
npm run dev
```

Tarayıcıda http://localhost:5173 açın.

✅ Site çalışıyorsa tebrikler! Fotoğraf yüklemeyi test edin.

---

## 📋 ADIM 4: CANLI YAYINA ALMA

### Seçenek A: Netlify (ÖNERİLEN - En Kolay)

1. https://www.netlify.com/ adresine gidin
2. "Sign up" → GitHub ile giriş yapın (veya email)
3. "Add new site" → "Deploy manually"
4. Terminal'de: `npm run build`
5. `dist` klasörünü Netlify'a sürükle-bırak
6. Site canlıya alındı! URL'inizi kopyalayın

### Seçenek B: Vercel

1. https://vercel.com/ adresine gidin
2. "Sign up" → GitHub ile giriş
3. "New Project" → `dist` klasörünü yükle
4. Deploy!

### Seçenek C: GitHub Pages (Ücretsiz)

```bash
# GitHub repo oluşturun ve push edin
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI-ADINIZ/dugun-site.git
git push -u origin main

# GitHub Pages'i aktif edin (repo settings)
```

---

## 📋 ADIM 5: QR KOD OLUŞTURMA (1 Dakika)

1. https://www.qr-code-generator.com/ adresine gidin
2. **URL** seçin
3. Netlify/Vercel'den aldığınız URL'i yapıştırın
4. **Generate QR Code** → **Download**
5. QR kodu yazdırıp düğün masalarına koyun

---

## 🎉 KULLANIM

### Misafirler İçin
1. QR kodu tarat
2. "Fotoğraf Yükle" butonuna tıkla
3. Fotoğraf seç
4. Yükle!

### Sizin İçin (Admin)
1. Kilit ikonuna tıklayın
2. Apps Script'te belirlediğiniz şifreyi girin
3. "Drive'ı Aç" butonuna tıklayın
4. Google Drive klasöründen tüm fotoğrafları indirebilirsiniz!

**Klasör Yolu**: Google Drive → "Düğün Fotoğrafları - [İsimleriniz]"

---

## 🔧 GÜNCELLEME YAPMA

### Apps Script'i Güncellemek
1. https://script.google.com/ → Projenizi açın
2. Değişiklik yapın
3. **Deploy** → **Manage deployments**
4. **✏️ Edit** → Version'u değiştirin → **Deploy**

### Web Sitesini Güncellemek
```bash
npm run build
# Sonra yeni dist klasörünü Netlify/Vercel'e yükleyin
```

---

## ❓ SORUN GİDERME

### "Fotoğraflar yüklenmiyor"
**Sebep**: CORS hatası olabilir

**Çözüm**: 
1. Apps Script'te deployment'ı kontrol edin
2. "Who has access" ayarı **Anyone** olmalı
3. Script URL'ini doğru kopyaladığınızdan emin olun

### "Admin şifresi çalışmıyor"
**Çözüm**:
1. Apps Script'teki `ADMIN_PASSWORD` değerini kontrol edin
2. Script'i tekrar deploy edin

### "Google Drive klasörü görünmüyor"
**Çözüm**:
1. Apps Script'te `testScript` fonksiyonunu çalıştırın
2. Google Drive'da arama yapın: `Düğün Fotoğrafları`

### "Fotoğraflar çok yavaş yükleniyor"
**Not**: 
- Google Apps Script'in dosya boyutu limiti var (50MB)
- Çok büyük fotoğraflar yavaş yüklenebilir
- Önerimiz: Telefon fotoğrafları genelde 2-5MB, sorun olmaz

---

## 💡 İPUÇLARI

✅ **Düğünden önce test edin!** 5-10 arkadaşınıza link gönderin, fotoğraf yüklesinler.

✅ **Drive klasörünü paylaşabilirsiniz:** Aile üyeleriyle paylaşıp hepsinin fotoğraf görmesini sağlayın.

✅ **Yedekleme:** Google Drive otomatik yedekler, kayıp riski yok!

✅ **Mobil data:** Misafirler WiFi kullanmazsa mobil data harcayacaklar, bunu düğün davetiyesinde belirtin.

✅ **TV'de slideshow:** Siteyi büyük ekrana bağlayıp slideshow gösterebilirsiniz!

---

## 📊 LİMİTLER

Google Apps Script limitleri (günlük):
- **URL fetches**: 20,000 istek/gün
- **Execution time**: 6 dakika/script
- **Storage**: Google Drive kotanız (15GB ücretsiz)

**Not**: Orta ölçek bir düğün için (100-300 misafir) bu limitler fazlasıyla yeterli!

---

## 🎯 ÖZETİ ÖZET - 4 ADIM

1. ✅ Google Apps Script oluştur → Code.gs'i yapıştır → Deploy et → URL kopyala
2. ✅ React projesinde Script URL'i yapıştır → `npm install` → `npm run dev`
3. ✅ `npm run build` → Netlify'a yükle → Canlı URL al
4. ✅ QR kod oluştur → Yazdır → Düğün masalarına koy

**HAZIR!** 💕

Başka sorunuz varsa çekinmeden sorun!
