import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { useGeolocation } from '../hooks/useGeolocation'
import type { ChatMessage, Venue } from '../types'

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=70',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=70',
]

let msgId = 0
const nextId = () => String(++msgId)

const WELCOME: ChatMessage = {
  id: nextId(),
  role: 'assistant',
  content: 'Merhaba! Bugün öğle yemeği için nasıl bir yer arıyorsun? Sana birkaç öneride bulunabilirim. 🍽️',
  timestamp: new Date(),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { lat, lon } = useGeolocation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: ChatMessage = { id: nextId(), role: 'user', content: text, timestamp: new Date() }
    setMessages((m) => [...m, userMsg])
    setLoading(true)

    try {
      const { data } = await api.get<{ mekanlar: Venue[] }>(`/api/lunch/mekanlar?lat=${lat ?? 39.9564}&lon=${lon ?? 32.8527}`)
      const venues = data.mekanlar.slice(0, 2)
      const aiMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: `Harika bir tercih! Sana göre birkaç mekan önereceğim:`,
        venues,
        timestamp: new Date(),
      }
      setMessages((m) => [...m, aiMsg])
    } catch {
      setMessages((m) => [...m, {
        id: nextId(), role: 'assistant',
        content: 'Şu an öneri getiremedim. Biraz sonra tekrar dene.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-mobile mx-auto bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 bg-white border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-dark flex items-center justify-center">
          <span className="text-primary font-black text-lg">N</span>
        </div>
        <div>
          <h1 className="font-bold text-text-primary text-base">AI Mekan Asistanı</h1>
          <p className="text-green-500 text-xs font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Çevrimiçi
          </p>
        </div>
        <span className="ml-auto text-xl">✨</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0 mt-auto">
                  <span className="text-primary text-xs font-black">N</span>
                </div>
              )}
              <div className="max-w-[78%]">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white text-text-primary rounded-bl-sm shadow-card'
                }`}>
                  {msg.content}
                </div>
                {msg.venues && msg.venues.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {msg.venues.map((v, i) => (
                      <div key={i} className="flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-card">
                        <img src={FOOD_IMAGES[i % 2]} alt={v.isim} className="w-full h-24 object-cover" />
                        <div className="p-2.5">
                          <p className="font-semibold text-text-primary text-xs leading-tight line-clamp-1">{v.isim}</p>
                          <p className="text-text-muted text-xs mt-0.5">{v.mutfak_turu}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-text-muted text-xs">{'$$'}</span>
                            <button className="text-primary text-xs font-semibold border border-primary/30 px-2 py-0.5 rounded-full">
                              İncele
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-black">N</span>
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-24 pt-2 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-background rounded-2xl px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Mesaj yaz..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage} disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-orange disabled:opacity-40 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white -rotate-45">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
