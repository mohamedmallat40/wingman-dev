# 🚀 Lighthouse Performance Optimization Guide

## ❌ Current Issues Causing Poor Performance

### 1. **Massive Framer Motion Overuse (73+ files)**
- **Impact**: ~100KB+ bundle size, layout thrashing
- **Issue**: Motion components on every hover/click
- **Solution**: Replace with CSS transitions for simple animations

### 2. **Poor Image Optimization**
- **Issue**: `priority={true}` on all avatar images
- **Impact**: Loads all images immediately, blocking render
- **Fix Applied**: Changed to `priority={false}` for non-critical images

### 3. **Bundle Size Issues**
- Multiple UI libraries loading unnecessarily
- No tree-shaking optimizations
- **Fix Applied**: Added webpack optimizations in next.config.ts

## ✅ Applied Fixes

### 1. **Next.js Config Optimizations**
```typescript
// Added to next.config.ts
experimental: {
  optimizePackageImports: ['@heroui/react', '@iconify/react', 'framer-motion']
},
webpack: (config) => {
  // Tree shake framer-motion
  config.module.rules.push({
    test: /node_modules\/framer-motion/,
    sideEffects: false,
  });
}
```

### 2. **Image Optimization**
- Removed `priority={true}` from avatar images
- Keep priority only for above-the-fold hero images

### 3. **CSS Transitions Instead of Motion**
- Replaced `motion.div` with `div + CSS transitions`
- Example: `whileHover={{ scale: 1.05 }}` → `hover:scale-105`

## 🎯 Additional Recommendations

### Critical (Do Now)
1. **Remove Framer Motion from these files**:
   - `private-navbar.tsx` (20+ motion elements)
   - `PostCard.tsx` (hover animations)
   - `QuickActions.tsx`
   - `BroadcastFeed.tsx`

2. **Lazy Load Components**:
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. **Bundle Analysis**:
   ```bash
   npm install @next/bundle-analyzer
   npx @next/bundle-analyzer
   ```

### Medium Priority
4. **Reduce Icon Library Usage**:
   - Currently using both `@iconify/react` AND `lucide-react`
   - Pick one, remove the other

5. **Code Splitting**:
   - Split broadcast components into separate chunks
   - Use dynamic imports for modals

6. **React Query Optimization**:
   - Add `staleTime` to reduce unnecessary refetches
   - Use `keepPreviousData: true` for pagination

### Low Priority
7. **CSS Optimization**:
   - Remove unused Tailwind classes
   - Use CSS custom properties for theme colors

## 📊 Expected Performance Gains

| Optimization | Bundle Size Reduction | Lighthouse Score Gain |
|--------------|----------------------|----------------------|
| Framer Motion removal | -80KB | +15-20 points |
| Tree shaking | -50KB | +10 points |
| Image optimization | N/A | +10-15 points |
| Code splitting | -100KB initial | +20 points |

## 🔧 Quick Wins (30 mins)

1. **Replace motion hover effects**:
   ```diff
   - <motion.div whileHover={{ scale: 1.05 }}>
   + <div className="transition-transform hover:scale-105">
   ```

2. **Remove priority from non-critical images**:
   ```diff
   - priority={true}
   + priority={false}
   ```

3. **Add bundle optimization**:
   ```typescript
   // In next.config.ts
   experimental: {
     optimizePackageImports: ['@heroui/react']
   }
   ```

## 🎯 Target Lighthouse Scores
- **Current**: ~30-40
- **After quick fixes**: ~60-70  
- **After full optimization**: 85+

Run `npm run build` and test with Lighthouse after each change to measure impact.