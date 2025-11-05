import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, AuthTokens} from '../App';

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;
type AboutScreenRouteProp = RouteProp<RootStackParamList, 'About'>;

interface Props {
  navigation: AboutScreenNavigationProp;
  route: AboutScreenRouteProp;
}

const AboutScreen: React.FC<Props> = ({navigation, route}) => {
  const {tokens} = route.params;

  const openWSO2Website = () => {
    Linking.openURL('https://wso2.com/identity-server/');
  };

  const openDocumentation = () => {
    Linking.openURL('https://is.docs.wso2.com/en/latest/');
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/wso2/product-is');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 About This App</Text>
          <Text style={styles.description}>
            This React Native application demonstrates WSO2 Identity Server's 
            App-Native Authentication capabilities. It showcases how to implement 
            secure, modern authentication flows in mobile applications.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Multi-factor Authentication (MFA)</Text>
            <Text style={styles.featureItem}>• SMS & Email OTP Support</Text>
            <Text style={styles.featureItem}>• TOTP (Authenticator App) Support</Text>
            <Text style={styles.featureItem}>• Passkey/FIDO Authentication</Text>
            <Text style={styles.featureItem}>• OAuth 2.0 Authorization Code Flow</Text>
            <Text style={styles.featureItem}>• JWT Token Management</Text>
            <Text style={styles.featureItem}>• Professional Native UI</Text>
          </View>
        </View>

        {/* WSO2 IS Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏢 WSO2 Identity Server</Text>
          <Text style={styles.description}>
            WSO2 Identity Server is an API-driven open source IAM product designed to 
            help you build effective CIAM solutions. It enables developers to secure 
            applications with minimal development effort.
          </Text>
          
          <TouchableOpacity style={styles.linkButton} onPress={openWSO2Website}>
            <Text style={styles.linkText}>🌐 Visit WSO2 Identity Server</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={openDocumentation}>
            <Text style={styles.linkText}>📚 View Documentation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={openGitHub}>
            <Text style={styles.linkText}>💻 GitHub Repository</Text>
          </TouchableOpacity>
        </View>

        {/* Technical Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Technical Details</Text>
          <View style={styles.techDetails}>
            <Text style={styles.techItem}>Framework: React Native</Text>
            <Text style={styles.techItem}>Platform: iOS & Android</Text>
            <Text style={styles.techItem}>Authentication: OAuth 2.0 + OIDC</Text>
            <Text style={styles.techItem}>Protocol: App-Native Authentication</Text>
            <Text style={styles.techItem}>Backend: WSO2 Identity Server</Text>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('Dashboard', {tokens})}
          >
            <Text style={styles.primaryButtonText}>← Back to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate('Statistics', {tokens})}
          >
            <Text style={styles.secondaryButtonText}>View Statistics →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a5568',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 24,
  },
  linkButton: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    textAlign: 'center',
  },
  techDetails: {
    marginTop: 8,
  },
  techItem: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 12,
    padding: 16,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AboutScreen;