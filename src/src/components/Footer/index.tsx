import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} KubeLilin 技术团队出品 `}
      links={[
        {
          key: 'github',
          title: <GithubOutlined /> ,
          href: 'https://github.com/kubelilin',
          blankTarget: true,
        },
        {
          key: 'ban',
          title: '京ICP备2020044483号-2',
          href: 'https://beian.miit.gov.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};
