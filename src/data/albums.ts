export interface Song {
  title: string;
  file: string;
  duration: string;
  cover: string;
}

export interface Album {
  id: string;
  name: string;
  cover: string;
  folder: string;
}

// Album configuration - songs will be loaded dynamically from MP3 files
export const albums: Album[] = [
  {
    id: 'so-close-to-what',
    name: 'so close to what???',
    cover: '/covers/so-close-to-what.jpg',
    folder: 'so-close-to-what',
  },
  {
    id: 'think-later',
    name: 'THINK LATER',
    cover: '/covers/think-later.jpg',
    folder: 'think-later',
  },
  {
    id: 'i-used-to-think-i-could-fly',
    name: 'i used to think i could fly',
    cover: '/covers/i-used-to-think-i-could-fly.jpg',
    folder: 'i-used-to-think-i-could-fly',
  },
  {
    id: 'singles',
    name: 'Singles & EPs',
    cover: '/covers/singles.jpg',
    folder: 'singles',
  },
];
