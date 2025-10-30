import { useMemo, useState } from 'react';
import { X, Book, Search, Trophy, BarChart3 } from 'lucide-react';
import LandmarkDetail from './LandmarkDetail';

// Use the same main images as LandmarkDetail for thumbnails
const nidarosImage = new URL('../assets/nidaros_cathedral.jpg', import.meta.url).href;
const kristianMain = new URL('../assets/Kristiansten_Festning_sunrise_red_canon.jpg', import.meta.url).href;
const cologne0 = new URL('../assets/cologne_0.jpg', import.meta.url).href;

export interface Landmark {
  id: number;
  name: string;
  category: string;
  year: string;
  discovered: boolean;
  metersAway?: number;
}

interface MuseumProps {
  cityName?: string;
  items: Landmark[];
  onClose: () => void;
}

const TABS = [
  { key: 'discovered', label: 'Discovered' },
  { key: 'all', label: 'All' },
];

const Museum = ({ cityName = 'Your City', items, onClose }: MuseumProps) => {
  const [activeTab, setActiveTab] = useState<'discovered' | 'all'>('discovered');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Landmark | null>(null);

  const discoveredCount = useMemo(() => items.filter(i => i.discovered).length, [items]);
  const totalCount = items.length;

  const filtered = useMemo(() => {
    const base = activeTab === 'discovered' ? items.filter(i => i.discovered) : items;
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [activeTab, items, query]);

  const getThumbnail = (name: string) => {
    if (name === 'Nidaros Cathedral') return nidarosImage;
    if (name === 'Kristiansten Fortress') return kristianMain;
    if (name === 'Cologne Cathedral') return cologne0;
    // default placeholder
    return `https://placehold.co/600x400/png?text=${encodeURIComponent(name)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-amber-50/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-amber-800" />
            <div>
              <h1 className="text-lg font-serif text-amber-900">Digital Museum</h1>
              <p className="text-xs text-amber-700">{discoveredCount}/{totalCount} discovered in {cityName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white border border-amber-200 hover:bg-amber-50">
            <X className="w-5 h-5 text-amber-800" />
          </button>
        </div>
        {/* Tabs and Search */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex bg-white rounded-xl border border-amber-200 overflow-hidden">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`px-4 py-2 text-sm ${activeTab === t.key ? 'bg-amber-100 text-amber-900' : 'text-amber-700'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search landmarks, categories..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-white text-amber-900 placeholder:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Search className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>
              {discoveredCount}/{totalCount} landmarks discovered{cityName ? ` in ${cityName}` : ''}!
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-4 py-4 overflow-y-auto h-[calc(100vh-120px)]">
        {filtered.length === 0 ? (
          <div className="text-center text-amber-700 py-20">No items match your search.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <button 
                key={item.id}
                onClick={() => setSelected(item)}
                className={`group rounded-2xl border p-3 text-left transition-all hover:shadow-md ${item.discovered ? 'bg-white border-amber-200' : 'bg-amber-100/60 border-amber-200 opacity-70'}`}
              >
                <div className="overflow-hidden rounded-xl mb-3 border border-amber-200">
                  <img 
                    src={getThumbnail(item.name)}
                    alt={`${item.name} thumbnail`} 
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-amber-900 font-medium leading-tight">{item.name}</h3>
                    <p className="text-amber-700 text-xs">{item.category} • Est. {item.year}</p>
                  </div>
                  {item.discovered && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs bg-emerald-100 rounded-full px-2 py-0.5">
                      <Trophy className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail overlay using LandmarkDetail */}
      {selected && (
        <LandmarkDetail 
          landmark={selected}
          onClose={() => setSelected(null)}
          photos={[
            `https://placehold.co/1200x700/png?text=${encodeURIComponent(selected.name)}`,
            `https://placehold.co/800x600/png?text=${encodeURIComponent(selected.name)}+2`,
            `https://placehold.co/800x600/png?text=${encodeURIComponent(selected.name)}+3`,
          ]}
        />
      )}
    </div>
  );
};

export default Museum;
