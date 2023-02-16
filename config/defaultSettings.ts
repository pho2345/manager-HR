import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: false,
  pwa: false,
  logo: 'https://aleger-server.process.vn/uploads/logo_orange_5c7f875e2d.png?updated_at=2023-02-16T09:43:35.788Z',
  iconfontUrl: '',
};

export default Settings;
