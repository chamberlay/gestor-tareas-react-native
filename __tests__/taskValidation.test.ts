import { isTaskTitleValid } from '../taskValidation';

describe('isTaskTitleValid', () => {
  test('acepta un título con texto', () => {
    expect(isTaskTitleValid('Estudiar')).toBe(true);
  });

  test('rechaza un título vacío o con espacios', () => {
    expect(isTaskTitleValid('   ')).toBe(false);
  });
});