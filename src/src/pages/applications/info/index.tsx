import { PageContainer } from '@ant-design/pro-layout';
import { Tabs,Layout } from 'antd';
import React, { useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';

import { history, Link } from 'umi';
import { Button, Tag, Typography } from 'antd';
import { PlusOutlined, LoadingOutlined,CloudUploadOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react'
import DevlopmentFormentForm from '../devlopmentForm';
import { DeploymentItem } from './data'
import {  getDeploymentList, getPodList ,GetApplicationInfo } from './deployment.service'
import { BindCluster } from '../devlopmentForm/service'
import ExecDeployment from '../execDeployment';
import AppBuildList from '../builds'


const { TabPane } = Tabs;
const { Content } = Layout;
const { Paragraph } = Typography;

const AppInfo: React.FC = () => {
    var appId = history.location.query?.id
    var appName = history.location.query?.name
    const actionRef = useRef<ActionType>();

    const [tableListDataSource, setTableListDataSource] = useState<DeploymentItem[]>([]);
    const [stepFormVisible, setStepFormVisible] = useState(false);
    const [execFormVisible, setExecFormVisible] = useState(false);
    const [stepFormEdit, setStepFormEdit] = useState(false);
    const [dpId, stepDpId] = useState<number>(0);
    const [deployImage, setDeployImage] = useState<string|undefined>(undefined);

    const [appbuildOnloaded, setAppbuildOnloaded] = useState(false);

    const columns: ProColumns<DeploymentItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title:'可用集群',
            dataIndex:'clusterId',
            hideInTable:true,
            request:BindCluster
        },
        {
            title: '环境名称',
            dataIndex: 'nickname',
            width: 250,
            render: (_, row) => {
                return <span>
                    <Paragraph><Link to={{ pathname:'/resources/pods' ,  search: '?did='+ row.id + '&app=' + row.name + '&cid=' + row.clusterId + '&ns=' + row.namespace ,  state:row } }  >{row.name}</Link></Paragraph>
                    <Paragraph>{row.nickname}</Paragraph>
                </span>
            }
        },
        {
            title: '集群',
            dataIndex: 'clusterName',
            width: 180,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            width: 180,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '部署状态',
            dataIndex: 'status',
            width: 110,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.running > 0 ? <Tag color='blue'>已部署</Tag> : <Tag color='red'>未部署</Tag>} </span>
            }
        },
        {
            title: '镜像(last)',
            dataIndex: 'lastImage',
            width: 450,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.lastImage != '' ? row.lastImage : <LoadingOutlined />} </span>
            }
        },
        {
            title: '运行中/预期实例数',
            dataIndex: 'runningNumber',
            width: 180,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.running > -1 ? row.running : <LoadingOutlined />}   / {row.expected}</span>
            }
        },
        {
            title: '服务名/IP',
            dataIndex: 'serviceIP',
            width: 350,
            hideInForm: true,
            hideInSearch: true,
            render: (dom, row) => {
                return (<span>
                    {row.serviceIP != '0.0.0.0' ? <span>
                        <Paragraph copyable>{row.serviceName}</Paragraph>
                        <Paragraph copyable>{row.serviceIP} </Paragraph>
                    </span> : <span><LoadingOutlined /> / {dom}</span>}
                </span>)
            }
        },
        {
            title: '操作',
            valueType: 'option',
            render: (dom, record, _, action) => [
                <Button key="depoly"   icon={<CloudUploadOutlined />} onClick={() => {
                    tableListDataSource[0].namespace = 'n' + Math.random()
                    setTableListDataSource(tableListDataSource)
                    stepDpId(record.id)
                    setDeployImage(record.lastImage)
                    setExecFormVisible(true)
                }}>部署应用</Button>,
                <Button key="edit" onClick={() => {
                    stepDpId(record.id)
                    setStepFormEdit(true)
                    setStepFormVisible(true)
                }}>编辑部署</Button>
            ]
        },]


    return (
        <PageContainer title={'应用: ' + appName} 
            breadcrumb={{ routes:[
                { path: '', breadcrumbName: '应用中心' },
                { path: '', breadcrumbName: '应用管理', }
            ] }}
            header={{
                extra: [
                    <Button key="1" onClick={() => { history.goBack() }}>返回上一级</Button>]
            }}>
            <Content style={{ background:'white' }} > 
            <Tabs defaultActiveKey="1" size="large" type="line" tabBarStyle={{ background:'white' ,paddingLeft:25 }}  >
                <TabPane tab="部署环境" key="1" >
                    <ProTable  columns={columns} rowKey="id" dataSource={tableListDataSource}
                        actionRef={actionRef} headerTitle="部署列表"
                        toolBarRender={() => [
                            <Button key='button' type="primary" icon={<PlusOutlined />}
                                onClick={() => {
                                    setStepFormEdit(false)
                                    setStepFormVisible(true)
                                }}>创建部署环境</Button>
                        ]}
                        request={async (params, sort) => {
                            params.appid = appId
                            console.log(params)
                            var datasource = await getDeploymentList(params, sort)

                            var asyncAll = []
                            for (var index = 0; index < datasource.data.length; index++) {
                                var item = datasource.data[index]
                                asyncAll.push(getPodList(item.name, item.clusterId, index))
                            }
                            Promise.all(asyncAll).then(asyncPodList => {
                                const list = [...datasource.data]
                                console.log(asyncPodList)
                                asyncPodList.forEach((podSet) => {
                                    if (podSet.data) {
                                        list[podSet.index].lastImage = podSet.data[0].containers[0].image
                                        list[podSet.index].running = podSet.data.length
                                        list[podSet.index].serviceIP = podSet.data[0].ip
                                    } else {
                                        list[podSet.index].lastImage = '无'
                                        list[podSet.index].running = 0
                                        list[podSet.index].serviceName ='no services'
                                        list[podSet.index].serviceIP = 'x.x.x.x'
                                    }
                                })
                                setTimeout(() => {
                                    setTableListDataSource(list)
                                }, 200)
                            })
                            console.log(datasource)
                            setTableListDataSource(datasource.data)
                            return datasource
                        }}
                    ></ProTable>
                </TabPane>
                <TabPane tab="基本信息" key="2" >
                    <ProDescriptions request={ async () => GetApplicationInfo(Number(appId)) } style={{ padding:35, }} 
                        column={2}  bordered	
                        columns={[
                            { title: '所属团队', dataIndex: 'tenantName'},
                            { title: '应用名称', dataIndex: 'name' },
                            { title: '应用级别',  dataIndex: 'level' },
                            { title: '应用语言', dataIndex: 'language' },
                            { title: 'Git仓库',  dataIndex: 'git' },
                            { title: '镜像仓库', dataIndex: 'hub' },
                            { title: '应用标签', dataIndex: 'labels' },
                            { title: '应用状态', dataIndex: 'status',valueEnum:{ 1: "生效",0:"失效" } }
                        ]}/>
                </TabPane>
                <TabPane tab="应用构建" key="3" >
                    <AppBuildList AppId={Number(appId)} />
                </TabPane>
                <TabPane tab="发布记录" key="4" >
                    Content of Tab Pane 4
                </TabPane>
                <TabPane tab="应用配置" key="5" disabled>
                    Content of Tab Pane 5
                </TabPane>
                <TabPane tab="应用监控" key="6" disabled>
                    Content of Tab Pane 6
                </TabPane>
            </Tabs>
         
            <DevlopmentFormentForm visibleFunc={[stepFormVisible, setStepFormVisible]}
                appId={appId} appName={appName} tableRef={actionRef} isEdit={stepFormEdit} id={dpId} />

            <ExecDeployment visibleFunc={[execFormVisible, setExecFormVisible]} 
              deploymentId={dpId} deployImage={deployImage} tableRef={null} ></ExecDeployment>
              
            </Content>
        </PageContainer>
    )

}






export default AppInfo