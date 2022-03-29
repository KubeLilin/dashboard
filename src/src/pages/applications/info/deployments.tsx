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
import { executeDeployment, getDeploymentList, getPodList } from './deployment.service'
import { GetDeploymentLevels } from '../devlopmentForm/service'
import ExecDeployment from '../execDeployment';

const { TabPane } = Tabs;
const { Content } = Layout;

const { Text, Paragraph } = Typography;

const Deployments: React.FC = () => {
    var appId = history.location.query?.id
    var appName = history.location.query?.name
    const actionRef = useRef<ActionType>();

    const [tableListDataSource, setTableListDataSource] = useState<DeploymentItem[]>([]);
    const [stepFormVisible, setStepFormVisible] = useState(false);
    const [execFormVisible, setExecFormVisible] = useState(false);
    const [stepFormEdit, setStepFormEdit] = useState(false);
    const [dpId, stepDpId] = useState<number>(0);
    const [deployImage, setDeployImage] = useState<string|undefined>(undefined);


    const columns: ProColumns<DeploymentItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '环境级别',
            width: 200,
            dataIndex: 'profile',
            hideInTable:true,
            request:GetDeploymentLevels
        },
        {
            title: '环境名称',
            dataIndex: 'nickname',
            width: 320,
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
            title: '应用',
            dataIndex: 'appName',
            width: 180,
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
        <PageContainer title="部署环境"  >
            <Content>
                    <ProTable<DeploymentItem>
                        columns={columns}
                        rowKey="id"
                        dataSource={tableListDataSource}
                        actionRef={actionRef}
                        headerTitle="环境列表"
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
                
                <DevlopmentFormentForm visibleFunc={[stepFormVisible, setStepFormVisible]}
                    appId={appId} appName={appName} tableRef={actionRef} isEdit={stepFormEdit} id={dpId} />

                <ExecDeployment visibleFunc={[execFormVisible, setExecFormVisible]} 
                    deploymentId={dpId} deployImage={deployImage}  tableRef={null} />
            </Content>
        </PageContainer>
    )

}






export default Deployments