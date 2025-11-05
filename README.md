# WSO2 Identity Server React Native Demo

A complete React Native mobile application demonstrating WSO2 Identity Server App-Native Authentication with multiple MFA methods.

## Features

- **Complete Authentication Flow**: Username/password + MFA
- **Multiple Authenticators**: TOTP, SMS OTP, Email OTP, Passkey (FIDO2)
- **Professional UI**: Clean purple theme with responsive design
- **Error Handling**: Comprehensive error messages and flow recovery
- **Production Ready**: APK build support and optimized code
- **Expo Support**: Instant testing on real devices without compilation

## Quick Start

### Prerequisites

- Node.js 16+
- React Native development environment OR Expo CLI for instant testing
- WSO2 Identity Server 7.x+ configured with app-native authentication
- ngrok for tunneling (development)

### Installation Options

#### Option 1: Expo (Fastest Testing - Recommended for Quick Start)

**Expo offers the fastest way to test React Native apps without compiling native code.**
You can instantly run your app on a real mobile device by scanning a QR code - no emulator or APK/IPA installation needed.

**Steps:**

1. **Install Expo CLI globally:**
```bash
npm install -g expo-cli
```

2. **Clone and Setup**
```bash
git clone git@github.com:nsivanoly/wso2-is-react-native-demo.git
cd wso2-is-react-native-demo
npm install
```

3. **Start Expo Development Server**
```bash
npm start
```

4. **Test on Your Device**
   - Install **Expo Go** app from App Store (iOS) or Google Play Store (Android)
   - Scan the QR code displayed in your terminal or browser
   - The app will load instantly on your device

**🧩 Important**: Both your PC/Laptop (running the Expo project) and mobile device (running Expo Go) must be connected to the **same Wi-Fi network**. Otherwise, the app will not connect to your local development server.

Expo will emulate the app directly on your device, giving you a real-world experience without additional setup.

#### Option 2: React Native CLI (Full Development)

1. **Setup Development Environment**
   - Install Android Studio (for Android) or Xcode (for iOS)
   - Configure React Native development environment

2. **Clone and Install**
```bash
git clone git@github.com:nsivanoly/wso2-is-react-native-demo.git
cd wso2-is-react-native-demo
npm install
```

3. **Run the Application**
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS  
npm run ios
```

#### Option 3: Expo Development Build (Advanced Testing)

For testing native modules and production-like behavior with Expo tooling:

```bash
# Install latest Expo CLI
npm install -g @expo/cli

# Create development build
npx expo install --fix
npx expo run:android
npx expo run:ios
```

### Testing Requirements

#### For Expo Go Testing
- **Same Wi-Fi Network**: Essential for connection between your development machine and mobile device
- **Expo Go App**: Install from app stores (free)
- **QR Code Scanner**: Built into Expo Go app
- **Network Permissions**: Ensure firewall allows local network connections

#### Troubleshooting Expo Connection Issues

1. **Check Wi-Fi Connection**
   ```bash
   # Verify both devices are on same network
   # PC/Laptop: Check network name in Wi-Fi settings
   # Mobile: Check network name in Wi-Fi settings
   ```

2. **Alternative Connection Methods**
   ```bash
   # Use tunnel connection (slower but works across networks)
   npx expo start --tunnel
   
   # Use LAN connection (fastest, same network required)
   npx expo start --lan
   
   # Use localhost (development machine only)
   npx expo start --localhost
   ```

3. **Firewall Configuration**
   - Ensure your firewall allows connections on Expo's development port (usually 19000-19002)
   - Temporarily disable firewall to test connection

## Configuration

### WSO2 Identity Server Setup

#### Supported Versions

This demo is designed and tested for **WSO2 Identity Server 7.x+ onwards**:

- **WSO2 Identity Server 7.2.0** (Latest LTS - Recommended)
- **WSO2 Identity Server 7.1.0+** (Latest features)
- **WSO2 Asgardeo** (Cloud-based identity platform)

**Note**: While this demo may work with WSO2 IS 6.x versions, it is optimized for WSO2 IS 7.x+ which provides enhanced app-native authentication capabilities and improved security features.

#### Version-Specific Features

##### WSO2 Identity Server 7.x+
- **Enhanced App-Native Authentication**: Improved API endpoints and flow management
- **Advanced FIDO2/Passkey Support**: Better passwordless authentication integration
- **OAuth 2.1 Compliance**: Updated security standards and best practices
- **Improved MFA Flow**: Streamlined multi-factor authentication experience
- **Better Error Handling**: Enhanced error responses for mobile applications
- **Performance Optimizations**: Faster authentication flows and reduced latency

##### WSO2 Asgardeo (Cloud)
- **Fully Managed Service**: No infrastructure management required
- **Auto-scaling**: Handles traffic spikes automatically
- **Regular Updates**: Always running the latest features
- **Global Availability**: Multi-region deployment options

#### Setup Instructions for WSO2 IS 7.x+

1. **Create Application (New Console)**
   - Navigate to **Applications** → **Mobile Application**
   - Select **React Native** as the platform
   - Configure the following:
     ```
     Application Name: WSO2 IS React Native Demo
     Callback URL: myapp://oauth2
     Grant Types: Authorization Code, Refresh Token
     Enable App-Native Authentication: Yes
     ```

2. **Configure OAuth Settings**
   - **Client Authentication Method**: None (for public clients) or Client Secret Post
   - **Required Scopes**: `openid`, `profile`, `email` (add additional scopes as needed)
   - **Token Endpoint Authentication**: Client Secret Post (if using confidential client)
   - **PKCE**: Enabled (recommended for mobile apps)

3. **Set up Authenticators**
   - **Primary Authentication**: Username & Password
   - **Multi-Factor Authentication**:
     - TOTP (Time-based OTP) - Google Authenticator, Authy, etc.
     - SMS OTP - SMS-based one-time password
     - Email OTP - Email-based one-time password
     - Passkey/FIDO2 - Passwordless authentication

4. **Authentication Flow Configuration**
   ```
   Step 1: Basic Authenticator (Username & Password)
   Step 2: Choose from available MFA options
   ```

#### Setup Instructions for WSO2 Asgardeo

1. **Create Organization**: Sign up at [Asgardeo Console](https://console.asgardeo.io/)

2. **Register Application**
   - Application Type: **Mobile Application**
   - Technology: **React Native**
   - Callback URL: `myapp://oauth2`

3. **Configure Authentication**
   - Enable desired authenticators in the organization settings
   - Configure authentication flow for the application

#### Development Setup

**Set up ngrok Tunnel (Development Only)**
```bash
# For local development with WSO2 IS running on localhost:9443
ngrok http https://localhost:9443
```
**Note**: ngrok is only needed for local development. In production, use your actual WSO2 IS server URL directly.

**Important for Expo Users**: When using Expo Go, ensure your ngrok tunnel is accessible from your mobile device's network. The tunnel URL should be reachable from both your development machine and mobile device.

### App Configuration

Update the configuration in the app based on your environment:

#### For WSO2 IS 7.x+ (On-Premise/Private Cloud)
- **Server URL**: 
  - Development: `https://abcd1234.ngrok-free.app` (from ngrok tunnel)
  - Production: `https://identity.yourcompany.com:9443` (your actual server)
- **Client ID**: Application client ID from WSO2 IS console
- **Client Secret**: Application secret (optional for public clients)
- **Scopes**: `openid profile email` (modify as needed for your use case)

#### For WSO2 Asgardeo (Cloud)
- **Server URL**: `https://api.asgardeo.io/t/{organization-name}`
- **Client ID**: Application client ID from Asgardeo console
- **Client Secret**: Application secret (if using confidential client)
- **Scopes**: `openid profile email` (modify as needed for your use case)

### Testing with Expo

#### Expo Go Testing Capabilities

✅ **What works in Expo Go:**
- Basic UI and navigation testing
- Configuration screen functionality
- Network requests to WSO2 IS
- OAuth flow initiation
- Error handling and user feedback

⚠️ **Limitations in Expo Go:**
- **Deep Linking**: OAuth callbacks may have limited functionality
- **Custom Native Modules**: Advanced authentication features may not work
- **Biometric Authentication**: Not available in Expo Go environment
- **Production Features**: Some security features require native builds

#### Recommended Expo Testing Strategy

1. **Phase 1 - Expo Go Testing**
   - Test UI components and user flows
   - Verify WSO2 IS connectivity
   - Test configuration and error handling
   - Validate basic authentication flow

2. **Phase 2 - Development Build Testing**
   - Test complete OAuth callback flow
   - Verify deep linking functionality
   - Test all authentication methods
   - Validate production-like behavior

3. **Phase 3 - Production Build Testing**
   - Full feature testing
   - Performance validation
   - App store submission testing

#### Expo Development Build Setup

For complete authentication testing with Expo tooling:

```bash
# Install latest Expo CLI
npm install -g @expo/cli

# Install dependencies
npx expo install --fix

# Build for Android
npx expo run:android

# Build for iOS
npx expo run:ios
```

This creates a development build with full native module support while maintaining Expo's development experience.

### Migration from Older Versions

If upgrading from WSO2 IS 6.x or earlier:

1. **Update API Endpoints**: WSO2 IS 7.x uses updated API paths
2. **Review Application Configuration**: New console interface and options
3. **Test Authenticators**: Verify all MFA methods work with new version
4. **Update Scopes**: Check if any OAuth scopes have changed
5. **Security Enhancements**: Review new security features and configurations

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

1. **Initialize**: Start OAuth flow with WSO2 IS 7.x+
2. **Primary Auth**: Username and password authentication
3. **MFA Selection**: Choose from available authenticators
4. **MFA Verification**: Complete second factor authentication
5. **Token Exchange**: Exchange authorization code for tokens
6. **Access**: Access protected resources with enhanced security

## Supported Authenticators

### Available in WSO2 IS 7.x+
- **Username & Password**: Primary authentication method
- **TOTP**: Time-based OTP using authenticator apps (Google Authenticator, Authy)
- **SMS OTP**: One-time password sent via SMS
- **Email OTP**: One-time password sent via email
- **Passkey/FIDO2**: Passwordless authentication with enhanced security
- **Biometric**: Device-based biometric authentication (when available)

### Demo Implementation

For demonstration purposes, this React Native app specifically implements:
- ✅ **Username & Password** (primary authentication)
- ✅ **SMS OTP** (secondary authentication)
- ✅ **Email OTP** (secondary authentication)

**Note**: Additional authenticators (TOTP, Passkey) can be easily integrated following the same pattern with WSO2 IS 7.x+ enhanced APIs.

### Platform-Specific Features
- **iOS**: Face ID, Touch ID integration
- **Android**: Fingerprint, face unlock integration
- **Cross-Platform**: FIDO2 security keys support

## Building for Production

### Generate APK (React Native CLI)

```bash
# Generate debug APK
cd android
./gradlew assembleDebug

# Generate release APK (requires signing configuration)
./gradlew assembleRelease
```

APK will be generated in `android/app/build/outputs/apk/`

### Build with Expo

```bash
# Modern EAS Build (Recommended)
npm install -g @expo/cli

# Build for Android (APK/AAB)
npx eas build --platform android

# Build for iOS (IPA)
npx eas build --platform ios

# Build for both platforms
npx eas build --platform all
```

### Production Deployment Considerations

1. **WSO2 IS 7.x+ Production Setup**
   - Use HTTPS with valid SSL certificates
   - Configure proper firewall rules
   - Set up load balancing if needed
   - Enable monitoring and logging

2. **Asgardeo Production Setup**
   - Configure custom domain (optional)
   - Set up proper user management
   - Configure SSO with other applications
   - Enable audit logs and monitoring

3. **Expo Production Considerations**
   - Use EAS Build for production builds
   - Configure proper app signing
   - Test with Expo Development Build before production
   - Ensure all native modules are compatible

## Security Features

### Enhanced in WSO2 IS 7.x+
- **OAuth 2.1 Compliance**: Latest security standards
- **PKCE (Proof Key for Code Exchange)**: Enhanced mobile security
- **Token Security**: Improved token handling and storage
- **Flow Validation**: Enhanced authentication flow integrity
- **Error Recovery**: Better error handling and session recovery
- **HTTPS Required**: All communication over HTTPS with improved certificate validation

## Testing Guide

### Testing Options

1. **Expo Go (Instant Testing)**
   - ✅ **Pros**: Instant deployment, no compilation, real device testing
   - ⚠️ **Cons**: Limited native functionality, OAuth callback limitations
   - **Best for**: UI testing, basic flow validation, quick iterations

2. **Expo Development Build (Comprehensive Testing)**
   - ✅ **Pros**: Full native module support, complete OAuth testing, Expo tooling
   - ⚠️ **Cons**: Requires initial build step, larger app size
   - **Best for**: Complete authentication testing, pre-production validation

3. **Production Build Testing**
   - ✅ **Pros**: Full feature testing, app store readiness, optimal performance
   - ⚠️ **Cons**: Longer build times, complex setup
   - **Best for**: Final testing, performance validation, distribution

### Test Scenarios

#### Expo Go Testing
1. **Configuration Testing**
   - WSO2 IS server connectivity
   - Configuration validation
   - Error message display

2. **UI/UX Testing**
   - Screen navigation
   - Form validation
   - Loading states

3. **Basic Authentication**
   - Username/password input
   - MFA selection interface
   - Success/error handling

#### Development Build Testing
1. **Complete OAuth Flow**
   - Authorization redirect
   - Callback handling
   - Token exchange

2. **MFA Testing**
   - SMS OTP verification
   - Email OTP verification
   - Authenticator integration

3. **Deep Linking**
   - OAuth callback URLs
   - App state restoration
   - Cross-platform compatibility

## Troubleshooting

### Expo-Specific Issues

1. **Connection Problems**
   ```bash
   # Check if both devices are on same Wi-Fi network
   # Your PC/Laptop network
   ipconfig (Windows) or ifconfig (Mac/Linux)
   
   # Your mobile device network
   # Check in Wi-Fi settings - must match PC network
   
   # Try tunnel mode if network issues persist
   npx expo start --tunnel
   ```

2. **QR Code Scanning Issues**
   - Ensure good lighting when scanning QR code
   - Try manually entering the URL displayed in terminal
   - Restart Expo Go app and try again
   - Clear Expo Go app cache in device settings

3. **App Loading Issues**
   ```bash
   # Clear Expo cache
   npx expo start --clear
   
   # Reset Metro cache
   npx expo start --reset-cache
   
   # Force reload in Expo Go
   # Shake device and select "Reload"
   ```

4. **Network Firewall Issues**
   - Temporarily disable firewall to test
   - Add exception for Expo development ports (19000-19002)
   - Use tunnel mode: `npx expo start --tunnel`

### Common Issues with WSO2 IS 7.x+

1. **Network Errors**: Check connectivity and configuration
   - For development: Ensure ngrok tunnel is active and pointing to localhost:9443
   - For production: Verify WSO2 IS 7.x+ server URL is accessible
   - For Asgardeo: Check organization URL format
   - **Expo specific**: Ensure ngrok URL is accessible from mobile device network

2. **Authentication Failures**: Verify WSO2 IS 7.x+ configuration
   - Check OAuth scopes are properly configured (`openid`, `profile`, `email`)
   - Ensure callback URL matches exactly: `myapp://oauth2`
   - Verify app-native authentication is enabled
   - Check authenticator configuration in the new console

3. **OAuth Callback Issues (Expo Go)**
   - Deep linking may not work properly in Expo Go
   - Test callback functionality with Expo Development Build
   - Verify scheme configuration in app.json

4. **Build Errors**
   ```bash
   # Update Expo CLI
   npm install -g @expo/cli@latest
   
   # Clear all caches
   npx expo start --clear
   npm start -- --reset-cache
   
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

### WSO2 IS 7.x+ Specific Troubleshooting

1. **App-Native Flow Issues**
   - Verify all configured authenticators support app-native mode
   - Check WSO2 IS 7.x+ logs for detailed error messages
   - Ensure user accounts have all required attributes

2. **Version Compatibility**
   - Confirm WSO2 IS version is 7.0.0 or higher
   - Check API endpoint changes in release notes
   - Verify authenticator compatibility

## Resources

### Documentation
- [WSO2 Identity Server 7.x Documentation](https://is.docs.wso2.com/en/7.2.0/)
- [WSO2 Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
- [App-Native Authentication Guide](https://is.docs.wso2.com/en/7.2.0/develop/app-native-authentication/)

## License

This project is for demonstration purposes.

## Support

For WSO2 Identity Server 7.x+ configuration and setup:
- [WSO2 Identity Server Documentation](https://is.docs.wso2.com/en/7.2.0/)
- [WSO2 Community](https://github.com/wso2/product-is)
- [WSO2 Support Portal](https://support.wso2.com/) (for enterprise customers)

For WSO2 Asgardeo:
- [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
- [Asgardeo Community](https://discord.gg/wso2)
