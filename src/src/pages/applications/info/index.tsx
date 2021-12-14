import { PageContainer } from '@ant-design/pro-layout';
import { Tabs,Layout } from 'antd';
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
import { history, Link } from 'umi';
import { Input, Button, Tag, Space, Menu, Form, Typography } from 'antd';
import { PlusOutlined, EllipsisOutlined, LoadingOutlined,CloudUploadOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react'
import DevlopmentFormentForm from '../devlopmentForm';
import { DeploymentItem } from './data'
import { getDeploymentList, getPodList } from './deployment.service'

const { TabPane } = Tabs;
const { Content } = Layout;

const { Text, Paragraph } = Typography;

const AppInfo: React.FC = () => {
    var appId = history.location.query?.id
    var appName = history.location.query?.name
    const actionRef = useRef<ActionType>();

    const [tableListDataSource, setTableListDataSource] = useState<DeploymentItem[]>([]);
    const [stepFormVisible, setStepFormVisible] = useState(false);
    const [stepFormEdit, setStepFormEdit] = useState(false);
    const [dpId, stepDpId] = useState<number>(0);

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
                <Button key="depoly" type="primary"  icon={<CloudUploadOutlined />} onClick={() => {
                    tableListDataSource[0].namespace = 'n' + Math.random()
                    setTableListDataSource(tableListDataSource)
                }}>部署应用</Button>,
                <Button key="edit" onClick={() => {
                    stepDpId(record.id)
                    setStepFormEdit(true)
                    setStepFormVisible(true)
                }}>编辑部署</Button>
            ]
        },]


    return (
        <PageContainer title={'应用: ' + appName} style={{background:'white'}}
            header={{
                extra: [
                    <Button key="1" onClick={() => { history.goBack() }}>返回上一级</Button>]
            }}>
            <Content>
            <Tabs defaultActiveKey="1" size="large" type="line" tabBarStyle={{ background:'white' }} >
                <TabPane tab="部署环境" key="1" >
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
                                    setStepFormEdit(false)
                                    setStepFormVisible(true)
                                }}>创建部署环境</Button>
                        ]}
                        //expandedRowRender={  }
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
                            setTableListDataSource(datasource.data)
                            return datasource
                        }}
                    ></ProTable>
                </TabPane>
                <TabPane tab="基本信息" key="2" >
                    Content of Tab Pane 2
                </TabPane>
                <TabPane tab="发布记录" key="3" >
                    Content of Tab Pane 4
                </TabPane>
                <TabPane tab="应用配置" key="4" disabled>
                    Content of Tab Pane 5
                </TabPane>
                <TabPane tab="应用监控" key="5" disabled>
                    Content of Tab Pane 6
                </TabPane>
            </Tabs>
         
            <DevlopmentFormentForm visibleFunc={[stepFormVisible, setStepFormVisible]}
                appId={appId} appName={appName} tableRef={actionRef} isEdit={stepFormEdit} id={dpId} />
            </Content>
        </PageContainer>
    )

}






export default AppInfo