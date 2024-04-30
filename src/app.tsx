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
import { getOption } from './services/utils';

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
  religion?:  GEN.Option[];
  tyBonus?:  GEN.Option[];
  nation?:  GEN.Option[];
  position?:  GEN.Option[];
  policyObject?:  GEN.Option[];
  academicLevel?:  GEN.Option[];
  memberFamily?:  GEN.Option[];
  secondaryEducation?:  GEN.Option[];
  professionalLevel?:  GEN.Option[];
  rankSalary?:  GEN.Option[];
  groupBlood?:  GEN.Option[];
  militaryRank?:  GEN.Option[];
  officialRank?:  GEN.Option[];
  civilServantRank?:  GEN.Option[];
  organization?:  GEN.Option[];
  positionJob?:  GEN.Option[];
  rankCommunistParty?:  GEN.Option[];
  relate?:  GEN.Option[];
  typeAllowance?:  GEN.Option[];
  typeSivilServant?:  GEN.Option[];
  typeOfficial?:  GEN.Option[];
  stateRank?:  GEN.Option[];
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
      religion: await getOption(`${SERVER_URL_ACCOUNT}/ton-giao?page=0&size=1000`, 'id', 'name'),
      tyBonus: await getOption(`${SERVER_URL_ACCOUNT}/hinh-thuc-khen-thuong`, 'id', 'name'),
      nation: await getOption(`${SERVER_URL_ACCOUNT}/dan-toc?page=0&size=1000`, 'id', 'name'),
      position: await getOption(`${SERVER_URL_ACCOUNT}/chuc-vu?page=0&size=1000`, 'id', 'name'),
      policyObject: await getOption(`${SERVER_URL_ACCOUNT}/doi-tuong-chinh-sach?page=0&size=1000`, 'id', 'name'),
      academicLevel: await getOption(`${SERVER_URL_ACCOUNT}/hoc-ham?page=0&size=1000`, 'id', 'name'),
      memberFamily: await getOption(`${SERVER_URL_ACCOUNT}/thanh-phan-gia-dinh?page=0&size=1000`, 'id', 'name'),
      secondaryEducation: await getOption(`${SERVER_URL_ACCOUNT}/trinh-do-giao-duc-pho-thong?page=0&size=1000`, 'id', 'name'),
      professionalLevel: await getOption(`${SERVER_URL_ACCOUNT}/trinh-do-chuyen-mon?page=0&size=1000`, 'id', 'name'),
      rankSalary: await getOption(`${SERVER_URL_ACCOUNT}/bac-luong?page=0&size=1000`, 'id', 'name'),
      groupBlood: await getOption(`${SERVER_URL_ACCOUNT}/nhom-mau?page=0&size=1000`, 'id', 'name'),
      militaryRank: await getOption(`${SERVER_URL_ACCOUNT}/cap-bac-loai-quan-ham-quan-doi?page=0&size=1000`, 'id', 'name'),
      officialRank: await getOption(`${SERVER_URL_ACCOUNT}/ngach-vien-chuc?page=0&size=1000`, 'id', 'name'),
      civilServantRank: await getOption(`${SERVER_URL_ACCOUNT}/ngach-cong-chuc?page=0&size=1000`, 'id', 'name'),
      organization: await getOption(`${SERVER_URL_ACCOUNT}/coquan-tochuc-donvi?page=0&size=1000`, 'id', 'name'),
      positionJob: await getOption(`${SERVER_URL_ACCOUNT}/vi-tri-viec-lam?page=0&size=1000`, 'id', 'name'),
      rankCommunistParty: await getOption(`${SERVER_URL_ACCOUNT}/chuc-danh-dang?page=0&size=1000`, 'id', 'name'),
      relate: await getOption(`${SERVER_URL_ACCOUNT}/moi-quan-he?page=0&size=1000`, 'id', 'name'),
      typeAllowance: await getOption(`${SERVER_URL_ACCOUNT}/loai-phu-cap?page=0&size=1000`, 'id', 'name'),
      typeSivilServant: await getOption(`${SERVER_URL_ACCOUNT}/loai-cong-chuc?page=0&size=1000`, 'id', 'name'),
      typeOfficial: await getOption(`${SERVER_URL_ACCOUNT}/loai-vien-chuc?page=0&size=1000`, 'id', 'name'),
      stateRank: await getOption(`${SERVER_URL_ACCOUNT}/danh-hieu-nha-nuoc-phong??page=0&size=1000`, 'id', 'name'),
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
