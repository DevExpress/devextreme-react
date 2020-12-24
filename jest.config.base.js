module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  testURL: 'http://localhost',
  testRegex: 'test\\.(jsx?|tsx?)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
};
