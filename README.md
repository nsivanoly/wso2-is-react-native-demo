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
- WSO2 Identity Server 7.x+ configured with app-native authentication
- ngrok for tunneling (development)

### Installation

1. **Clone and Install**
```bash
git clone git@github.com:nsivanoly/wso2-is-react-native-demo.git
cd wso2-is-react-native-demo
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

#### Supported Versions

This demo is optimized for **WSO2 Identity Server 7.x and later versions**:

- **WSO2 Identity Server 7.0.0** (Latest LTS - Recommended)
- **WSO2 Identity Server 7.1.0** (Latest features)
- **Future 7.x releases** (Forward compatibility)

**Note**: While this demo may work with WSO2 IS 6.x versions, it is specifically designed and tested for WSO2 IS 7.x+ to leverage the latest App-Native Authentication enhancements.

#### WSO2 IS 7.x+ Features Used

- **Enhanced App-Native Authentication**: Improved mobile authentication flows
- **Advanced MFA Support**: Better multi-factor authentication handling
- **OAuth 2.1 Compliance**: Latest OAuth security standards
- **Improved FIDO2/Passkey**: Enhanced passwordless authentication
- **Better Error Handling**: More detailed error responses for mobile apps
- **Performance Optimizations**: Faster authentication flows

#### Setup Instructions for WSO2 IS 7.x+

1. **Create OAuth Application**
   - NavigateI'll update the README.md file to include WSO2 Identity Server version information, specifically focusing on WSO2 IS 7.x+ onwards as requested.

````markdown
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
- WSO2 Identity Server 7.x+ configured with app-native authentication
- ngrok for tunneling (development)

### Installation

1. **Clone and Install**
```bash
git clone git@github.com:nsivanoly/wso2-is-react-native-demo.git
cd wso2-is-react-native-demo
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

#### Supported Versions

This demo is designed and tested for **WSO2 Identity Server 7.x+ onwards**:

- **WSO2 Identity Server 7.0.0** (Latest LTS - Recommended)
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

### Platform-Specific Features
- **iOS**: Face ID, Touch ID integration
- **Android**: Fingerprint, face unlock integration
- **Cross-Platform**: FIDO2 security keys support

## Building for Production

### Generate APK

```bash
# Generate debug APK
cd android
./gradlew assembleDebug

# Generate release APK (requires signing configuration)
./gradlew assembleRelease
```

APK will be generated in [apk](http://_vscodecontentref_/3)

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

## Security Features

### Enhanced in WSO2 IS 7.x+
- **OAuth 2.1 Compliance**: Latest security standards
- **PKCE (Proof Key for Code Exchange)**: Enhanced mobile security
- **Token Security**: Improved token handling and storage
- **Flow Validation**: Enhanced authentication flow integrity
- **Error Recovery**: Better error handling and session recovery
- **HTTPS Required**: All communication over HTTPS with improved certificate validation

## Troubleshooting

### Common Issues with WSO2 IS 7.x+

1. **Network Errors**: Check connectivity and configuration
   - For development: Ensure ngrok tunnel is active and pointing to localhost:9443
   - For production: Verify WSO2 IS 7.x+ server URL is accessible
   - For Asgardeo: Check organization URL format

2. **Authentication Failures**: Verify WSO2 IS 7.x+ configuration
   - Check OAuth scopes are properly configured (`openid`, `profile`, `email`)
   - Ensure callback URL matches exactly: `myapp://oauth2`
   - Verify app-native authentication is enabled
   - Check authenticator configuration in the new console

3. **Token Issues**: Check OAuth application configuration
   - Verify client authentication method settings
   - Check PKCE configuration
   - Ensure grant types are properly configured

4. **Build Errors**: Ensure React Native environment is properly set up
   - Update React Native CLI to latest version
   - Clear Metro cache: `npx react-native start --reset-cache`

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
- [WSO2 Identity Server 7.x Documentation](https://is.docs.wso2.com/en/7.0.0/)
- [WSO2 Asgardeo Documentation](https://asgardeo.io/docs/)
- [App-Native Authentication Guide](https://is.docs.wso2.com/en/7.0.0/develop/app-native-authentication/)

### Migration Guides
- [Migrating to WSO2 IS 7.x](https://is.docs.wso2.com/en/7.0.0/deploy/migrate/)
- [WSO2 IS to Asgardeo Migration](https://asgardeo.io/docs/migrate/)

## License

This project is for demonstration purposes. Ensure proper licensing for production use.

## Support

For WSO2 Identity Server 7.x+ configuration and setup:
- [WSO2 Identity Server Documentation](https://is.docs.wso2.com/en/7.0.0/)
- [WSO2 Community](https://github.com/wso2/product-is)
- [WSO2 Support Portal](https://support.wso2.com/) (for enterprise customers)

For WSO2 Asgardeo:
- [Asgardeo Documentation](https://asgardeo.io/docs/)
- [Asgardeo Community](https://discord.gg/wso2)