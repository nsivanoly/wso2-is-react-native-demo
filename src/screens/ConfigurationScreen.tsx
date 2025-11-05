import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, WSO2Config} from '../App';

type ConfigurationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Configuration'
>;

interface Props {
  navigation: ConfigurationScreenNavigationProp;
}

const ConfigurationScreen: React.FC<Props> = ({navigation}) => {
  const [clientId, setClientId] = useState('fw6HOZMQsplJjkm9S3dA8YI6Ep8a');
  const [clientSecret, setClientSecret] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('myapp://oauth2');
  const [ngrokUrl, setNgrokUrl] = useState('https://41fffa58559f.ngrok-free.app');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');

  const showMessage = (text: string, type: 'error' | 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const validateConfiguration = (): boolean => {
    if (!clientId.trim()) {
      showMessage('Client ID is required', 'error');
      return false;
    }
    // Client Secret is optional for public clients
    if (!callbackUrl.trim()) {
      showMessage('Callback URL is required', 'error');
      return false;
    }
    if (!ngrokUrl.trim()) {
      showMessage('ngrok URL is required', 'error');
      return false;
    }
    
    // Validate ngrok URL format
    const ngrokPattern = /^https:\/\/[a-zA-Z0-9-]+\.(ngrok\.io|ngrok-free\.app)$/;
    if (!ngrokPattern.test(ngrokUrl.trim())) {
      showMessage('Invalid ngrok URL format. Expected: https://your-domain.ngrok.io or https://your-domain.ngrok-free.app', 'error');
      return false;
    }

    return true;
  };

  const handleProceed = () => {
    if (!validateConfiguration()) {
      return;
    }

    const config: WSO2Config = {
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim() || undefined,
      callbackUrl: callbackUrl.trim(),
      ngrokUrl: ngrokUrl.trim(),
    };

    navigation.navigate('Login', {config});
  };

  const fillDemoValues = () => {
    setClientId('fw6HOZMQsplJjkm9S3dA8YI6Ep8a');
    setClientSecret('');
    setCallbackUrl('myapp://oauth2');
    setNgrokUrl('https://41fffa58559f.ngrok-free.app');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>WSO2 Identity Server Configuration</Text>
          <Text style={styles.subtitle}>
            Configure your WSO2 IS instance details to start the demo
          </Text>
        </View>

        <View style={styles.form}>
          {message !== '' && (
            <View style={[styles.messageContainer, messageType === 'error' ? styles.errorMessage : styles.successMessage]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client ID *</Text>
            <TextInput
              style={styles.input}
              value={clientId}
              onChangeText={setClientId}
              placeholder="Enter your OAuth2 Client ID"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Secret (Optional)</Text>
            <TextInput
              style={styles.input}
              value={clientSecret}
              onChangeText={setClientSecret}
              placeholder="Enter your OAuth2 Client Secret (leave empty for public clients)"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              Client Secret is not required for App-Native Authentication with public clients
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Callback URL *</Text>
            <TextInput
              style={styles.input}
              value={callbackUrl}
              onChangeText={setCallbackUrl}
              placeholder="com.wso2isdemo://callback"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ngrok URL *</Text>
            <TextInput
              style={styles.input}
              value={ngrokUrl}
              onChangeText={setNgrokUrl}
              placeholder="https://your-domain.ngrok.io"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text style={styles.helpText}>
              Use ngrok to expose your local WSO2 IS instance to the mobile app
            </Text>
          </View>

          <TouchableOpacity style={styles.demoButton} onPress={fillDemoValues}>
            <Text style={styles.demoButtonText}>Fill Demo Values</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
            <Text style={styles.proceedButtonText}>Proceed to Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Setup Instructions:</Text>
          <Text style={styles.infoText}>
            1. Start your WSO2 Identity Server locally{'\n'}
            2. Install and setup ngrok to expose your IS instance{'\n'}
            3. Create an OAuth2 application in WSO2 IS{'\n'}
            4. Enable App-Native Authentication for the application{'\n'}
            5. Enter the configuration details above
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  demoButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  demoButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  proceedButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 15,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  messageContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorMessage: {
    backgroundColor: '#fee',
    borderColor: '#f56565',
    borderWidth: 1,
  },
  successMessage: {
    backgroundColor: '#f0fff4',
    borderColor: '#38a169',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ConfigurationScreen;