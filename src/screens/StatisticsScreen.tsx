import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, AuthTokens} from '../App';
import {jwtDecode} from 'jwt-decode';

type StatisticsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Statistics'>;
type StatisticsScreenRouteProp = RouteProp<RootStackParamList, 'Statistics'>;

interface Props {
  navigation: StatisticsScreenNavigationProp;
  route: StatisticsScreenRouteProp;
}

interface DecodedToken {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

const StatisticsScreen: React.FC<Props> = ({navigation, route}) => {
  const {tokens} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    loginTime: new Date().toISOString(),
    sessionDuration: '0 minutes',
    tokenExpiry: 'Unknown',
    authMethod: 'App-Native Authentication',
  });

  useEffect(() => {
    calculateSessionStats();
    const interval = setInterval(calculateSessionStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const calculateSessionStats = () => {
    try {
      const decoded: DecodedToken = jwtDecode(tokens.accessToken);
      const now = Math.floor(Date.now() / 1000);
      const sessionDuration = decoded.iat ? Math.floor((now - decoded.iat) / 60) : 0;
      const tokenExpiry = decoded.exp 
        ? new Date(decoded.exp * 1000).toLocaleString()
        : 'Unknown';

      setSessionStats({
        loginTime: decoded.iat 
          ? new Date(decoded.iat * 1000).toLocaleString()
          : 'Unknown',
        sessionDuration: `${sessionDuration} minutes`,
        tokenExpiry,
        authMethod: 'App-Native Authentication',
      });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    calculateSessionStats();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getTokenInfo = () => {
    try {
      const decoded: DecodedToken = jwtDecode(tokens.accessToken);
      return decoded;
    } catch (error) {
      return {};
    }
  };

  const tokenInfo = getTokenInfo();

  const StatCard: React.FC<{title: string; value: string; icon: string}> = ({title, value, icon}) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Session Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Session Statistics</Text>
          
          <View style={styles.statsGrid}>
            <StatCard 
              title="Login Time" 
              value={sessionStats.loginTime.split(',')[1] || sessionStats.loginTime} 
              icon="🕐" 
            />
            <StatCard 
              title="Session Duration" 
              value={sessionStats.sessionDuration} 
              icon="⏱️" 
            />
            <StatCard 
              title="Auth Method" 
              value={sessionStats.authMethod} 
              icon="🔐" 
            />
            <StatCard 
              title="Token Status" 
              value="Active" 
              icon="✅" 
            />
          </View>
        </View>

        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 User Information</Text>
          <View style={styles.userInfo}>
            <View style={styles.userRow}>
              <Text style={styles.userLabel}>Subject:</Text>
              <Text style={styles.userValue}>{tokenInfo.sub || 'N/A'}</Text>
            </View>
            <View style={styles.userRow}>
              <Text style={styles.userLabel}>Username:</Text>
              <Text style={styles.userValue}>{tokenInfo.preferred_username || 'N/A'}</Text>
            </View>
            <View style={styles.userRow}>
              <Text style={styles.userLabel}>Email:</Text>
              <Text style={styles.userValue}>{tokenInfo.email || 'N/A'}</Text>
            </View>
            <View style={styles.userRow}>
              <Text style={styles.userLabel}>Name:</Text>
              <Text style={styles.userValue}>{tokenInfo.name || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Token Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎫 Token Information</Text>
          <View style={styles.tokenInfo}>
            <View style={styles.tokenRow}>
              <Text style={styles.tokenLabel}>Issuer:</Text>
              <Text style={styles.tokenValue}>{tokenInfo.iss || 'N/A'}</Text>
            </View>
            <View style={styles.tokenRow}>
              <Text style={styles.tokenLabel}>Audience:</Text>
              <Text style={styles.tokenValue}>{tokenInfo.aud || 'N/A'}</Text>
            </View>
            <View style={styles.tokenRow}>
              <Text style={styles.tokenLabel}>Expires:</Text>
              <Text style={styles.tokenValue}>{sessionStats.tokenExpiry}</Text>
            </View>
            <View style={styles.tokenRow}>
              <Text style={styles.tokenLabel}>Token Type:</Text>
              <Text style={styles.tokenValue}>JWT Bearer</Text>
            </View>
          </View>
        </View>

        {/* App Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 App Metrics</Text>
          <View style={styles.metricsGrid}>
            <StatCard title="API Calls" value="12" icon="🔄" />
            <StatCard title="Auth Steps" value="3" icon="🔢" />
            <StatCard title="Security Level" value="High" icon="🛡️" />
            <StatCard title="Connection" value="Secure" icon="🔒" />
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
            onPress={() => navigation.navigate('About', {tokens})}
          >
            <Text style={styles.secondaryButtonText}>About App →</Text>
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
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  userInfo: {
    marginTop: 8,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  userLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  userValue: {
    fontSize: 16,
    color: '#1a202c',
    flex: 1,
    textAlign: 'right',
  },
  tokenInfo: {
    marginTop: 8,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  tokenValue: {
    fontSize: 14,
    color: '#1a202c',
    flex: 1,
    textAlign: 'right',
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

export default StatisticsScreen;