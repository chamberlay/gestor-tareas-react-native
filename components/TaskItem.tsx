import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskItemProps = {
  title: string;
  imageUri?: string;
  onDelete: () => void;
};

export default function TaskItem({ title, onDelete, imageUri }: TaskItemProps) {
  return (
    <View style={styles.taskRow}>
      <Text>{title}</Text>
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
});