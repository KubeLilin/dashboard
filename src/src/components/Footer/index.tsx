import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} SGR技术团队出品`}
      links={[
        {
          key: 'platform-ui',
          title: 'SGR Platform Dashboard',
          href: 'https://github.com/yoyofxteam/sgr-platform-ui',
          blankTarget: true,
        },
        {
          key: 'platform-api',
          title: 'SGR Platform API',
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
