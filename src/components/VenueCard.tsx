import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import StarRating from './StarRating'
import type { Venue } from '../types'

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
]

interface Props {
  venue: Venue
  index: number
  isTop: boolean
  suggesterName?: string
  voteCount?: number
  hasVoted?: boolean
  onSwipe: (dir: 'left' | 'right') => void
}

export default function VenueCard({ venue, index, isTop, suggesterName, voteCount, hasVoted, onSwipe }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const likeOpacity = useTransform(x, [0, 80], [0, 1])
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0])

  const { isim: name, mutfak_turu: cuisine, adres: address, puan: rating, mesafe: distance } = venue
  const imageUrl = FOOD_IMAGES[index % FOOD_IMAGES.length]

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 100) onSwipe('right')
    else if (info.offset.x < -100) onSwipe('left')
  }

  return (
    <motion.div
      style={{ x, rotate, opacity, position: 'absolute', top: 0, left: 0, right: 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 16 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full rounded-3xl overflow-hidden shadow-card-hover cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-full">
        <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {suggesterName && (
            <div className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-orange">
              {suggesterName} Önerdi
            </div>
          )}
          {voteCount !== undefined && (
            <div className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${hasVoted ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
              {voteCount}
            </div>
          )}
        </div>

        {isTop && (
          <>
            <motion.div style={{ opacity: likeOpacity }}
              className="absolute top-8 left-6 border-4 border-green-400 text-green-400 text-2xl font-black px-4 py-1 rounded-xl rotate-[-20deg]">
              EVET
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }}
              className="absolute top-8 right-6 border-4 border-red-400 text-red-400 text-2xl font-black px-4 py-1 rounded-xl rotate-[20deg]">
              PAS
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-white text-2xl font-bold leading-tight mb-1">{name}</h2>
          <p className="text-white/70 text-sm mb-2">
            {cuisine}{distance ? ` · ${distance}` : ''}{address ? ` · ${address.slice(0, 30)}` : ''}
          </p>
          {rating > 0 && <StarRating rating={rating} />}
        </div>
      </div>
    </motion.div>
  )
}
