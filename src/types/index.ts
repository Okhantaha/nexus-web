export interface User {
  id: number
  mail: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
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

export interface VenueSuggestion {
  id?: number
  mekan_adi: string
  mutfak_turu: string
  adres: string
  oneren?: string
  created_at?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  venues?: Venue[]
  timestamp: Date
}

export interface VoteEntry {
  id: string
  name: string
  initials: string
  color: string
  time: string
  voted: boolean
}

export interface LeaderboardVenue {
  id: string
  name: string
  cuisine: string
  votes: number
  maxVotes: number
  image?: string
}
