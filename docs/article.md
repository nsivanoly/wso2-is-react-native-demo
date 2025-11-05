# WSO2 Identity Server App-Native Authentication: Complete Demo Setup Guide

*A step-by-step guide to configure and run a production-ready React Native authentication demo using WSO2 Identity Server's app-native flows*

![WSO2 Identity Server App-Native Demo](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=WSO2+IS+App-Native+Demo)

---

## Introduction

Mobile authentication has evolved significantly in recent years. Traditional OAuth flows, while reliable for web applications, often create **friction** in mobile user experiences—through browser redirects, app switching, and clunky token handling.

**WSO2 Identity Server (WSO2 IS)** addresses this with **app-native authentication**, allowing mobile apps to integrate directly with the identity provider via APIs, without leaving the app context.

This guide walks you through setting up a complete **React Native demo** that showcases WSO2 IS app-native authentication. You’ll see how authentication works, how multiple factors are handled, and how you can adapt this for your own production systems.

---

## What You’ll Learn

By the end of this guide, you’ll have:

* A **React Native app** integrated with WSO2 IS authentication
* Hands-on experience with **username/password + SMS OTP + Email OTP** flows (for demo purposes)
* Understanding of how app-native authentication works in WSO2 IS
* Knowledge of how to extend the demo with **other authenticators** for real-world implementations

---

## Why App-Native Authentication Matters

### The Mobile Authentication Challenge

Traditional mobile authentication often involves:

* **Browser Redirects**: Users are taken out of your app to authenticate
* **Context Switching**: Poor UX due to jumping between apps
* **Security Concerns**: Tokens handled in external browsers
* **Platform Inconsistencies**: Different flows on iOS vs. Android

### The WSO2 IS App-Native Solution

App-native authentication fixes these issues by:

* **Keeping users in your app** — no browser popups
* **Direct API integration** with WSO2 IS
* **Enhanced security** — tokens remain in your app context
* **Consistent experience** across iOS and Android

---

## Important Note About the Demo

For **demo purposes**, this guide uses:

* **Step 1**: Username & Password
* **Step 2**: SMS OTP *or* Email OTP

👉 This setup helps you quickly experience a working **multi-factor authentication flow**.

However, in **real-world implementations**, WSO2 IS allows you to use **any available authenticators** — such as TOTP, FIDO2/WebAuthn (biometrics, hardware keys), social logins, or enterprise IdPs.

This means you can easily extend the demo to match your organization’s authentication requirements.

---

## Prerequisites

### Technical Requirements

* **WSO2 Identity Server**: v6.0.0 or later
* **React Native environment**: Node.js, npm/yarn, Android Studio or Xcode
* **Git**: For cloning the demo repository
* **ngrok**: To expose your local IS to mobile devices

### Knowledge Requirements

* Basic understanding of **OAuth 2.0** flows
* Familiarity with **React Native** (optional, but helpful)
* Basic **WSO2 IS administration** knowledge

---

## Step 1: WSO2 Identity Server Setup

### Installation

1. Download WSO2 IS from the [official site](https://wso2.com/identity-server/).
2. Start the server:

   ```bash
   ./bin/wso2server.sh   # Linux/Mac
   ./bin/wso2server.bat  # Windows
   ```
3. Access the management console: `https://localhost:9443/carbon`

### Create OAuth Application

* Go to **Service Providers → Add**
* Name: `WSO2 IS React Native Demo`
* Under **OAuth/OpenID Connect Configuration**:

  ```
  Callback URL: myapp://oauth2
  Grant Type: Authorization Code
  Public Client: Yes
  Enable App-Native Authentication: Checked
  ```
* Save and note the **Client ID**

### Configure Authenticators

For demo purposes:

* **Basic Authenticator** (username/password)
* **SMS OTP** (with Twilio, AWS SNS, etc.)
* **Email OTP** (configure SMTP)

### Authentication Steps

1. Step 1: Basic Authenticator
2. Step 2: SMS OTP and Email OTP

---

## Step 2: Expose IS for Mobile Devices

Since IS runs on `localhost:9443`, your phone/emulator can’t access it directly.

Use **ngrok**:

```bash
ngrok http https://localhost:9443
```

You’ll get a public URL like:

```
https://abc123.ngrok-free.app
```

Use this URL in your demo app configuration.

---

## Step 3: Setup the React Native Demo

Clone the demo repo:

```bash
git clone https://github.com/your-repo/wso2-is-react-native-demo.git
cd wso2-is-react-native-demo
npm install   # or yarn install
```

Run the app:

```bash
npx react-native run-android   # Android
npx react-native run-ios       # iOS
```

---

## Step 4: Configure the Demo App

When launched, the app shows a configuration screen. Enter:

* **Server URL**: your ngrok/public IS URL
* **Client ID**: from WSO2 IS
* **Callback URL**: `myapp://oauth2`

Save and start authentication.

---

## Step 5: Test Authentication Flow

1. Enter **username/password**
2. Choose **SMS OTP** or **Email OTP**
3. Enter the verification code
4. You’ll be logged in, and tokens displayed in the demo app

---

## Step 6: Understanding the Demo

The demo provides:

* **Flow visualization**: shows steps taken during authentication
* **Error handling**: retry flows with meaningful errors
* **Dashboard**: view tokens, user info, and session details

---

## Limitations of App-Native Authentication

While powerful, app-native authentication has some **limitations** to keep in mind:

* **Limited Protocol Coverage**: Not all OAuth/OIDC flows are supported (e.g., implicit flows).
* **Client Type Restrictions**: Public clients may have fewer options for advanced flows.
* **Security Dependencies**: Secure token storage and device protection are crucial — responsibility shifts more to the app.
* **Complexity at Scale**: Adding multiple authenticators or enterprise integrations may require extra backend orchestration.

👉 For production, always evaluate if **standard OIDC with in-app browsers** or **AppAuth libraries** might be a better fit depending on your needs.

---

## Customization Options

* **Branding**: Update icons, colors, splash screens
* **Additional Authenticators**: Add biometrics, FIDO2, social logins
* **Session Management**: Customize timeouts, logout, and token refresh

---

## Security Best Practices

* Store tokens securely (e.g., device Keychain/Secure Storage)
* Use **HTTPS only** with certificate pinning
* Enable code obfuscation and jailbreak/root detection
* Configure MFA policies according to your org’s needs

---

## Conclusion

This React Native demo with WSO2 Identity Server gives you a **hands-on look** at app-native authentication.

* For demo, we used **username/password + SMS OTP/Email OTP**
* For production, you can integrate **any authenticator** supported by WSO2 IS
* App-native flows provide a **seamless user experience**, but come with **limitations** you should evaluate before large-scale rollout

With the right configuration, this demo can evolve into a **production-ready mobile authentication solution**.

---

🚀 **Next Steps**

1. Set up your WSO2 IS instance
2. Clone and configure the demo app
3. Test login with MFA
4. Add your own authenticators
5. Secure and scale for production

The future of mobile authentication is **app-native**, and WSO2 IS provides a solid foundation to build it.

---

**Tags:** #WSO2 #IdentityServer #ReactNative #MobileAuthentication #OAuth #AppNative #Demo
