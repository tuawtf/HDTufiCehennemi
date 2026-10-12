# Young Sheldon — İkimize Özel Romantik Dizi İzleme Platformu

Sevgilinizle birlikte baş başa izleyeceğiniz, resmi Google Material Design 3 (M3) tasarım sistemini eksiksiz uygulayan, sade ve romantik bir izleme geçmişi tutan, yeni bölümlerin video linkiyle kolayca yüklenebildiği ve şifresiz doğrudan yönetici paneline sahip özel web uygulaması.

---

## Kullanıcı Tercihleri ve Kararlar

> [!IMPORTANT]
> Kullanıcı ile 1. Aşamada (`ask_question`) netleştirilen temel kararlar:
> - **Seçilen Dizi**: *Young Sheldon* (Tüm platform yalnızca bu diziye ve çiftin izleme serüvenine odaklanacak).
> - **Romantik İzleme Geçmişi**: Yalnızca hangi tarihte ve saatte hangi bölümün birlikte izlendiğini gösteren, sade ve şık bir kronolojik izleme günlüğü.
> - **Bölüm Yükleme / Video Kaynağı**: Video bağlantıları (MP4, HLS, Google Drive, YouTube veya iframe embed) ve önceden yüklenmiş zengin örnek Young Sheldon bölümleri.
> - **Yönetici Paneli Erişimi**: Şifresiz, tek tıkla doğrudan açılan hızlı içerik ve bölüm yönetimi paneli.

---

## 1. Genel Bakış ve Temel Konsept

- **Ne İşe Yarar?**: Genel kitleye yönelik karmaşık dizi siteleri yerine; iki kişinin ortak dizi izleme ritüelini güzelleştiren, *Young Sheldon* bölümlerini sırayla oynatan, birlikte izlenen bölümleri romantik bir zaman çizelgesinde saklayan ve yeni bölümlerin pratikçe eklenebildiği samimi bir özel yayın alanı.
- **Hedef Kitle**: Ahmet ve sevgilisi (çift için özel, dikkat dağıtıcı reklamsız, temiz arayüz).
- **Temel Değer**: Sevgiliyle dizi izlerken "en son nerede kalmıştık?" veya "bu bölümü ne zaman izlemiştik?" karmaşasını bitiren, her bölümün tamamlanma tarihini ölümsüzleştiren Material 3 estetiğinde bir yuva.

---

## 2. Kullanıcı Deneyimi ve Material 3 Görsel Tasarımı

### Görsel Kimlik ve Material 3 Renk Rolleri
Uygulama, Google Material Design 3 yönergelerindeki tonal renk paleti ve yüzey hiyerarşisiyle tasarlanır:
- **Primary (`#8D4F5E`) & Primary Container (`#FFD9DF`)**: Romantik gül kurusu ve sıcak berry tonları; M3 FAB butonları ve aktif sekme kapsayıcıları.
- **On Primary (`#FFFFFF`) & On Primary Container (`#3A0B18`)**: Yüksek kontrastlı okunabilirlik.
- **Surface (`#FFF8F8`) & Surface Container High (`#F5EBEB`)**: Yumuşak, dingin arka plan ve yükseltilmiş kart yüzeyleri (M3 Elevation Level 1 & 2).
- **Outline & Outline Variant (`#857376` & `#D7C2C4`)**: 1px M3 kılcal kenarlıklar ve liste ayraçları.
- **Dark Mode Uyumu**: Gece izlemeleri için M3 Dark Surface (`#191113`), Surface Container (`#22191B`) ve Tonal Rose vurguları.

### Tipografi ve Bileşen Mimarisi
- **Tipografi**: Google Sans / Plus Jakarta Sans aileleri ile M3 ölçeği (Display Large, Headline Medium, Title Large, Body Medium, Label Large).
- **M3 Navigation Bar**: Altta (mobilde) veya üstte (geniş ekranda) M3 aktif göstergesi ile *Bölümler*, *İzleme Geçmişimiz*, *Dizi Detayları* ve *Yönetici Paneli* sekmeleri.
- **M3 Elevated / Tonal Cards**: Bölüm kartlarında 24px (`rounded-3xl`) yumuşak köşeler, oynat butonu ve izlendi rozeti.
- **M3 Video Player**: Dahili HTML5 video oynatıcı (MP4/video akışları için hız ayarı, tam ekran, zaman çubuğu) ve YouTube/Embed linkleri için otomatik duyarlı iframe desteği.
- **M3 Floating Action Button (FAB)**: Sayfanın sağ alt köşesinde hızlıca son kalınan bölüme götüren "Kaldığımız Yerden Devam Et" aksiyon butonu.

---

## 3. Ürün Özellikleri ve Bölüm Akışları

```
┌────────────────────────────────────────────────────────────────────────┐
│                        M3 TOP APP BAR & ÇİFT LOGOSU                    │
│                 "Bizim Dizimiz · Young Sheldon"                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    M3 CİNEMATİK OYNATICI ALANI                   │  │
│  │    [ Video Ekranı / Embed / Oynatıcı Kontrolleri ]               │  │
│  │    Bölüm 1: Pilot · "Birlikte İzledik" Butonu ✓                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │  SEZON & BÖLÜM LİSTESİ │  │      ROMANTİK İZLEME GEÇMİŞİMİZ       │  │
│  │  • Sezon 1 (Bölüm 1-22)│  │  • 1. Bölüm: 12 Ekim 2026, 21:30     │  │
│  │  • Sezon 2 (Bölüm 1-22)│  │  • 2. Bölüm: 14 Ekim 2026, 22:15     │  │
│  │  • [+ Yeni Bölüm Ekle] │  │  • Toplam: 4 Bölüm Birlikte İzlendi   │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              YÖNETİCİ PANELİ (ŞİFRESİZ DOĞRUDAN ERİŞİM)          │  │
│  │  Bölüm Başlığı, Sezon, Bölüm No, Süre, Video URL, Açıklama       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Ana İzleme Ekranı (Young Sheldon Focus)**:
   - Seçilen bölümü geniş ekranda hemen oynatabilme.
   - Doğrudan video dosyaları (MP4, WebM, HLS) veya YouTube/Drive embed bağlantılarını sorunsuz algılayıp oynatan çift yönlü video motoru.
   - Bölüm bittiğinde tek tıkla "İzledik Olarak İşaretle" aksiyonu.

2. **Romantik İzleme Geçmişi ("Aşk Günlüğümüz")**:
   - İzlenen her bölümün yanına eklenen romantik tamamlanma damgası (örneğin: *"14 Ekim 2026, 22:15'te birlikte izlendi"*).
   - Sade istatistikler: Birlikte tamamlanan bölüm sayısı, toplam izleme süresi ve sezon ilerleme yüzdesi.
   - İstenildiğinde izleme geçmişini sıfırlama veya düzenleme imkanı.

3. **Yönetici Paneli (İçerik Yönetimi)**:
   - Şifresiz, tek tıkla açılan sezgisel M3 yönetim arayüzü.
   - Form alanları: Sezon Seçimi / Yeni Sezon, Bölüm Numarası, Bölüm Adı, Süre (dk), Video Bağlantısı (URL/Embed), Bölüm Özeti.
   - Mevcut bölümleri düzenleme, silme ve video linkini güncelleme.
   - Verilerin kaybolmaması için tarayıcı `localStorage` desteği ve tek tıkla `JSON Yedek İndir / Yükle` güvencesi.

---

## 4. Teknik Mimari ve Veri Stratejisi

```
                ┌─────────────────────────────────┐
                │         React 19 + Vite         │
                │     Material 3 Tasarım Teması    │
                └───────────────┬─────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Young Sheldon │       │   Romantik    │       │   Yönetici    │
│ Video Oynatıcı│       │ İzleme Günlüğü│       │    Paneli     │
│  (MP4/Embed)  │       │ (Tarih/Saat)  │       │ (Bölüm Ekle)  │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                ┌─────────────────────────────────┐
                │    localStorage Veri Deposu     │
                │  - initialEpisodes (Young S.)  │
                │  - watchHistory (Zaman damgası)│
                │  - JSON Dışa/İçe Aktarımı       │
                └─────────────────────────────────┘
```

- **Veri Modeli**:
  - `Episode`: id, season, episodeNumber, title, duration, videoUrl, videoType ('direct' | 'embed'), description, thumbnail, airDate.
  - `WatchRecord`: episodeId, watchedAt (ISO timestamp), formattedDate, notes.
- **Kusursuz Oynatıcı Uyumu**: MP4/WebM doğrudan HTML5 video oynatıcıyla çalışır; YouTube, Google Drive ve video barındırma linkleri otomatik olarak M3 çerçeveli responsive iframe içine dönüştürülür.
- **Hazır İçerik**: Kullanıcının hemen keyifle test edebilmesi için Young Sheldon 1. ve 2. sezonundan gerçek bölüm başlıkları, özetleri ve çalışan örnek video akışları başlangıçta hazır sunulur.
