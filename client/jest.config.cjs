module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './client/test-results',  // Store test results for CircleCI
        outputName: 'junit.xml'
      }
    ]
  ]
};
