import { useState } from 'react'
import { motion } from 'framer-motion'
import type { LeaderboardVenue, VoteEntry } from '../types'

const MOCK_VENUES: LeaderboardVenue[] = [
  { id: '1', name: 'Karaköy Lokantası', cuisine: 'Türk Mutfağı', votes: 42, maxVotes: 42 },
  { id: '2', name: 'Midpoint', cuisine: 'Fast Food', votes: 28, maxVotes: 42 },
  { id: '3', name: 'Günaydın Kasap', cuisine: 'Et & Kebap', votes: 15, maxVotes: 42 },
]

const MOCK_VOTERS: VoteEntry[] = [
  { id: '1', name: 'Ahmet Yılmaz', initials: 'AY', color: '#F47B20', time: '10:42', voted: true },
  { id: '2', name: 'Ayşe Demir', initials: 'AD', color: '#3B82F6', time: '10:35', voted: true },
  { id: '3', name: 'Mehmet Kaya', initials: 'MK', color: '#8B5CF6', time: '10:12', voted: true },
  { id: '4', name: 'Can Gürbüz', initials: 'CG', color: '#10B981', time: '09:58', voted: true },
]

const MOCK_NON_VOTERS: VoteEntry[] = [
  { id: '5', name: 'Zeynep Arslan', initials: 'ZA', color: '#EC4899', time: '', voted: false },
  { id: '6', name: 'Ali Çelik', initials: 'AÇ', color: '#F59E0B', time: '', voted: false },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function ResultsPage() {
  const [voteTab, setVoteTab] = useState<'voted' | 'not'>('voted')
  const list = voteTab === 'voted' ? MOCK_VOTERS : MOCK_NON_VOTERS

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-mobile mx-auto pb-24">
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <h1 className="text-xl font-bold text-text-primary">En Çok Oylananlar</h1>
        <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Canlı
        </span>
      </div>

      <div className="px-5 space-y-3">
        {MOCK_VENUES.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl p-4 shadow-card ${i === 0 ? 'border-2 border-primary/20' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{MEDALS[i]}</span>
                <div>
                  <p className="font-bold text-text-primary text-sm">{v.name}</p>
                  <p className="text-text-muted text-xs">{v.cuisine}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary font-black text-xl">{v.votes}</p>
                <p className="text-text-muted text-xs">oy</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(v.votes / v.maxVotes) * 100}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-primary rounded-full" />
            </div>
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
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {list.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-card">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: entry.color }}>
                {entry.initials}
              </div>
              <p className="flex-1 font-medium text-text-primary text-sm">{entry.name}</p>
              {entry.time && <p className="text-text-muted text-xs">{entry.time}</p>}
              {!entry.voted && <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">Bekliyor</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
