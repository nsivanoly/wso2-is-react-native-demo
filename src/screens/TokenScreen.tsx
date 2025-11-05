import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {DecodedJWT} from '../types';
import {
  decodeJWT,
  formatTimestamp,
  isJWTExpired,
  getTokenExpirationMinutes,
  extractCommonClaims,
} from '../utils/jwtUtils';

type TokenScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Token'>;
type TokenScreenRouteProp = RouteProp<RootStackParamList, 'Token'>;

interface Props {
  navigation: TokenScreenNavigationProp;
  route: TokenScreenRouteProp;
}

const TokenScreen: React.FC<Props> = ({navigation, route}) => {
  const {tokens, config} = route.params;
  const [accessTokenDecoded, setAccessTokenDecoded] = useState<DecodedJWT | null>(null);
  const [idTokenDecoded, setIdTokenDecoded] = useState<DecodedJWT | null>(null);
  const [selectedToken, setSelectedToken] = useState<'access' | 'id'>('access');
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

  useEffect(() => {
    decodeTokens();
  }, []);

  const decodeTokens = () => {
    try {
      if (tokens.accessToken) {
        const decodedAccess = decodeJWT(tokens.accessToken);
        setAccessTokenDecoded(decodedAccess);
      }
    } catch (error) {
      console.error('Error decoding access token:', error);
      showMessage('Failed to decode access token', 'error');
    }

    try {
      if (tokens.idToken) {
        const decodedId = decodeJWT(tokens.idToken);
        setIdTokenDecoded(decodedId);
      }
    } catch (error) {
      console.error('Error decoding ID token:', error);
      showMessage('Failed to decode ID token', 'error');
    }
  };

  const renderTokenInfo = (decodedToken: DecodedJWT, tokenType: string) => {
    const commonClaims = extractCommonClaims(decodedToken.payload);
    const isExpired = isJWTExpired(decodedToken.payload);
    const expirationMinutes = getTokenExpirationMinutes(decodedToken.payload);

    return (
      <View style={styles.tokenContainer}>
        <View style={styles.tokenHeader}>
          <Text style={styles.tokenTitle}>{tokenType} Token</Text>
          {isExpired ? (
            <Text style={styles.expiredBadge}>EXPIRED</Text>
          ) : expirationMinutes !== null ? (
            <Text style={styles.validBadge}>
              Expires in {expirationMinutes} min
            </Text>
          ) : (
            <Text style={styles.validBadge}>VALID</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Header</Text>
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Algorithm:</Text>
            <Text style={styles.claimValue}>{decodedToken.header.alg || 'N/A'}</Text>
          </View>
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Type:</Text>
            <Text style={styles.claimValue}>{decodedToken.header.typ || 'N/A'}</Text>
          </View>
          {decodedToken.header.kid && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Key ID:</Text>
              <Text style={styles.claimValue}>{decodedToken.header.kid}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standard Claims</Text>
          
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Subject:</Text>
            <Text style={styles.claimValue}>{commonClaims.subject}</Text>
          </View>
          
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Issuer:</Text>
            <Text style={styles.claimValue}>{commonClaims.issuer}</Text>
          </View>
          
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Audience:</Text>
            <Text style={styles.claimValue}>{commonClaims.audience}</Text>
          </View>
          
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Issued At:</Text>
            <Text style={styles.claimValue}>{commonClaims.issuedAt}</Text>
          </View>
          
          <View style={styles.claimContainer}>
            <Text style={styles.claimKey}>Expires At:</Text>
            <Text style={styles.claimValue}>{commonClaims.expiresAt}</Text>
          </View>
          
          {commonClaims.jwtId !== 'N/A' && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>JWT ID:</Text>
              <Text style={styles.claimValue}>{commonClaims.jwtId}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          
          {commonClaims.username !== 'N/A' && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Username:</Text>
              <Text style={styles.claimValue}>{commonClaims.username}</Text>
            </View>
          )}
          
          {commonClaims.name !== 'N/A' && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Name:</Text>
              <Text style={styles.claimValue}>{commonClaims.name}</Text>
            </View>
          )}
          
          {commonClaims.email !== 'N/A' && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Email:</Text>
              <Text style={styles.claimValue}>{commonClaims.email}</Text>
            </View>
          )}
          
          {commonClaims.scope !== 'N/A' && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Scope:</Text>
              <Text style={styles.claimValue}>{commonClaims.scope}</Text>
            </View>
          )}
          
          {Array.isArray(commonClaims.roles) && commonClaims.roles.length > 0 && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Roles:</Text>
              <Text style={styles.claimValue}>{commonClaims.roles.join(', ')}</Text>
            </View>
          )}
          
          {Array.isArray(commonClaims.groups) && commonClaims.groups.length > 0 && (
            <View style={styles.claimContainer}>
              <Text style={styles.claimKey}>Groups:</Text>
              <Text style={styles.claimValue}>{commonClaims.groups.join(', ')}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raw Payload</Text>
          <ScrollView style={styles.rawPayloadContainer} nestedScrollEnabled>
            <Text style={styles.rawPayloadText}>
              {JSON.stringify(decodedToken.payload, null, 2)}
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tokenTabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedToken === 'access' && styles.activeTab,
          ]}
          onPress={() => setSelectedToken('access')}
        >
          <Text
            style={[
              styles.tabText,
              selectedToken === 'access' && styles.activeTabText,
            ]}
          >
            Access Token
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedToken === 'id' && styles.activeTab,
          ]}
          onPress={() => setSelectedToken('id')}
        >
          <Text
            style={[
              styles.tabText,
              selectedToken === 'id' && styles.activeTabText,
            ]}
          >
            ID Token
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {message !== '' && (
          <View style={[styles.messageContainer, messageType === 'error' ? styles.errorMessage : styles.successMessage]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
        
        {selectedToken === 'access' && accessTokenDecoded && 
          renderTokenInfo(accessTokenDecoded, 'Access')
        }
        {selectedToken === 'id' && idTokenDecoded && 
          renderTokenInfo(idTokenDecoded, 'ID')
        }
      </ScrollView>

      {/* Navigation Menu */}
      <View style={styles.navigationMenu}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Statistics', {tokens})}
        >
          <Text style={styles.navButtonText}>📊 Statistics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('About', {tokens})}
        >
          <Text style={styles.navButtonText}>ℹ️ About</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Dashboard', {tokens, config})}
        >
          <Text style={styles.navButtonText}>🏠 Dashboard</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard', {tokens, config})}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tokenTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#667eea',
  },
  scrollView: {
    flex: 1,
  },
  tokenContainer: {
    padding: 20,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  validBadge: {
    backgroundColor: '#28a745',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  expiredBadge: {
    backgroundColor: '#dc3545',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  claimContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  claimKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 100,
    minWidth: 100,
  },
  claimValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  rawPayloadContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    maxHeight: 200,
  },
  rawPayloadText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
  },
  backButton: {
    backgroundColor: '#6c757d',
    margin: 20,
    borderRadius: 8,
    padding: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
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
  navigationMenu: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TokenScreen;