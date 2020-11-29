const esModules = [
  '@alshdavid/rxjs',
]

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,js,tsx,jsx}',
    '!src/**/index.{ts,js,tsx,jsx}',
    '!src/**/index.barrel.{ts,js,tsx,jsx}',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${esModules.join('|')})`,
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  }
};