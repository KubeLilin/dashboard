import { PageContainer } from '@ant-design/pro-layout';
import { Tabs,Layout,Badge,Dropdown,Menu,Divider,Space,Modal ,message} from 'antd';
import React, { useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';

import { history, Link } from 'umi';
import { Button, Tag, Typography } from 'antd';
import { PlusOutlined, LoadingOutlined,CloudUploadOutlined, PushpinOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react'
import DevlopmentFormentForm from '../devlopmentForm';
import AdvancedDevlopment from '../advancedDeployment';

import { DeploymentItem } from './data'
import {  getDeploymentList, getPodList ,GetApplicationInfo,GetDeployLevelCounts,getRouterList,DeleteDeployment } from './deployment.service'
import { BindCluster } from '../devlopmentForm/service'
import ExecDeployment from '../execDeployment';
import AppBuildList from '../builds'
import ReleaseRecord from '../releaseRecord';
import Probe from '../probe';
import AppConifigMaps from '../appConfigmaps'
import BasicMonitor from '../basicmonitor'

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
    const [advancedDeployFormVisible, setAdvancedDeployFormVisible] = useState(false);


    const [execFormVisible, setExecFormVisible] = useState(false);
    const [probeFormVisible, setProbeFormVisible] = useState(false);
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
            const data = [{label:'全部',value:'all',count:allCount}].concat(res.data)
            levelTabsHandler(data)
        })
    },[onLoaded])

    const columns: ProColumns<DeploymentItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
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
            width: 280,
            render: (_, row) => {
                return <span>
                    <Paragraph><Link to={{ pathname:'/resources/pods' ,  search: '?did='+ row.id + '&app=' + row.name + '&cid=' + row.clusterId + '&ns=' + row.namespace ,  state:row } }  >{row.name}</Link></Paragraph>
                    <Paragraph><Tag color="yellow" style={{fontSize:13}}>{row.nickname}</Tag></Paragraph>
                </span>
            }
        },
        {
            title: '环境级别',
            dataIndex: 'level',
            hideInSearch: true,
            valueEnum:{
                '测试环境': { text: '测试环境', status: 'Warning' },
                '开发环境': { text: '开发环境', status: 'Processing' },
                '预发布环境': { text: '预发布环境', status: 'Default' },
                '生产环境': { text: '生产环境', status: 'Success' },

            },
            hideInTable:true,
        },
        {
            title: '实例数',
            width: 80,
            dataIndex: 'runningNumber',
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <span>  {row.running > -1 ? row.running : <LoadingOutlined />}   / {row.expected}</span>
            }
        },
        {
            title: '部署状态',
            dataIndex: 'status',
            width: 80,
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <Space> 
                            <span>  {row.running > 0 ? <Tag color='green' style={{fontSize:13}}>已部署</Tag> : <Tag color='red' style={{fontSize:13}}>未部署</Tag>} </span>
                            {row.ready?<Tag color='green' style={{fontSize:13}} >就绪</Tag>:<Tag color='red' style={{fontSize:13}}>未就绪</Tag>} 
                        </Space>
            }
        },
        {
            title: '运行时',
            dataIndex: 'runtime',
            width: 80,
            hideInForm: true,
            hideInSearch: true,
            render: (dom, row) => {
                return   row.runtime != ''? <Tag color='blue' style={{fontSize:13}}>{row.runtime}</Tag>:<Tag color='blue' style={{fontSize:13}}>None</Tag>
            }
        },
        {
            title: '集群',
            dataIndex: 'clusterName',
            hideInForm: true,
            hideInSearch: true,
            render: (dom, row) => {
                return (<span>
                        <Paragraph>集群: {row.clusterName}</Paragraph>
                        <Paragraph>命名空间: {row.namespace}</Paragraph>
                </span>)
            }
        },      
        {
            title: '镜像(last)',
            dataIndex: 'lastImage',
            hideInForm: true,
            hideInSearch: true,
            render: (_, row) => {
                return <Paragraph copyable>  {row.lastImage != '' ? row.lastImage : <LoadingOutlined />} </Paragraph>
            }
        },

        {
            title: '服务名 / ClusterIP',
            dataIndex: 'serviceIP',
            width: 400,
            hideInForm: true,
            hideInSearch: true,
            render: (dom, row) => {
                return (<span>
                    {row.serviceIP != '0.0.0.0' ? <span>
                        <Paragraph copyable>{row.serviceName}</Paragraph>
                        <Paragraph>ClusterIP: {row.serviceIP}:{row.servicePort}  </Paragraph>
                    </span> : <span>
                        <Paragraph copyable>Service Name:<LoadingOutlined /></Paragraph>
                        <Paragraph>ClusterIP: <LoadingOutlined /> </Paragraph>
                    </span>  }
                </span>)
            }
        },
        {
            title: '操作',
            width: 200,
            valueType: 'option',
            render: (dom, record, _, action) => {
                const menu = (
                    <Menu items={[
                        { key:1,icon:<CloudUploadOutlined /> ,label: '更新部署',onClick:()=>{
                                tableListDataSource[0].namespace = 'n' + Math.random()
                                setTableListDataSource(tableListDataSource)
                                stepDpId(record.id)
                                if (record.lastImage != '无') {
                                    setDeployImage(record.lastImage)
                                }
                               
                                setExecFormVisible(true)
                        }},
                        // { key:2,icon:<PushpinOutlined />,label: '生命周期',onClick:()=>{
                        //         stepDpId(record.id)
                        //         setProbeFormVisible(true)
                        // }},
                        { key:3,icon:<PushpinOutlined />,label: '删除部署环境',danger:true,onClick:()=>{
                            Modal.confirm({
                                title: 'Confirm',
                                icon: <ExclamationCircleOutlined />,
                                content: `确认要删除${record.name}部署环境吗?`,
                                okText: '确认',
                                cancelText: '取消',
                                onOk:async ()=>{
                                    const resp = await DeleteDeployment(record.id)
                                    if (resp.success) {
                                            message.success('删除部署成功');
                                    } else {
                                            message.error('删除部署失败！');
                                    }
                                    actionRef.current?.reload()
                                }
                              });
                        }},
                      ]} />
                  );

                return (
                <Dropdown.Button type="primary"  overlay={menu} 
                    onClick={() =>{
                        stepDpId(record.id)
                        setStepFormEdit(true)
                        setAdvancedDeployFormVisible(true)
                        //setStepFormVisible(true)
                    }}>编辑部署
                </Dropdown.Button>)
            }
            
        },]

    const renderBadge = (count: number, active = false) =>   {
        return (<Badge count={count} showZero={true} 
            style={{ marginTop: -2, marginLeft: 4, color: active ? '#1890FF' : '#722ed1',
            backgroundColor: active ? '#722ed1' : '#eee',}} />) }


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
            <Tabs defaultActiveKey={defaultActiveKey} size="large" type="line" tabBarStyle={{ paddingLeft:25 }} 
                onChange={(key)=>{
                    if(key=="3") {
                        setAutoLoadPipelineData(true)
                    } else {
                        setAutoLoadPipelineData(false)
                    }
                }}
            >
                <TabPane tab="部署环境" key="1" >
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


                                <Dropdown.Button type="primary"  overlay={ <Menu items={[
                                    { key:1,icon:<CloudUploadOutlined /> ,label: '创建部署(高级)',onClick:()=>{
                                        setStepFormEdit(false)
                                        setAdvancedDeployFormVisible(true)
                                    }},
                                   
                                    ]}/> }
                                    onClick={() =>{
                                        setStepFormEdit(false)
                                        setStepFormVisible(true)
                                    }}> 创建部署 </Dropdown.Button>,
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
                                        list[podSet.index].ready = podSet.data[0].podReadyCount == podSet.data[0].podCount
                                    } else {
                                        list[podSet.index].lastImage = '无'
                                        list[podSet.index].running = 0
                                        list[podSet.index].serviceName ='No Service'
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
                <TabPane tab="性能监控" key="6" >
                    <BasicMonitor AppId={Number(appId)} deployList={tableListDataSource}></BasicMonitor>
                </TabPane>
                <TabPane tab="详情&路由" key="2" >
                    <ProDescriptions title="应用详情" request={ async () => GetApplicationInfo(Number(appId)) } style={{ padding:35, }} 
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
                    <ProTable  rowKey={"id"} search={false} headerTitle="应用路由"
                        columns={ [
                        { dataIndex: 'id', title: 'ID', hideInSearch:true,},
                        { dataIndex: 'name', title: '路由名称',},
                        { dataIndex: 'host',title: '域名',},
                        { dataIndex: 'uri',title: '路径',hideInSearch:true,},
                        { dataIndex: 'desc',title: '描述',},
                        { dataIndex:'liveness',title:'探针', render: (dom, row) => (<a key={'livenesslink' + row.id} href={row.liveness} target="_blank">{dom}</a>)},
                        { dataIndex: 'nodes',title: '绑定负载',hideInSearch:true,},]}
                    request={ (params)=>{
                        params.appId = Number(appId)
                        return getRouterList(params)
                    } } 
                    toolBarRender={() => [
                        <Button key='button' icon={<PlusOutlined />} type="primary"
                            onClick={() => {
                              history.push('/networks/gateway')
                            }}>网关路由设置</Button>
                    ]}
                    ></ProTable>
                </TabPane>
                <TabPane tab="应用流水线" key="3">
                    <AppBuildList AppId={Number(appId)} AppName={String(appName)} AutoLoad={autoLoadPipelineData} />
                </TabPane>
                <TabPane tab="发布记录" key="4" >
                   <ReleaseRecord AppId={Number(appId)}></ReleaseRecord>
                </TabPane>
                <TabPane tab="服务监控配置 (Service Monitor)" key="7" >
                </TabPane>
                <TabPane tab="应用配置列表 (Configmap)" key="5" >
                    <AppConifigMaps  AppId={Number(appId)}></AppConifigMaps>
                </TabPane>
              
              

            </Tabs>
         
            <DevlopmentFormentForm visibleFunc={[stepFormVisible ,setStepFormVisible ]}
                appId={appId} appName={appName} tableRef={actionRef} isEdit={stepFormEdit} id={dpId} />

            <AdvancedDevlopment visibleFunc={[advancedDeployFormVisible, setAdvancedDeployFormVisible]}
                appId={appId} appName={appName} tableRef={actionRef} isEdit={stepFormEdit} id={dpId} />


            <ExecDeployment visibleFunc={[execFormVisible, setExecFormVisible]} 
              deploymentId={dpId} deployImage={deployImage} tableRef={null} ></ExecDeployment>

            <Probe visibleFunc={[probeFormVisible,setProbeFormVisible]} 
                deploymentId={dpId} tableRef={actionRef} ></Probe>
              
        </PageContainer>
    )

}






export default AppInfo