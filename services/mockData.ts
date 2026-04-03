import { Category, Wallpaper } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'chill_mode_cat',
    name: { en: 'Chill Mode', hi: 'चिल मोड', ja: 'チルモード', fr: 'Mode Détente' },
    title: 'Chill Mode',
    image: 'https://images.unsplash.com/photo-1518091044184-21f44c6ef94b?q=80&w=2070&auto=format&fit=crop',
    count: '1',
    type: 'main'
  },
  {
    id: 'mini_games_cat',
    name: { en: 'Mini Games', hi: 'मिनी गेम्स', ja: 'ミニゲーム', fr: 'Mini-jeux' },
    title: 'Mini Games',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    count: '1',
    type: 'main'
  },
  {
    id: 'abstract',
    name: { en: 'Abstract Elements', hi: 'एब्सट्रैक्ट', ja: '抽象', fr: 'Abstrait' },
    title: 'Abstract Elements',
    image: require('../assets/images/categories/category-1.webp'),
    count: '120+',
    type: 'image'
  },
  {
    id: 'nature',
    name: { en: 'Minimal Nature', hi: 'प्रकृति', ja: '自然', fr: 'Nature' },
    title: 'Minimal Nature',
    image: require('../assets/images/categories/category-2.webp'),
    count: '85+',
    type: 'image'
  },
  {
    id: 'urban',
    name: { en: 'Urban Geometry', hi: 'शहरी', ja: '都市', fr: 'Urbain' },
    title: 'Urban Geometry',
    image: require('../assets/images/categories/category-3.webp'),
    count: '98+',
    type: 'image'
  },
  {
    id: 'animated',
    name: { en: 'Animated', hi: 'एनिमेटेड', ja: 'アニメーション', fr: 'Animé' },
    title: 'Animated',
    image: require('../assets/gif/Animated_Category_comppressed.mp4'),
    count: '15+',
    type: 'video'
  },
  {
    id: 'cosmic_cat',
    name: { en: 'Cosmic Dynamics', hi: 'कॉस्मिक', ja: '宇宙', fr: 'Cosmique' },
    title: 'Cosmic Dynamics',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    count: '5+',
    type: 'video'
  },
];

export const MOCK_WALLPAPERS: Wallpaper[] = [
  {
    _id: 'dino_game_mock',
    url: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'mini_games_cat', name: { en: 'Mini Games' } }
  },
  {
    _id: 'animated_particle_mock',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'aurora_waves_mock',
    url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'blob_morph_mock',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'neural_network_mock',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd486490e?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd486490e?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'orbit_mock',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'cosmic_cat', name: { en: 'Cosmic Dynamics' } }
  },
  {
    _id: 'rainy_day_mock',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'gradient_mesh_mock',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'glass_mock',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'plasma_mock',
    url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    author: 'Toss Studio',
    type: 'interactive' as any,
    category: { id: 'animated', name: { en: 'Animated' } }
  },
  {
    _id: 'abstract_1',
    url: 'https://picsum.photos/seed/abs1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/abs1/400/800',
    author: 'Abstract Artist',
    type: 'image',
    category: { id: 'abstract', name: { en: 'Abstract' } }
  },
  {
    _id: 'abstract_2',
    url: 'https://picsum.photos/seed/abs2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/abs2/400/800',
    author: 'Digital Guru',
    type: 'image',
    category: { id: 'abstract', name: { en: 'Abstract' } }
  },
  {
    _id: 'nature_1',
    url: 'https://picsum.photos/seed/nat1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/nat1/400/800',
    author: 'Nature Lover',
    type: 'image',
    category: { id: 'nature', name: { en: 'Nature' } }
  },
  {
    _id: 'nature_2',
    url: 'https://picsum.photos/seed/nat2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/nat2/400/800',
    author: 'Eco Warrior',
    type: 'image',
    category: { id: 'nature', name: { en: 'Nature' } }
  },
  {
    _id: 'urban_1',
    url: 'https://picsum.photos/seed/urb1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/urb1/400/800',
    author: 'City Slicker',
    type: 'image',
    category: { id: 'urban', name: { en: 'Urban' } }
  },
  {
    _id: 'urban_2',
    url: 'https://picsum.photos/seed/urb2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/urb2/400/800',
    author: 'Modernist',
    type: 'image',
    category: { id: 'urban', name: { en: 'Urban' } }
  },
];

// For backward compatibility until imageService is updated
export const CATEGORIES = MOCK_CATEGORIES;
export const MOCK_IMAGES = MOCK_WALLPAPERS.map(w => ({ id: w._id, url: w.url, author: w.author }));
