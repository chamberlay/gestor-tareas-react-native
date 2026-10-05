import { fireEvent, render, screen } from '@testing-library/react-native';
import TaskItem from '../components/TaskItem';

describe('TaskItem', () => {
  test('muestra el título de la tarea', async () => {
    await render(<TaskItem title="Estudiar" onDelete={jest.fn()} />);

    expect(screen.getByText('Estudiar')).toBeTruthy();
  });

  test('llama a onDelete al tocar Eliminar', async () => {
    const onDelete = jest.fn();

    await render(<TaskItem title="Estudiar" onDelete={onDelete} />);
    await fireEvent.press(screen.getByText('Eliminar'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});