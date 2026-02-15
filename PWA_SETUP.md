# PWA Setup Guide

This guide explains how the Progressive Web App (PWA) is configured and how to customize it.

## What's Included

### 1. Web App Manifest
- **Location**: `app/manifest.ts` and `public/manifest.json`
- **Purpose**: Defines how the app appears when installed
- **Features**: App name, icons, theme colors, display mode

### 2. Service Worker
- **Location**: `public/sw.js`
- **Purpose**: Enables offline functionality and caching
- **Features**:
  - Caches static assets
  - Provides offline fallback
  - Updates automatically

### 3. Service Worker Registration
- **Location**: `lib/pwa/service-worker-register.ts`
- **Purpose**: Registers the service worker on app load
- **Features**: Automatic registration, update handling

### 4. Install Prompt Component
- **Location**: `components/pwa/ServiceWorkerProvider.tsx`
- **Purpose**: Shows install prompt to users
- **Features**: Custom install button, dismissible prompt

## Customization

### Changing App Name and Colors

Edit `app/manifest.ts`:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Your App Name",           // Change this
    short_name: "ShortName",         // Change this
    theme_color: "#your-color",      // Change this
    background_color: "#your-color", // Change this
    // ... rest of config
  };
}
```

### Adding App Icons

1. **Create Icons**: Design your app icon (recommended: 512x512px minimum)
2. **Generate Sizes**: Use one of these tools:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
   - [Favicon.io](https://favicon.io/)
3. **Place Icons**: Put all generated PNG files in `public/icons/`
4. **Required Sizes**: 72, 96, 128, 144, 152, 192, 384, 512 pixels

### Customizing Service Worker Caching

Edit `public/sw.js` to customize:
- Which assets to cache
- Cache names
- Offline fallback behavior

### Testing PWA Features

1. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

2. **Test in Chrome DevTools**:
   - Open DevTools → Application tab
   - Check Service Workers section
   - Test "Offline" mode
   - Check Manifest section

3. **Test Install Prompt**:
   - Visit the site
   - Look for install prompt (appears after a few visits)
   - Or use Chrome menu → "Install App"

## Browser Support

- ✅ Chrome/Edge (Desktop & Android)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop & Android)
- ⚠️ Safari (Desktop) - Limited support

## Troubleshooting

### Service Worker Not Registering
- Ensure you're using HTTPS (or localhost)
- Check browser console for errors
- Verify `sw.js` is accessible at `/sw.js`

### Install Prompt Not Showing
- Visit the site multiple times
- Ensure manifest is valid
- Check that icons are properly configured
- Use Chrome DevTools → Application → Manifest to verify

### Icons Not Displaying
- Verify icons exist in `public/icons/`
- Check file names match manifest
- Ensure icons are PNG format
- Clear browser cache

## Production Checklist

Before deploying to production:

- [ ] Replace placeholder icons with actual app icons
- [ ] Update app name and description in manifest
- [ ] Set correct theme colors
- [ ] Test install prompt on multiple devices
- [ ] Test offline functionality
- [ ] Verify service worker updates work correctly
- [ ] Test on iOS Safari (if targeting iOS users)

## Additional Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)
