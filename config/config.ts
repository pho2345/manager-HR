// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import * as dotenv from 'dotenv';
dotenv.config();

const { REACT_APP_ENV = 'dev',SERVERURL } = process.env;

export default defineConfig({

  define: {
    SERVERURL: SERVERURL,
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

  title: 'Aleplay',
  layout: {
    locale: true,
    ...defaultSettings,
  },

  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  
  locale: {
  
    default: 'vi-cn',
     //default: 'en-US',
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
