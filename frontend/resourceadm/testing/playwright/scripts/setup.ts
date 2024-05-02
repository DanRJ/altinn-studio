﻿import path from 'path';
import fs from 'fs';
import os from 'os';

const giteaApi = require('../../../../../development/utils/gitea-api');

// Configure the dotenv to read form the .env file on root of monorepo.
require('dotenv').config({ path: path.resolve(__dirname, '../../../../../.env') });

const PLAYWRIGHT_RESOURCES_ORGANIZATION = 'ttd';
const PLAYWRIGHT_RESOURCES_REPO_NAME = 'ttd-resources';

const environment: Record<string, string> = {
  PLAYWRIGHT_TEST_BASE_URL: 'http://studio.localhost',
  PLAYWRIGHT_RESOURCES_ORGANIZATION: PLAYWRIGHT_RESOURCES_ORGANIZATION,
  PLAYWRIGHT_RESOURCES_REPO_NAME: PLAYWRIGHT_RESOURCES_REPO_NAME,
  PLAYWRIGHT_USER: process.env.GITEA_CYPRESS_USER,
  PLAYWRIGHT_PASS: process.env.GITEA_CYPRESS_PASS,
  GITEA_ACCESS_TOKEN: null,
};

const createGiteaAccessToken = async (): Promise<void> => {
  const result = await giteaApi({
    path: `/repos/api/v1/users/${process.env.GITEA_ADMIN_USER}/tokens`,
    method: 'POST',
    user: process.env.GITEA_ADMIN_USER,
    pass: process.env.GITEA_ADMIN_PASS,
    body: {
      name: 'setup.ts' + ' ' + Date.now(),
      scopes: [
        'write:activitypub',
        'write:admin',
        'write:issue',
        'write:misc',
        'write:notification',
        'write:organization',
        'write:package',
        'write:repository',
        'write:user',
      ],
    },
  });
  environment.GITEA_ACCESS_TOKEN = result.sha1;
};

const getEnvFilePath = (): string => {
  return path.resolve(__dirname, '..', '.env');
};

const mapEnvironment = () => {
  return Object.keys(environment)
    .map((key) => [key, environment[key]].join('='))
    .join(os.EOL);
};

const updateEnvironmentVars = async (): Promise<void> => {
  await createGiteaAccessToken();
  const filePath: string = getEnvFilePath();
  console.table(environment);
  fs.writeFileSync(filePath, mapEnvironment(), { encoding: 'utf8', flag: 'w' });
};

const createResourceRepo = async () => {
  await giteaApi({
    path: `/repos/api/v1/orgs/${PLAYWRIGHT_RESOURCES_ORGANIZATION}/repos`,
    method: 'POST',
    user: process.env.GITEA_ADMIN_USER,
    pass: process.env.GITEA_ADMIN_PASS,
    body: {
      name: PLAYWRIGHT_RESOURCES_REPO_NAME,
    },
  });
};

(async (): Promise<void> => {
  console.log('----- SETUP PLAYWRIGHT ENVIRONMENT VARIABLES STARTED -----');
  if (!environment.PLAYWRIGHT_USER || !environment.PLAYWRIGHT_PASS) {
    console.error('Ensure to run `node setup.js` within development folder on root.');
    return;
  }
  await updateEnvironmentVars();
  await createResourceRepo();
  console.log('----- SETUP PLAYWRIGHT ENVIRONMENT VARIABLES DONE -----');
})();
