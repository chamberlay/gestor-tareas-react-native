import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, View, Button} from 'react-native';

import { useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TaskItem from '../../components/TaskItem';

import { useRouter } from 'expo-router';

import { useTaskStore } from '../../stores/taskStore';

export default function App() {
  
  const tasks = useTaskStore((state) => state.tasks);
  
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const router = useRouter();

  useEffect(() => {
    async function checkLogin() {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      if (isLoggedIn !== 'true') {
        router.replace('/');
      }
    }

    checkLogin();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi lista de tareas</Text>
      {tasks.length === 0 && <Text>Todavía no tenés tareas.</Text>}
      
    <Button
      title="Nueva tarea"
      onPress={() => router.push('/add-task')}
    />

    {tasks.map((task) => (
      <TaskItem
        key={task.id}
        title={task.title}
        onDelete={() => deleteTask(task.id)}
        imageUri={task.imageUri}
        location={task.location}
        contact={task.contact}
        calendarEventId={task.calendarEventId}
      />
    ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
