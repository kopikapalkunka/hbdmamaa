# 🌷 Stylized Parallax Birthday Webpage

A heartfelt, artistic birthday tribute webpage featuring parallax scrolling, hand-drawn floral animations, interactive elements, and beautiful memories.

## ✨ Features

- **Parallax Scrolling**: Smooth depth-based scrolling effects
- **Hand-drawn Animations**: SVG path animations for flowers and illustrations
- **Interactive Garden**: Tap flowers to reveal messages, swipe pot for plant growth
- **Memory Gallery**: Swipeable photo carousel using Swiper.js
- **Audio Integration**: Background music and voice messages using Howler.js
- **Mobile-Optimized**: Fully responsive design for all devices
- **Warm Color Palette**: Elegant maroon, cream, gold, and sage green theme

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
public/
├── music/                        # Background music files (MP3)
│   └── Happy Birthday Song Music Box.mp3
├── photos/                       # Family photos (JPG, PNG, WebP)
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── ...
├── voices/                       # Voice message audio files (MP3)
│   ├── ayah.mp3
│   ├── adek.mp3
│   └── kakak.mp3
└── flowers/                      # Flower SVG assets (optional)

src/
├── components/
│   ├── HeroSection.jsx          # Opening scene with parallax
│   ├── IntroSection.jsx          # Animated flower illustration
│   ├── GallerySection.jsx        # Memory gallery with Swiper
│   ├── MessagesSection.jsx       # Family messages with audio
│   ├── InteractiveGarden.jsx    # Interactive garden scene
│   └── ClosingSection.jsx        # Ending with drifting petals
├── App.jsx                       # Main app component
└── main.jsx                      # Entry point
```

## 🎨 Customization

### Adding Your Photos

1. Place photos in `public/photos/` directory
2. Update the `galleryItems` array in `GallerySection.jsx` with your photo paths:
   ```javascript
   { id: 1, caption: "Beautiful memories", image: '/photos/photo1.jpg' }
   ```
3. Use paths starting with `/photos/` - they will work in both development and production

### Adding Background Music

1. Place your music file (MP3 recommended) in `public/music/` directory
2. The music file is already configured in `App.jsx`
3. Current file: `public/music/Happy Birthday Song Music Box.mp3`
4. To change the music, update the path in `App.jsx`:
   ```javascript
   const musicPath = '/music/your-music-file.mp3';
   ```

### Adding Voice Messages

1. Record short voice messages and save them in `public/voices/` directory
2. Update the `messages` array in `MessagesSection.jsx` with:
   ```javascript
   {
     id: 1,
     name: "Family Member",
     message: "Your message here",
     audioUrl: '/voices/audio-file.mp3', // Path in public/voices/
   }
   ```

### Color Palette

Colors are defined in `src/index.css` as CSS variables:
- `--color-primary`: #800000 (Deep maroon)
- `--color-secondary`: #FAF4EF (Soft cream)
- `--color-accent-1`: #D4AF37 (Light gold)
- `--color-accent-2`: #B76E79 (Dusty rose)
- `--color-accent-3`: #9CAF88 (Sage green)

## 📱 Mobile Optimization

The website is fully optimized for mobile devices with:
- Touch-friendly interactions
- Swipe gestures for gallery
- Responsive typography using `clamp()`
- Optimized animations for performance

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Vite and build your project
4. Your site will be live!

### Alternative: Netlify

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📝 Notes

- All placeholder images use SVG placeholders - replace with actual photos
- Audio files are optional but enhance the experience
- The background music will auto-start when the Hero section loads
- Music fades out when reaching the closing section

## 💝 Made with Love

This project was created as a heartfelt digital tribute, blending storytelling, interactivity, and art into a beautiful web experience.

---

Happy Birthday! 🌷✨
