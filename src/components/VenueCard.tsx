import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import StarRating from './StarRating'
import type { Venue, VenueSuggestion } from '../types'

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
]

interface Props {
  venue: Venue | VenueSuggestion
  index: number
  isTop: boolean
  suggesterName?: string
  onSwipe: (dir: 'left' | 'right') => void
}

function isVenue(v: Venue | VenueSuggestion): v is Venue {
  return 'isim' in v
}

export default function VenueCard({ venue, index, isTop, suggesterName, onSwipe }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const likeOpacity = useTransform(x, [0, 80], [0, 1])
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0])

  const name = isVenue(venue) ? venue.isim : venue.mekan_adi
  const cuisine = isVenue(venue) ? venue.mutfak_turu : venue.mutfak_turu
  const address = isVenue(venue) ? venue.adres : venue.adres
  const rating = isVenue(venue) ? venue.puan : 0
  const distance = isVenue(venue) ? venue.mesafe : ''
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

        {suggesterName && (
          <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-orange">
            {suggesterName} Önerdi
          </div>
        )}

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
