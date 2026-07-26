# AI-SMART-CITY-MANAGMENT 🌆⚡

> **CityVerse AI OS**: Enterprise Autonomous Smart City Intelligence & Digital Twin Platform

---

## 🌟 Key Features

- 🌍 **Dynamic Location Intelligence (Real-World Behaviour)**: Zero hardcoding. Auto-detects GPS coordinates, street address, suburb, district, city, state, country, postal code, time zone, language, and compass heading anywhere on Earth.
- 💱 **Location-Based Currency & Local Rates**: Automatically detects local currency (`USD $`, `EUR €`, `INR ₹`, `GBP £`, `JPY ¥`, `AED`, `CAD $`, `AUD $`, `SGD S$`, etc.) and formats all POI rates, hotel fees, parking, transit fares, and EV charging costs dynamically.
- ⚡ **Adaptive Movement Telemetry**: Tracks speed ($\text{km/h}$) and movement heading, dynamically scaling update frequencies:
  - **Walking** ($0–7\text{ km/h}$) → 15s
  - **Cycling** ($7–25\text{ km/h}$) → 7s
  - **Driving** ($25–120\text{ km/h}$) → 3s
  - **High-Speed** ($>120\text{ km/h}$) → 5s
- 🏙️ **20 Real-Time Dynamic Urban Categories**: Live GIS map overlays for Hospitals, Police, Traffic, Weather Radar, Air Quality (AQI), Transit, Restaurants, Hotels, Tourist Attractions, Parking, EV Charging, Local Events, Essential Businesses, News Alerts, Recommendations, Utilities, Power Grid, Flood Risk, and Disasters.
- 🤖 **Location-Aware AI Copilot & Global Search**: Natural language assistant answering proximity queries (*"Nearest hospital"*, *"Safest hotel nearby"*, *"Find parking near my current location"*, *"Navigate to closest metro station"*).

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Leaflet, Three.js, Lucide React.
- **Backend**: FastAPI (Python), Uvicorn, Async HTTPX, Pydantic, WebSockets.
- **AI Gateway**: Integrated Gemini LLM Gateway for real-time spatial reasoning.

---

## 🚀 Quick Start (Local Setup)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment Guide

### Part 1: Deploy Backend (FastAPI) on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `https://github.com/faizkhatri196/AI-SMART-CITY-MANAGMENT`.
3. Configure settings:
   - **Name**: `ai-smart-city-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables (if needed):
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CITY_LAT`: `40.7128`
   - `CITY_LON`: `-74.0060`
5. Click **Create Web Service**. Copy the deployed backend URL (e.g., `https://ai-smart-city-backend.onrender.com`).

---

### Part 2: Deploy Frontend (Next.js) on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository: `faizkhatri196/AI-SMART-CITY-MANAGMENT`.
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
4. Add Environment Variables in Vercel:
   - `NEXT_PUBLIC_API_BASE`: `https://ai-smart-city-backend.onrender.com/api/v1`
   - `NEXT_PUBLIC_WS_BASE`: `wss://ai-smart-city-backend.onrender.com/ws/city`
5. Click **Deploy**. Vercel will build and host your Next.js frontend globally.

---

## 📜 License
MIT License - Built for Smart City Innovation.
