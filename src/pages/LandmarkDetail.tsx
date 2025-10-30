import { useEffect, useState } from 'react';
import { X, MapPin, Sparkles, Trophy, Star, Zap, Camera } from 'lucide-react';

// Resolve local assets via Vite's import.meta.url so TypeScript doesn't need custom declarations for .jpg
const nidarosImage = new URL('../assets/nidaros_cathedral.jpg', import.meta.url).href;
const nidaros1Image = new URL('../assets/nidaros_1.jpg', import.meta.url).href;
const nidaros01Image = new URL('../assets/Nidaros_Cathedral_01.jpg', import.meta.url).href;
const nidaros712Image = new URL('../assets/Nidarosdomen_7.1.2.jpg', import.meta.url).href;
const kristianMain = new URL('../assets/Kristiansten_Festning_sunrise_red_canon.jpg', import.meta.url).href;
const kristian2 = new URL('../assets/fortress2.jpg', import.meta.url).href;
const kristian3 = new URL('../assets/fortress3.jpg', import.meta.url).href;
const kristian4 = new URL('../assets/fortress4.jpg', import.meta.url).href;

interface LandmarkBasic {
  id: number;
  name: string;
  category: string;
  year: string;
  discovered: boolean;
}

interface LandmarkDetailProps {
  landmark: LandmarkBasic;
  onClose: () => void;
  photos?: string[]; // optional list of photo URLs
}

const LandmarkDetail = ({ landmark, onClose, photos = [] }: LandmarkDetailProps) => {
  const [aiSummary, setAiSummary] = useState('');
  const [earnedXP, setEarnedXP] = useState(0);
  const [badge, setBadge] = useState('');

  useEffect(() => {
    // Simulate loading content and rewards similar to DiscoveryScanner summary stage
    const xp = Math.floor(Math.random() * 25) + 25; // 25-50 XP for reading more
    setEarnedXP(xp);
    setBadge(getBadgeForCategory(landmark.category));
    const summary = generateAISummary(landmark);
    setAiSummary(summary);
  }, [landmark]);

  const getBadgeForCategory = (category: string): string => {
    const badges: { [key: string]: string } = {
      'Historic': '🏛️ History Scholar',
      'Military': '⚔️ Fortress Explorer',
      'Architecture': '🏗️ Design Enthusiast',
      'Culture': '🎨 Culture Curator',
      'Royal': '👑 Royal Heritage'
    };
    return badges[category] || '⭐ Explorer';
  };

  const generateAISummary = (lm: LandmarkBasic): string => {
    const summaries: { [key: string]: string } = {
      'Nidaros Cathedral': `Built over the burial site of St. Olav, this Gothic masterpiece became Norway's coronation church. Its ornate west façade and centuries of craftsmanship make it a living chronicle of Scandinavian history.`,
      'Kristiansten Fortress': `Raised after the great fire of 1681, the fortress secured Trondheim and withstood the 1718 siege. Today it serves as a vantage point and cultural venue overlooking the city.`,
      'Old Town Bridge': `The "Gamle Bybro" connects the center with Bakklandet, a postcard view of colorful wooden houses. Nicknamed the Gateway to Happiness, it's a beloved symbol of Trondheim.`,
      'Rockheim Museum': `Norway's national museum of pop and rock chronicles the sounds and scenes from the 1950s onward with immersive, interactive exhibits.`,
      'Stiftsgården': `Among Scandinavia's largest wooden residences, Stiftsgården has hosted the Norwegian royal family since the late 18th century and anchors the city's ceremonial life.`,
    };
    return summaries[lm.name] || `A notable ${lm.category.toLowerCase()} landmark established in ${lm.year}. Its stories and design offer a window into the city's evolving identity.`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-black/90 to-black/95 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Landmark Details</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close details"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 pt-2">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-serif text-white mb-2">{landmark.name}</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">
              {landmark.category}
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">
              Est. {landmark.year}
            </span>
          </div>
        </div>

        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-white/10 mb-6 shadow-xl">
          <img
            src={
              landmark.name === 'Nidaros Cathedral'
                ? nidarosImage // use the image located at `src/assets/nidaros_cathedral.jpg`
                : landmark.name === 'Kristiansten Fortress'
                ? kristianMain
                : `https://placehold.co/1200x700/png?text=${encodeURIComponent(landmark.name)}`
            }
            alt={`${landmark.name} photo`}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* AI Summary */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Overview</h3>
          </div>
          <p className="text-white/80 leading-relaxed">{aiSummary}</p>
        </div>

        {/* Photos Gallery (placeholder or provided) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Photos</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(
              photos.length > 0
                ? photos
                : landmark.name === 'Nidaros Cathedral'
                ? [nidaros1Image, nidaros01Image, nidaros712Image]
                : landmark.name === 'Kristiansten Fortress'
                ? [kristian2, kristian3, kristian4]
                : [
                    `https://placehold.co/400x300/png?text=${encodeURIComponent(landmark.name)}`,
                    `https://placehold.co/400x300/png?text=${encodeURIComponent(landmark.name)}+Photo+2`,
                    `https://placehold.co/400x300/png?text=${encodeURIComponent(landmark.name)}+Photo+3`
                  ]
            ).map((src, idx) => (
              <img key={idx} src={src} alt={`${landmark.name} ${idx + 1}`} className="w-full h-28 object-cover rounded-lg border border-white/10" />
            ))}
          </div>
        </div>

        {/* Rewards & Meta */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70 text-sm">Reading Bonus</span>
            </div>
            <p className="text-2xl font-bold text-white">+{earnedXP} XP</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-white/70 text-sm">Badge</span>
            </div>
            <p className="text-lg font-semibold text-white">{badge}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Back to Map
          </button>
          <button 
            className="px-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start AR Scan
          </button>
        </div>

        {/* Trivia */}
        <div className="mt-6 p-4 bg-cyan-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/20">
          <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Did you know?
          </h4>
          <p className="text-white/70 text-sm">
            This landmark often appears in local postcards and travel journals. Explore nearby sites to continue your discovery streak!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandmarkDetail;
