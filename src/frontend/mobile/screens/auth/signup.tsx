import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/input';

const Signup = () => {
  const { signup } = useAuth();
  const [accountType, setAccountType] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await signup(accountType, name, email, password);
    } catch (error) {
      console.error("Signup error:", error);
      // エラー処理を実装
    }
  };

  return (
    <View style={styles.container}>
      <Text>新規登録</Text>
      <Input label="名前" value={name} onChangeText={setName} />
      <Input label="メールアドレス" value={email} onChangeText={setEmail} />
      <Input label="パスワード" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="登録" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Signup;