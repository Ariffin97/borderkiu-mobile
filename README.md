# 🚗 BorderKiu Mobile

> **Real-time border crossing queue tracker and traveler chat platform for Malaysia-Brunei borders**

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Latest-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)

BorderKiu Mobile is a React Native application that provides real-time border crossing information and live chat functionality for travelers crossing between Malaysia and Brunei. Stay informed about queue times, connect with fellow travelers, and make your border crossing experience smoother.

## ✨ Features

### 🚦 Real-Time Border Tracking
- **Live Queue Times** - Get up-to-date waiting times for all major border crossings
- **Queue Length Monitoring** - See how many vehicles are ahead
- **Interactive Maps** - View border locations with precise coordinates
- **Queue Status Indicators** - Quick visual status (Low/Moderate/High traffic)

### 💬 Live Chat System
- **Border-Specific Chats** - Connect with travelers at specific border crossings
- **Real-Time Messaging** - Instant updates via Socket.IO
- **Rich Message Support** - Text messages, images, and captions
- **Developer Recognition** - Special badges for verified developers
- **User Count Display** - See how many travelers are online
- **Message History** - Access previous conversations

### 📍 Supported Border Crossings
- **Miri (Sungai Tujuh)** - Malaysia ↔ Brunei
- **Kuala Lurah (ICQS Tedungan)** - Brunei ↔ Limbang
- **Ujung Jalan (ICQS Pandaruan)** - Temburung ↔ Limbang
- **Lawas (ICQS Mengkalap)** - Lawas ↔ Brunei
- **Sindumin-Merapok** - Sarawak ↔ Sabah

### 🎨 Modern UI/UX
- **Gradient Designs** - Beautiful color schemes throughout
- **Smooth Animations** - Enhanced user experience with Reanimated
- **Dark Mode Support** - Comfortable viewing in any lighting
- **Responsive Layout** - Optimized for all screen sizes
- **Intuitive Navigation** - Easy-to-use interface

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type safety and better development experience
- **NativeWind** - Tailwind CSS for React Native styling

### Backend Integration
- **BorderKiu API** - Real-time border data from [borderkiu.com](https://www.borderkiu.com)
- **Socket.IO** - Real-time chat functionality
- **REST API** - Border queue data and chat history

### UI Components
- **Lucide React Native** - Beautiful icon library
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions

## 🚀 Quick Start

### Prerequisites
- Node.js (16.0 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ariffin97/borderkiu-mobile.git
   cd borderkiu-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

### Environment Setup

The app connects to the BorderKiu API at `https://www.borderkiu.com`. No additional environment variables are required for basic functionality.

## 📱 Screenshots

*Screenshots coming soon...*

## 🔧 Development

### Project Structure
```
borderkiu_mobile/
├── app/                    # Main app screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen with border data
│   ├── chat.tsx           # Chat interface
│   ├── IndividualChat.tsx # Chat room selection
│   ├── Borders.tsx        # Border information
│   ├── Updates.tsx        # App updates
│   ├── FAQ.tsx            # Frequently asked questions
│   ├── aboutUs.tsx        # About page
│   └── analytics.tsx      # Analytics (future feature)
├── components/            # Reusable components
│   ├── BorderMap.tsx      # Interactive border map
│   ├── BorderPicker.tsx   # Border selection component
│   ├── ChatBox.tsx        # Chat interface component
│   ├── CollapsibleHeader.tsx # Animated header
│   └── QueueTimeChart.tsx # Queue time visualization
├── utils/                 # Utility functions
│   ├── string-utils.tsx   # String formatting helpers
│   └── time-utils.tsx     # Time formatting helpers
└── assets/               # Images and fonts
```

### Key Components

#### BorderMap Component
Displays interactive maps showing border crossing locations with real-time coordinates.

#### ChatBox Component
Handles complex message rendering including:
- Text messages with usernames and timestamps
- Image messages with captions
- Developer badge recognition
- Real-time message updates

#### QueueTimeChart Component
Visualizes queue time data with charts and status indicators.

### API Integration

#### BorderKiu API Endpoints

**Get Border Chat History**
```javascript
GET https://www.borderkiu.com/api/chat/{borderName}
```

**Send Message**
```javascript
POST https://www.borderkiu.com/api/chat/{borderName}
Content-Type: application/json

{
  "message": "Your message here",
  "deviceId": "unique-device-identifier"
}
```

**Socket.IO Real-time Connection**
```javascript
const socket = io(`https://www.borderkiu.com/${borderName}`, {
  query: {
    deviceIdentifier: 'borderkiu-mobile-app'
  }
});
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use consistent naming conventions
- Add proper error handling
- Test on both iOS and Android
- Update documentation for new features

## 🐛 Known Issues

- None currently reported

## 🔮 Roadmap

- [ ] Push notifications for queue updates
- [ ] Offline mode support
- [ ] Historical queue data analytics
- [ ] User profiles and authentication
- [ ] Weather integration for border crossings
- [ ] Multi-language support (Malay, Chinese, Tamil)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fenix Digital** - Original BorderKiu platform creators
- **BorderKiu.com** - API and data provider
- **React Native Community** - Amazing open-source ecosystem
- **Expo Team** - Excellent development platform

## 📞 Support

- **Website**: [borderkiu.com](https://www.borderkiu.com)
- **Issues**: [GitHub Issues](https://github.com/Ariffin97/borderkiu-mobile/issues)
- **Email**: Contact through BorderKiu website

---

**Made with ❤️ for travelers crossing Malaysia-Brunei borders**

*Stay informed, stay connected, travel smart with BorderKiu Mobile!*
