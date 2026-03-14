# UniConvert Pro – All-in-One Instant Converter 2026

> **Fast, clean, offline unit converter – no ads, no tracking, PWA installable**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/uniconvert-pro)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/uniconvert-pro)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **25+ Categories** | Length, Weight, Temperature, Volume, Area, Speed, Data, Energy, Pressure, Power, Time, Angle, Fuel, Cooking, Shoe Size, Percentage, Currency, Timezone, Color, BMI, Age, Base/Hex, Roman, Password, Base64, QR |
| **300+ Units** | NIST-precision conversion factors |
| **PWA / Offline** | Service Worker cache-first, works 100% offline for fixed units |
| **Dark Mode** | Auto system preference + manual toggle, persisted |
| **Natural Language** | Type "75 kg to lbs" or "100 miles in km" |
| **SEO Programmatic** | Dynamic title/meta per URL params |
| **Currency** | Live rates (api.exchangerate-api.com) + static fallback (Jan 2026) |
| **Multi-result** | See value in 5+ units simultaneously |
| **Shareable Links** | Every conversion gets a unique URL |
| **Favorites** | Save frequent conversions to localStorage |
| **i18n** | English, Italiano, Español, Deutsch |
| **Zero backend** | 100% static, deploy anywhere |

---

## 🚀 Quick Deploy

### Netlify (recommended)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "UniConvert Pro"
git remote add origin https://github.com/YOUR_USERNAME/uniconvert-pro.git
git push -u origin main

# 2. Connect to Netlify
# Go to app.netlify.com → "New site from Git" → select repo
# Build command: (leave empty)
# Publish directory: .
```

Add `_redirects` file for SPA routing on Netlify:
```
/* /index.html 200
```

### Vercel

```bash
npx vercel --prod
```

### GitHub Pages

```bash
# Enable Pages in repo Settings → Pages → Source: main / (root)
```

---

## 📁 File Structure

```
uniconvert-pro/
├── index.html          ← Main SPA
├── style.css           ← Full CSS (dark/light, glass, animations)
├── data.js             ← All conversion data, units, i18n, categories
├── app.js              ← App logic, routing, tools, SEO
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker (cache-first, offline)
├── generate-icons.js   ← Icon generation helper
├── icons/              ← PWA icons (see below)
│   ├── icon-192.png
│   ├── icon-512.png
│   └── ...
└── README.md
```

---

## 🎨 Generating Icons

Use [realfavicongenerator.net](https://realfavicongenerator.net) or:

```bash
npm install -g pwa-asset-generator
node generate-icons.js   # creates icons/icon.svg
npx pwa-asset-generator icons/icon.svg icons/ --index index.html
```

---

## 🔧 Customization

### Update Currency Rates (monthly)
In `data.js`, update `CURRENCY_FALLBACK` object with fresh values from:
- https://exchangerate-api.com/docs/free (free tier: 1500 req/month)
- https://api.coinbase.com/v2/exchange-rates

### Add More Units
In `data.js`, add to the appropriate category in `UNITS`:
```js
'newunit': { label: 'New Unit (abbrev)', f: <factor_in_SI_base> },
```

### Add NL Patterns
In `data.js`, add to `NL_PATTERNS`:
```js
{ re: /pattern/i, cat: 'length', from: 'km', to: 'mi' },
```

---

## 📊 SEO – Top 50 Long-tail Keywords to Target

1. kg to lbs converter
2. miles to kilometers converter
3. cm to inches converter
4. celsius to fahrenheit converter
5. GB to MB converter
6. km/h to mph converter
7. liters to gallons converter
8. ounces to grams converter
9. feet to meters converter
10. pounds to kilograms
11. convert 75 kg to lbs
12. convert 100 miles to km
13. how many inches in a foot
14. how many km in a mile
15. convert 180 cm to feet and inches
16. 1 cup in ml
17. tablespoons to ml
18. ml to cups cooking converter
19. shoe size us to eu converter
20. GB to bytes converter
21. MB to GB converter
22. TB to GB converter
23. knots to mph converter
24. speed of light in km/h
25. BTU to kWh converter
26. psi to bar converter
27. atm to psi converter
28. square meters to square feet
29. hectares to acres converter
30. convert euros to dollars today
31. USD to EUR exchange rate converter
32. bitcoin to usd converter
33. hex to rgb color converter
34. rgb to hex converter
35. hsl to rgb converter
36. binary to decimal converter
37. hex to binary converter
38. base64 encode decode online
39. roman numeral converter
40. bmi calculator metric
41. age calculator in days
42. how many days since my birthday
43. password generator strong
44. qr code generator free
45. timezone converter CET to EST
46. convert UTC to local time
47. London to New York time difference
48. fuel consumption mpg to L/100km
49. fahrenheit to kelvin converter
50. parsec to light year converter

---

## ⚡ Performance Tips

- **Lighthouse Score**: Aim for 95-100 by hosting on CDN (Netlify/Vercel both do this)
- **Core Web Vitals**: LCP < 1.5s (no images on initial load), FID = 0ms (no blocking JS)
- **Sitemap**: Generate at `/sitemap.xml` via a simple script or Netlify plugin
- **robots.txt**: Allow all, point to sitemap

```
# robots.txt
User-agent: *
Allow: /
Sitemap: https://uniconvert.pro/sitemap.xml
```

---

## 🌍 Submit to Search Engines

1. **Google Search Console**: https://search.google.com/search-console
2. **Bing Webmaster Tools**: https://www.bing.com/webmasters
3. **Submit sitemap**: After generating, submit URL `/sitemap.xml`

---

## 📜 License

MIT License – Free to use, modify and deploy.

---

Made with ⚡ by UniConvert Pro | [uniconvert.pro](https://uniconvert.pro)
