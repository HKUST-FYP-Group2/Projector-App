# 🎬 Virtual Window Projector App

A React.js-based web application that serves as the **display interface** for the **Virtual Window System**, delivering immersive outdoor experiences through real-time video streaming, synchronized settings control, and ambient background music.

## 🌟 Features

- **Secure Login System**: Supports both manual login and **QR code-based authentication** via the Control App.
- **Real-time Video Streaming**: Displays live video using **HLS (HTTP Live Streaming)** from an RTMP source.
- **Dynamic Settings Panel**: Adjust brightness, volume, clock appearance, and audio settings in real time.
- **Bluetooth Remote Control Integration**: Connect and synchronize with the **ESP32-based hardware remote**.
- **AI-Driven Ambient Music**: Dynamically selects background sounds based on the current video content using AI-generated keywords.
- **Cross-Device Synchronization**: Uses **WebSocket (Socket.IO)** to sync settings across all connected devices (Control App, Camera App, Remote).
- **Responsive UI**: Built with **Tailwind CSS** and **Material UI**, ensuring compatibility across desktop and mobile devices.

---

## 📱 Usage

### 📲 Login
![image](https://github.com/user-attachments/assets/487f6016-41f1-45de-8dbe-0db094845b96)


1. **Manual Login**
   - Enter your username and password.
   - Redirects to the display page upon successful authentication.

2. **QR Code Login**
   - A UUID is generated and displayed as a QR code.
   - Use the Control App to scan the QR code and authenticate.
   - Automatically logs the user in and loads their saved settings.

### 🖥️ Display Interface
![image](https://github.com/user-attachments/assets/cc7d41c5-5d47-4de6-846f-4d7cd51471f4)
![image](https://github.com/user-attachments/assets/271eb455-2dbd-49c4-84ef-a45f38e5e366)
![image](https://github.com/user-attachments/assets/4eaf8af2-9890-4c1f-b1a1-ac3875d68239)
- **Video Feed**: Full-screen video stream from the selected source.
- **Clock Widget**: Real-time clock with customizable appearance (font size, color, background, 12/24-hour format).
- **Settings Panel**:
  - Brightness
  - Volume
  - Clock settings
  - Audio source selection
  - Background music toggle (AI-curated)

### 🔧 Settings Management

All projector settings are:
- **Saved on the server**
- **Synchronized in real-time** across devices via WebSocket

### 🔊 Background Music

- Uses AI-generated keywords from the current video stream
- Queries [Freesound.org API](https://freesound.org) for relevant ambient sounds
- Allows manual override or keyword-based auto-selection

### 🔀 Remote Control Support

- Connects via **Web Bluetooth API**
- Enables physical control of:
  - Brightness
  - Volume
  - Background music

---

## ⚙️ Deployment

### Prerequisites

Before deploying, ensure you have:

- Node.js (v18 or higher)
- npm or yarn installed
- Access to the backend server (Flask API + Socket.IO)
- A valid SSL certificate if deploying publicly

---

### 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with the following:
```env
VITE_HOST=0.0.0.0
VITE_PORT=4173
VITE_HTTPS=true
VITE_API_URL=https://api.virtualwindow.cam
VITE_SSL_CERT=.cert/cert.cert
VITE_SSL_KEY=.cert/key.key
```

---

### 🚀 Running Locally

To start the development server:
```bash
npm run dev
```

Access the app at `https://localhost:4173`.

---
