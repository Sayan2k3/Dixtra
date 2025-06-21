# 🌪️ DIXTRA: Disaster Information Exchange & Response Assistant

**DIXTRA** is a full-stack disaster response dashboard that allows users to:
- Report disasters with geolocation
- Get official updates via live web scraping
- View social media reports and AI-driven responses
- Explore maps and safety suggestions with ease



---

## 🧠 Features

- 🗺️ Interactive Map of disasters (OpenStreetMap & Leaflet)
- 📣 Social Media Report Mocking with Priority Alerts (e.g., keywords: “SOS”, “urgent”)
- 🧠 AI Safety Bot (powered by OpenAI API)
- 📡 Official updates scraped live from FEMA & Red Cross websites
- 🧪 Real-time editing, reporting, and tagging
- 🔐 Role-ready architecture (admin/user separation possible)
- ⚡ WebSocket-ready (Socket.IO integrated)

---

## 👨‍💻 Cursor (AI Code Editor)

 - Cursor was used as an AI assistant to streamline the full-stack development process:

 - Generated boilerplate for OfficialUpdates.jsx, SocialMedia.jsx, and the AI Bot modal

 - Helped debug REST API route conflicts and enhanced error-handling in Express

 - Assisted in crafting regex parsing for geolocation from PostGIS format

 - Suggested modular CSS layouts and responsive improvements for cards and tables

---

## 🛠️ Tech Stack

| Frontend      | Backend         | Database   | Others                  |
|---------------|------------------|------------|--------------------------|
| React         | Node.js + Express| Supabase   | Cheerio (Scraping), Socket.IO |
| React Router  | REST API         | Postgres   | Leaflet, Vercel, Render |

---

## ⚙️ Setup Instructions

### Backend (Render)
```bash
cd backend
npm install
npm run dev
