import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import WSO2AuthService from '../services/WSO2AuthService';
import {WSO2AuthResponse, AuthenticatorInfo} from '../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const LoginScreen: React.FC<Props> = ({navigation, route}) => {
  const {config} = route.params;
  const [authService] = useState(new WSO2AuthService(config));
  
  // Authentication flow state
  const [flowId, setFlowId] = useState<string>('');
  const [flowStartTime, setFlowStartTime] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>('init');
  const [authenticators, setAuthenticators] = useState<AuthenticatorInfo[]>([]);
  const [selectedAuthenticator, setSelectedAuthenticator] = useState<string>('');
  
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form inputs
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('');
  const [smsOtpCode, setSmsOtpCode] = useState<string>('');
  const [genericOtpCode, setGenericOtpCode] = useState<string>('');
  
  // Resend OTP state
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [resendTimer, setResendTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Message state (replacing alerts)
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Helper functions to show messages
  const showError = (message: string) => {
    setLoading(false);
    setSuccessMessage('');
    setErrorMessage(message);
    
    // Auto-clear error after 8 seconds
    setTimeout(() => {
      setErrorMessage('');
    }, 8000);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    // Auto-clear success after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Reset authentication state to start fresh
  const resetAuthState = () => {
    console.log('🔄 Resetting authentication state...');
    console.log('📊 Current state before reset:', {
      flowId,
      currentStep,
      authenticatorsCount: authenticators.length,
      selectedAuthenticator,
      hasUsername: !!username,
      hasPassword: !!password
    });
    
    setFlowId('');
    setFlowStartTime(0);
    setCurrentStep('init');
    setAuthenticators([]);
    setSelectedAuthenticator('');
    setUsername('');
    setPassword('');
    setTotpCode('');
    setSmsOtpCode('');
    setGenericOtpCode('');
    setLoading(false);
    clearMessages();
    console.log('✅ Authentication state reset complete - ready for new flow');
  };

  useEffect(() => {
    initializeAuthentication();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resendTimer) {
        clearInterval(resendTimer);
      }
    };
  }, [resendTimer]);

    const initializeAuthentication = async () => {
    setLoading(true);
    try {
      const response = await authService.initializeAuth();
      handleAuthResponse(response);
    } catch (error) {
      console.error('Authentication initialization failed:', error);
      showError('Failed to initialize authentication. Please check your configuration and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthResponse = (response: WSO2AuthResponse) => {
    if (response.flowId) {
      setFlowId(response.flowId);
      setFlowStartTime(Date.now());
    }

    // Check for authentication completion
    if (response.flowStatus === 'SUCCESS_COMPLETED' && response.authData?.code) {
      exchangeCodeForTokens(response.authData.code);
      return;
    }

    if (response.authCode) {
      exchangeCodeForTokens(response.authCode);
      return;
    }

    if (response.code) {
      exchangeCodeForTokens(response.code);
      return;
    }

    // Handle next authentication steps
    if (response.nextStep) {
      if ((response.nextStep.stepType === 'AUTHENTICATOR_PROMPT' || response.nextStep.stepType === 'MULTI_OPTIONS_PROMPT') && response.nextStep.authenticators) {
        setAuthenticators(response.nextStep.authenticators);
        
        // Auto-select if only one authenticator
        if (response.nextStep.authenticators.length === 1) {
          const authenticator = response.nextStep.authenticators[0];
          setSelectedAuthenticator(authenticator.authenticatorId);
          
          // Determine the step type based on authenticator
          const stepType = getStepTypeForAuthenticator(authenticator);
          setCurrentStep(stepType);
          
          // Start resend cooldown for OTP authenticators
          if (stepType.includes('otp')) {
            startResendCooldown();
          }
        } else {
          setCurrentStep('select');
        }
      }
    }

    // Check for legacy authenticators field (backwards compatibility)
    if (response.authenticators && response.authenticators.length > 0) {
      console.log('🔑 Available authenticators (legacy):', response.authenticators);
      setAuthenticators(response.authenticators);
      
      // Auto-select first authenticator if only one available
      if (response.authenticators.length === 1) {
        setSelectedAuthenticator(response.authenticators[0].authenticatorId);
        setCurrentStep('authenticate');
      } else {
        setCurrentStep('select');
      }
    }

    // Check for completion status variations
    if (response.flowStatus === 'SUCCESSFUL_COMPLETED' || 
        response.flowStatus === 'SUCCESS_COMPLETED' ||
        response.flowStatus === 'COMPLETED') {
      console.log('🎉 Flow completed successfully with status:', response.flowStatus);
      
      // Try to find the authorization code in various possible locations
      const authCode = response.authData?.code || response.authCode || response.code;
      if (authCode) {
        console.log('🎫 Found authorization code:', authCode);
        exchangeCodeForTokens(authCode);
      } else {
        console.log('⚠️ Flow completed but no authorization code found in response');
        setErrorMessage('Authentication completed but no authorization code was received. Please try again.');
      }
    }
  };

  // Helper functions for authenticator handling
  const getStepTypeForAuthenticator = (authenticator: AuthenticatorInfo): string => {
    const authName = authenticator.authenticator.toLowerCase();
    const authId = authenticator.authenticatorId;
    
    if (authName.includes('username') && authName.includes('password')) {
      return 'authenticate';
    } else if (authName.includes('totp') || authName.includes('two-factor') || authId === 'dG90cDpMT0NBTA' || authId === 'dG90cDpMT0NBTA==') {
      return 'totp';
    } else if (authName.includes('sms') && authName.includes('otp') || authId === 'c21zLW90cC1hdXRoZW50aWNhdG9yOkxPQ0FM') {
      return 'sms-otp';
    } else if (authName.includes('email') && authName.includes('otp') || authId === 'ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I6TE9DQUw') {
      return 'email-otp';
    } else if (authName.includes('passkey') || authName.includes('fido') || authId === 'RklET0F1dGhlbnRpY2F0b3I6TE9DQUw') {
      return 'passkey';
    } else {
      return 'generic-otp';
    }
  };

  const getAuthenticatorIcon = (stepType: string): string => {
    switch (stepType) {
      case 'authenticate':
        return '👤';
      case 'totp':
        return '🔐';
      case 'sms-otp':
        return '📱';
      case 'email-otp':
        return '📧';
      case 'passkey':
        return '🔑';
      default:
        return '🔒';
    }
  };

  const getAuthenticatorDescription = (stepType: string): string => {
    switch (stepType) {
      case 'authenticate':
        return 'Use your username and password';
      case 'totp':
        return 'Use your authenticator app';
      case 'sms-otp':
        return 'Receive code via SMS';
      case 'email-otp':
        return 'Receive code via email';
      case 'passkey':
        return 'Use biometric or security key';
      default:
        return 'Complete authentication';
    }
  };

  const exchangeCodeForTokens = async (authCode: string) => {
    console.log('🎫 Starting token exchange...');
    console.log('🎫 Authorization code:', authCode);
    
    setLoading(true);
    try {
      console.log('📞 Calling authService.exchangeCodeForTokens()...');
      const tokens = await authService.exchangeCodeForTokens(authCode);
      console.log('✅ Token exchange successful:', tokens);
      
      // Navigate to Token screen to display the tokens
      navigation.navigate('Token', {tokens, config});
    } catch (error) {
      console.error('❌ Token exchange error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showError(`Token Exchange Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticatorSelection = (authenticatorId: string) => {
    setSelectedAuthenticator(authenticatorId);
    
    // Find the authenticator and check its type
    const authenticator = authenticators.find(auth => auth.authenticatorId === authenticatorId);
    if (authenticator) {
      const stepType = getStepTypeForAuthenticator(authenticator);
      
      // Auto-trigger for certain authenticator types
      switch (stepType) {
        case 'passkey':
          // Automatically trigger passkey authentication
          setCurrentStep(stepType);
          setTimeout(() => {
            authenticateWithPasskey();
          }, 500); // Small delay to show the UI first
          break;
          
        case 'sms-otp':
        case 'email-otp':
          // For OTP authenticators, send initial OTP first
          setCurrentStep(stepType);
          sendInitialOTP(authenticatorId, authenticator.authenticator);
          break;
          
        case 'totp':
          // For TOTP, just show the form
          setCurrentStep(stepType);
          break;
          
        default:
          // For username/password and others, show the form
          setCurrentStep('authenticate');
          break;
      }
    } else {
      setCurrentStep('authenticate');
    }
  };

    const authenticateWithCredentials = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!username.trim() || !password.trim()) {
      showError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.authenticateWithCredentials(flowId, username.trim(), password.trim());
      handleAuthResponse(response);
    } catch (error) {
      console.error('Credentials authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let userMessage = 'Authentication failed. Please check your credentials.';
      if (errorMessage.includes('401')) {
        userMessage = 'Invalid username or password. Please try again.';
      } else if (errorMessage.includes('403')) {
        userMessage = 'Account may be locked or disabled. Please contact administrator.';
      } else if (errorMessage.includes('400')) {
        userMessage = 'Invalid request. Please check your configuration.';
      } else if (errorMessage.includes('500')) {
        userMessage = 'Server error. Please try again later.';
      } else if (errorMessage.includes('Network')) {
        userMessage = 'Network error. Please check your connection and ngrok URL.';
      }
      
      showError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithTOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!totpCode.trim()) {
      showError('Please enter the TOTP code');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.authenticateWithTOTP(flowId, totpCode.trim(), selectedAuthenticator);
      handleAuthResponse(response);
      setTotpCode('');
    } catch (error) {
      console.error('TOTP authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let userMessage = 'TOTP authentication failed. Please check the code.';
      let shouldRestart = false;
      
      if (errorMessage.includes('401')) {
        userMessage = 'Invalid TOTP code. Please check your authenticator app and try again.';
      } else if (errorMessage.includes('ABA-60002') || errorMessage.includes('Authentication failure')) {
        userMessage = 'Invalid or expired TOTP code. Please enter the current 6-digit code from your authenticator app.';
      } else if (errorMessage.includes('400')) {
        userMessage = 'Invalid TOTP format. Please enter a 6-digit code.';
      } else if (errorMessage.includes('ABA-65003') || errorMessage.includes('Unknown authentication flow status')) {
        userMessage = 'Authentication session expired. Please start login again.';
        shouldRestart = true;
      } else if (errorMessage.includes('500')) {
        userMessage = 'Server error occurred. The authentication flow may have expired. Please restart login.';
        shouldRestart = true;
      }
      
      showError(userMessage);
      
      if (shouldRestart) {
        setTimeout(() => {
          resetAuthState();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithSMSOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!smsOtpCode.trim()) {
      showError('Please enter the SMS OTP code');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.authenticateWithSMSOTP(flowId, smsOtpCode.trim());
      handleAuthResponse(response);
      setSmsOtpCode('');
    } catch (error) {
      console.error('SMS OTP authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let userMessage = 'SMS OTP authentication failed. Please check the code.';
      let shouldRestart = false;
      
      if (errorMessage.includes('401')) {
        userMessage = 'Invalid SMS OTP code. Please check the code sent to your mobile number and try again.';
      } else if (errorMessage.includes('ABA-60002') || errorMessage.includes('Authentication failure')) {
        userMessage = 'Invalid or expired SMS OTP code. Please check the code sent to your mobile number and try again.';
      } else if (errorMessage.includes('400')) {
        userMessage = 'Invalid OTP format. Please enter the correct code.';
      } else if (errorMessage.includes('ABA-65003') || errorMessage.includes('Unknown authentication flow status')) {
        userMessage = 'Authentication session expired. Please start login again.';
        shouldRestart = true;
      } else if (errorMessage.includes('500')) {
        userMessage = 'Server error occurred. The authentication flow may have expired. Please restart login.';
        shouldRestart = true;
      } else if (errorMessage.includes('expired') || errorMessage.includes('timeout')) {
        userMessage = 'SMS OTP code has expired. Please request a new code and try again.';
      }
      
      showError(userMessage);
      
      if (shouldRestart) {
        setTimeout(() => {
          resetAuthState();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithGenericOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!genericOtpCode.trim()) {
      showError('Please enter the authentication code');
      return;
    }

    const authenticator = authenticators.find(auth => auth.authenticatorId === selectedAuthenticator);
    if (!authenticator) {
      showError('Authenticator not found');
      return;
    }

    setLoading(true);
    try {
      const params: { [key: string]: string } = {};
      if (authenticator.requiredParams) {
        const otpParam = authenticator.requiredParams[0];
        params[otpParam] = genericOtpCode.trim();
      } else {
        params['OTPcode'] = genericOtpCode.trim();
      }
      
      const response = await authService.authenticateWithGeneric(flowId, selectedAuthenticator, params);
      handleAuthResponse(response);
      setGenericOtpCode('');
    } catch (error) {
      console.error('Generic OTP authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let userMessage = `${authenticator.authenticator} authentication failed. Please check the code.`;
      let shouldRestart = false;
      
      if (errorMessage.includes('401')) {
        userMessage = `Invalid ${authenticator.authenticator} code. Please try again.`;
      } else if (errorMessage.includes('ABA-60002') || errorMessage.includes('Authentication failure')) {
        userMessage = `Invalid or expired ${authenticator.authenticator} code. Please check your ${authenticator.authenticator.toLowerCase()} and try again.`;
      } else if (errorMessage.includes('400')) {
        userMessage = 'Invalid code format. Please enter the correct code.';
      } else if (errorMessage.includes('ABA-65003') || errorMessage.includes('Unknown authentication flow status')) {
        userMessage = 'Authentication session expired. Please start login again.';
        shouldRestart = true;
      } else if (errorMessage.includes('500')) {
        userMessage = 'Server error occurred. The authentication flow may have expired. Please restart login.';
        shouldRestart = true;
      } else if (errorMessage.includes('expired') || errorMessage.includes('timeout')) {
        userMessage = `${authenticator.authenticator} code has expired. Please request a new code and try again.`;
      }
      
      showError(userMessage);
      
      if (shouldRestart) {
        setTimeout(() => {
          resetAuthState();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithPasskey = async () => {
    console.log('🔐 Starting Passkey authentication...');
    console.log('🔐 FlowId:', flowId);
    console.log('🔐 Authenticator ID:', selectedAuthenticator);

    setLoading(true);
    try {
      // First, initiate the passkey challenge
      console.log('📞 Calling authService.continueAuth() for passkey challenge...');
      const challengeResponse = await authService.continueAuth(flowId, selectedAuthenticator, {});
      console.log('✅ Got passkey challenge response:', challengeResponse);
      
      // Check if we got a challenge that needs WebAuthn handling
      if (challengeResponse.nextStep?.stepType === 'AUTHENTICATOR_PROMPT' && 
          challengeResponse.nextStep.authenticators?.[0]?.metadata?.additionalData?.challengeData) {
        
        const challengeData = challengeResponse.nextStep.authenticators[0].metadata.additionalData.challengeData;
        console.log('� Received WebAuthn challenge data:', challengeData);
        
        // For now, show an informative message about WebAuthn requirements
        showError(`🔐 Passkey Challenge Generated Successfully!
        
📋 Challenge Details:
• Challenge Data: ${challengeData.substring(0, 50)}...
• Authenticator: ${selectedAuthenticator}
• Flow ID: ${flowId}

⚠️ Demo Limitation:
This demo app cannot complete Passkey authentication because:
• WebAuthn APIs require native browser/WebView integration
• Biometric authentication needs platform-specific implementation
• FIDO2 credential processing requires specialized libraries

✅ Authentication Flow Status:
The WSO2 Identity Server is working correctly and generated a proper FIDO2 challenge. In a production app with WebAuthn support, this would proceed to biometric authentication.

🔄 Click "Start Over" to try other authentication methods.`);
        
      } else {
        // Handle other response types
        handleAuthResponse(challengeResponse);
      }
    } catch (error) {
      console.error('❌ Passkey auth error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let userMessage = 'Passkey authentication failed. Please try again.';
      let shouldRestart = false;
      
      if (errorMessage.includes('401')) {
        userMessage = 'Passkey authentication was rejected. Please try again.';
      } else if (errorMessage.includes('400')) {
        userMessage = 'Passkey authentication failed. Please ensure your device supports passkeys.';
      } else if (errorMessage.includes('ABA-65003') || errorMessage.includes('Unknown authentication flow status')) {
        const flowDuration = flowStartTime ? Math.round((Date.now() - flowStartTime) / 1000) : 'unknown';
        console.log(`⏰ Passkey: Flow expired after ${flowDuration} seconds`);
        userMessage = `Authentication session expired after ${flowDuration}s. This may happen when the Passkey flow takes too long. Please start login again and try a different authentication method.`;
        shouldRestart = true;
      } else if (errorMessage.includes('500')) {
        const flowDuration = flowStartTime ? Math.round((Date.now() - flowStartTime) / 1000) : 'unknown';
        console.log(`⏰ Passkey: Server error after ${flowDuration} seconds`);
        userMessage = `Server error occurred after ${flowDuration}s. The Passkey authentication flow may have expired. Please restart login and try a different method.`;
        shouldRestart = true;
      }
      
      showError(`Passkey Authentication Failed: ${userMessage}`);
      
      // If flow is invalid, reset to start fresh
      if (shouldRestart) {
        setTimeout(() => {
          resetAuthState();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendInitialOTP = async (authenticatorId: string, authenticatorName: string) => {
    console.log(`📤 Sending initial ${authenticatorName}...`);
    console.log('📤 FlowId:', flowId);
    console.log('📤 Authenticator ID:', authenticatorId);

    setLoading(true);
    try {
      console.log('📞 Calling authService.continueAuth() to send initial OTP...');
      const response = await authService.continueAuth(flowId, authenticatorId, {});
      console.log('✅ Initial OTP sent successfully:', response);
      
      // Start cooldown timer after successful OTP send
      startResendCooldown();
      
      // Handle any response (usually just confirms OTP was sent)
      if (response.flowStatus === 'SUCCESS_COMPLETED') {
        handleAuthResponse(response);
      } else {
        // Show success message to user
        const otpType = authenticatorName.includes('SMS') ? 'SMS' : 'email';
        showSuccess(`${authenticatorName} Sent - A verification code has been sent to your ${otpType}. Please check and enter the code below.`);
      }
      
    } catch (error) {
      console.error(`❌ Initial ${authenticatorName} send error:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showError(`${authenticatorName} Failed - Failed to send ${authenticatorName}. Please try again. Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP functionality
  const startResendCooldown = () => {
    setResendCooldown(60); // 60 seconds cooldown
    
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setResendTimer(timer);
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) {
      showError(`Please Wait - You can resend OTP in ${resendCooldown} seconds`);
      return;
    }

    console.log('🔄 Resending OTP...');
    setLoading(true);
    
    try {
      // Re-trigger the current authenticator to resend OTP
      const authenticator = authenticators.find(auth => auth.authenticatorId === selectedAuthenticator);
      if (!authenticator) {
        showError('Authenticator not found');
        return;
      }

      console.log('📞 Calling authService.continueAuth() for OTP resend...');
      const response = await authService.continueAuth(flowId, selectedAuthenticator, {});
      console.log('✅ OTP resend response:', response);
      
      // Start cooldown timer
      startResendCooldown();
      
      showSuccess(`OTP Sent - A new ${authenticator.authenticator} code has been sent. Please check your ${currentStep.includes('sms') ? 'SMS messages' : 'email'}.`);
      
    } catch (error) {
      console.error('❌ OTP resend error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showError(`Resend Failed - Failed to resend OTP: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderAuthenticatorSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Choose Authentication Method</Text>
      <Text style={styles.subtitle}>
        Select your preferred authentication method to continue
      </Text>
      {authenticators.map((auth) => {
        const stepType = getStepTypeForAuthenticator(auth);
        const icon = getAuthenticatorIcon(stepType);
        
        return (
          <TouchableOpacity
            key={auth.authenticatorId}
            style={styles.authenticatorButton}
            onPress={() => handleAuthenticatorSelection(auth.authenticatorId)}
          >
            <View style={styles.authenticatorContent}>
              <Text style={styles.authenticatorIcon}>{icon}</Text>
              <View style={styles.authenticatorTextContainer}>
                <Text style={styles.authenticatorText}>
                  {auth.authenticator}
                </Text>
                <Text style={styles.authenticatorDescription}>
                  {getAuthenticatorDescription(stepType)}
                </Text>
              </View>
              <Text style={styles.authenticatorArrow}>›</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderCredentialsForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Username & Password</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.authButton}
        onPress={authenticateWithCredentials}
        disabled={loading}
      >
        <Text style={styles.authButtonText}>
          {loading ? 'Authenticating...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTOTPForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code from your authenticator app
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>TOTP Code</Text>
        <TextInput
          style={styles.input}
          value={totpCode}
          onChangeText={setTotpCode}
          placeholder="000000"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={6}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.authButton}
        onPress={authenticateWithTOTP}
        disabled={loading}
      >
        <Text style={styles.authButtonText}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.passkeyInfo}>
        💡 Need to set up TOTP? Use apps like Google Authenticator, Authy, or Microsoft Authenticator. 
        The code changes every 30 seconds.
      </Text>
    </View>
  );

  const renderSMSOTPForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SMS OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the code sent to your mobile number
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>SMS OTP Code</Text>
        <TextInput
          style={styles.input}
          value={smsOtpCode}
          onChangeText={setSmsOtpCode}
          placeholder="000000"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={6}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.authButton}
        onPress={authenticateWithSMSOTP}
        disabled={loading}
      >
        <Text style={styles.authButtonText}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resendButton, resendCooldown > 0 && styles.resendButtonDisabled]}
        onPress={resendOTP}
        disabled={loading || resendCooldown > 0}
      >
        <Text style={[styles.resendButtonText, resendCooldown > 0 && styles.resendButtonTextDisabled]}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenericOTPForm = () => {
    const authenticator = authenticators.find(auth => auth.authenticatorId === selectedAuthenticator);
    const authName = authenticator?.authenticator || 'Authentication';
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{authName}</Text>
        <Text style={styles.subtitle}>
          Enter the required authentication code
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Authentication Code</Text>
          <TextInput
            style={styles.input}
            value={genericOtpCode}
            onChangeText={setGenericOtpCode}
            placeholder="Enter code"
            placeholderTextColor="#999"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={styles.authButton}
          onPress={authenticateWithGenericOTP}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, resendCooldown > 0 && styles.resendButtonDisabled]}
          onPress={resendOTP}
          disabled={loading || resendCooldown > 0}
        >
          <Text style={[styles.resendButtonText, resendCooldown > 0 && styles.resendButtonTextDisabled]}>
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPasskeyForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Passkey Authentication</Text>
      <Text style={styles.subtitle}>
        Use your biometric authentication or security key to sign in
      </Text>
      
      <TouchableOpacity
        style={styles.authButton}
        onPress={authenticateWithPasskey}
        disabled={loading}
      >
        <Text style={styles.authButtonText}>
          {loading ? 'Authenticating...' : 'Use Passkey'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.passkeyInfo}>
        This will use your device's biometric authentication (Face ID, Touch ID, fingerprint) 
        or your registered security key.
      </Text>
    </View>
  );

  const renderCurrentStep = () => {
    if (loading && currentStep === 'init') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Initializing authentication...</Text>
        </View>
      );
    }

    switch (currentStep) {
      case 'select':
        return renderAuthenticatorSelection();
      case 'authenticate':
        if (selectedAuthenticator === 'QmFzaWNBdXRoZW50aWNhdG9yOkxPQ0FM') {
          return renderCredentialsForm();
        } else if (selectedAuthenticator === 'dG90cDpMT0NBTA==') {
          return renderTOTPForm();
        } else {
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Unsupported Authenticator</Text>
              <Text style={styles.subtitle}>
                This authenticator is not yet supported in the demo app.
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentStep('select')}
              >
                <Text style={styles.backButtonText}>Back to Selection</Text>
              </TouchableOpacity>
            </View>
          );
        }
      case 'totp':
        return renderTOTPForm();
      case 'sms-otp':
        return renderSMSOTPForm();
      case 'email-otp':
        return renderGenericOTPForm();
      case 'passkey':
        return renderPasskeyForm();
      case 'generic-otp':
        return renderGenericOTPForm();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>WSO2 Identity Server</Text>
          <Text style={styles.subtitle}>App-Native Authentication Demo</Text>
        </View>

        {/* Message Display Component */}
        {errorMessage ? (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            <TouchableOpacity onPress={clearMessages} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            {/* Show restart button for flow-related errors */}
            {(errorMessage.includes('session expired') || 
              errorMessage.includes('flow may have expired') || 
              errorMessage.includes('restart login')) && (
              <TouchableOpacity 
                onPress={resetAuthState} 
                style={[styles.authButton, { marginTop: 10, backgroundColor: '#666' }]}
              >
                <Text style={styles.authButtonText}>🔄 Start Over</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
        
        {successMessage ? (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>✅ {successMessage}</Text>
            <TouchableOpacity onPress={clearMessages} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loading && currentStep !== 'init' && (
          <ActivityIndicator size="large" color="#667eea" style={styles.loader} />
        )}

        {renderCurrentStep()}

        <TouchableOpacity
          style={styles.backToConfigButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToConfigButtonText}>Back to Configuration</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
    textAlign: 'center',
  },
  authenticatorButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  authenticatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authenticatorIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  authenticatorTextContainer: {
    flex: 1,
  },
  authenticatorText: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '600',
    marginBottom: 2,
  },
  authenticatorDescription: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '400',
  },
  authenticatorArrow: {
    fontSize: 18,
    color: '#cbd5e0',
    fontWeight: '300',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1a202c',
  },
  authButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backToConfigButton: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  backToConfigButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },
  resendButtonDisabled: {
    borderColor: '#cbd5e0',
    backgroundColor: '#f7fafc',
  },
  resendButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendButtonTextDisabled: {
    color: '#a0aec0',
  },
  passkeyInfo: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  errorMessage: {
    backgroundColor: '#fed7d7',
    borderColor: '#fc8181',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#c53030',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  successMessage: {
    backgroundColor: '#c6f6d5',
    borderColor: '#68d391',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  successText: {
    color: '#2f855a',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeButtonText: {
    color: '#718096',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;