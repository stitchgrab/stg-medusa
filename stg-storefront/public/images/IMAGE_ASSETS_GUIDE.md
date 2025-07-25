# StitchGrab Homepage Image Assets Guide

## 📁 Complete Folder Structure

```
stg-storefront/public/images/
├── categories/              # Shop by Categories section
├── sneakers/               # Shop All Sneakers section
├── styles/                 # Popular Styles section
├── brand-spotlight/        # Featuring KASIOPYA section
├── lifestyle/              # Let's Get Wavy lifestyle images
├── brands/                 # Best Sellers & Brand sections
│   ├── logos/             # Circular brand logos
│   └── imagery/           # Brand hero images
└── products/
    └── showcase/          # Product showcase items
```

## 🎨 **Section 1: Shop by Categories**
**Folder:** `/images/categories/`

### Required Images:
- `for-men.jpg` - Professional man in beige/tan suit
- `for-women.jpg` - Elegant woman sitting with handbag  
- `vintage.jpg` - Woman in vintage style by car
- `streetwear.jpg` - Person on car/urban street setting
- `accessories.jpg` - Person with stylish accessories
- `denim.jpg` - Person in denim-focused outfit

**Specs:** 800x1000px (4:5 ratio), High-quality fashion photography

---

## 👟 **Section 2: Shop All Sneakers**  
**Folder:** `/images/sneakers/`

### Required Images:
- `hero-sneaker.jpg` - Dynamic action shot of person in sneakers (jumping/movement)

**Specs:** 800x1000px (4:5 ratio), High-energy athletic photography

---

## 🎭 **Section 3: Popular Styles**
**Folder:** `/images/styles/`

### Required Images:
- `hats.jpg` - Stylish hat/headwear (like the eye-decorated hat in Figma)
- `dresses.jpg` - Elegant dress styling
- `hoodies.jpg` - Casual hoodie/streetwear
- `sportswear.jpg` - Athletic/sports clothing

**Specs:** 600x400px (3:2 ratio), Lifestyle photography with product focus

---

## ✨ **Section 4: Featuring KASIOPYA (Brand Spotlight)**
**Folder:** `/images/brand-spotlight/`

### Required Images:
- `kasiopya-hero.jpg` - Full-width brand hero image (person in flowing garments by water)
- `[brand-name]-hero.jpg` - Additional brand hero images for rotation

**Specs:** 1920x800px (landscape), Cinematic brand photography with lifestyle elements

---

## 🌊 **Section 5: Let's Get Wavy (Product Showcase)**
**Folder:** `/images/lifestyle/`

### Required Images:
- `wavy-lifestyle.jpg` - Large lifestyle image (woman in elegant dress/hat)
- `beach-resort.jpg` - Beach/resort lifestyle imagery
- `summer-collection.jpg` - Summer collection lifestyle shots

**Specs:** 800x1000px (4:5 ratio), High-end lifestyle photography

---

## 🏷️ **Section 6: Popular Brands & Best Sellers**
**Folder:** `/images/brands/`

### Brand Hero Images (`/imagery/`):
- `new-balance.jpg` - New Balance brand imagery
- `soleman.jpg` - Soleman Fine footwear
- `trth.jpg` - Trth Brand
- `na-lei.jpg` - Na Lei Boho Clothier  
- `ugg.jpg` - UGG brand imagery

**Specs:** 600x600px (1:1 ratio), Brand-focused photography

### Brand Logos (`/logos/`):
- `legends-miami.png` - Legends of Miami logo
- `jb.png` - JB logo  
- `cnb.png` - CNB logo
- `maly.png` - MALY logo
- `mabel-love.png` - Mabel Love logo
- `soleman.png` - Soleman logo
- `s1.png` - S1 logo
- `kasiopya.png` - KASIOPYA logo
- `hotbox.png` - Hot Box logo
- `avita.png` - AVITA logo

**Specs:** 200x200px (1:1 ratio), PNG with transparent background, Clean logo marks

---

## 🛍️ **Section 7: Product Showcase Items**
**Folder:** `/images/products/showcase/`

### Required Images:
- `swim-resort-1.jpg` - Swim & Resort Wear product
- `swim-resort-2.jpg` - Additional swimwear item  
- `bracelet-mya-bay.jpg` - Super Marraine bracelet MYA BAY
- `summer-item-1.jpg` - Featured summer product
- `summer-item-2.jpg` - Additional summer product

**Specs:** 600x600px (1:1 ratio), Clean product photography with lifestyle context

---

## 📋 **Implementation Checklist**

### Phase 1: Category & Sneaker Sections ✅
- [x] Categories folder structure created
- [x] Components implemented
- [ ] Add category images (for-men.jpg, for-women.jpg, etc.)
- [ ] Add sneaker hero image

### Phase 2: Popular Styles Section
- [ ] Add style category images (hats.jpg, dresses.jpg, etc.)  
- [ ] Update Popular Styles component

### Phase 3: Brand Spotlight
- [ ] Add KASIOPYA hero image
- [ ] Create brand spotlight component

### Phase 4: Product Showcase
- [ ] Add lifestyle images
- [ ] Add product showcase images
- [ ] Update Let's Get Wavy component

### Phase 5: Brand Logos
- [ ] Add all brand logos to `/brands/logos/`
- [ ] Update brand components

---

## 🎯 **Technical Requirements**

### Image Optimization:
- **Format:** WebP preferred, JPG fallback
- **Compression:** 80-85% quality for web
- **Naming:** lowercase, hyphen-separated
- **Alt text:** Descriptive for accessibility

### Responsive Images:
```typescript
<Image
  src="/images/categories/for-men.jpg"
  alt="Men's Fashion Category"
  fill
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  priority={index < 4}
/>
```

### Performance:
- Use `priority={true}` for above-fold images
- Implement lazy loading for below-fold content
- Consider blur placeholders for smooth loading

---

## 🚀 **Quick Start**

1. **Add images to respective folders** following the naming convention
2. **Update component imports** to use new image paths  
3. **Test responsive behavior** across all devices
4. **Optimize images** for web performance
5. **Add proper alt text** for accessibility

This structure ensures organized, scalable, and maintainable image assets across the entire StitchGrab homepage. 