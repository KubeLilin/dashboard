import { PageContainer } from '@ant-design/pro-layout';
import { Tabs,Layout,Badge } from 'antd';
import React, { useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';

import { history, Link } from 'umi';
import { Button, Tag, Typography } from 'antd';
import { PlusOutlined, LoadingOutlined,CloudUploadOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react'
import DevlopmentFormentForm from '../devlopmentForm';
import { DeploymentItem } from './data'
import {  getDeploymentList, getPodList ,GetApplicationInfo,GetDeployLevelCounts } from './deployment.service'
import { BindCluster } from '../devlopmentForm/service'
import ExecDeployment from '../execDeployment';
import AppBuildList from '../builds'
import ReleaseRecord from '../releaseRecord';


const { TabPane } = Tabs;
const { Content } = Layout;
const { Paragraph } = Typography;

const AppInfo: React.FC = () => {
    var appId = history.location.query?.id
    var appName = history.location.query?.name
    var returnKey = history.location.query?.returnkey
    var defaultActiveKey = "1"
    if (returnKey) {
        defaultActiveKey = returnKey.toString()
    }


    const actionRef = useRef<ActionType>();
    const [tableListDataSource, setTableListDataSource] = useState<DeploymentItem[]>([]);
    const [stepFormVisible, setStepFormVisible] = useState(false);
    const [execFormVisible, setExecFormVisible] = useState(false);
    const [stepFormEdit, setStepFormEdit] = useState(false);
    const [dpId, stepDpId] = useState<number>(0);
    const [deployImage, setDeployImage] = useState<string|undefined>(undefined);
    const [activeKey, setActiveKey] = useState<string>('all');
    const [autoLoadPipelineData, setAutoLoadPipelineData] = useState<boolean>(false)
    const [levelTabs,levelTabsHandler] = useState<{label:string,value:string,count:number}[]>()
    const [onLoaded,_] = useState<boolean>()

    useEffect(()=>{
        GetDeployLevelCounts(Number(appId)).then(res=>{
            var allCount = 0
            res.data.forEach(val=> allCount += val.count)
            const data = [{label:'??????',value:'all',count:allCount}].concat(res.data)
            levelTabsHandler(data)
        })
    },[onLoaded])


    const columns: ProColumns<DeploymentItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title:'????????????',
            dataIndex:'clusterId',
            hideInTable:true,
            request:BindCluster
        },
        {
            title: '????????????',
            width: 320,
            dataIndex: 'nickname',
            render: (_, row) => {
                return <span>
                    <Paragraph><Link to={{ pathname:'/resources/pods' ,  search: '?did='+ row.id + '&app=' + row.name + '&cid=' + row.clusterId + '&ns=' + row.namespace ,  state:row } }  >{row.name}</Link></Paragraph>
                    <Paragraph>{row.nickname}</Paragraph>
                </span>
            }
        },
        {
            title: '????????????',
            dataIndex: 'level',
            hideInSearch: true,
            width: 140,
            valueEnum:{
                '????????????': { text: '????????????', status: 'Warning' },
                '????????????': { text: '????????????', status: 'Processing' },
                '???????????????': { text: '???????????????', status: 'Default' },
                '????????????': { text: '????????????', status: 'Success' },

            }
        },
        {
            title: '??????',
            dataIndex: 'clusterName',
            width: 180,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '????????????',
            dataIndex: 'namespace',
            width: 180,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '????????????',
            dataIndex: 'status',
            width: 110,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.running > 0 ? <Tag color='blue'>?????????</Tag> : <Tag color='red'>?????????</Tag>} </span>
            }
        },
        {
            title: '??????(last)',
            dataIndex: 'lastImage',
            width: 330,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.lastImage != '' ? row.lastImage : <LoadingOutlined />} </span>
            }
        },
        {
            title: '?????????',
            dataIndex: 'runningNumber',
            width: 80,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.running > -1 ? row.running : <LoadingOutlined />}   / {row.expected}</span>
            }
        },
        {
            title: '?????????/IP',
            dataIndex: 'serviceIP',
            width: 380,
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
            title: '??????',
            width: 200,
            valueType: 'option',
            render: (dom, record, _, action) => [
                <Button key="depoly"   icon={<CloudUploadOutlined />} onClick={() => {
                    tableListDataSource[0].namespace = 'n' + Math.random()
                    setTableListDataSource(tableListDataSource)
                    stepDpId(record.id)
                    setDeployImage(record.lastImage)
                    setExecFormVisible(true)
                }}>????????????</Button>,
                <Button key="edit" onClick={() => {
                    stepDpId(record.id)
                    setStepFormEdit(true)
                    setStepFormVisible(true)
                }}>????????????</Button>
            ]
        },]

    const renderBadge = (count: number, active = false) =>   {
        return (<Badge count={count} showZero={true} 
            style={{ marginTop: -2, marginLeft: 4, color: active ? '#1890FF' : '#722ed1',
            backgroundColor: active ? '#722ed1' : '#eee',}} />) }


    return (
        <PageContainer title={'??????: ' + appName} 
            breadcrumb={{ routes:[
                { path: '', breadcrumbName: '????????????' },
                { path: '', breadcrumbName: '????????????', }
            ] }}
            header={{
                extra: [
                    <Button key="1" onClick={() => { history.replace('/applications/apps') }}>???????????????</Button>]
            }}>
            <Content style={{ background:'white' }} > 
            <Tabs defaultActiveKey={defaultActiveKey} size="large" type="line" tabBarStyle={{ background:'white' ,paddingLeft:25 }} 
                onChange={(key)=>{
                    if(key=="3") {
                        setAutoLoadPipelineData(true)
                    } else {
                        setAutoLoadPipelineData(false)
                    }
                }}
            >
                <TabPane tab="????????????" key="1" >
                    <ProTable  columns={columns} rowKey="id" dataSource={tableListDataSource}
                        actionRef={actionRef}  cardProps={{  bordered: true }}
                        toolbar={{
                            style:{ fontSize: 14 },
                            menu:{
                                type:'tab',
                                activeKey: activeKey,
                                items:
                                    levelTabs?.map((v):{key:string,label:React.ReactNode}  =>{ 
                                        console.log(v)
                                        return ( { key:v.value,label: (<span>{v.label}{renderBadge(v.count,activeKey==v.label)}</span>) } )
                                    }),
                  
                                
                                onChange:(key) => { 
                                    setActiveKey(key as string)
                                    actionRef.current?.reload()
                                }
                            },
                            actions: [
                                <Button key='button' type="primary" icon={<PlusOutlined />}
                                    onClick={() => {
                                        setStepFormEdit(false)
                                        setStepFormVisible(true)
                                    }}>??????????????????</Button>
                            ]
                        }}
                        request={async (params, sort) => {
                            params.appid = appId
                            if (activeKey == 'all') {
                                params.profile = ''
                            } else {
                                params.profile = activeKey
                            }
                            var datasource = await getDeploymentList(params, sort)
                            
                            if (!datasource.data) {
                                setTableListDataSource([])
                                return []
                            }

                            var asyncAll = []
                            for (var index = 0; index < datasource.data.length; index++) {
                                var item = datasource.data[index]
                                asyncAll.push(getPodList(item.name, item.clusterId, index))
                            }
                            Promise.all(asyncAll).then(asyncPodList => {
                                const list = [...datasource.data]
                                console.log(asyncPodList)
                                asyncPodList.forEach((podSet) => {
                                    if (podSet.data && podSet.data.length > 0) {
                                        list[podSet.index].lastImage = podSet.data[0].containers[0].image
                                        list[podSet.index].running = podSet.data.length
                                        list[podSet.index].serviceIP = podSet.data[0].ip
                                    } else {
                                        list[podSet.index].lastImage = '???'
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
                <TabPane tab="????????????" key="2" >
                    <ProDescriptions request={ async () => GetApplicationInfo(Number(appId)) } style={{ padding:35, }} 
                        column={2}  bordered	
                        columns={[
                            { title: '????????????', dataIndex: 'tenantName'},
                            { title: '????????????', dataIndex: 'name' },
                            { title: '????????????',  dataIndex: 'level' },
                            { title: '????????????', dataIndex: 'language' },
                            { title: 'Git??????',  dataIndex: 'git' },
                            { title: '????????????', dataIndex: 'hub' },
                            { title: '????????????', dataIndex: 'labels' },
                            { title: '????????????', dataIndex: 'status',valueEnum:{ 1: "??????",0:"??????" } }
                        ]}/>
                </TabPane>
                <TabPane tab="???????????????" key="3">
                    <AppBuildList AppId={Number(appId)} AppName={String(appName)} AutoLoad={autoLoadPipelineData} />
                </TabPane>
                <TabPane tab="????????????" key="4" >
                   <ReleaseRecord AppId={Number(appId)}></ReleaseRecord>
                </TabPane>
                <TabPane tab="????????????" key="5" disabled>
                    Content of Tab Pane 5
                </TabPane>
                <TabPane tab="????????????" key="6" disabled>
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