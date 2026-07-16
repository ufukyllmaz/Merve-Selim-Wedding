const { useState, useEffect } = React;

// ============================================
// FIREBASE AYARLARI
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyAKda4i68S5VIDnrqFFFW_EWNDLCtpJJ6Y",
  authDomain: "project-76c2a12a-3789-4c81-a94.firebaseapp.com",
  projectId: "project-76c2a12a-3789-4c81-a94",
  storageBucket: "project-76c2a12a-3789-4c81-a94.firebasestorage.app",
  messagingSenderId: "966819585926",
  appId: "1:966819585926:web:fcd3ab339907693b2f1607"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const PHOTO_FOLDER = 'photos';

// Çift bilgileri
const COUPLE_NAMES = 'Merve & Selim';
const WEDDING_DATE = '17 Temmuz 2026';

// ---- Basit SVG ikonları ----
const Camera = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);
const X = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const Upload = ({ size = 24, strokeWidth = 2, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
  </svg>
);
const ImageIcon = ({ size = 24, strokeWidth = 2, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

const WeddingPhotoApp = () => {
  const [allItems, setAllItems] = useState([]);   // Storage referansları (tüm fotoğraflar)
  const [batch, setBatch] = useState([]);         // o an gösterilen grup: [{name, url}]
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coupleNames] = useState(COUPLE_NAMES);
  const [weddingDate] = useState(WEDDING_DATE);

  const COUPLE_PHOTO_URL = `/Merve-Selim-Wedding/couple.jpg`;

  // ---- Slayt ayarları ----
  const BATCH_SIZE = 10;                    // her turda gösterilecek foto sayısı
  const BATCH_DURATION_MS = 5 * 60 * 1000;  // 5 dakika
  const SLIDE_INTERVAL_MS = 5000;           // 5 saniye

  // Rastgele referans seç (Fisher-Yates)
  const pickRandomRefs = (items) => {
    if (!items || items.length === 0) return [];
    if (items.length <= BATCH_SIZE) return items.slice();
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, BATCH_SIZE);
  };

  // Seçilen referansların indirme URL'lerini çöz ve grubu ayarla
  const loadBatch = async (items) => {
    const chosen = pickRandomRefs(items);
    try {
      const resolved = await Promise.all(
        chosen.map(async (ref) => ({ name: ref.name, url: await ref.getDownloadURL() }))
      );
      setBatch(resolved);
      setCurrentPhotoIndex(0);
    } catch (e) {
      console.error('Grup URL çözme hatası:', e);
    }
  };

  // Tüm fotoğraf listesini Firebase Storage'dan çek
  const loadPhotos = async () => {
    try {
      const res = await storage.ref(PHOTO_FOLDER).listAll();
      setAllItems(res.items);
      await loadBatch(res.items);
      console.log(`Galeri: ${res.items.length} fotoğraf bulundu`);
    } catch (error) {
      console.error('Fotoğraflar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPhotos(); }, []);

  // Her 5 dakikada yeni rastgele grup
  useEffect(() => {
    if (allItems.length > BATCH_SIZE) {
      const t = setInterval(() => { loadBatch(allItems); }, BATCH_DURATION_MS);
      return () => clearInterval(t);
    }
  }, [allItems]);

  // Gruptaki fotoğraflar arasında her 5 saniyede geç
  useEffect(() => {
    if (batch.length > 1) {
      const t = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % batch.length);
      }, SLIDE_INTERVAL_MS);
      return () => clearInterval(t);
    }
  }, [batch]);

  // Dosya adını güvenli hale getir
  const safeName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Fotoğraf yükleme - doğrudan Firebase Storage'a, PARALEL (resumable)
  const UPLOAD_CONCURRENCY = 4; // aynı anda kaç fotoğraf yüklensin

  const handleFileUpload = async (event) => {
    const selected = Array.from(event.target.files);
    if (selected.length === 0) return;

    // Geçerli dosyaları ayıkla (boyut/tip)
    const files = [];
    for (const file of selected) {
      if (file.size > 30 * 1024 * 1024) { alert(`${file.name} çok büyük (max 30MB)`); continue; }
      if (!file.type.startsWith('image/')) { alert(`${file.name} bir resim dosyası değil`); continue; }
      files.push(file);
    }
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Toplam bayta göre ilerleme (paralelde en sağlıklısı)
    const transferred = new Array(files.length).fill(0);
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0) || 1;
    const updateProgress = () => {
      const sum = transferred.reduce((a, b) => a + b, 0);
      setUploadProgress(Math.min(100, (sum / totalBytes) * 100));
    };

    let nextIndex = 0;
    let successCount = 0;

    const worker = async () => {
      while (nextIndex < files.length) {
        const myIndex = nextIndex++;
        const file = files[myIndex];
        const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName(file.name)}`;
        const ref = storage.ref(`${PHOTO_FOLDER}/${uniqueName}`);
        try {
          await new Promise((resolve, reject) => {
            const task = ref.put(file, { contentType: file.type });
            task.on('state_changed',
              (snapshot) => { transferred[myIndex] = snapshot.bytesTransferred; updateProgress(); },
              (err) => reject(err),
              () => { transferred[myIndex] = file.size; updateProgress(); resolve(); }
            );
          });
          successCount++;
        } catch (err) {
          console.error('Yükleme hatası:', file.name, err);
        }
      }
    };

    try {
      const pool = Array.from(
        { length: Math.min(UPLOAD_CONCURRENCY, files.length) },
        () => worker()
      );
      await Promise.all(pool);

      if (successCount > 0) {
        alert(`${successCount} fotoğraf başarıyla yüklendi! Teşekkür ederiz 💕`);
        setShowUploadModal(false);
        setLoading(true);
        await loadPhotos();
      } else {
        alert('Fotoğraflar yüklenemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };


  const hasPhotos = allItems.length > 0;

  return (
    <div className="min-h-screen bg-black">
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={COUPLE_PHOTO_URL} alt="Couple" className="w-full h-full object-cover filter grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="mb-8">
            <div className="w-px h-16 bg-white/30 mx-auto mb-8"></div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-wider">{coupleNames}</h1>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-px bg-white/50"></div>
              <p className="text-xl md:text-2xl text-white/90 font-light tracking-widest uppercase">{weddingDate}</p>
              <div className="w-12 h-px bg-white/50"></div>
            </div>
            <div className="w-px h-16 bg-white/30 mx-auto"></div>
          </div>
          <div className="flex justify-center items-center mt-12">
            <button onClick={() => setShowUploadModal(true)}
              className="group flex items-center space-x-3 bg-white text-black px-8 py-4 hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase">
              <Camera size={20} /><span>Share Your Moment</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <p className="text-white/60 text-xs tracking-widest uppercase">Scroll</p>
            <div className="w-px h-12 bg-white/30"></div>
          </div>
        </div>
      </header>

      <main className="bg-black min-h-screen py-16">
        <div className="text-center mb-16 px-4">
          <div className="w-px h-12 bg-white/30 mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 tracking-wider">Our Memories</h2>
          <p className="text-white/60 text-sm tracking-widest uppercase">
            {hasPhotos ? `${allItems.length} moment shared` : 'Shared moments from our special day'}
          </p>
          <div className="w-px h-12 bg-white/30 mx-auto mt-6"></div>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-2 border-white/30 border-t-white"></div>
            <p className="mt-6 text-white/60 text-sm tracking-widest uppercase">Loading Gallery...</p>
          </div>
        ) : hasPhotos ? (
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative mb-16">
              <div className="relative bg-black border border-white/10">
                <div className="relative aspect-[16/10] md:aspect-[21/9]">
                  {batch.length > 0 ? (
                    <div key={batch[currentPhotoIndex]?.name || currentPhotoIndex}
                      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                      {/* Bulanık arka plan: boşlukları doldurur (dikey fotoğraflarda siyah bant yerine) */}
                      <img
                        src={batch[currentPhotoIndex]?.url}
                        alt=""
                        aria-hidden="true"
                        referrerPolicy="no-referrer"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                          objectFit: 'cover', filter: 'grayscale(1) blur(24px)', transform: 'scale(1.1)', opacity: 0.4 }}
                      />
                      {/* Asıl fotoğraf: kırpılmadan, tam görünür */}
                      <img
                        src={batch[currentPhotoIndex]?.url}
                        alt={`Memory ${currentPhotoIndex + 1}`}
                        referrerPolicy="no-referrer"
                        loading="eager"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                          objectFit: 'contain', filter: 'grayscale(1)' }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-white/30 border-t-white"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                    <div className="text-white">
                      <p className="text-sm tracking-widest uppercase mb-1 text-white/60">Photo</p>
                      <p className="text-2xl md:text-3xl font-serif">
                        {String(currentPhotoIndex + 1).padStart(2, '0')} / {String(batch.length).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                  {batch.length > 1 && (
                    <>
                      <button onClick={() => setCurrentPhotoIndex((currentPhotoIndex - 1 + batch.length) % batch.length)}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-white/60 transition-all group" aria-label="Previous photo">
                        <div className="w-12 h-12 md:w-16 md:h-16 border border-white/30 group-hover:border-white flex items-center justify-center transition-all">
                          <span className="text-2xl">←</span>
                        </div>
                      </button>
                      <button onClick={() => setCurrentPhotoIndex((currentPhotoIndex + 1) % batch.length)}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-white/60 transition-all group" aria-label="Next photo">
                        <div className="w-12 h-12 md:w-16 md:h-16 border border-white/30 group-hover:border-white flex items-center justify-center transition-all">
                          <span className="text-2xl">→</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="h-px bg-white/10 relative">
                  <div className="absolute h-full bg-white transition-all duration-500"
                    style={{ width: `${batch.length ? ((currentPhotoIndex + 1) / batch.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 px-4">
            <ImageIcon size={80} className="mx-auto text-white/20 mb-8" strokeWidth={1} />
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">No photos yet</h3>
            <p className="text-white/60 mb-8 text-sm tracking-wider">Be the first to share a moment</p>
            <button onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-3 bg-white text-black px-8 py-4 hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase mx-auto">
              <Camera size={20} /><span>Share Your Moment</span>
            </button>
          </div>
        )}
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 max-w-lg w-full p-8 md:p-12 relative">
            <button onClick={() => !uploading && setShowUploadModal(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors" disabled={uploading}>
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <div className="w-px h-12 bg-white/30 mx-auto mb-6"></div>
              <h3 className="text-3xl font-serif text-white mb-4 tracking-wider">Share a Memory</h3>
              <p className="text-white/60 text-sm tracking-wider">Upload your favorite moments from our special day</p>
              <div className="w-px h-12 bg-white/30 mx-auto mt-6"></div>
            </div>
            <label className="block">
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" id="file-upload" />
              <div className={`border-2 border-dashed border-white/20 p-12 text-center cursor-pointer hover:border-white/40 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="mx-auto mb-4 text-white/60" size={48} strokeWidth={1} />
                <p className="text-white font-light tracking-wider mb-2">{uploading ? 'Uploading...' : 'Select Photos'}</p>
                <p className="text-xs text-white/40 tracking-wider uppercase">Multiple files supported • Max 30MB each</p>
              </div>
            </label>
            {uploading && (
              <div className="mt-8">
                <div className="h-px bg-white/10 relative overflow-hidden">
                  <div className="absolute h-full bg-white transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-center text-sm text-white/60 mt-3 tracking-wider">{Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-black border-t border-white/10 py-12 text-center">
        <div className="w-px h-12 bg-white/30 mx-auto mb-6"></div>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-2">{coupleNames}</p>
        <p className="text-white/30 text-xs tracking-wider">{weddingDate}</p>
        <div className="w-px h-12 bg-white/30 mx-auto mt-6"></div>
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<WeddingPhotoApp />);
