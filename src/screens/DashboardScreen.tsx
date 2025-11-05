import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, WSO2Config} from '../App';
import WSO2AuthService from '../services/WSO2AuthService';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
  route: DashboardScreenRouteProp;
}

const DashboardScreen: React.FC<Props> = ({navigation, route}) => {
  const {tokens, config} = route.params;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleViewTokens = () => {
    navigation.navigate('Token', {tokens, config});
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    
    try {
      // Use the configuration passed through navigation
      const authService = new WSO2AuthService(config);
      
      console.log('🚪 Starting logout process...');
      
      // Call WSO2 IS logout endpoint with ID token
      if (tokens.idToken) {
        await authService.logout(tokens.idToken);
        console.log('✅ Server logout completed');
      }
      
      // Clear local state and navigation
      console.log('🧹 Clearing local session...');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Continue with local cleanup even if server logout fails
    } finally {
      // Always clear local navigation and return to configuration
      navigation.reset({
        index: 0,
        routes: [{name: 'Configuration'}],
      });
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      title: 'View JWT Tokens',
      description: 'Decode and view Access Token and ID Token details',
      icon: '🔐',
      onPress: handleViewTokens,
    },
    {
      title: 'Statistics',
      description: 'View session statistics and user information',
      icon: '📊',
      onPress: () => navigation.navigate('Statistics', {tokens}),
    },
    {
      title: 'About App',
      description: 'Learn about this app and WSO2 Identity Server',
      icon: 'ℹ️',
      onPress: () => navigation.navigate('About', {tokens}),
    },
    {
      title: isLoggingOut ? 'Logging out...' : 'Logout',
      description: isLoggingOut ? 'Clearing session and signing out' : 'Sign out and return to configuration',
      icon: isLoggingOut ? '⏳' : '🚪',
      onPress: handleLogout,
    },
  ];

  const externalLinks = [
    {
      title: 'WSO2 Documentation',
      description: 'Visit the official WSO2 IS documentation',
      icon: '📚',
      onPress: () => handleOpenLink('https://is.docs.wso2.com/en/latest/'),
    },
    {
      title: 'App-Native Auth Guide',
      description: 'Learn more about App-Native Authentication',
      icon: '📱',
      onPress: () => handleOpenLink('https://is.docs.wso2.com/en/latest/guides/authentication/app-native-authentication/'),
    },
    {
      title: 'WSO2 GitHub',
      description: 'Explore WSO2 open source projects',
      icon: '💻',
      onPress: () => handleOpenLink('https://github.com/wso2'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>WSO2</Text>
        </View>
        <Text style={styles.welcomeText}>Authentication Successful!</Text>
        <Text style={styles.subText}>You have successfully logged in using WSO2 Identity Server</Text>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Quick Actions</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, item.title === 'Logout' && styles.logoutMenuItem]}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
              <Text style={[styles.menuItemTitle, item.title === 'Logout' && styles.logoutText]}>{item.title}</Text>
              <Text style={[styles.menuItemDescription, item.title === 'Logout' && styles.logoutDescription]}>{item.description}</Text>
            </View>
            <Text style={[styles.menuArrow, item.title === 'Logout' && styles.logoutText]}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>External Resources</Text>
        {externalLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About WSO2 Identity Server</Text>
        
        <View style={styles.aboutCard}>
          <Text style={styles.aboutSubtitle}>What is WSO2 Identity Server?</Text>
          <Text style={styles.aboutText}>
            WSO2 Identity Server (WSO2 IS) is a fully-featured enterprise identity and access management solution that provides identity federation, single sign-on (SSO), multi-factor authentication (MFA), and more.
          </Text>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutSubtitle}>App-Native Authentication</Text>
          <Text style={styles.aboutText}>
            App-Native Authentication provides a seamless login experience directly within mobile and desktop applications without browser redirections. It supports various authentication methods including:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Username and Password authentication</Text>
            <Text style={styles.featureItem}>• Multi-Factor Authentication (MFA)</Text>
            <Text style={styles.featureItem}>• TOTP (Time-based One-Time Password)</Text>
            <Text style={styles.featureItem}>• Passkey/FIDO2 authentication</Text>
            <Text style={styles.featureItem}>• Social login integration</Text>
            <Text style={styles.featureItem}>• Adaptive authentication</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutSubtitle}>Key Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>🔒 <Text style={styles.featureBold}>Security:</Text> Enterprise-grade security with OAuth 2.0, OpenID Connect, and SAML 2.0 support</Text>
            <Text style={styles.featureItem}>🌐 <Text style={styles.featureBold}>Federation:</Text> Connect with external identity providers and social logins</Text>
            <Text style={styles.featureItem}>🔑 <Text style={styles.featureBold}>SSO:</Text> Single Sign-On across multiple applications</Text>
            <Text style={styles.featureItem}>📊 <Text style={styles.featureBold}>Analytics:</Text> Comprehensive analytics and monitoring capabilities</Text>
            <Text style={styles.featureItem}>🛡️ <Text style={styles.featureBold}>Risk-based Auth:</Text> Adaptive authentication based on risk analysis</Text>
            <Text style={styles.featureItem}>👥 <Text style={styles.featureBold}>User Management:</Text> Complete user lifecycle management</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutSubtitle}>Use Cases</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Enterprise applications and B2B scenarios</Text>
            <Text style={styles.featureItem}>• Customer identity and access management (CIAM)</Text>
            <Text style={styles.featureItem}>• API security and management</Text>
            <Text style={styles.featureItem}>• Cloud and hybrid deployments</Text>
            <Text style={styles.featureItem}>• Multi-tenant SaaS applications</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutSubtitle}>Standards Compliance</Text>
          <Text style={styles.aboutText}>
            WSO2 IS is compliant with industry standards including OAuth 2.0, OpenID Connect, SAML 2.0, WS-Federation, SCIM 2.0, and XACML 3.0.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 30,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  menuContainer: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuArrow: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: 'bold',
  },
  aboutSection: {
    padding: 20,
    paddingTop: 0,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  aboutSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'justify',
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 5,
  },
  featureBold: {
    fontWeight: 'bold',
    color: '#333',
  },
  logoutMenuItem: {
    backgroundColor: '#fee',
    borderColor: '#f56565',
    borderWidth: 1,
  },
  logoutText: {
    color: '#c53030',
  },
  logoutDescription: {
    color: '#c53030',
    opacity: 0.8,
  },
});

export default DashboardScreen;