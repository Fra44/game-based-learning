import { useState } from 'react';
import { MapPin, Compass, Book, Trophy, User, Camera } from 'lucide-react';
import DiscoveryScanner from './DiscoveryScanner';
import LandmarkDetail from './LandmarkDetail';
import Museum from './Museum';

interface Landmark {
  id: number;
  name: string;
  x: number;
  y: number;
  discovered: boolean;
  category: string;
  year: string;
  metersAway: number;
}

const WatercolorAtlasExplore = () => {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [landmarkToScan, setLandmarkToScan] = useState<Landmark | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [landmarkToShow, setLandmarkToShow] = useState<Landmark | null>(null);
  const [showMuseum, setShowMuseum] = useState(false);

  // Landmark data - discovered vs undiscovered
  const [landmarks, setLandmarks] = useState([
  // moved pins: Nidaros -> red cross (left), Kristiansten -> blue cross (right)
  { id: 1, name: 'Nidaros Cathedral', x: 10, y: 50, discovered: true, category: 'Historic', year: '1070', metersAway: 100 },
  { id: 2, name: 'Kristiansten Fortress', x: 89, y: 45, discovered: true, category: 'Military', year: '1681', metersAway: 300 },
    { id: 3, name: 'Old Town Bridge', x: 62, y: 14, discovered: false, category: 'Architecture', year: '1861', metersAway: 50 },
    { id: 4, name: 'Rockheim Museum', x: 30, y: 60, discovered: false, category: 'Culture', year: '2010', metersAway: 125 },
    { id: 5, name: 'Stiftsgården', x: 7, y: 39, discovered: false, category: 'Royal', year: '1778', metersAway: 500 },
  ]);

  const discoveredCount = landmarks.filter(l => l.discovered).length;
  const totalCount = landmarks.length;

  // Position the user indicator near Old Town Bridge if present
  const oldBridge = landmarks.find(l => l.name === 'Old Town Bridge');
  const userX = oldBridge ? oldBridge.x + 6 : 50; // small offset to sit next to the pin
  const userY = oldBridge ? oldBridge.y + 2: 50;

  // Handle discovery completion
  const handleDiscoveryComplete = (landmarkId: number) => {
    setLandmarks(prevLandmarks =>
      prevLandmarks.map(landmark =>
        landmark.id === landmarkId ? { ...landmark, discovered: true } : landmark
      )
    );
    setShowScanner(false);
    setLandmarkToScan(null);
  };

  // Launch scanner for selected landmark
  const launchScanner = (landmark: Landmark) => {
    setLandmarkToScan(landmark);
    setShowScanner(true);
    setSelectedLandmark(null);
  };

  return (
    <div className="h-screen w-full bg-amber-50 flex flex-col relative overflow-hidden">
      {/* background imaage (assets/ChatGPT_background.png)  */}
      <div className="absolute inset-0">
        <img src={'/src/assets/Group 5.png'} alt="Background" className="object-cover w-full h-full opacity-50"  />
      </div>

      {/* Watercolor texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 92, 46, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 50% 50%, rgba(160, 82, 45, 0.05) 0%, transparent 70%)`
           }}>
      </div>

      {/* Top Bar */}
      <div className="relative z-20 bg-gradient-to-b from-amber-100 to-amber-50 px-4 py-3 shadow-sm border-b-2 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-800" />
            <div>
              <h1 className="text-lg font-serif text-amber-900">Trondheim</h1>
              <p className="text-xs text-amber-700">{discoveredCount}/{totalCount} landmarks discovered</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-full bg-white shadow-sm"
              onClick={() => setShowMuseum(true)}
              aria-label="Open Digital Museum"
            >
              <Book className="w-5 h-5 text-amber-800" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-sm">
              <Trophy className="w-5 h-5 text-amber-800" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-sm">
              <User className="w-5 h-5 text-amber-800" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-500 rounded-full"
            style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Base map with watercolor effect */}
        <div className="absolute inset-0">
          {/* Discovered areas - colored */}
          <div className="absolute inset-0 opacity-30"
               style={{
                 background: `
                   radial-gradient(ellipse 400px 300px at 45% 40%, rgba(147, 197, 114, 0.4) 0%, transparent 60%),
                   radial-gradient(ellipse 350px 350px at 65% 25%, rgba(173, 216, 230, 0.3) 0%, transparent 60%)
                 `
               }}>
          </div>
          
          {/* Undiscovered areas - grayscale sketch */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 background: `
                   radial-gradient(ellipse 300px 300px at 55% 50%, rgba(100, 100, 100, 0.2) 0%, transparent 60%),
                   radial-gradient(ellipse 280px 280px at 30% 60%, rgba(120, 120, 120, 0.15) 0%, transparent 60%)
                 `
               }}>
          </div>

          {/* Map details - streets as sketched lines */}
          <svg className="absolute inset-0 w-full h-full opacity-0">
            <path d="M 100 200 Q 250 180 400 220" stroke="#8B7355" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M 200 100 L 200 400" stroke="#8B7355" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M 300 150 Q 350 250 320 350" stroke="#8B7355" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Landmarks */}
        {landmarks.map((landmark) => (
          <button
            key={landmark.id}
            onClick={() => setSelectedLandmark(landmark)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              selectedLandmark?.id === landmark.id ? 'scale-125 z-30' : 'z-10'
            }`}
            style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
          >
            {landmark.discovered ? (
              // Discovered landmark - colorful watercolor pin
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-full shadow-lg flex items-center justify-center border-3 border-white">
                  <MapPin className="w-6 h-6 text-white" fill="white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium text-amber-900 bg-white px-2 py-1 rounded shadow-sm border border-amber-200 text-center">
                    {landmark.name.includes('\n') ? (
                      landmark.name.split('\n').map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))
                    ) : (
                      landmark.name
                    )}
                  </span>
                </div>
              </div>
            ) : (
              // Undiscovered landmark - grayscale sketch
              <div className="relative opacity-60">
                <div className="w-10 h-10 bg-gray-300 rounded-full shadow-md flex items-center justify-center border-2 border-gray-400"
                     style={{
                       background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                       filter: 'grayscale(100%)'
                     }}>
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs text-gray-500">???</span>
                </div>
              </div>
            )}
          </button>
        ))}

        {/* User location indicator (placed next to Old Town Bridge) */}
        <div className="absolute z-40" style={{ left: `${userX}%`, top: `${userY}%`, transform: 'translate(-50%, -50%)' }}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Bottom Card - Landmark Details */}
      {selectedLandmark && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300"
             style={{
               background: 'linear-gradient(to bottom, #fffbeb 0%, #ffffff 100%)',
               borderTop: '3px solid #d97706'
             }}>
          <div className="p-5">
            <div className="w-12 h-1 bg-amber-300 rounded-full mx-auto mb-4"></div>
            
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-serif text-amber-900 mb-1">{selectedLandmark.name}</h2>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">{selectedLandmark.category}</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">Est. {selectedLandmark.year}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLandmark(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {selectedLandmark.discovered ? (
              <div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  A magnificent example of Norwegian Gothic architecture, this cathedral has stood as a pilgrimage destination for centuries...
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setLandmarkToShow(selectedLandmark);
                      setShowDetail(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Learn More
                  </button>
                  {/* <button className="px-4 bg-amber-100 text-amber-800 py-3 rounded-xl font-medium hover:bg-amber-200 transition-all">
                    <Camera className="w-5 h-5" />
                  </button> */}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">🔒 Landmark locked</p>
                <p className="text-sm text-gray-600 mb-4">Visit this location to unlock and discover its story</p>
                <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg inline-block mb-4">
                  {selectedLandmark.metersAway} meters away
                </div>
                <button 
                  onClick={() => launchScanner(selectedLandmark)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Scan to Discover
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating AR Camera Button */}
      <button 
        onClick={() => {
          // Launch scanner with nearest undiscovered landmark
          const undiscovered = landmarks.find(l => !l.discovered);
          if (undiscovered) {
            launchScanner(undiscovered);
          }
        }}
        className="absolute bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-xl flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        <Camera className="w-8 h-8 text-white" />
      </button>

      {/* Discovery Scanner Modal */}
      {showScanner && landmarkToScan && (
        <DiscoveryScanner
          landmark={landmarkToScan}
          onClose={() => {
            setShowScanner(false);
            setLandmarkToScan(null);
          }}
          onDiscoveryComplete={handleDiscoveryComplete}
        />
      )}

      {/* Landmark Detail Modal */}
      {showDetail && landmarkToShow && (
        <LandmarkDetail 
          landmark={landmarkToShow}
          onClose={() => {
            setShowDetail(false);
            setLandmarkToShow(null);
          }}
        />
      )}

      {/* Digital Museum Modal */}
      {showMuseum && (
        <Museum 
          cityName="Trondheim"
          items={landmarks}
          onClose={() => setShowMuseum(false)}
        />
      )}
    </div>
  );
};

export default WatercolorAtlasExplore;