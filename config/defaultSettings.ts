import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: false,
  pwa: false,
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRWbPGynlornWe69h8xKgQ9LnJWzhQ2GyBjpC6BNpv9g&s',
  iconfontUrl: '',
};

export default Settings;
