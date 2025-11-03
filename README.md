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
src/
├── components/
│   ├── HeroSection.jsx          # Opening scene with parallax
│   ├── IntroSection.jsx          # Animated flower illustration
│   ├── GallerySection.jsx        # Memory gallery with Swiper
│   ├── MessagesSection.jsx       # Family messages with audio
│   ├── InteractiveGarden.jsx    # Interactive garden scene
│   ├── ClosingSection.jsx        # Ending with drifting petals
│   └── AudioPlayer.jsx           # Audio playback component
├── assets/
│   ├── flowers/                  # Flower SVG assets
│   ├── music/                    # Background music files
│   ├── voices/                   # Voice message audio files
│   └── photos/                   # Family photos
├── App.jsx                       # Main app component
└── main.jsx                      # Entry point
```

## 🎨 Customization

### Adding Your Photos

1. Place photos in `src/assets/photos/`
2. Update the `galleryItems` array in `GallerySection.jsx` with your photo paths
3. Replace placeholder SVGs with actual `<img>` tags pointing to your photos

### Adding Background Music

1. Place your music file (MP3 recommended) in `src/assets/music/background.mp3`
2. Uncomment the music initialization code in `App.jsx` (lines 22-36)
3. Update the `musicUrl` path if using a different filename

### Adding Voice Messages

1. Record short voice messages and save them in `src/assets/voices/`
2. Update the `messages` array in `MessagesSection.jsx` with:
   - `audioUrl`: path to your audio file
   - `name`: family member's name
   - `message`: text message to display

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
