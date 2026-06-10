# Nexus Web

**Nexus**, ekip içi öğle yemeği kararlarını kolaylaştıran bir mekan öneri ve oylama uygulamasıdır. Bu repo, [NexusAPI](https://github.com/batuhanbaran/NexusAPI) backend'i için geliştirilmiş React web frontend'ini içerir.

---

## Özellikler

- **Giriş / Kimlik Doğrulama** — JWT tabanlı oturum yönetimi
- **AI Önerileri** — GPS konumuna göre Groq AI destekli mekan önerileri
- **İnsan Önerileri** — Ekip üyelerinin eklediği mekanları swipe ile keşfet
- **Oylama** — Beğendiğin mekana oy ver, oyu geri al (toggle)
- **Canlı Sıralama** — En çok oy alan mekanları ve katılımcıları gerçek zamanlı gör
- **AI Sohbet Asistanı** — Doğal dille mekan önerisi al
- **Mekan Öner** — Yeni mekan ekle

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | React 18 + Vite |
| Dil | TypeScript |
| Stil | Tailwind CSS |
| Animasyon | Framer Motion |
| Veri Fetching | TanStack Query v5 |
| State | Zustand |
| HTTP | Axios |
| Routing | React Router v6 |

---

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışır. API istekleri varsayılan olarak `https://nexusapi-suj1.onrender.com` adresine yönlendirilir.

Farklı bir backend kullanmak için `.env` dosyası oluştur:

```env
VITE_API_URL=http://localhost:8000
```

---

## Proje Yapısı

```
src/
├── pages/
│   ├── LoginPage.tsx        # Giriş ekranı
│   ├── DiscoverPage.tsx     # Swipe keşif (AI + İnsan önerileri)
│   ├── ResultsPage.tsx      # Canlı oy sıralaması
│   ├── ChatPage.tsx         # AI sohbet asistanı
│   └── SuggestPage.tsx      # Mekan öneri formu
├── components/
│   ├── VenueCard.tsx        # Swipe kartı (Framer Motion)
│   ├── BottomNav.tsx        # Alt navigasyon
│   └── ProtectedRoute.tsx   # Auth koruması
├── hooks/
│   └── useGeolocation.ts    # GPS hook
├── lib/
│   └── api.ts               # Axios instance + JWT interceptor
├── store/
│   └── authStore.ts         # Zustand auth state
└── types/
    └── index.ts             # TypeScript tipleri
```

---

## Backend

Bu proje [NexusAPI](https://github.com/batuhanbaran/NexusAPI) ile çalışır.  
Canlı API: `https://nexusapi-suj1.onrender.com`

---

## Lisans

MIT
