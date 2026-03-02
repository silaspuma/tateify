# Tateify - Tate McRae Music Streaming App

A modern, Spotify-inspired music streaming web application dedicated to Tate McRae's music. Built with Next.js, React, TypeScript, and Tailwind CSS. **Optimized for iPad** with automatic MP3 metadata reading.

## ✨ Key Features

- **Automatic MP3 Metadata Reading**: Just drop MP3 files into album folders - the app automatically reads song titles, duration, and track numbers from the file metadata
- **Spotify-Inspired Design**: Modern, clean interface with large album artwork, smooth animations, and intuitive controls
- **iPad Optimized**: Designed specifically for iPad with larger touch targets, optimal spacing, and beautiful typography
- **Full Playback Controls**: Play, pause, next, previous, seek, and volume control
- **Media Session API**: Hardware media key support and OS-level controls
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Global Player State**: Music continues playing when switching albums
- **Modern UI**: Warm color palette with glassmorphism effects and smooth transitions

## 🎨 Design Philosophy

This app takes inspiration from Spotify's clean, modern interface while maintaining a unique warm aesthetic:
- **Background**: Warm cream (#ffeac6) instead of dark theme
- **Accent**: Vibrant orange (#f19e31) for interactive elements
- **Typography**: Large, bold text optimized for iPad viewing
- **Layout**: Three-column layout (sidebar, content, player bar)
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Touch-Friendly**: Larger buttons and controls perfect for iPad

## 📱 iPad Optimization

- **Large Touch Targets**: 44x44pt minimum for all interactive elements
- **Optimal Text Size**: 16-20px for body text, larger for headings
- **Spacious Layout**: Generous padding and margins
- **Smooth Scrolling**: Optimized for touch interactions
- **Responsive**: Works in both portrait and landscape orientations

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
