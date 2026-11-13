import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskItemProps = {
  title: string;
  imageUri?: string;
  onDelete: () => void;
  location?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    id: string;
    name: string;
  };
};

export default function TaskItem({ title, onDelete, imageUri, location, contact }: TaskItemProps) {
  return (
    <View style={styles.taskRow}>
      <View style={styles.taskDetails}>
        <Text>{title}</Text>

        {location && (
          <Text style={styles.location}>
            Ubicación: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </Text>
        )}

        {contact && (
          <Text style={styles.contact}>
            Contacto: {contact.name}
          </Text>
        )}
      </View>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.taskImage}
        />
      )}
      <TouchableOpacity onPress={onDelete}>
        <Text>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  taskImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  taskDetails: {
    flex: 1,
  },
  location: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  contact: {
  marginTop: 4,
  fontSize: 12,
  color: '#555',
  },
});