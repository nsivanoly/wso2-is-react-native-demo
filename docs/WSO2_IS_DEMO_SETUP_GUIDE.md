# WSO2 Identity Server App-Native Authentication: Complete Demo Setup Guide

*A step-by-step guide to configure and run a production-ready React Native authentication demo using WSO2 Identity Server's app-native flows*

![WSO2 Identity Server App-Native Demo](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=WSO2+IS+App-Native+Demo)

## Introduction

Mobile authentication has evolved significantly over the past few years. Traditional OAuth flows, while effective for web applications, often create friction in mobile user experiences through browser redirects and complex token handling. WSO2 Identity Server's app-native authentication eliminates these pain points by providing direct API integration between mobile applications and the identity provider.

This article will guide you through setting up and running a complete React Native demo that showcases WSO2 IS app-native authentication. Whether you're evaluating WSO2 IS for your organization or looking to implement mobile authentication, this demo provides a hands-on experience with all the key features.

## What You'll Learn

By the end of this guide, you'll have:
- A fully functional React Native app with WSO2 IS authentication
- Hands-on experience with multiple authentication factors (SMS OTP, Email OTP)
- Understanding of app-native authentication flows
- A working setup that can be adapted for your organization

## Why App-Native Authentication Matters

### The Mobile Authentication Challenge

Traditional mobile authentication often involves:
- **Browser Redirects**: Users are taken out of your app to authenticate
- **Context Switching**: Poor user experience with multiple app switches
- **Security Concerns**: Tokens handled in external browsers
- **Platform Inconsistencies**: Different behavior across iOS and Android

### WSO2 IS App-Native Solution

App-native authentication addresses these issues by:
- **Keeping Users in Your App**: All authentication happens within your mobile app
- **Direct API Integration**: Your app communicates directly with WSO2 IS
- **Enhanced Security**: Tokens never leave your application context
- **Consistent Experience**: Same flow across all platforms

## Prerequisites

Before we begin, ensure you have:

### Technical Requirements
- **WSO2 Identity Server**: Version 6.0.0 or later
- **React Native Development Environment**: Node.js, npm/yarn, Android Studio or Xcode
- **Git**: For cloning the demo repository
- **ngrok** (for local development): To expose localhost WSO2 IS to your mobile device

### Knowledge Requirements
- Basic understanding of OAuth 2.0 flows
- Familiarity with React Native (helpful but not required)
- Basic WSO2 IS administration knowledge

## Step 1: WSO2 Identity Server Setup

### Installation and Initial Configuration

If you don't have WSO2 IS installed:

1. **Download WSO2 Identity Server**
   - Visit the WSO2 website and download the latest version
   - Extract and start the server: `./bin/wso2server.sh` (Linux/Mac) or `./bin/wso2server.bat` (Windows)
   - Access the management console at `https://localhost:9443/carbon`

2. **Basic Server Configuration**
   - Login with default credentials (admin/admin)
   - Ensure the server is running and accessible
   - Note the server URL for later configuration

### Creating the OAuth Application

1. **Navigate to Service Providers**
   - Go to Main → Identity → Service Providers
   - Click "Add" to create a new service provider
   - Name: "WSO2 IS React Native Demo"

2. **Configure OAuth Settings**
   - Expand "Inbound Authentication Configuration"
   - Expand "OAuth/OpenID Connect Configuration"
   - Click "Configure"

3. **OAuth Application Configuration**
   ```
   Callback Url: myapp://oauth2
   Allowed Grant Types: Authorization Code
   Public Client: Yes (check this box)
   ```

4. **Enable App-Native Authentication**
   - Check "Enable App-Native Authentication"
   - This is crucial for the demo to work properly

5. **Note Your Credentials**
   Save the generated:
   - Client ID (you'll need this for the mobile app)
   - Client Secret (optional for public clients)

### Configuring Authenticators

The demo supports multiple authentication methods. Configure them as follows:

1. **SMS OTP Configuration**
   - Navigate to Main → Identity → Authenticators
   - Under "Federated Authenticators," find "SMS OTP"
   - Configure your SMS provider settings (Twilio, AWS SNS, etc.)

2. **Email OTP Configuration**
   - Under "Federated Authenticators," find "Email OTP"
   - Configure SMTP settings for email delivery

3. **Basic Authenticator**
   - Ensure "Basic Authenticator" is enabled (default)
   - This handles username/password authentication

### Setting Up Authentication Steps

1. **Configure Authentication Steps**
   - Go to your service provider configuration
   - Navigate to "Local & Outbound Authentication Configuration"
   - Select "Advanced Configuration"

2. **Step 1: Username & Password**
   - Add "Basic Authenticator" as the first step
   - This handles initial credential verification

3. **Step 2: Multi-Factor Authentication**
   - Add a second authentication step
   - Include SMS OTP and Email OTP authenticators
   - Users can choose between these options

## Step 2: Exposing WSO2 IS for Mobile Access

### Using ngrok for Local Development

Since WSO2 IS runs on localhost:9443, mobile devices cannot access it directly. We'll use ngrok to create a secure tunnel.

1. **Install ngrok**
   ```bash
   # On macOS using Homebrew
   brew install ngrok
   
   # On other platforms, download from ngrok.com
   ```

2. **Start ngrok Tunnel**
   ```bash
   ngrok http https://localhost:9443
   ```

3. **Note the ngrok URL**
   ngrok will display something like:
   ```
   Forwarding: https://abc123.ngrok-free.app -> https://localhost:9443
   ```
   Save this URL - you'll need it for the mobile app configuration.

### Alternative: Production/Cloud Setup

For production or cloud-hosted WSO2 IS:
- Use your actual server URL (e.g., `https://identity.yourcompany.com:9443`)
- Ensure SSL certificates are properly configured
- Verify firewall rules allow mobile app access

## Step 3: Setting Up the React Native Demo

### Cloning the Repository

1. **Clone the Demo Repository**
   ```bash
   git clone https://github.com/your-repo/wso2-is-react-native-demo.git
   cd wso2-is-react-native-demo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Mobile Development Environment Setup

#### For Android Development

1. **Android Studio Setup**
   - Install Android Studio
   - Set up Android SDK
   - Create an Android Virtual Device (AVD) or connect a physical device

2. **Environment Variables**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### For iOS Development (macOS only)

1. **Xcode Setup**
   - Install Xcode from App Store
   - Install Xcode Command Line Tools
   - Set up iOS Simulator or connect a physical device

2. **CocoaPods Installation**
   ```bash
   sudo gem install cocoapods
   cd ios && pod install
   ```

## Step 4: Configuring the Demo App

### App Configuration

The demo includes a configuration screen where you'll enter your WSO2 IS details:

1. **Start the Demo App**
   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on Device/Emulator**
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   npx react-native run-ios
   ```

### Configuration Screen Setup

When the app launches, you'll see a configuration screen. Enter:

1. **WSO2 IS Server URL**
   - For local development: Your ngrok URL (e.g., `https://abc123.ngrok-free.app`)
   - For production: Your actual server URL (e.g., `https://identity.yourcompany.com:9443`)

2. **OAuth Client ID**
   - Use the Client ID from your WSO2 IS service provider configuration

3. **OAuth Client Secret**
   - Leave empty for public clients
   - Enter the secret if using confidential client mode

4. **Callback URL**
   - Use: `myapp://oauth2`
   - This should match what you configured in WSO2 IS

### Quick Configuration Options

The demo provides preset configuration buttons:

1. **Fill Demo Values**
   - Automatically fills common development values
   - Update the ngrok URL as needed

2. **Save Configuration**
   - Stores settings locally for future use
   - No need to re-enter every time

## Step 5: Testing the Authentication Flow

### Basic Authentication Test

1. **Start Authentication**
   - Tap "Start Authentication" or navigate from the configuration screen
   - The app will initialize the authentication flow with WSO2 IS

2. **Username/Password Login**
   - Default credentials: admin/admin
   - Or use any user you've created in WSO2 IS

3. **Multi-Factor Authentication**
   - After successful login, choose between SMS OTP or Email OTP
   - Enter the verification code you receive

### SMS OTP Testing

1. **Select SMS OTP**
   - Choose "SMS OTP" from the available options
   - A verification code will be sent to the configured mobile number

2. **Enter Verification Code**
   - Input the 6-digit code you received
   - The authentication should complete successfully

### Email OTP Testing

1. **Select Email OTP**
   - Choose "Email OTP" from the available options
   - A verification code will be sent to the configured email address

2. **Verify Email Code**
   - Check your email for the verification code
   - Enter the code to complete authentication

## Step 6: Understanding the Demo Features

### Authentication Flow Visualization

The demo includes comprehensive logging that shows:

1. **OAuth Initialization**
   - Client credentials validation
   - Flow ID generation
   - Available authenticator discovery

2. **Multi-Step Authentication**
   - Username/password verification
   - Authenticator selection
   - OTP verification

3. **Token Exchange**
   - Authorization code generation
   - Access token retrieval
   - User profile information

### User Interface Features

1. **Configuration Management**
   - Easy environment switching
   - Configuration validation
   - Local storage persistence

2. **Error Handling**
   - Clear error messages
   - Retry mechanisms
   - Flow restart capabilities

3. **Success Dashboard**
   - User profile display
   - Token information
   - Session management

## Customizing for Your Environment

### Branding Customization

1. **App Icons and Logos**
   - Replace default icons with your organization's branding
   - Update splash screens and app metadata

2. **Color Schemes**
   - Modify the theme to match your brand colors
   - Update button styles and UI elements

### Business Logic Integration

1. **Additional Authenticators**
   - Add support for your organization's custom authenticators
   - Integrate with existing MFA solutions

2. **User Profile Fields**
   - Customize displayed user information
   - Add organization-specific claims and attributes

3. **Session Management**
   - Implement your logout policies
   - Add session timeout handling

## Production Considerations

### Security Best Practices

1. **Token Security**
   - Implement secure token storage
   - Use device biometrics for token access
   - Set appropriate token expiration times

2. **Network Security**
   - Implement certificate pinning
   - Use HTTPS for all communications
   - Validate server certificates

3. **App Security**
   - Enable code obfuscation
   - Implement root/jailbreak detection
   - Use secure coding practices

### Performance Optimization

1. **App Size Optimization**
   - Remove unused dependencies
   - Optimize images and assets
   - Enable ProGuard/R8 for Android

2. **Network Optimization**
   - Implement request caching
   - Use compression where appropriate
   - Handle offline scenarios

### Deployment Strategy

1. **Environment Management**
   - Separate development, staging, and production configurations
   - Use environment-specific build variants
   - Implement feature flags

2. **Distribution**
   - Set up CI/CD pipelines
   - Configure app store deployment
   - Plan for updates and rollbacks

## Troubleshooting Common Issues

### Connection Issues

**Problem**: Cannot connect to WSO2 IS
**Solutions**:
- Verify ngrok tunnel is active and accessible
- Check firewall settings
- Validate SSL certificate configuration
- Test connectivity with curl or browser

### Authentication Failures

**Problem**: Login fails with invalid credentials
**Solutions**:
- Verify user exists in WSO2 IS
- Check user account status (locked, expired)
- Validate authenticator configuration
- Review WSO2 IS logs for detailed errors

### OTP Delivery Issues

**Problem**: SMS or Email OTP not received
**Solutions**:
- Verify SMS provider configuration
- Check email SMTP settings
- Validate recipient contact information
- Review delivery logs in WSO2 IS

### Token Exchange Errors

**Problem**: Cannot exchange authorization code for tokens
**Solutions**:
- Verify OAuth client configuration
- Check redirect URI matches exactly
- Validate client credentials
- Review token endpoint configuration

## Monitoring and Analytics

### Logging and Debugging

1. **App-Level Logging**
   - The demo includes comprehensive console logging
   - Monitor authentication flow steps
   - Track error conditions and user actions

2. **Server-Side Monitoring**
   - Review WSO2 IS access logs
   - Monitor authentication success/failure rates
   - Track performance metrics

### User Analytics

1. **Authentication Patterns**
   - Monitor preferred authentication methods
   - Track completion rates by method
   - Identify potential user experience issues

2. **Security Monitoring**
   - Monitor failed authentication attempts
   - Track suspicious activity patterns
   - Implement alerting for security events

## Next Steps and Further Development

### Extending the Demo

1. **Additional Features**
   - Implement user registration flows
   - Add password reset functionality
   - Include social login options

2. **Integration Opportunities**
   - Connect with your existing APIs
   - Integrate with analytics platforms
   - Add push notification support

### Learning Resources

1. **WSO2 IS Documentation**
   - Explore advanced authentication scenarios
   - Learn about custom authenticator development
   - Study enterprise deployment patterns

2. **React Native Resources**
   - Advance your mobile development skills
   - Learn platform-specific optimizations
   - Explore state management solutions

## Conclusion

This WSO2 Identity Server React Native demo provides a comprehensive foundation for understanding and implementing app-native authentication in mobile applications. The setup process, while detailed, results in a production-ready authentication solution that can be adapted for real-world use cases.

Key benefits of this approach include:

- **Seamless User Experience**: No browser redirects or context switching
- **Enhanced Security**: Tokens remain within the mobile application
- **Flexible Authentication**: Support for multiple authentication factors
- **Enterprise Ready**: Built on WSO2 IS's robust identity management platform

The demo serves as both a learning tool and a starting point for your own mobile authentication implementation. With proper configuration and customization, it can evolve into a production-ready solution that meets your organization's specific requirements.

Whether you're evaluating WSO2 IS for your organization or looking to improve your existing mobile authentication, this demo provides hands-on experience with modern authentication patterns and best practices.

### Ready to Get Started?

1. Set up your WSO2 IS instance
2. Clone and configure the demo application
3. Test the authentication flows
4. Customize for your environment
5. Plan your production deployment

The future of mobile authentication is app-native, and WSO2 Identity Server provides the robust foundation needed to implement it successfully.

---

*Questions about the setup process or need help adapting this demo for your specific use case? Drop a comment below or reach out to the WSO2 community for support!*

**Tags:** #WSO2 #IdentityServer #ReactNative #MobileAuthentication #OAuth #AppNative #Demo #Configuration