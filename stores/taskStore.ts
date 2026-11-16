import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  imageUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    id: string;
    name: string;
  };

  calendarEventId?: string;
};

type TaskStore = {
  tasks: Task[];
    addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, newTitle: string) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

    addTask: (task) =>
    set((state) => ({
        tasks: [
        ...state.tasks,
        { id: `${Date.now()}-${Math.random()}`, ...task },
        ],
    })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      updateTask: (id, newTitle) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, title: newTitle } : task
          ),
        })),
    }),
    {
      // Usamos la misma clave donde ya se guardan las tareas.
      name: 'tasks',
    storage: createJSONStorage(() => ({
    getItem: async (key) => {
        const value = await AsyncStorage.getItem(key);

        if (value === null) return null;

        const savedData = JSON.parse(value);

        // Convierte la lista antigua de textos al formato nuevo.
        if (Array.isArray(savedData)) {
        return JSON.stringify({
            state: {
            tasks: savedData.map((title, index) => ({
                id: `tarea-anterior-${index}`,
                title: String(title),
            })),
            },
            version: 0,
        });
        }

        // Si ya estaba en el formato de Zustand, lo deja igual.
        return value;
    },
    setItem: (key, value) => AsyncStorage.setItem(key, value),
    removeItem: (key) => AsyncStorage.removeItem(key),
    })),

      // Convierte las tareas viejas (una lista de textos)
      // al nuevo formato con id y título.
      merge: (savedData, currentState) => {
        if (Array.isArray(savedData)) {
          return {
            ...currentState,
            tasks: savedData.map((title, index) => ({
              id: `tarea-anterior-${index}`,
              title: String(title),
            })),
          };
        }

        return {
          ...currentState,
          ...(savedData as Partial<TaskStore>),
        };
      },
    }
  )
);