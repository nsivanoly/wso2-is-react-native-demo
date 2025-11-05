# WSO2 Identity Server React Native Demo

A complete React Native mobile application demonstrating WSO2 Identity Server App-Native Authentication with multiple MFA methods.

## Features

- **Complete Authentication Flow**: Username/password + MFA
- **Multiple Authenticators**: TOTP, SMS OTP, Email OTP, Passkey (FIDO2)
- **Professional UI**: Clean purple theme with responsive design
- **Error Handling**: Comprehensive error messages and flow recovery
- **Production Ready**: APK build support and optimized code

## Quick Start

### Prerequisites

- Node.js 16+
- React Native development environment
- WSO2 Identity Server configured with app-native authentication
- ngrok for tunneling (development)

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd WSO2ISDemo
npm install
```

2. **Configure WSO2 IS Connection**
   - Update configuration in the app with your WSO2 IS details
   - Set up ngrok tunnel to your WSO2 IS instance

3. **Run the Application**
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS  
npm run ios
```

## Configuration

### WSO2 Identity Server Setup

1. **Create OAuth Application**
   - Client ID and Secret
   - Callback URL: `myapp://oauth2`
   - Enable App-Native Authentication
   - **Required Scopes**: `openid`, `profile`, `email` (add additional scopes as needed)

2. **Configure Authenticators**
   - Username & Password (primary)
   - TOTP (Time-based OTP)
   - SMS OTP
   - Email OTP  
   - Passkey/FIDO2

3. **Set up ngrok Tunnel (Development Only)**
```bash
# For local development with WSO2 IS running on localhost:9443
ngrok http https://localhost:9443
```
**Note**: ngrok is only needed for local development. In production, use your actual WSO2 IS server URL directly (e.g., `https://your-domain.com:9443` or `https://identity.yourcompany.com`).

### App Configuration

Update the configuration in the app:
- **ngrok URL**: Your ngrok tunnel URL (development) or actual WSO2 IS server URL (production)
  - Development: `https://abcd1234.ngrok-free.app` (from ngrok tunnel)
  - Production: `https://identity.yourcompany.com:9443` (your actual server)
- **Client ID**: OAuth application client ID
- **Client Secret**: OAuth application secret (optional for public clients)
- **Scopes**: Default scopes include `openid profile email` - modify as needed for your use case

## Architecture

```
src/
├── components/          # Reusable UI components
├── screens/            # Main application screens
│   ├── ConfigurationScreen.tsx
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   └── TokenScreen.tsx
├── services/           # API and authentication services
│   └── WSO2AuthService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── jwtUtils.ts
```

## Authentication Flow

1. **Initialize**: Start OAuth flow with WSO2 IS
2. **Primary Auth**: Username and password authentication
3. **MFA Selection**: Choose from available authenticators
4. **MFA Verification**: Complete second factor authentication
5. **Token Exchange**: Exchange authorization code for tokens
6. **Access**: Access protected resources

## Supported Authenticators

- **TOTP**: Time-based OTP using authenticator apps
- **SMS OTP**: One-time password sent via SMS
- **Email OTP**: One-time password sent via email
- **Passkey**: FIDO2/WebAuthn passwordless authentication

## Building for Production

### Generate APK

```bash
# Generate debug APK
cd android
./gradlew assembleDebug

# Generate release APK (requires signing configuration)
./gradlew assembleRelease
```

APK will be generated in `android/app/build/outputs/apk/`

## Security Features

- **Token Security**: Secure token storage and handling
- **Flow Validation**: Authentication flow integrity checks
- **Error Recovery**: Graceful error handling and session recovery
- **HTTPS Required**: All communication over HTTPS

## Troubleshooting

### Common Issues

1. **Network Errors**: Check ngrok tunnel and WSO2 IS connectivity
   - For development: Ensure ngrok tunnel is active and pointing to localhost:9443
   - For production: Verify your WSO2 IS server URL is accessible and correct
2. **Authentication Failures**: Verify WSO2 IS configuration and user setup
   - Check OAuth scopes are properly configured (`openid`, `profile`, `email`)
   - Ensure callback URL matches: `myapp://oauth2`
3. **Token Issues**: Check OAuth application configuration
4. **Build Errors**: Ensure React Native environment is properly set up

## License

This project is for demonstration purposes. Ensure proper licensing for production use.

## Support

For WSO2 Identity Server configuration and setup, refer to the [official documentation](https://is.docs.wso2.com/).
