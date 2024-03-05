import fs from 'fs';

const path = process.env.PWD;

let rootPath = path;
let jestPath = path;

if (path.endsWith('/test')) {
  rootPath = rootPath.replace('/test', '');
} else {
  jestPath += '/test';
}

const tsConfigPath = rootPath + '/tsconfig.json';
const jestConfigPath = jestPath + '/jest.json';
const jestE2EConfigPath = jestPath + '/jest-e2e.json';

const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath).toString('utf-8'));
const jestUnitConfig = JSON.parse(fs.readFileSync(jestConfigPath).toString('utf-8'));
const jestE2eConfig = JSON.parse(fs.readFileSync(jestE2EConfigPath).toString('utf-8'));

const moduleNameMapper = { 'src/(.*)$': '<rootDir>/src/$1' };

for (const [alias, paths] of Object.entries(tsConfig.compilerOptions.paths)) {
  moduleNameMapper[`^${alias.replace('/*', '/(.*)$')}`] = `<rootDir>/${paths[0].replace('/*', '/$1')}`;
}

jestUnitConfig.moduleNameMapper = moduleNameMapper;
jestE2eConfig.moduleNameMapper = moduleNameMapper;

fs.writeFileSync(jestConfigPath, JSON.stringify(jestUnitConfig, null, 2), 'utf-8');
fs.writeFileSync(jestE2EConfigPath, JSON.stringify(jestE2eConfig, null, 2), 'utf-8');
