import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    const router = useRouter();

    async function loginUser() {
        const datosGuardados = await AsyncStorage.getItem('registeredUser');

        if (datosGuardados === null) {
        Alert.alert('Sin cuenta', 'Primero tenes que registrarte.');
        return;
        }

        const usuarioGuardado = JSON.parse(datosGuardados);

        if (
        usuario.trim() === usuarioGuardado.usuario &&
        contrasena === usuarioGuardado.contrasena
        ) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        router.replace('/home');
        } else {
        Alert.alert('Error', 'El usuario o la contraseña son incorrectos.');
        }
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesion</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <Button title="Iniciar sesion" onPress={loginUser} />

      <Link href="/register">Crear una cuenta</Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#eef2ff',
  },
  title: {
    marginBottom: 24,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: 'white',
  },
});