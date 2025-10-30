import React, { useState, useEffect } from 'react';
import { Camera, X, Sparkles, Trophy, Star, MapPin, Zap, CheckCircle } from 'lucide-react';

interface Landmark {
  id: number;
  name: string;
  category: string;
  year: string;
  discovered: boolean;
}

interface DiscoveryScannerProps {
  landmark: Landmark | null;
  onClose: () => void;
  onDiscoveryComplete: (landmarkId: number) => void;
}

type ScanningState = 'initializing' | 'scanning' | 'recognizing' | 'discovered' | 'summary';

const DiscoveryScanner: React.FC<DiscoveryScannerProps> = ({ 
  landmark, 
  onClose, 
  onDiscoveryComplete 
}) => {
  const [scanningState, setScanningState] = useState<ScanningState>('initializing');
  const [scanProgress, setScanProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [aiSummary, setAiSummary] = useState('');
  const [badge, setBadge] = useState('');

  // Simulated AR scanning process
  useEffect(() => {
    if (!landmark) return;

    const sequence = async () => {
      // Step 1: Initializing camera
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanningState('scanning');

      // Step 2: Scanning with progress
      const scanInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 2500));
      clearInterval(scanInterval);
      setScanProgress(100);

      // Step 3: Recognition
      setScanningState('recognizing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Discovery unlocked!
      setScanningState('discovered');
      setShowConfetti(true);
      
      // Calculate rewards
      const xp = Math.floor(Math.random() * 50) + 50; // 50-100 XP
      setEarnedXP(xp);
      setBadge(getBadgeForCategory(landmark.category));

      // Generate AI summary
      await new Promise(resolve => setTimeout(resolve, 2000));
      const summary = generateAISummary(landmark);
      setAiSummary(summary);
      setScanningState('summary');
    };

    sequence();
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

  const generateAISummary = (landmark: Landmark): string => {
    // Simulated AI-generated content (in production, this would call OpenAI API)
    const summaries: { [key: string]: string } = {
      'Nidaros Cathedral': 'Built over the burial site of St. Olav, Norway\'s patron saint, this magnificent Gothic cathedral has been the coronation church of Norwegian kings since 1814. Its intricate west façade features over 50 sculptures, making it one of the finest examples of medieval architecture in Scandinavia.',
      'Kristiansten Fortress': 'Constructed after the great fire of 1681, this fortress played a crucial role in defending Trondheim against Swedish forces in 1718. Today, it offers panoramic views of the city and hosts cultural events throughout the summer.',
      'Old Town Bridge': 'Known locally as "Gamle Bybro," this iconic red bridge connects the city center with Bakklandet, a picturesque neighborhood of colorful wooden houses. It\'s often called "The Gateway to Happiness."',
      'Rockheim Museum': 'Norway\'s national museum of pop and rock music, featuring interactive exhibits that chronicle Norwegian music from the 1950s to present day. The building\'s unique architecture resembles a speaker stack.',
      'Stiftsgården': 'One of Scandinavia\'s largest wooden buildings, this royal residence was completed in 1778. It serves as the official residence of the Norwegian royal family during visits to Trondheim.'
    };
    return summaries[landmark.name] || `A fascinating ${landmark.category.toLowerCase()} landmark established in ${landmark.year}. Rich in history and cultural significance, it represents an important part of local heritage.`;
  };

  const handleComplete = () => {
    if (landmark) {
      onDiscoveryComplete(landmark.id);
    }
    onClose();
  };

  if (!landmark) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* AR Camera View Simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Camera feed simulation with subtle animation */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05" /%3E%3C/svg%3E")',
            animation: 'grain 0.5s steps(10) infinite'
          }}
        />
        
        {/* Scanning Grid Overlay */}
        {(scanningState === 'scanning' || scanningState === 'recognizing') && (
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-12 opacity-30">
            {Array.from({ length: 96 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-cyan-400"
                style={{
                  animation: `pulse ${Math.random() * 2 + 1}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-white" />
            <span className="text-white font-medium">AR Scanner</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Center Content - State dependent */}
      <div className="absolute inset-0 flex items-center justify-center">
        {scanningState === 'initializing' && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Initializing AR Camera...</p>
          </div>
        )}

        {scanningState === 'scanning' && (
          <div className="text-center px-6">
            {/* Target Reticle */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cyan-400 animate-pulse" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cyan-400 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cyan-400 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cyan-400 animate-pulse" />
              
              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              </div>
              
              {/* Scanning line */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  top: `${scanProgress}%`,
                  transition: 'top 0.1s linear'
                }}
              />
            </div>
            
            <p className="text-white text-xl mb-2">Scanning landmark...</p>
            <p className="text-cyan-400 text-sm mb-4">Point camera at {landmark.name}</p>
            
            {/* Progress bar */}
            <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-white/70 text-sm mt-2">{scanProgress}%</p>
          </div>
        )}

        {scanningState === 'recognizing' && (
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="w-12 h-12 text-white animate-spin" />
              </div>
              {/* Ripple effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-cyan-400/50 animate-ping" />
              </div>
            </div>
            <p className="text-white text-xl">Analyzing image...</p>
            <p className="text-cyan-400 text-sm mt-2">Using ML recognition</p>
          </div>
        )}

        {scanningState === 'discovered' && (
          <div className="text-center px-6 relative">
            {/* Confetti Animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 60}%`,
                      top: `${50}%`,
                      backgroundColor: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                      animation: `confetti ${1 + Math.random()}s ease-out forwards`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Success Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-yellow-400/20 animate-ping" />
              </div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
            </div>
            
            {/* Discovery Text */}
            <h2 className="text-4xl font-bold text-white mb-2 animate-bounce">
              Discovery Unlocked! 🎉
            </h2>
            <h3 className="text-2xl font-serif text-yellow-400 mb-6">{landmark.name}</h3>
            
            {/* Rewards */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold text-xl">+{earnedXP} XP</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-purple-400 inline-block">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">{badge}</span>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mt-6">Loading landmark information...</p>
          </div>
        )}

        {scanningState === 'summary' && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/95 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-6 pt-20">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" fill="white" />
                </div>
                <h2 className="text-3xl font-serif text-white mb-2">{landmark.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30">
                    {landmark.category}
                  </span>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30">
                    Est. {landmark.year}
                  </span>
                </div>
              </div>

              {/* AI-Generated Summary */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold">AI-Generated Summary</h3>
                </div>
                <p className="text-white/80 leading-relaxed">{aiSummary}</p>
              </div>

              {/* Rewards Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/70 text-sm">Experience</span>
                  </div>
                  <p className="text-2xl font-bold text-white">+{earnedXP} XP</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-white/70 text-sm">Badge Earned</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{badge}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Continue Exploring
                </button>
                <button 
                  className="w-full bg-white/10 backdrop-blur-sm text-white py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Share Discovery
                </button>
              </div>

              {/* Fun Facts Section */}
              <div className="mt-6 p-4 bg-cyan-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/20">
                <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Did you know?
                </h4>
                <p className="text-white/70 text-sm">
                  You're the {Math.floor(Math.random() * 500) + 100}th explorer to discover this landmark! Keep exploring to unlock more achievements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint Text */}
      {(scanningState === 'initializing' || scanningState === 'scanning') && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white/70 text-center text-sm">
            {scanningState === 'initializing' ? 
              'Preparing AR camera...' : 
              'Hold steady and ensure the landmark is clearly visible'
            }
          </p>
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) translateX(${Math.random() * 200 - 100}px) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}</style>
    </div>
  );
};

export default DiscoveryScanner;
