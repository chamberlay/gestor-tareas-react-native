import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';

export default function AddTaskScreen() {
  const [task, setTask] = useState('');
  const router = useRouter();

  async function saveTask() {
    const title = task.trim();

    if (title === '') {
      Alert.alert('Falta el titulo', 'Escribi que tarea queres agregar.');
      return;
    }

    const savedTasks = await AsyncStorage.getItem('tasks');
    const tasks: string[] = savedTasks ? JSON.parse(savedTasks) : [];

    tasks.push(title);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

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
});
