import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
//import { LinkOutlined } from '@ant-design/icons';
import { Settings as LayoutSettings, PageLoading } from '@ant-design/pro-components';
//import { SettingDrawer } from '@ant-design/pro-components';
//// import type { RuntimeConfig } from '@umijs/max';
import { RunTimeLayoutConfig, history, } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { get, currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import React from 'react';
import { ConfigProvider } from 'antd';
import Page403 from '@/pages/403';
import viVNIntl from 'antd/lib/locale/vi_VN';

//const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;

  // fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  religion?: {
    total: any;
    success: any;
    data: any;
  }
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      }) as API.CurrentUser;

      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };



  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser: any = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
      religion: await get(`${SERVER_URL_ACCOUNT}/dan-toc`)
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}


export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any) => {
  return {
    rightContentRender: () => <RightContent />,
    waterMarkProps: {
      content: '',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    unAccessible: <Page403 />,
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>Đang mở</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: false,

    childrenRender: (children: any) => {
      if (initialState?.loading) return <PageLoading />;
      return (

        <ConfigProvider locale={viVNIntl}>
          {children}
        </ConfigProvider>

      );

    },
    ...initialState?.settings,
  };
};

export const request = {
  ...errorConfig,
};
