import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import type { AuthResponse, User } from '../types'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/register', { mail, password })
      const { data: user } = await api.get<User>('/api/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      setAuth(data.access_token, user)
      navigate('/discover')
    } catch {
      setError('Kayıt başarısız. Bu e-posta zaten kullanılıyor olabilir.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-dark flex items-center justify-center shadow-orange mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-dark to-dark-card" />
            <span className="relative text-primary font-black text-3xl tracking-tight">N</span>
            <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Nexus</h1>
          <p className="text-text-muted text-sm mt-1">Hesap Oluştur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">E-posta</label>
            <input type="email" placeholder="ornek@sirket.com" value={mail} onChange={(e) => setMail(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">Şifre</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-orange disabled:opacity-60 transition-all mt-2">
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </motion.button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Hesabın var mı?{' '}
          <Link to="/" className="text-primary font-semibold">Giriş Yap</Link>
        </p>
      </motion.div>
    </div>
  )
}
