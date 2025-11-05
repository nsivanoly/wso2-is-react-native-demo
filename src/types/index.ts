export interface WSO2Config {
  clientId: string;
  clientSecret?: string; // Optional for public clients
  callbackUrl: string;
  ngrokUrl: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

export interface WSO2AuthResponse {
  flowId?: string;
  flowStatus?: string;
  flowType?: string;
  authCode?: string;
  code?: string;
  authData?: {
    code: string;
    session_state: string;
  };
  nextStep?: {
    stepType: string;
    authenticators?: AuthenticatorInfo[];
  };
  authResult?: boolean;
  authenticators?: AuthenticatorInfo[];
  links?: AuthLink[];
}

export interface AuthenticatorInfo {
  authenticatorId: string;
  authenticator: string;
  idp: string;
  requiredParams?: string[];
  metadata?: {
    i18nKey?: string;
    promptType?: string;
    params?: AuthenticatorParam[];
    additionalData?: {
      challengeData?: string;
      [key: string]: any;
    };
  };
}

export interface AuthenticatorParam {
  param: string;
  type: string;
  order: number;
  i18nKey: string;
  displayName: string;
  confidential: boolean;
}

export interface AuthLink {
  name: string;
  href: string;
  method: string;
}

export interface WSO2InitRequest {
  client_id: string;
  response_type: string;
  redirect_uri: string;
  scope: string;
  response_mode: string;
}

export interface WSO2AuthRequest {
  flowId: string;
  selectedAuthenticator: {
    authenticatorId: string;
    params?: {
      [key: string]: string;
    };
  };
}

export interface WSO2TokenRequest {
  client_id: string;
  code: string;
  grant_type: string;
  redirect_uri: string;
}

export interface WSO2TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface DecodedJWT {
  header: {
    [key: string]: any;
  };
  payload: {
    [key: string]: any;
  };
  signature: string;
}