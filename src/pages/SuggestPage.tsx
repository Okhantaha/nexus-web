import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

const CUISINE_OPTIONS = ['Et & Kebap', 'Cafe', 'Fast Food', 'Türk Mutfağı', 'İtalyan', 'Deniz Ürünleri', 'Vegan', 'Diğer']

export default function SuggestPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [mekanAdi, setMekanAdi] = useState('')
  const [mutfakTuru, setMutfakTuru] = useState('')
  const [adres, setAdres] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/lunch/oner', { mekan_adi: mekanAdi, mutfak_turu: mutfakTuru, adres })
      setSuccess(true)
      setTimeout(() => navigate('/discover'), 1500)
    } catch {
      alert('Öneri gönderilemedi. Tekrar dene.')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.mail?.slice(0, 2).toUpperCase() ?? 'JD'
  const displayName = user?.mail?.split('@')[0] ?? 'Kullanıcı'

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-mobile mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="text-text-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-bold text-text-primary text-base">Mekan Öner</h1>
        <motion.button whileTap={{ scale: 0.95 }} type="submit" form="suggest-form" disabled={loading}
          className="text-primary font-semibold text-sm disabled:opacity-40">
          Gönder
        </motion.button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
          <p className="text-green-700 font-semibold text-sm">✅ Önerin alındı! Teşekkürler.</p>
        </motion.div>
      )}

      <form id="suggest-form" onSubmit={handleSubmit} className="px-5 pt-6 space-y-5 pb-24">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Mekan Adı <span className="text-red-400">*</span>
          </label>
          <input value={mekanAdi} onChange={(e) => setMekanAdi(e.target.value)} required
            placeholder="Mekan adını girin" maxLength={100}
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          <p className="text-right text-xs text-text-muted mt-1">{mekanAdi.length}/100</p>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Mutfak Türü</label>
          <div className="relative">
            <select value={mutfakTuru} onChange={(e) => setMutfakTuru(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
              <option value="">Et & Kebap, Cafe, Fast Food...</option>
              {CUISINE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Adres</label>
          <textarea value={adres} onChange={(e) => setAdres(e.target.value)} rows={3}
            placeholder="Mekanın açık adresini girin"
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
        </div>

        <div className="bg-white rounded-2xl px-4 py-3.5 border border-gray-200">
          <p className="text-xs font-medium text-text-secondary mb-2">Öneren</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-text-primary">{displayName}</span>
          </div>
        </div>
      </form>
    </div>
  )
}
