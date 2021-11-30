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
import { history,Link  } from 'umi';
import { Input, Button, Tag, Space, Menu, Form } from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { DeploymentItem } from './data'
import { getDeploymentList } from './deployment.service'
import {useState,useRef} from 'react'
import DevlopmentFormentForm from '../devlopmentForm';


const { TabPane } = Tabs;

const AppInfo: React.FC = () => {
    var appId = history.location.query?.id
    var appName = history.location.query?.name
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<DeploymentItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '环境名称',
            dataIndex: 'nickname',
            render:(_,row) =>{
                return <span>{row.nickname}/{row.name}</span>
            }
        },
        {
            title: '集群',
            dataIndex: 'clusterName',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '部署状态',
            dataIndex: 'status',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '镜像(last)',
            dataIndex: 'lastImage',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '运行中/预期实例数',
            dataIndex: 'runningNumber',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '服务名/IP',
            dataIndex: 'serviceName',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '操作',
            valueType: 'option',
            render: (dom, record, _, action) => [
                <Button key="depoly" type="primary" danger onClick={()=>{
                    tableListDataSource[0].namespace = 'n'+Math.random()
                    setTableListDataSource(tableListDataSource)
                }}>部署应用</Button>
            ]
        },
    ]

    const [tableListDataSource, setTableListDataSource] = useState<DeploymentItem[]>([]);
    const [stepFormVisible, setStepFormVisible] = useState(false);
    return (
        <PageContainer title={ '应用: ' + appName } >
            <DevlopmentFormentForm visibleFunc={[stepFormVisible,setStepFormVisible]}/>
            <Tabs defaultActiveKey="1" size="large"  >
                <TabPane tab="部署环境" key="1">
                    <ProTable<DeploymentItem>
                    columns={columns}
                    rowKey="id"
                    dataSource={tableListDataSource}
                    actionRef={actionRef}
                    headerTitle="部署列表"
                    toolBarRender={() => [
                        <Button key='button' type="primary" icon={<PlusOutlined />} 
                        onClick={() => { 
                            setStepFormVisible(true)
                        }}>创建部署环境</Button>
                    ]}
                    request={async (params,sort) => {
                        params.appid = appId
                        console.log(params)
                        var datasource = await getDeploymentList(params,sort)
                        setTableListDataSource(datasource.data)
                        return datasource
                     }}
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