const themeService = require('../../../src/services/theme.services');
const { Theme } = require('../../../src/models');

jest.mock('../../../src/models/theme.model', () => ({
  // Mock de la méthode find
  find: jest.fn(),
  // Mock de la méthode create
  findById: jest.fn(),
}));

describe('theme service - get', () => {
  test('should be throw error if id is null or nan', async () => {
    // arrange

    //act
    const callMethod = async () => await themeService.get(null);

    //assert
    expect(Theme.findById).not.toHaveBeenCalled();
    await expect(callMethod).rejects.toThrow(
      'The parameter must cannot be empty'
    );
  });

  test('should be return null object because id is not exist', async () => {
    // arrange
    Theme.findById.mockReturnValue(null);

    //act
    const result = await themeService.get(-1);

    //assert
    expect(Theme.findById).toHaveBeenCalledWith(-1);
    expect(result).toEqual(null);
  });

  test('should be return one theme', async () => {
    // arrange
    const id = 1;
    const theme = {
      _id: id,
      name: 'Test Theme',
    };
    Theme.findById.mockReturnValue(theme);

    //act
    const result = await themeService.get(id);

    //assert
    expect(Theme.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(theme);
  });
});

describe('theme service - get all', () => {
  test('should be return all theme', async () => {
    // arrange
    const themes = [
      { _id: '1', name: 'Test theme 1' },
      { _id: '2', name: 'Test theme 2' },
    ];
    Theme.find.mockReturnValue(themes);

    //act
    const result = await themeService.getAll();

    //assert
    expect(Theme.find).toHaveBeenCalled();
    expect(result).toEqual([
      { _id: '1', name: 'Test theme 1' },
      { _id: '2', name: 'Test theme 2' },
    ]);
  });
});
