# Hume EVI Integration Setup

This guide explains how to set up the Hume Empathic Voice Interface (EVI) integration for the NightMind application.

## Prerequisites

1. A Hume AI account with API access
2. Node.js 18+ installed
3. The NightMind application already set up

## Setup Steps

### 1. Get Hume API Credentials

1. Sign up for a Hume AI account at [https://platform.hume.ai](https://platform.hume.ai)
2. Navigate to the API Keys section in your dashboard
3. Create a new API key and secret key
4. (Optional) Create a configuration ID for custom voice settings

### 2. Configure Environment Variables

Add the following variables to your `server/.env` file:

```env
# Hume AI Configuration
HUME_API_KEY=your_hume_api_key_here
HUME_SECRET_KEY=your_hume_secret_key_here
HUME_CONFIG_ID=your_config_id_here  # Optional
```

### 3. Install Dependencies

The required dependencies have already been installed:

- `@humeai/voice-react` - React SDK for Hume EVI
- `hume` - TypeScript SDK for Hume

### 4. Start the Application

1. Start the server:

   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

## Features

### Voice Chat Integration

- **Real-time voice conversation** with AI using Hume's EVI
- **Automatic speech-to-text** and text-to-speech
- **Emotion detection** and response
- **Interruption handling** for natural conversation flow
- **Chat synchronization** - voice messages appear in the regular chat interface

### Audio Visualizer

- **3D animated visualizer** that responds to voice activity
- **Perlin noise-based animations** for organic movement
- **Color changes** based on conversation state
- **Real-time audio feedback** visualization

### Integration with Existing Chat

- Voice conversations are automatically saved to the chat history
- Messages from voice chat appear in the regular text chat interface
- Seamless switching between text and voice modes
- Conversation analysis and journaling work with voice conversations

## Usage

1. Click the voice chat button in the main interface
2. Grant microphone permissions when prompted
3. Click "Start Voice Chat" to begin
4. Speak naturally - the AI will respond with voice
5. Use the microphone button to pause/resume
6. Click the end call button to finish

## Troubleshooting

### Common Issues

1. **"Failed to authenticate with Hume"**

   - Check that your API key and secret key are correct
   - Ensure the keys are properly set in the environment variables

2. **"Failed to connect to voice chat"**

   - Check your internet connection
   - Ensure microphone permissions are granted
   - Verify the server is running

3. **No audio output**
   - Check your system's audio settings
   - Ensure the browser has permission to play audio
   - Try refreshing the page

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem("debug", "hume:*");
```

## API Endpoints

The following endpoints are available for Hume integration:

- `POST /api/hume/auth` - Generate access token for EVI
- `GET /api/hume/config` - Get Hume configuration

## Security Notes

- API keys are stored server-side only
- Access tokens are generated on-demand and not stored
- All voice data is processed by Hume's secure infrastructure
- No voice data is stored locally

## Customization

### Voice Configuration

You can customize the voice behavior by creating a configuration in the Hume dashboard and setting the `HUME_CONFIG_ID` environment variable.

### Visualizer Settings

The audio visualizer can be customized by modifying the config object in `VoiceChatOverlay.tsx`:

```typescript
const config = {
  perlinTime: 50.0, // Animation speed
  perlinMorph: 5.5, // Morphing intensity
  chromaRGBr: 7.5, // Red color intensity
  chromaRGBg: 5.0, // Green color intensity
  chromaRGBb: 7.0, // Blue color intensity
  // ... more settings
};
```

## Support

For issues with:

- **Hume API**: Contact Hume AI support
- **Application**: Check the application logs and browser console
- **Setup**: Refer to this guide or the main README
