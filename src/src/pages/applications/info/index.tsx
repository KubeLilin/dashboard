import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import styles from './index.less';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, {
    DrawerForm,
    ProFormSelect,
    ProFormTextArea,
    ProFormInstance,
    ProFormText
} from '@ant-design/pro-form';
import { history,Link } from 'umi';
import { Input, Button, Tag, Space, Menu, Form } from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;


const AppInfo: React.FC = () => {
    var appId = history.location.query?.id
    var appName = history.location.query?.name

    return (
        <PageContainer title={ '应用: ' + appName } >
            <Tabs defaultActiveKey="1" size="large"  >
                <TabPane tab="部署环境" key="1">
                    <ProTable
                    //columns={columns}
                    rowKey="id"
                    //actionRef={actionRef}
                    headerTitle="部署列表"
                    toolBarRender={() => [
                        <Button key='button' icon={<PlusOutlined />} 
                        onClick={() => { 
                     
                        }}>创建部署环境</Button>
                    ]}
                    //request={getApps}
                    ></ProTable>
                </TabPane>
                <TabPane tab="基本信息" key="2">
                Content of Tab Pane 2
                </TabPane>
                <TabPane tab="镜像仓库" key="3">
                Content of Tab Pane 3
                </TabPane>
                <TabPane tab="发布记录" key="4">
                Content of Tab Pane 4
                </TabPane>
                <TabPane tab="应用配置" key="5">
                Content of Tab Pane 5
                </TabPane>
                <TabPane tab="应用监控" key="6">
                Content of Tab Pane 6
                </TabPane>
            </Tabs>
        </PageContainer>
    )
}







export default AppInfo