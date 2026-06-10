import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { SonuclarResponse } from '../types'

const MEDALS = ['🥇', '🥈', '🥉']
const AVATAR_COLORS = ['#F47B20', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#F59E0B', '#EF4444']

function initials(isim: string, soyisim: string) {
  return `${isim[0] ?? ''}${soyisim[0] ?? ''}`.toUpperCase()
}

export default function ResultsPage() {
  const [voteTab, setVoteTab] = useState<'voted' | 'not'>('voted')

  const { data, isLoading } = useQuery({
    queryKey: ['sonuclar'],
    queryFn: () => api.get<SonuclarResponse>('/api/lunch/sonuclar').then((r) => r.data),
    refetchInterval: 15_000,
  })

  const maxVotes = data?.sirali_mekanlar[0]?.oy_sayisi ?? 1

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-mobile mx-auto pb-24">
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <h1 className="text-xl font-bold text-text-primary">En Çok Oylananlar</h1>
        <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Canlı
        </span>
        {data && (
          <span className="ml-auto text-xs text-text-muted">{data.toplam_katilimci} katılımcı</span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="px-5 space-y-3">
            {data?.sirali_mekanlar.length === 0 && (
              <p className="text-center text-text-muted py-12">Henüz oy kullanılmadı.</p>
            )}
            {data?.sirali_mekanlar.map((v, i) => (
              <motion.div key={v.mekan_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-2xl p-4 shadow-card ${i === 0 ? 'border-2 border-primary/20' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{MEDALS[i] ?? `${v.sira}.`}</span>
                    <div>
                      <p className="font-bold text-text-primary text-sm">{v.isim}</p>
                      <p className="text-text-muted text-xs">{v.mutfak_turu} · {v.oneren.isim} {v.oneren.soyisim}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-xl">{v.oy_sayisi}</p>
                    <p className="text-text-muted text-xs">oy</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(v.oy_sayisi / maxVotes) * 100}%` }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full" />
                </div>
                {v.oy_kullandim && (
                  <p className="text-xs text-primary font-medium mt-2">✓ Oy kullandın</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="px-5 mt-6">
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
              {([['voted', 'Oy Kullananlar'], ['not', 'Kullanmayanlar']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setVoteTab(key)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    voteTab === key ? 'bg-white text-text-primary shadow-card' : 'text-text-muted'
                  }`}>
                  {label} {voteTab === key && (
                    <span className="text-primary">
                      ({key === 'voted' ? (data?.oy_kullananlar.length ?? 0) : (data?.oy_kullanmayanlar.length ?? 0)})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {voteTab === 'voted'
                ? data?.oy_kullananlar.map((u, i) => (
                    <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-card">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {initials(u.isim, u.soyisim)}
                      </div>
                      <p className="flex-1 font-medium text-text-primary text-sm">{u.isim} {u.soyisim}</p>
                      <p className="text-text-muted text-xs">
                        {new Date(u.oy_zamani).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </motion.div>
                  ))
                : data?.oy_kullanmayanlar.map((u, i) => (
                    <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-card">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {initials(u.isim, u.soyisim)}
                      </div>
                      <p className="flex-1 font-medium text-text-primary text-sm">{u.isim} {u.soyisim}</p>
                      <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">Bekliyor</span>
                    </motion.div>
                  ))
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}
