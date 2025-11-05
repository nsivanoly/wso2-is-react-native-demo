import {
  WSO2Config,
  WSO2AuthResponse,
  WSO2InitRequest,
  WSO2AuthRequest,
  WSO2TokenRequest,
  WSO2TokenResponse,
  AuthTokens,
} from '../types';

class WSO2AuthService {
  private config: WSO2Config;
  private baseUrl: string;

  constructor(config: WSO2Config) {
    this.config = config;
    this.baseUrl = config.ngrokUrl;
  }

  /**
   * Initialize the authentication flow
   * Equivalent to the "Init" request in the Postman collection
   */
  async initializeAuth(): Promise<WSO2AuthResponse> {
    const requestData: WSO2InitRequest = {
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.callbackUrl,
      scope: 'openid address email groups phone profile roles',
      response_mode: 'direct',
    };

    const formData = new URLSearchParams();
    Object.entries(requestData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const url = `${this.baseUrl}/oauth2/authorize`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = formData.toString();

    // Log full curl command for debugging
    const curlCommand = `curl -X POST '${url}' \\
  -H 'Accept: ${headers.Accept}' \\
  -H 'Content-Type: ${headers['Content-Type']}' \\
  -d '${body}'`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Initialize auth error:', error);
      throw error;
    }
  }

  /**
   * Continue with the authentication flow
   * Equivalent to the "Next" requests in the Postman collection
   */
  async continueAuth(
    flowId: string,
    authenticatorId: string,
    params?: { [key: string]: string }
  ): Promise<WSO2AuthResponse> {
    const requestData: WSO2AuthRequest = {
      flowId,
      selectedAuthenticator: {
        authenticatorId,
        params: params || {},
      },
    };

    const url = `${this.baseUrl}/oauth2/authn`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(requestData);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Continue auth error:', error);
      throw error;
    }
  }

  /**
   * Authenticate with username and password
   * Equivalent to the "Next[un+pw]" request in the Postman collection
   */
  async authenticateWithCredentials(
    flowId: string,
    username: string,
    password: string
  ): Promise<WSO2AuthResponse> {
    return this.continueAuth(
      flowId,
      'QmFzaWNBdXRoZW50aWNhdG9yOkxPQ0FM', // Base64 encoded BasicAuthenticator:LOCAL
      {
        username,
        password,
      }
    );
  }

  /**
   * Authenticate with TOTP
   * Equivalent to the "Next[totp]" request in the Postman collection
   */
  async authenticateWithTOTP(
    flowId: string,
    token: string,
    authenticatorId?: string
  ): Promise<WSO2AuthResponse> {
    // Use provided authenticatorId or fallback to WSO2 IS documentation format
    const totpAuthenticatorId = authenticatorId || 'dG90cDpMT0NBTA';
    return this.continueAuth(
      flowId,
      totpAuthenticatorId,
      {
        token,
      }
    );
  }

  /**
   * Authenticate with SMS OTP
   * Equivalent to SMS OTP authentication request
   */
  async authenticateWithSMSOTP(
    flowId: string,
    otpCode: string
  ): Promise<WSO2AuthResponse> {
    return this.continueAuth(
      flowId,
      'c21zLW90cC1hdXRoZW50aWNhdG9yOkxPQ0FM', // SMS OTP authenticator ID
      {
        OTPcode: otpCode, // Note: parameter name is 'OTPcode' as per metadata
      }
    );
  }

  /**
   * Generic authenticator method for any authenticator type
   * Use this for custom or new authenticator types
   */
  async authenticateWithGeneric(
    flowId: string,
    authenticatorId: string,
    params: { [key: string]: string }
  ): Promise<WSO2AuthResponse> {
    return this.continueAuth(flowId, authenticatorId, params);
  }

  /**
   * Exchange authorization code for tokens
   * Equivalent to the "Token call" request in the Postman collection
   */
  async exchangeCodeForTokens(authCode: string): Promise<AuthTokens> {
    const requestData: WSO2TokenRequest = {
      client_id: this.config.clientId,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: this.config.callbackUrl,
    };

    const formData = new URLSearchParams();
    Object.entries(requestData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const url = `${this.baseUrl}/oauth2/token`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = formData.toString();

    // Log full curl command for debugging
    const curlCommand = `curl -X POST '${url}' \\
  -H 'Content-Type: ${headers['Content-Type']}' \\
  -d '${body}'`;
    
    console.log('🔍 TOKEN EXCHANGE CURL COMMAND:');
    console.log(curlCommand);
    console.log('📋 Request Details:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);
    
    // Also warn the curl command so it's visible even if console logs are filtered
    setTimeout(() => {
      console.warn('TOKEN EXCHANGE CURL COMMAND FOR DEBUGGING:', curlCommand);
    }, 100);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response Body:', errorText);
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const data: WSO2TokenResponse = await response.json();
      console.log('✅ Token Response Data:', data);
      
      const tokens: AuthTokens = {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
      };
      
      console.log('🎫 Parsed Tokens:', tokens);
      return tokens;
    } catch (error) {
      console.error('❌ Token exchange error:', error);
      throw error;
    }
  }

  /**
   * Logout from WSO2 IS
   * Equivalent to the "Logout" request in the Postman collection
   */
  async logout(idToken: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append('id_token_hint', idToken);
    formData.append('response_mode', 'direct');

    try {
      const response = await fetch(`${this.baseUrl}/oidc/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get available authenticators for multi-option selection
   */
  getAuthenticatorDisplayName(authenticatorId: string): string {
    const authenticatorMap: { [key: string]: string } = {
      'QmFzaWNBdXRoZW50aWNhdG9yOkxPQ0FM': 'Username & Password',
      'dG90cDpMT0NBTA==': 'TOTP (Authenticator App)',
      'RklET0F1dGhlbnRpY2F0b3I6TE9DQUw=': 'Passkey/FIDO',
      'R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I6R29vZ2xl': 'Google Sign-In',
    };
    
    return authenticatorMap[authenticatorId] || authenticatorId;
  }
}

export default WSO2AuthService;