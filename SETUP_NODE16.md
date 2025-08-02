# 🚀 Node.js 16.x Setup Guide

This guide helps you set up the Berlin Clock Gamified application in Node.js 16.x environments.

## 📋 Prerequisites

- **Node.js 16.14.0 or higher** (but below 18.x)
- **npm 8.0.0 or higher** OR **Yarn 1.22.0 or higher**
- Modern browser with WebGL support

## 🔧 Installation Steps

### 1. Verify Node.js Version

```bash
node --version
# Should show v16.x.x

npm --version
# Should show 8.x.x or higher
```

### 2. Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# OR using npm
npm install
```

### 3. Start Development Server

```bash
# Using Yarn
yarn dev

# OR using npm
npm run dev
```

## 🐛 Common Issues & Solutions

### Issue: "Found invalid Node.js Version"

**Solution**: Ensure you're using Node.js 16.14.0 or higher:

```bash
# Check current version
node --version

# If using nvm, switch to Node 16
nvm use 16

# If using nvm and don't have Node 16 installed
nvm install 16.20.2
nvm use 16.20.2
```

### Issue: Dependency resolution errors

**Solution**: Clear cache and reinstall:

```bash
# Using Yarn
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# Using npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with TypeScript errors

**Solution**: The project is configured for Node.js 16.x compatibility:

```bash
# Check TypeScript version
npx tsc --version

# Run type checking
yarn type-check

# If issues persist, try with legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Vite build warnings about chunk sizes

This is normal for our feature-rich application. The chunks are optimized for performance:

- `three.js` chunk: Contains 3D graphics libraries
- `animations` chunk: Contains GSAP and animation libraries
- `vendor` chunk: Contains React and core dependencies

## 🎯 Environment-Specific Features

### Node.js 16.x Compatibility

Our application includes:

- **Polyfills** for newer JavaScript features
- **Compatible dependency versions** tested with Node 16.x
- **Fallback implementations** for missing APIs
- **Enhanced error handling** for older environments

### Performance Optimizations

- **Code splitting** reduces initial bundle size
- **Tree shaking** removes unused code
- **Optimized builds** target ES2020 for broad compatibility
- **Service worker** provides offline functionality

## 🔍 Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run tests
yarn test

# Type checking
yarn type-check

# Linting
yarn lint
```

## 📊 Build Analysis

The application is optimized with the following chunks:

1. **vendor** (~140KB gzipped): React core
2. **three** (~229KB gzipped): 3D graphics engine
3. **animations** (~60KB gzipped): Animation libraries
4. **utils** (~25KB gzipped): Utility functions

Total initial load: ~454KB gzipped - excellent for a feature-rich 3D application!

## 🚨 Troubleshooting

### Memory Issues

If you encounter memory issues during development:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Then run your commands
yarn dev
```

### Port Conflicts

The application runs on port 3000 by default. To change:

```bash
# Set custom port
PORT=3001 yarn dev

# Or modify vite.config.ts server.port setting
```

### Build Performance

For faster builds in development:

1. Use `yarn dev` instead of `yarn build` during development
2. Enable TypeScript incremental compilation
3. Use Vite's hot reload for instant updates

## 🎮 Quick Start Checklist

- [ ] Node.js 16.14+ installed
- [ ] Dependencies installed (`yarn install`)
- [ ] Development server running (`yarn dev`)
- [ ] Application loads at `http://localhost:3000`
- [ ] 3D graphics render properly
- [ ] No console errors
- [ ] PWA features work (offline capability)

## 📞 Need Help?

1. **Check the console** for specific error messages
2. **Verify Node.js version** matches requirements
3. **Clear caches** and reinstall dependencies
4. **Check browser compatibility** (modern browsers required)
5. **Review error logs** in the terminal

## 🌟 Success Indicators

When setup is successful, you should see:

- ✅ Development server starts without errors
- ✅ Application loads with animated Berlin Clock
- ✅ 3D background animations render smoothly
- ✅ Game mode selection works
- ✅ Responsive design adapts to screen size
- ✅ PWA installation prompt (if supported)

---

**🎉 Congratulations!** Your Berlin Clock Gamified application is now running successfully on Node.js 16.x!