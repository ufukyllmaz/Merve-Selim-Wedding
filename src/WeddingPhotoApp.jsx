import React, { useState, useEffect } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

const WeddingPhotoApp = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [coupleNames, setCoupleNames] = useState('');
  const [weddingDate, setWeddingDate] = useState('');

  // ============================================
  // ÖNEMLİ: Google Apps Script URL'inizi buraya yapıştırın!
  // ============================================
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVruB1tsas9X-8jE0c8-U_31PwLladcowCL0h7yQzY--UKlasz2tdgRgKl8T5bMZ6Drg/exec';
  // Örnek: https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXXXXXXXXXXX/exec
  // ============================================

  // ============================================
  // ÇİFT FOTOĞRAFI - Base URL ile uyumlu
  // ============================================
  
  // SEÇENEK 1: Public klasöründen (ÖNERİLEN)
  // Vite'ın base URL'ini otomatik kullanır
  const COUPLE_PHOTO_URL = `/Merve-Selim-Wedding/couple.jpg`;
  
  // SEÇENEK 2: Harici URL (Base URL'den bağımsız)
  // const COUPLE_PHOTO_URL = 'https://i.imgur.com/XXXXX.jpg';
  
  // Not: import.meta.env.BASE_URL otomatik olarak vite.config.js'deki 
  // base ayarını kullanır (örn: '/Merve-Selim-Wedding/')
  // ============================================

  // Demo mode kontrolü
  const isDemoMode = SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  // Uygulama başlatma
  useEffect(() => {
    loadConfig();
    loadPhotos();
  }, []);

  // Slideshow - Her 5 saniyede bir fotoğraf değişir
  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => 
          (prevIndex + 1) % photos.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [photos]);

  // Konfigürasyon yükle
  const loadConfig = async () => {
    // Demo mode - Script URL ayarlanmamışsa
    if (isDemoMode) {
      setCoupleNames('Merve & Selim');
      setWeddingDate('17 Temmuz 2025');
      return;
    }

    try {
      const response = await fetch(`${SCRIPT_URL}?action=getConfig`);
      const data = await response.json();
      if (data.success) {
        setCoupleNames(data.coupleNames);
        setWeddingDate(data.weddingDate);
      }
    } catch (error) {
      console.error('Config yükleme hatası:', error);
      // Fallback to demo
      setCoupleNames('Merve & Selim');
      setWeddingDate('17 Temmuz 2025');
    }
  };

  // Fotoğrafları yükle
  const loadPhotos = async () => {
    setLoading(true);
    
    // Demo mode - örnek fotoğraflar göster
    if (isDemoMode) {
      const demoPhotos = [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
          uploadedAt: new Date(),
          name: 'demo1.jpg'
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
          uploadedAt: new Date(),
          name: 'demo2.jpg'
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80',
          uploadedAt: new Date(),
          name: 'demo3.jpg'
        },
        {
          id: '4',
          url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
          uploadedAt: new Date(),
          name: 'demo4.jpg'
        }
      ];
      setPhotos(demoPhotos);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'getPhotos' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPhotos(data.photos);
        setDriveFolderUrl(data.folderUrl);
      } else {
        console.error('Fotoğraf yükleme hatası:', data.error);
      }
    } catch (error) {
      console.error('Fotoğraflar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dosyayı base64'e çevir
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Fotoğraf yükleme
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Demo mode uyarısı
    if (isDemoMode) {
      alert('⚠️ DEMO MODE\n\nFotoğraf yüklemek için önce Google Apps Script URL\'ini ayarlamanız gerekiyor!\n\nAdımlar:\n1. Code.gs dosyasını Google Apps Script\'e yükleyin\n2. Deploy edin\n3. URL\'i WeddingPhotoApp.jsx dosyasına yapıştırın (satır 21)');
      setShowUploadModal(false);
      return;
    }

    setUploading(true);
    let successCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Dosya boyut kontrolü (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} çok büyük (max 10MB)`);
          continue;
        }

        // Sadece resim dosyalarına izin ver
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} bir resim dosyası değil`);
          continue;
        }

        // Progress güncelle
        setUploadProgress(((i) / files.length) * 100);

        // Dosyayı base64'e çevir
        const base64Data = await fileToBase64(file);
        
        // Google Apps Script'e gönder
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({
            action: 'upload',
            fileName: file.name,
            fileData: base64Data,
            mimeType: file.type,
            uploaderName: 'Misafir'
          })
        });

        const result = await response.json();
        
        if (result.success) {
          successCount++;
        } else {
          console.error('Yükleme hatası:', result.error);
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      if (successCount > 0) {
        alert(`${successCount} fotoğraf başarıyla yüklendi! Teşekkür ederiz 💕`);
        setShowUploadModal(false);
        await loadPhotos();
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Elegant Header with Couple Photo Background */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-500/90 text-black px-6 py-2 text-xs tracking-wider">
            ⚠️ DEMO MODE - Configure Google Apps Script URL in WeddingPhotoApp.jsx
          </div>
        )}
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={COUPLE_PHOTO_URL}
            alt="Couple"
            className="w-full h-full object-cover filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        {/* Header Content */}
        <div className="relative z-10 text-center px-4">
          <div className="mb-8">
            <div className="w-px h-16 bg-white/30 mx-auto mb-8"></div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-wider">
              {coupleNames || 'Loading...'}
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-px bg-white/50"></div>
              <p className="text-xl md:text-2xl text-white/90 font-light tracking-widest uppercase">
                {weddingDate}
              </p>
              <div className="w-12 h-px bg-white/50"></div>
            </div>
            <div className="w-px h-16 bg-white/30 mx-auto"></div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center items-center mt-12">
            <button
              onClick={() => setShowUploadModal(true)}
              className="group flex items-center space-x-3 bg-white text-black px-8 py-4 hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase"
            >
              <Camera size={20} />
              <span>Share Your Moment</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <p className="text-white/60 text-xs tracking-widest uppercase">Scroll</p>
            <div className="w-px h-12 bg-white/30"></div>
          </div>
        </div>
      </header>

      {/* Main Content - Gallery Section */}
      <main className="bg-black min-h-screen py-16">
        {/* Section Title */}
        <div className="text-center mb-16 px-4">
          <div className="w-px h-12 bg-white/30 mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 tracking-wider">
            Our Memories
          </h2>
          <p className="text-white/60 text-sm tracking-widest uppercase">
            Shared moments from our special day
          </p>
          <div className="w-px h-12 bg-white/30 mx-auto mt-6"></div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-2 border-white/30 border-t-white"></div>
            <p className="mt-6 text-white/60 text-sm tracking-widest uppercase">Loading Gallery...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4">
            {/* Elegant Photo Slideshow */}
            <div className="relative mb-16">
              {/* Main Photo Display */}
              <div className="relative bg-black border border-white/10">
                <div className="relative aspect-[16/10] md:aspect-[21/9]">
                  <img
                    src={photos[currentPhotoIndex]?.thumbnailUrl || photos[currentPhotoIndex]?.url}
                    alt={`Memory ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover filter grayscale"
                  />
                  
                  {/* Photo Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  
                  {/* Photo Counter */}
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                    <div className="text-white">
                      <p className="text-sm tracking-widest uppercase mb-1 text-white/60">Photo</p>
                      <p className="text-2xl md:text-3xl font-serif">
                        {String(currentPhotoIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPhotoIndex((currentPhotoIndex - 1 + photos.length) % photos.length)}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-white/60 transition-all group"
                        aria-label="Previous photo"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 border border-white/30 group-hover:border-white flex items-center justify-center transition-all">
                          <span className="text-2xl">←</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex((currentPhotoIndex + 1) % photos.length)}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-white/60 transition-all group"
                        aria-label="Next photo"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 border border-white/30 group-hover:border-white flex items-center justify-center transition-all">
                          <span className="text-2xl">→</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Elegant Progress Bar */}
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="h-px bg-white/10 relative">
                  <div 
                    className="absolute h-full bg-white transition-all duration-500"
                    style={{ width: `${((currentPhotoIndex + 1) / photos.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 px-4">
            <ImageIcon size={80} className="mx-auto text-white/20 mb-8" strokeWidth={1} />
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">No photos yet</h3>
            <p className="text-white/60 mb-8 text-sm tracking-wider">Be the first to share a moment</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-3 bg-white text-black px-8 py-4 hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase mx-auto"
            >
              <Camera size={20} />
              <span>Share Your Moment</span>
            </button>
          </div>
        )}
      </main>

      {/* Elegant Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 max-w-lg w-full p-8 md:p-12 relative">
            <button
              onClick={() => !uploading && setShowUploadModal(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              disabled={uploading}
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-px h-12 bg-white/30 mx-auto mb-6"></div>
              <h3 className="text-3xl font-serif text-white mb-4 tracking-wider">Share a Memory</h3>
              <p className="text-white/60 text-sm tracking-wider">
                Upload your favorite moments from our special day
              </p>
              <div className="w-px h-12 bg-white/30 mx-auto mt-6"></div>
            </div>

            <label className="block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <div className={`border-2 border-dashed border-white/20 p-12 text-center cursor-pointer hover:border-white/40 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="mx-auto mb-4 text-white/60" size={48} strokeWidth={1} />
                <p className="text-white font-light tracking-wider mb-2">
                  {uploading ? 'Uploading...' : 'Select Photos'}
                </p>
                <p className="text-xs text-white/40 tracking-wider uppercase">
                  Multiple files supported • Max 10MB each
                </p>
              </div>
            </label>

            {uploading && (
              <div className="mt-8">
                <div className="h-px bg-white/10 relative overflow-hidden">
                  <div
                    className="absolute h-full bg-white transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-white/60 mt-3 tracking-wider">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Elegant Footer */}
      <footer className="bg-black border-t border-white/10 py-12 text-center">
        <div className="w-px h-12 bg-white/30 mx-auto mb-6"></div>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-2">
          {coupleNames}
        </p>
        <p className="text-white/30 text-xs tracking-wider">
          {weddingDate}
        </p>
        <div className="w-px h-12 bg-white/30 mx-auto mt-6"></div>
      </footer>
    </div>
  );
};

export default WeddingPhotoApp;