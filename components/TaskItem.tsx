import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskItemProps = {
  title: string;
  onDelete: () => void;
};

export default function TaskItem({ title, onDelete }: TaskItemProps) {
  return (
    <View style={styles.taskRow}>
      <Text>{title}</Text>
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
});