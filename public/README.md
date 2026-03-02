# Public Assets Directory

This directory contains all public assets for the Tateify application.

## Required Files

### Logo
- **File**: `logo.png`
- **Description**: Landscape logo with transparent background
- **Recommended Size**: 400x100px or similar aspect ratio

### Loader
- **File**: `loader.gif`
- **Description**: Loading animation with transparent background
- **Recommended Size**: 128x128px

### Album Covers
Place album cover images in the `covers/` directory:
- `think-later.jpg`
- `so-close-to-what.jpg`
- `i-used-to-think-i-could-fly.jpg`
- `singles.jpg`

**Recommended Size**: 512x512px or 1000x1000px (square)

### Audio Files
Place MP3 files in their respective album directories:

```
audio/
├── think-later/
│   ├── cut-my-hair.mp3
│   ├── greedy.mp3
│   ├── hurt-my-feelings.mp3
│   └── ... (other songs)
├── so-close-to-what/
│   ├── 2-hands.mp3
│   ├── nothing-really-matters.mp3
│   └── ... (other songs)
├── i-used-to-think-i-could-fly/
│   ├── feel-like-shit.mp3
│   ├── shes-all-i-wanna-be.mp3
│   └── ... (other songs)
└── singles/
    ├── run-for-the-hills.mp3
    ├── 10-35.mp3
    └── rubberband.mp3
```

## Notes

- Use consistent naming conventions (lowercase with hyphens)
- Ensure all images are optimized for web
- MP3 files should be good quality (320kbps recommended)
- All paths in `src/data/albums.ts` should match these file names exactly
