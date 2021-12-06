import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import React, { useEffect } from 'react';

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
import { Input, Button, Tag, Space, Menu, Form ,Typography } from 'antd';
import { PlusOutlined, EllipsisOutlined , LoadingOutlined } from '@ant-design/icons';
import {useState,useRef} from 'react'
import DevlopmentFormentForm from '../devlopmentForm';
import { DeploymentItem } from './data'
import { getDeploymentList , getPodList } from './deployment.service'

const { TabPane } = Tabs;
const { Text,Paragraph } = Typography;

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
            width:250,
            render:(_,row) =>{
                return <span>
                    <Paragraph><Link to={ '/resources/pods?app='+ row.name +'&cid=' + row.clusterId } >{row.name}</Link></Paragraph>
                    <Paragraph>{row.nickname}</Paragraph>
                </span>
            }
        },
        {
            title: '集群',
            dataIndex: 'clusterName',
            width:180,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            width:180,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '部署状态',
            dataIndex: 'status',
            width:110,
            hideInForm: true,
            hideInSearch: true,
            render:(_,row)=>{
                return <span>  {row.running >0?<Tag color='blue'>已部署</Tag>:<Tag color='red'>未部署</Tag> } </span>
            }
        },
        {
            title: '镜像(last)',
            dataIndex: 'lastImage',
            width:550,
            hideInForm: true,
            hideInSearch: true,
            render:(_,row)=>{
                return <span>  {row.lastImage!=''?row.lastImage:<LoadingOutlined /> } </span>
            }
        },
        {
            title: '运行中/预期实例数',
            dataIndex: 'runningNumber',
            width:180,
            hideInForm: true,
            hideInSearch: true,
            render:(_,row) => {
                return <span>  {row.running >0?row.running:<LoadingOutlined /> }
                        / {row.expected}</span>
            }
        },
        {
            title: '服务名/IP',
            dataIndex: 'serviceIP',
            hideInForm: true,
            hideInSearch: true,
            render:(dom,row) => {
                return (<span>
                    {row.serviceIP !='0.0.0.0'?<span>
                        <Paragraph copyable>{row.serviceName}</Paragraph> 
                        <Paragraph copyable>{row.serviceIP} </Paragraph>
                    </span>:<span><LoadingOutlined /> / {dom}</span> }
                </span> )
            }
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
        },]

    const [tableListDataSource, setTableListDataSource] = useState<DeploymentItem[]>([]);
    const [stepFormVisible, setStepFormVisible] = useState(false);

    return (
        <PageContainer title={ '应用: ' + appName }
            header={{ extra: [
                <Button key="1" onClick={()=>{ history.goBack() }}>返回上一级</Button>]
            }}>
            <Tabs defaultActiveKey="1" size="large"  >
                <TabPane tab="部署环境" key="1">
                    <ProTable<DeploymentItem>
                    columns={columns}
                    rowKey="id"
                    dataSource={tableListDataSource}
                    actionRef={actionRef}
                    headerTitle="部署列表"
                    pagination={false}
                    toolBarRender={() => [
                        <Button key='button' type="primary" icon={<PlusOutlined />} 
                        onClick={() => { 
                            setStepFormVisible(true)
                        }}>创建部署环境</Button>
                    ]}
                    //expandedRowRender={  }
                    request={async (params,sort) => {
                        params.appid = appId
                        console.log(params)
                        var datasource = await getDeploymentList(params,sort)

                        var asyncAll = []
                        for(var index=0 ; index <datasource.data.length ; index++ ) {
                            var item = datasource.data[index]
                            asyncAll.push(getPodList(item.name,2,index))
                        }
                        Promise.all(asyncAll).then(asyncPodList=>{
                            const list = [...datasource.data]
                            asyncPodList.forEach((podSet)=>{
                                if (podSet.data){
                                    list[podSet.index].lastImage = podSet.data.containers[0].image
                                    list[podSet.index].running = podSet.data.containers.length
                                    list[podSet.index].serviceIP = podSet.data.ip
                                }
                            })
                            setTimeout(()=>{
                                setTableListDataSource(list)
                            },200)
                           
                        })

                        setTableListDataSource(datasource.data)
                        return datasource
                     }}
                    ></ProTable>
                    <DevlopmentFormentForm visibleFunc={[stepFormVisible,setStepFormVisible]} appId={appId }appName={appName} tableRef={actionRef}/>
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