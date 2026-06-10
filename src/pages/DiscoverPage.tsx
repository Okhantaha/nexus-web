import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import api from '../lib/api'
import { useGeolocation } from '../hooks/useGeolocation'
import VenueCard from '../components/VenueCard'
import type { Venue, MekanOnerileriListesi, OyResponse } from '../types'

type Tab = 'ai' | 'human'

export default function DiscoverPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<Tab>('ai')
  const [currentIndex, setCurrentIndex] = useState(0)
  const { lat, lon } = useGeolocation()

  const aiQuery = useQuery({
    queryKey: ['venues', lat, lon],
    queryFn: () => api.get<Venue[]>(`/api/lunch/mekanlar?lat=${lat}&lon=${lon}`).then((r) => r.data),
    enabled: !!lat && !!lon,
    staleTime: 5 * 60 * 1000,
  })

  const humanQuery = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => api.get<MekanOnerileriListesi>('/api/lunch/oneriler').then((r) => r.data),
  })

  const voteMutation = useMutation({
    mutationFn: (mekanId: number) =>
      api.post<OyResponse>(`/api/lunch/oy/${mekanId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
      queryClient.invalidateQueries({ queryKey: ['sonuclar'] })
    },
  })

  const aiVenues = aiQuery.data ?? []
  const humanVenues = humanQuery.data?.oneriler ?? []
  const venues = tab === 'ai' ? aiVenues : humanVenues
  const loading = tab === 'ai' ? aiQuery.isLoading : humanQuery.isLoading
  const remaining = venues.slice(currentIndex)
  const totalCount = tab === 'human' ? (humanQuery.data?.toplam ?? 0) : aiVenues.length

  function handleSwipe() {
    setCurrentIndex((i) => i + 1)
  }

  function handleVote() {
    const top = remaining[0]
    if (tab === 'human' && top && 'id' in top) {
      voteMutation.mutate((top as { id: number }).id)
    }
    handleSwipe()
  }

  return (
    <div className="flex flex-col h-screen bg-background max-w-mobile mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <h1 className="text-lg font-bold text-text-primary">Bugün Nereye?</h1>
        <div className="flex items-center gap-2">
          <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {totalCount} Katılımcı
          </span>
          <button onClick={() => navigate('/results')}
            className="text-primary text-sm font-semibold border border-primary/30 px-3 py-1 rounded-full">
            Sonuçları Gör
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 pb-4">
        {([['ai', '🤖', 'AI Önerileri'], ['human', '👥', 'İnsan Önerileri']] as const).map(([key, emoji, label]) => (
          <button key={key} onClick={() => { setTab(key); setCurrentIndex(0) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === key ? 'bg-primary text-white shadow-orange' : 'bg-white text-text-secondary border border-gray-200'
            }`}>
            <span>{emoji}</span>{label}
          </button>
        ))}
      </div>

      {/* Card Stack */}
      <div className="flex-1 px-5 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-text-muted text-sm">Mekanlar yükleniyor...</p>
          </div>
        ) : remaining.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl">🎉</div>
            <div className="text-center">
              <p className="font-bold text-text-primary">Hepsi bu kadar!</p>
              <p className="text-text-muted text-sm mt-1">Tüm mekanları gördün</p>
            </div>
            <button onClick={() => setCurrentIndex(0)}
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold shadow-orange">
              Tekrar Başla
            </button>
          </div>
        ) : (
          <div className="relative h-full" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            <AnimatePresence>
              {remaining.slice(0, 3).map((venue, i) => (
                <VenueCard
                  key={currentIndex + i}
                  venue={tab === 'human' ? {
                    isim: (venue as { isim: string }).isim,
                    adres: (venue as { adres: string }).adres,
                    mutfak_turu: (venue as { mutfak_turu: string }).mutfak_turu,
                    puan: 0,
                    aciklama: '',
                    mesafe: '',
                  } : venue as Venue}
                  index={currentIndex + i}
                  isTop={i === 0}
                  suggesterName={
                    tab === 'human'
                      ? `${(venue as { oneren: { isim: string; soyisim: string } }).oneren.isim} ${(venue as { oneren: { isim: string; soyisim: string } }).oneren.soyisim}`
                      : undefined
                  }
                  voteCount={tab === 'human' ? (venue as { oy_sayisi: number }).oy_sayisi : undefined}
                  hasVoted={tab === 'human' ? (venue as { oy_kullandim: boolean }).oy_kullandim : undefined}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {remaining.length > 0 && !loading && (
        <div className="px-5 pb-24 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSwipe()}
              className="w-14 h-14 rounded-full bg-white shadow-card flex items-center justify-center border border-red-100">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleVote}
              disabled={voteMutation.isPending}
              className="w-14 h-14 rounded-full bg-white shadow-card flex items-center justify-center border border-green-100 disabled:opacity-50">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </motion.button>
          </div>
          {tab === 'human' && remaining[0] && (
            <p className="text-xs text-text-muted">
              {(remaining[0] as { oy_kullandim: boolean }).oy_kullandim
                ? '✓ Bu mekana oy verdin'
                : '✓ butonuna bas oy ver'}
            </p>
          )}
          <Link to="/suggest"
            className="text-primary text-sm font-semibold border border-primary/30 px-5 py-2.5 rounded-full">
            + Mekan Öner
          </Link>
        </div>
      )}
    </div>
  )
}
