import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmacion, setConfirmacion] = useState('');

    async function registerUser() {
        if (!usuario.trim() || !contrasena.trim()) {
        Alert.alert('Faltan datos', 'Completá el usuario y la contraseña.');
        return;
        }

        if (contrasena !== confirmacion) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
        }

        const nuevoUsuario = {
        usuario: usuario.trim(),
        contrasena,
        };

        await AsyncStorage.setItem('registeredUser', JSON.stringify(nuevoUsuario));
        Alert.alert('Cuenta creada', 'Ya podés iniciar sesión.');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

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

            <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmacion}
            onChangeText={setConfirmacion}
            secureTextEntry
            />

            <Button title="Registrarme" onPress={registerUser} />

            <Link href="/">Volver al inicio de sesion</Link>

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