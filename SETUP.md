# Quick Setup Guide

Follow these steps to get Tateify running on your local machine:

## 1. Install Dependencies

```bash
npm install
```

## 2. Add Required Assets

Before running the app, you need to add the following files to the `public` directory:

### Required Files:

1. **Logo** (`public/logo.png`)
   - Landscape format
   - Transparent background
   - Recommended: 400x100px

2. **Loader** (`public/loader.gif`)
   - Animated GIF
   - Transparent background
   - Recommended: 128x128px

3. **Album Covers** (`public/covers/`)
   - `think-later.jpg`
   - `so-close-to-what.jpg`
   - `i-used-to-think-i-could-fly.jpg`
   - `singles.jpg`
   - Recommended: 512x512px or 1000x1000px

4. **Music Files** (`public/audio/`)
   - Place MP3 files in their respective album folders:
     - `think-later/`
     - `so-close-to-what/`
     - `i-used-to-think-i-could-fly/`
     - `singles/`
   - File names must match those in `src/data/albums.ts`

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 4. Build for Production (Optional)

```bash
npm run build
npm start
```

## Troubleshooting

### Music not playing?
- Check that MP3 files exist in the correct paths
- Verify file paths in `src/data/albums.ts` match actual files
- Check browser console for 404 errors

### Images not loading?
- Ensure images are in the correct directories
- Verify file extensions match (`.jpg`, `.png`, `.gif`)
- Check that file names are lowercase with hyphens

### Port already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

## File Naming Convention

Use lowercase with hyphens for all files:
- ✅ `greedy.mp3`
- ✅ `think-later.jpg`
- ❌ `Greedy.mp3`
- ❌ `Think Later.jpg`

## Need Help?

Check the main README.md for detailed documentation.
