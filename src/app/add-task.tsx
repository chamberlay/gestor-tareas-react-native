import { useState } from 'react';
import { Alert, Button, StyleSheet, Image, Text, TextInput, View } from 'react-native';
import { useTaskStore } from '../../stores/taskStore';
import { useRouter } from 'expo-router';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { isTaskTitleValid } from '../../taskValidation';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Contact as ExpoContact } from 'expo-contacts';
import * as ContactsLegacy from 'expo-contacts/legacy';
import * as Calendar from 'expo-calendar/legacy';

export default function AddTaskScreen() {
  const [task, setTask] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedContact, setSelectedContact] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [calendarEventId, setCalendarEventId] = useState<string | null>(null);
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

  async function getTaskLocation() {
    let permiso = await Location.getForegroundPermissionsAsync();

    // Si todavía puede pedir permiso, mostramos el diálogo del sistema.
    if (!permiso.granted && permiso.canAskAgain) {
      permiso = await Location.requestForegroundPermissionsAsync();
    }

    if (!permiso.granted) {
      Alert.alert(
        'Permiso de ubicación',
        permiso.canAskAgain
          ? 'Necesitamos permiso para guardar la ubicación de la tarea.'
          : 'El permiso está desactivado. Habilitalo en los Ajustes de la app.'
      );
      return;
    }

    try {
      const posicion = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude,
      });
    } catch {
      Alert.alert(
        'Ubicación no disponible',
        'No pudimos obtener tu ubicación. Revisá que la ubicación del teléfono esté activada e intentá de nuevo.'
      );
    }
  }

  async function pickContact() {
    try {
      let permiso = await ContactsLegacy.getPermissionsAsync();

      if (!permiso.granted && permiso.canAskAgain) {
        permiso = await ContactsLegacy.requestPermissionsAsync();
      }

      if (!permiso.granted) {
        Alert.alert(
          'Permiso de contactos requerido',
          permiso.canAskAgain
            ? 'Permití el acceso a tus contactos para poder elegir uno.'
            : 'El acceso está desactivado. Habilitalo en los Ajustes de la app.'
        );
        return;
      }

      const contact = await ExpoContact.presentPicker();

      if (contact === null) return;

      const name = await contact.getFullName();

      setSelectedContact({
        id: contact.id,
        name: name || 'Contacto sin nombre',
      });
    } catch (error) {
      const detalle = error instanceof Error ? error.message : String(error);
      Alert.alert('Error al abrir contactos', detalle);
    }
  }

  async function createCalendarEvent() {
    const title = task.trim();

    if (!isTaskTitleValid(task)) {
      Alert.alert('Falta el título', 'Escribí la tarea antes de crear el evento.');
      return;
    }

    try {
      let permiso = await Calendar.getCalendarPermissionsAsync();

      if (!permiso.granted && permiso.canAskAgain) {
        permiso = await Calendar.requestCalendarPermissionsAsync();
      }

      if (!permiso.granted) {
        Alert.alert(
          'Permiso de calendario',
          permiso.canAskAgain
            ? 'Permití el acceso al calendario para crear el evento.'
            : 'El acceso está desactivado. Habilitalo en los Ajustes de la app.'
        );
        return;
      }

      const calendarios = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      const calendario =
        calendarios.find((item) => item.allowsModifications && item.isPrimary) ??
        calendarios.find((item) => item.allowsModifications);

      if (!calendario) {
        Alert.alert('Sin calendario disponible', 'No encontramos un calendario editable.');
        return;
      }

      const startDate = new Date(Date.now() + 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

      const eventId = await Calendar.createEventAsync(calendario.id, {
        title,
        startDate,
        endDate,
      });

      setCalendarEventId(eventId);
      Alert.alert('Evento creado', 'Se agregó al calendario para dentro de una hora.');
    } catch (error) {
      const detalle = error instanceof Error ? error.message : String(error);
      Alert.alert('No se pudo crear el evento', detalle);
    }
  }

  async function saveTask() {
    const title = task.trim();

    if (!isTaskTitleValid(task)) {
      Alert.alert('Falta el titulo', 'Escribi que tarea queres agregar.');
      return;
    }

    addTask({
      title,
      imageUri: imageUri ?? undefined,
      location: location ?? undefined,
      contact: selectedContact ?? undefined,
      calendarEventId: calendarEventId ?? undefined,
    });

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

      <Button
        title={location ? 'Actualizar ubicación' : 'Agregar ubicación actual'}
        onPress={getTaskLocation}
      />

      {location && (
        <Text>
          Coordenadas: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </Text>
      )}

      <Button
        title={selectedContact ? 'Cambiar contacto' : 'Elegir contacto'}
        onPress={pickContact}
      />

      {selectedContact && (
        <Text>Contacto: {selectedContact.name}</Text>
      )}

      <Button
        title={calendarEventId ? 'Evento agregado al calendario' : 'Crear evento en calendario'}
        onPress={createCalendarEvent}
        disabled={calendarEventId !== null}
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
  preview: {
  width: 200,
  height: 150,
  alignSelf: 'center',
  marginVertical: 12,
  borderRadius: 8,
  },
});
