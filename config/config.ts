// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import * as dotenv from 'dotenv';
dotenv.config();

const { REACT_APP_ENV = 'dev', SERVER_URL_ACCOUNT, SERVER_URL_CONFIG, SERVER_URL_PROFILE_DETAIL, ID_SAVE_INFO, SERVER_URL_PROFILE, FORMAT_DATE, PAGE_SIZE } = process.env;

export default defineConfig({

  define: {
    SERVER_URL_ACCOUNT: SERVER_URL_ACCOUNT,
    SERVER_URL_CONFIG: SERVER_URL_CONFIG,
    SERVER_URL_PROFILE_DETAIL: SERVER_URL_PROFILE_DETAIL,
    ID_SAVE_INFO: ID_SAVE_INFO,
    SERVER_URL_PROFILE: SERVER_URL_PROFILE,
    FORMAT_DATE: FORMAT_DATE,
    PAGE_SIZE: PAGE_SIZE
  },

  hash: true,


  routes,

  theme: {
  
    'root-entry-name': 'variable',
  },

  ignoreMomentLocale: true,

  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],

  fastRefresh: true,

  model: {},

  initialState: {},

  title: 'HR',
  layout: {
    locale: true,
    ...defaultSettings,
  },

  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  
  locale: {
  
    default: 'vi-VN',
    //  default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },

  antd: {},
 
  request: {},
 
  access: {},
 
  headScripts: [
    
    { src: '/scripts/loading.js', async: true },
  ],
 
  presets: ['umi-presets-pro'],

  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  // mfsu: {
  //   strategy: 'normal',
  // },
  mfsu: false,
  requestRecord: {},
});
