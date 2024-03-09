import fs from 'fs';

const unit = (app, moduleNameMapper) => ({
  path: `./apps/${app}/test/jest.json`,
  config: {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../../..',
    testRegex: `apps/${app}/test/.*\\.spec\\.ts$`,
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: [`<rootDir>/apps/${app}`, '<rootDir>/libs/'],
    moduleNameMapper,
  },
});

const e2e = (app, moduleNameMapper) => ({
  path: `./apps/${app}/test/jest-e2e.json`,
  config: {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../../..',
    testRegex: `apps/${app}/test/.*\\.e2e-spec\\.ts$`,
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: [`<rootDir>/apps/${app}`, '<rootDir>/libs/'],
    moduleNameMapper,
  },
});

const overwrite = (target) => {
  const current = JSON.stringify(target.config, null, 2);

  if (fs.existsSync(target.path)) {
    const before = fs.readFileSync(target.path).toString('utf-8');

    if (current === before) {
      return;
    }
  }

  fs.writeFileSync(target.path, current, 'utf-8');
};

const initialize = () => {
  const moduleNameMapper = {};

  const ts = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf-8').toString());
  const alias = Object.entries(ts.compilerOptions.paths);

  for (const [k, v] of alias) {
    const key = `^${k.replace('/*', '')}(|/.*)$`;
    const value = `<rootDir>/${v.shift().replace('/*', '')}/$1`;

    moduleNameMapper[key] = value;
  }

  const apps = fs.readdirSync('./apps');

  for (const app of apps) {
    overwrite(unit(app, moduleNameMapper));
    overwrite(e2e(app, moduleNameMapper));
  }
};

initialize();
