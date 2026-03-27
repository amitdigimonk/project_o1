export interface ImageData {
  id: string;
  url: string;
  author: string;
}

export interface Category {
  id: string;
  title?: string;
  name?: string | { [key: string]: string };
  image: any;
  count: string;
  type?: 'image' | 'video' | 'main' | 'sub';
}

export interface Wallpaper {
  _id: string;
  url: string;
  thumbnail: string;
  author: string;
  type: 'image' | 'video' | 'interactive';
  category: any;
}

export type ThemeVariant = 'light' | 'dark';
