// barra superior del sistema operativo
import { StatusBar } from 'expo-status-bar';

// componentes visuales basicos de react
import { StyleSheet, Text, View, Button} from 'react-native';

//useState guarda los datos que cambian en la pantalla
//useaEffect ejecuta las acciones cuando se actualizan los datos
import { useEffect, useState } from 'react';

//asyncStorage guarda los datos en el dispositivo
import AsyncStorage from '@react-native-async-storage/async-storage';

//importo la fila reutilizable 
import TaskItem from '../../components/TaskItem';

import { useRouter } from 'expo-router';

export default function App() {
  
  //tasks es la lista de tareas guardadas
  const [tasks, setTasks] = useState<string[]>([]);
  
  //verifica si la lista fue guardada
  const [tasksLoaded, setTasksLoaded] = useState(false);

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
  
  useEffect(() => {
    async function loadTasks() {
      const savedTasks = await AsyncStorage.getItem('tasks');

      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }

      setTasksLoaded(true);
    }

    loadTasks();
  }, []);
  
  useEffect(() => {
    if (!tasksLoaded) return;

    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks, tasksLoaded]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi lista de tareas</Text>
      {tasks.length === 0 && <Text>Todavía no tenés tareas.</Text>}
      
    <Button
      title="Nueva tarea"
      onPress={() => router.push('/add-task')}
    />

    {tasks.map((item, index) => (
      <TaskItem
        key={index}
        title={item}
        onDelete={() =>
          setTasks(tasks.filter((_, currentIndex) => currentIndex !== index))
        }
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
