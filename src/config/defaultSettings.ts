import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  primaryColor: '#FAAD14',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  headerHeight:43,
  title: 'KubeLilin',
  pwa: false,
  logo: '/icon.svg',
  iconfontUrl: '',
  menu: {
    locale: false,
    defaultOpenAll: true,
  }
};

export default Settings;