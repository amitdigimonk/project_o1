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
];

export const MOCK_WALLPAPERS: Wallpaper[] = [
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
