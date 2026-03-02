# Tateify - Tate McRae Music Streaming App

A modern, minimal, and warm music streaming web application dedicated to Tate McRae's music. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Spotify-Inspired Layout**: Left sidebar, main content area, and bottom player bar
- **Full Playback Controls**: Play, pause, next, previous, seek, and volume control
- **Media Session API**: Hardware keys and OS media controls support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Global Player State**: Music continues playing when switching albums
- **Modern UI**: Warm color palette with soft shadows and subtle animations
- **Album Navigation**: Browse through different albums and singles
- **Real-time Progress**: Live progress bar with seek functionality
- **Auto-play**: Automatically plays next track when song ends

## Color Palette

- Background: `#ffeac6`
- Accent: `#f19e31`
- Text: `#2a2a2a`
- Hover Accent: `#f4ad4f`

## Tech Stack

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **HTML5 Audio API**
- **Media Session API**

## Project Structure

```
tateify/
├── public/
│   ├── audio/
│   │   ├── think-later/
│   │   ├── so-close-to-what/
│   │   ├── i-used-to-think-i-could-fly/
│   │   └── singles/
│   ├── covers/
│   ├── logo.png
│   └── loader.gif
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── SongList.tsx
│   │   ├── PlayerBar.tsx
│   │   └── Loader.tsx
│   ├── context/
│   │   └── PlayerContext.tsx
│   └── data/
│       └── albums.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tateify
```

2. Install dependencies:
```bash
npm install
```

3. Add your music files and assets:

Create the following folders in the `public` directory:

```
public/
├── audio/
│   ├── think-later/
│   ├── so-close-to-what/
│   ├── i-used-to-think-i-could-fly/
│   └── singles/
└── covers/
```

Add your MP3 files to the appropriate audio folders and album cover images to the covers folder.

4. Add the logo and loader:

- `public/logo.png` - Application logo (landscape, transparent background)
- `public/loader.gif` - Loading animation (transparent background)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Songs

Edit `src/data/albums.ts` to add or modify songs. Each album has the following structure:

```typescript
{
  id: 'album-id',
  name: 'Album Name',
  cover: '/covers/album-cover.jpg',
  songs: [
    {
      title: 'Song Title',
      file: '/audio/album-id/song-file.mp3',
      duration: '2:45',
      cover: '/covers/album-cover.jpg'
    }
  ]
}
```

## Building for Production

```bash
npm run build
npm start
```

## Features Implementation

### Player Controls
- Play/Pause toggle
- Next/Previous track navigation
- Progress bar with click-to-seek
- Volume slider
- Auto-play next track

### Media Session API
Enables hardware media keys and OS-level controls with song metadata including:
- Song title
- Album name
- Album artwork

### Responsive Design
- Desktop: Full sidebar with album navigation
- Mobile: Slide-out menu with hamburger button
- Bottom player bar always visible

### Visual Features
- Blurred album cover background when playing
- Hover effects on song rows
- Smooth transitions and animations
- Loading screen with animated GIF

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Media Session API support varies by browser.

## License

This project is for educational purposes.

## Credits

Music by Tate McRae
