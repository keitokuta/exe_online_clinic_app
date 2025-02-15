import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/input';

const LoginScreen = () => {
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      // エラー処理を実装
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await socialLogin(provider);
    } catch (error) {
      console.error("Social login failed:", error);
      // エラー処理を実装
    }
  };

  return (
    <View style={styles.container}>
      <Text>ログイン</Text>
      <Input 
        placeholder="メールアドレス" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
      />
      <Input 
        placeholder="パスワード" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <Button title="ログイン" onPress={handleLogin} />
      <Button title="Googleでログイン" onPress={() => handleSocialLogin('google')} />
      <Button title="Appleでログイン" onPress={() => handleSocialLogin('apple')} />
      <Text onPress={() => navigation.navigate('PasswordReset')}>パスワードを忘れた場合</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LoginScreen;