export interface User {
  id: number
  isim: string
  soyisim: string
  mail: string
  cinsiyet?: string
  created_at?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Venue {
  id?: string
  isim: string
  adres: string
  mutfak_turu: string
  puan: number
  aciklama: string
  mesafe: string
  fotograf_url?: string
}

export interface OneriKullanici {
  id: number
  isim: string
  soyisim: string
}

export interface VenueSuggestion {
  id: number
  isim: string
  adres: string
  mutfak_turu: string
  oneren: OneriKullanici
  oy_sayisi: number
  oy_kullandim: boolean
  created_at: string
}

export interface MekanOnerileriListesi {
  oneriler: VenueSuggestion[]
  toplam: number
}

export interface SonucMekan {
  sira: number
  mekan_id: number
  isim: string
  adres: string
  mutfak_turu: string
  oneren: OneriKullanici
  oy_sayisi: number
  oy_kullandim: boolean
}

export interface OyKullananKullanici {
  id: number
  isim: string
  soyisim: string
  oy_zamani: string
}

export interface SonuclarResponse {
  sirali_mekanlar: SonucMekan[]
  oy_kullananlar: OyKullananKullanici[]
  oy_kullanmayanlar: OneriKullanici[]
  toplam_katilimci: number
}

export interface OyResponse {
  mekan_id: number
  oy_sayisi: number
  oy_kullandim: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  venues?: Venue[]
  timestamp: Date
}
