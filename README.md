# MetaLens — Professional Image Metadata & EXIF Extractor

> A high-performance, privacy-first, client-side web application designed to extract, analyze, visualize, and sanitize image metadata (EXIF, GPS, IPTC, XMP, ICC, and Camera Settings) directly in your browser.

---

> [!TIP]
> ## Live Application
> # **[https://n0vemberain.github.io/metalens/](https://n0vemberain.github.io/metalens/)**
>
> **Click above to try MetaLens live directly in your browser.**  
> *Zero setup required • 100% Client-Side & Private • No images uploaded to any server.*

[![Open Live App](https://img.shields.io/badge/OPEN%20LIVE%20WEBSITE-https%3A%2F%2Fn0vemberain.github.io%2Fmetalens%2F-4F46E5?style=for-the-badge)](https://n0vemberain.github.io/metalens/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## Features

### 1. 100% Client-Side & Privacy-First
- **Zero Server Uploads**: Every byte of your image is parsed strictly inside your local browser memory using modern web APIs (`FileReader`, `ArrayBuffer`, and HTML5 Canvas).
- Your private photos, location data, camera serial numbers, and personal tags **never leave your device**.

### 2. Camera & Exposure Dashboard
- **Camera & Lens Gear**: Camera Make, Model, Lens Model, Lens Make, and Firmware version.
- **Exposure Diagnostics**:
  - Aperture ($f$-stop)
  - Shutter Speed (Exposure Time)
  - ISO Sensitivity
  - Focal Length & 35mm Equivalent
  - Exposure Program (Manual, Aperture Priority, Shutter Priority, etc.)
  - Metering Mode (Multi-segment, Spot, Center-weighted)
  - Flash Status (Fired, Did not fire, Auto)
  - White Balance & Exposure Compensation (EV Bias)

### 3. Geolocation & Interactive Map
- Automatic extraction of GPS coordinates (Decimal Degrees and DMS format: `23° 46' 20" N`).
- Altitude calculation (meters and feet above sea level).
- **Interactive OpenStreetMap / Leaflet map** with custom pin and interactive popup.
- One-click links to open location in **Google Maps** or **OpenStreetMap**.
- One-click GPS coordinates copy.

### 4. File & Display Specifications
- Real pixel dimensions (Width × Height) and Megapixel (MP) calculation.
- Aspect Ratio recognition ($16:9, 4:3, 3:2, 1:1$, etc.).
- Print size estimation for professional 300 DPI high-quality prints.
- Color Space (sRGB, Adobe RGB, Display P3) and Bit Depth.

### 5. Creator & Copyright Information
- Photographer / Artist name (IPTC/EXIF by-line).
- Copyright notices and image descriptions / captions.
- Editing software detection (e.g. Adobe Photoshop, Lightroom, Capture One).

### 6. Searchable Raw Tags Inspector
- Live instant search across hundreds of raw metadata tags and descriptions.
- Filter by tag groups: `EXIF`, `GPS`, `IPTC`, `XMP`, `ICC`, `FILE`.
- Copy individual tag values or entire tag blocks with a single click.

### 7. Privacy Sanitizer (Metadata Stripper)
- Download a sanitized version of the image with all EXIF, GPS coordinates, and camera information stripped.
- Choose between JPEG (with customizable compression quality) or lossless PNG.

### 8. Export Options
- Export complete metadata structure as a neatly formatted `.json` file.
- One-click copy of all parsed metadata to your clipboard.

### 9. Seamless Input Options
- **Drag & Drop** file zone.
- Traditional file browser.
- **Clipboard Paste (`Ctrl+V` / `Cmd+V`)**: Paste images directly from screenshots or web pages.
- **Pre-loaded Sample Photos**: Test immediately with pre-configured sample photos (Sony Alpha A7 IV, Apple iPhone 15 Pro, and Canon EOS R5).

### 10. Bilingual Interface
- Fully localized in **English** and **Bengali**, toggleable with one click.

---

## Supported Formats

- **JPEG / JPG** (`.jpg`, `.jpeg`)
- **PNG** (`.png`)
- **WebP** (`.webp`)
- **TIFF / TIF** (`.tiff`, `.tif`)
- **HEIC / HEIF** (`.heic`, `.heif`)
- **AVIF** (`.avif`)
- **RAW Camera Formats**: Canon (`.cr2`, `.cr3`), Nikon (`.nef`), Sony (`.arw`), Adobe DNG (`.dng`), and Fujifilm (`.raf`).

---

## Quick Start & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/n0vemberain/metalens.git

# 2. Navigate to the project directory
cd metalens

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Metadata Engine**: [ExifReader](https://github.com/mattiasw/ExifReader)
- **Map & Geolocation**: [Leaflet](https://leafletjs.com/) & OpenStreetMap
- **Typography**: Google Fonts (*Hind Siliguri*, *Inter*, *JetBrains Mono*)

---

## License

This project is licensed under the [MIT License](LICENSE).
