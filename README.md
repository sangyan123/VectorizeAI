# VectorizeAI

VectorizeAI is a powerful web application that uses Google's Gemini 3 Vision capabilities to transform raster images (JPG, PNG) into clean, scalable SVG vector art.

![VectorizeAI Preview](https://placehold.co/800x400/1e293b/6366f1?text=VectorizeAI+Preview)

## ✨ Features

- **Gemini 3 Powered**: Utilizes the latest `gemini-3-flash-preview` model for intelligent visual understanding.
- **Multiple Styles**: Generate vectors in various artistic styles:
  - Realistic Tracing
  - Flat Design
  - Minimalist Line Art
  - Low Poly
  - Pixel Art
  - Abstract
- **Instant Preview**: Render SVG code securely in the browser immediately after generation.
- **Modern UI**: Built with React, Tailwind CSS, and a dark-mode optimized interface.
- **Privacy Focused**: Images are processed securely via the Gemini API.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Cloud Project with the Gemini API enabled and an API Key.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vectorize-ai.git
   cd vectorize-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 to view the app.

## 📦 Build & Deploy

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory. You can deploy this folder to any static hosting provider like Vercel, Netlify, or GitHub Pages.

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
├── components/       # UI Components (Dropzone, Preview)
├── services/         # API Service integrations (Gemini)
├── types.ts          # TypeScript definitions
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
├── index.html        # HTML entry
├── vite.config.ts    # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
