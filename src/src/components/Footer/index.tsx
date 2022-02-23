import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} KubeLilin 技术团队出品`}
      links={[
        {
          key: 'platform-ui',
          title: 'KubeLilin Dashboard',
          href: 'https://github.com/yoyofxteam/sgr-platform-ui',
          blankTarget: true,
        },
        {
          key: 'platform-api',
          title: 'KubeLilin API Server',
          href: 'https://github.com/yoyofxteam/sgr-platform-api',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined /> ,
          href: 'https://github.com/yoyofx/yoyogo',
          blankTarget: true,
        },
      ]}
    />
  );
};
