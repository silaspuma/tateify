# Adding Music to Tateify

This guide will help you add new albums, songs, and customize the music library.

## Adding a New Album

1. **Add album cover image** to `public/covers/`
   ```
   public/covers/new-album.jpg
   ```

2. **Create audio folder** for the album
   ```
   public/audio/new-album/
   ```

3. **Add MP3 files** to the folder
   ```
   public/audio/new-album/song1.mp3
   public/audio/new-album/song2.mp3
   ```

4. **Update `src/data/albums.ts`**

   Add a new album object to the `albums` array:

   ```typescript
   {
     id: 'new-album',  // Use lowercase with hyphens
     name: 'New Album Title',  // Display name
     cover: '/covers/new-album.jpg',
     songs: [
       {
         title: 'Song Title',
         file: '/audio/new-album/song1.mp3',
         duration: '3:24',  // Format: M:SS or MM:SS
         cover: '/covers/new-album.jpg'
       },
       // Add more songs...
     ]
   }
   ```

## Modifying Existing Songs

To edit song information, open `src/data/albums.ts` and find the song you want to modify:

```typescript
{
  title: 'New Song Title',  // Change the display name
  file: '/audio/album/song.mp3',  // Update file path if renamed
  duration: '2:45',  // Update duration
  cover: '/covers/album.jpg'  // Change cover image
}
```

## File Naming Best Practices

### Audio Files
- Use lowercase letters
- Replace spaces with hyphens
- Example: `you-broke-me-first.mp3`

### Album Covers
- Use lowercase letters  
- Replace spaces with hyphens
- Square format (512x512px or 1000x1000px)
- JPG or PNG format
- Example: `think-later.jpg`

### Album IDs
- Lowercase with hyphens
- Short and descriptive
- Example: `think-later`, `singles`

## Song Duration Format

Calculate and format song duration as:
- Minutes : Seconds
- Pad seconds with zero if needed
- Examples: `2:05`, `3:24`, `10:35`

You can get duration by:
1. Right-clicking MP3 file → Properties/Info
2. Or playing it in any media player

## Album Order

Albums appear in the sidebar in the order they're listed in the `albums` array in `src/data/albums.ts`. 

To reorder albums, simply move the album objects in the array:

```typescript
export const albums: Album[] = [
  { id: 'newest-album', ... },  // Shows first
  { id: 'second-album', ... },
  { id: 'oldest-album', ... },  // Shows last
];
```

## Example: Complete Album Entry

```typescript
{
  id: 'think-later',
  name: 'THINK LATER',
  cover: '/covers/think-later.jpg',
  songs: [
    {
      title: 'cut my hair',
      file: '/audio/think-later/cut-my-hair.mp3',
      duration: '2:52',
      cover: '/covers/think-later.jpg'
    },
    {
      title: 'greedy',
      file: '/audio/think-later/greedy.mp3',
      duration: '2:11',
      cover: '/covers/think-later.jpg'
    },
  ]
}
```

## Removing an Album

1. Delete or comment out the album object in `src/data/albums.ts`
2. Optionally delete the associated files from `public/`

## Tips

- Always use absolute paths starting with `/` in the data file
- File paths are case-sensitive on some systems (Linux/Mac)
- Test after adding new music to ensure paths are correct
- Keep backup copies of your music files
- Optimize images for web (compress without losing quality)

## Troubleshooting

**Song won't play?**
- Check file path matches exactly (case-sensitive)
- Verify MP3 file exists in the correct folder
- Check browser console for 404 errors

**Cover not showing?**
- Verify image path is correct
- Check file extension (.jpg vs .png)
- Ensure image is in public/covers/

**Album not appearing?**
- Make sure it's added to the `albums` array
- Check for syntax errors (missing commas, brackets)
- Restart development server

## Testing Changes

After modifying `albums.ts`:

1. Save the file
2. Check browser - Next.js should auto-reload
3. If changes don't appear, try:
   ```bash
   # Restart dev server
   Ctrl+C (stop server)
   npm run dev
   ```
