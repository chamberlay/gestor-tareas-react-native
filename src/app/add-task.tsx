import { useState } from 'react';
import { Alert, Button, StyleSheet, Image, Text, TextInput, View } from 'react-native';
import { useTaskStore } from '../../stores/taskStore';
import { useRouter } from 'expo-router';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { isTaskTitleValid } from '../../taskValidation';
import * as ImagePicker from 'expo-image-picker';

export default function AddTaskScreen() {
  const [task, setTask] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const addTask = useTaskStore((state) => state.addTask);

  async function pickImage() {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        'Permiso requerido',
        permiso.canAskAgain
          ? 'Necesitamos permiso para elegir una foto.'
          : 'El acceso a las fotos está desactivado. Revisá los permisos de la app en Ajustes.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setImageUri(resultado.assets[0].uri);
    }
  }

  async function saveTask() {
    const title = task.trim();

    if (!isTaskTitleValid(task)) {
      Alert.alert('Falta el titulo', 'Escribi que tarea queres agregar.');
      return;
    }

    addTask({ title, imageUri: imageUri ?? undefined });

    try {
      const permiso = await requestPermissionsAsync();

      if (permiso.status === 'granted') {
        await scheduleNotificationAsync({
          content: {
            title: 'Recordatorio de tarea',
            body: `No te olvides: ${title}`,
          },
          trigger: {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 10,
          },
        });
      } else {
        Alert.alert('Avisos desactivados', 'La tarea se guardó, pero no se programó un aviso.');
      }
    } catch (error) {
      console.error('No se pudo programar el aviso:', error);
      Alert.alert('Aviso no disponible', 'La tarea se guardó, pero no se pudo programar el recordatorio.');
    }

    router.replace('/home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva tarea</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribi una tarea"
        value={task}
        onChangeText={setTask}
      />

      <Button
      title={imageUri ? 'Cambiar foto' : 'Elegir foto'}
      onPress={pickImage}
      />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.preview}
        />
      )}

      <Button title="Guardar tarea" onPress={saveTask} />
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
  preview: {
  width: 200,
  height: 150,
  alignSelf: 'center',
  marginVertical: 12,
  borderRadius: 8,
  },
});
