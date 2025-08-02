# 🕐 Berlin Clock Gamified

> An innovative, interactive Berlin Clock (Mengenlehreuhr) learning experience with stunning 3D animations, multiple game modes, and modern web technologies.

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-black.svg)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02.svg)](https://greensock.com/gsap/)

## ✨ Features

### 🎯 Game Modes
- **Tutorial Mode**: Step-by-step guided learning with interactive lessons
- **Practice Mode**: Unlimited time with hints and detailed feedback
- **Time Challenge**: Race against the clock with score multipliers
- **Memory Game**: Test your memory with quick time flashes
- **Speed Reading**: Master rapid Berlin Clock interpretation
- **Competitive Mode**: Challenge other players in real-time matches

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effects with depth
- **3D Animations**: Stunning Three.js-powered background animations
- **Particle Systems**: Dynamic particle effects that respond to interactions
- **Dark/Light Themes**: Seamless theme switching with custom color schemes
- **Responsive Design**: Perfect experience across all devices
- **Micro-interactions**: Delightful GSAP-powered animations

### ♿ Accessibility First
- **ARIA Labels**: Complete screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility for visual impairments
- **Reduce Motion**: Respects user's motion preferences
- **Color Blind Support**: Multiple color blind friendly modes
- **Scalable Text**: Adjustable font sizes

### 🚀 Performance & PWA
- **60fps Animations**: Buttery smooth performance
- **Progressive Web App**: Install on any device
- **Offline Support**: Works without internet connection
- **Service Worker**: Automatic updates and caching
- **Code Splitting**: Optimized bundle loading
- **Web Core Vitals**: Excellent performance metrics

## 🛠️ Technical Stack

### Core Technologies
- **React 18.2+** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **Zustand** for lightweight state management
- **Styled Components** for CSS-in-JS styling

### Animation & Graphics
- **GSAP** for high-performance animations
- **Framer Motion** for declarative React animations
- **Three.js** with React Three Fiber for 3D graphics
- **React Three Drei** for enhanced 3D components

### Additional Libraries
- **React Spring** for physics-based animations
- **Howler.js** for audio management
- **Canvas Confetti** for celebration effects
- **Date-fns** for time utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/berlin-clock-gamified.git
cd berlin-clock-gamified

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Development Commands

```bash
# Development server with hot reload
yarn dev

# Type checking
yarn type-check

# Build for production
yarn build

# Preview production build
yarn preview

# Run tests
yarn test

# Run tests with UI
yarn test:ui

# Generate test coverage
yarn test:coverage

# Lint code
yarn lint
```

## 🎮 How to Play

### Berlin Clock Basics
The Berlin Clock displays time using 24 illuminated fields arranged in 5 rows:

1. **Top Circle**: Seconds indicator (blinks every 2 seconds)
2. **Row 1**: 4 red lights, each representing 5 hours
3. **Row 2**: 4 red lights, each representing 1 hour
4. **Row 3**: 11 lights (8 yellow + 3 red quarter markers), each representing 5 minutes
5. **Row 4**: 4 yellow lights, each representing 1 minute

**Example**: For 13:25:30
- Top: On (even seconds)
- Row 1: 2 lights (2 × 5 = 10 hours)
- Row 2: 3 lights (3 × 1 = 3 hours) → Total: 13 hours
- Row 3: 5 lights (5 × 5 = 25 minutes)
- Row 4: 0 lights (0 × 1 = 0 minutes) → Total: 25 minutes

### Game Progression
1. Start with **Tutorial Mode** to learn the basics
2. Practice in **Practice Mode** with unlimited time
3. Challenge yourself with **Time Challenges**
4. Test your memory with **Memory Games**
5. Master **Speed Reading** for rapid interpretation
6. Compete with others in **Competitive Mode**

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── BerlinClock/    # Main clock components
│   └── Game/           # Game-specific components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

### State Management
- **Game Store**: Manages game state, scoring, and progression
- **Settings Store**: Handles themes, accessibility, and user preferences
- **Persistent Storage**: User settings saved locally

### Component Architecture
- **Modular Design**: Reusable, composable components
- **Styled Components**: Isolated, themeable styles
- **TypeScript**: Full type safety and IDE support

## 🎨 Customization

### Themes
The application supports extensive theming:

```typescript
interface ThemeSettings {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  backgroundGradient: string[];
  glassOpacity: number;
  particleIntensity: number;
}
```

### Accessibility Options
```typescript
interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  fontSize: number;
  colorBlindMode: ColorBlindMode;
}
```

## 📱 PWA Features

### Installation
- Install directly from browser
- Works offline
- Native app-like experience

### Shortcuts
- Quick access to Live Clock
- Direct launch to Practice Mode
- Keyboard shortcuts for power users

## 🔧 Development

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code style
- **Husky**: Pre-commit hooks

### Testing
- **Vitest**: Unit and integration tests
- **Happy DOM**: Fast DOM simulation
- **Coverage Reports**: Comprehensive test coverage

### Performance
- **Bundle Analysis**: Optimized chunk splitting
- **Lazy Loading**: Dynamic imports for large components
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Compressed images and fonts

## 🌟 Unique Features

### 🎪 Particle Effects
Dynamic particle systems that respond to user interactions and clock state changes.

### 🎭 3D Background
Time-based ambient lighting and floating geometric shapes that change throughout the day.

### 🎵 Audio System
Spatial audio feedback with customizable sound packs and haptic feedback support.

### 🏆 Achievement System
Comprehensive progression tracking with unlockable achievements and ranking system.

### 📊 Analytics
Detailed performance tracking and learning analytics to help users improve.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Original Berlin Clock design by Dieter Rams
- React and Three.js communities
- Open source contributors
- Beta testers and feedback providers

## 📈 Roadmap

### Version 2.0
- [ ] Multiplayer real-time competitions
- [ ] Advanced analytics dashboard
- [ ] Custom clock designs
- [ ] Voice commands
- [ ] AR mode for mobile devices

### Version 2.1
- [ ] Social features and leaderboards
- [ ] Advanced AI tutoring
- [ ] Accessibility improvements
- [ ] Performance optimizations

---

<div align="center">

**[🌐 Live Demo](https://berlinclock.game)** | **[📚 Documentation](https://docs.berlinclock.game)** | **[🐛 Report Bug](https://github.com/yourusername/berlin-clock-gamified/issues)**

Made with ❤️ and ⚡ by passionate developers

</div>
