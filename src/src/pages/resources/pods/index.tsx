
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { history, Link,useModel } from 'umi';
import { PodItem, ContainerItem, podLogsRequest } from './data';
import { Table,Tabs, Button, Space, Tooltip,Layout, Tag, Modal, InputNumber, message, Popconfirm, Select, Switch, notification, Radio } from 'antd'

import { getPodList, getNamespaceList, setReplicasByDeployId, 
    GetDeploymentFormInfo, destroyPod, getPodLogs, getYaml , 
    DeleteDeploymentWithOutDB,getServiceInfo , getGatewayRouterList } from './service'

import React, { useState, useRef, useEffect } from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CloudUploadOutlined,ExpandAltOutlined,LoadingOutlined, ReloadOutlined ,SearchOutlined } from '@ant-design/icons';
import moment from 'moment'; 
import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import './monokai-bright.css'
import 'codemirror/theme/ayu-dark.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import EventListComponent from './events';
import WebTerminal from './terminal';
import ExecDeployment from '@/pages/applications/execDeployment';


const { TabPane } = Tabs;
const { Option } = Select;
const { Content } = Layout;

const Pods: React.FC = (props) => {
    const { initialState } = useModel('@@initialState');
    const currentUser =  initialState?.currentUser

    const [time, setTime] = useState(() => Date.now());
    const [polling, setPolling] = useState<number | undefined>(undefined);
    const [visableScaleModal, setVisableScaleModal] = useState<boolean>(false);
    const formScaleModalRef = useRef<ProFormInstance>();
    const [visibleTerminal, setVisibleTerminal] = useState(false);
    const [visibleWebConsole, setVisibleWebConsole] = useState(false);
    const [terminalShellType,terminalShellTypeHandler] = useState<string>('/bin/bash');


    const [podListState, handePodListState] = useState<PodItem[]>([]);
    const [containerListState, handeContainerListState] = useState<ContainerItem[]>([]);
    const [selectedNamespace, setSelectedNamespace] = useState<string | undefined>(undefined);
    const [selectedPodName, setSelectedPodName] = useState<string | undefined>(undefined);
    const [selectedContainerName, setSelectedContainerName] = useState<string | undefined>(undefined);
    const [selectedLines, setSelectedLines] = useState<number>(100);
    const [autoLogs, setAutoLogs] = useState<boolean>(false)
    const [logContent, setLogContent] = useState<string[]>([]);
    const [yamlContent, setyamlContent] = useState<string>("");
    const [execFormVisible, setExecFormVisible] = useState(false);
    const [dpId, stepDpId] = useState<number>(0);
    var text1: any = undefined;


    var deploymentInfo:any = history.location.state
    console.log(deploymentInfo)
    var deployId = history.location.query?.did
    var namespace = history.location.query?.ns
    var appName = history.location.query?.app
    var clusterId = history.location.query?.cid
    var node = history.location.query?.node
    var did = 0
    if (deployId) {
        did = Number(deployId)
    }
    if (clusterId == undefined && (node == undefined || appName == undefined)) {
        history.goBack()
    }

   

    function bindYaml() {
        let res = getYaml(deployId,Number(clusterId),namespace,appName)
        res.then((x) => {
            if (x?.success) {
                setyamlContent(x.data)
            } else {
                notification.open({
                    message: '获取Pod Yaml失败',
                    description: x?.message,
                });
            }
        })
    }

    const podColumns: ProColumns<PodItem>[] = [
        {
            title: '实例名称',
            dataIndex: 'name',
            search: false,
            render: (dom, _) => {
                return <span style={{ color: 'blueviolet' }}>{dom}</span>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            search: false,
            render: (dom, row) => {
                if (row.status == 'Running') {
                    return <span style={{ color: 'green' }}>{dom}</span>
                }
                return <span style={{ color: 'red' }}>{dom}</span>
            }
        },
        {
            title: '实例IP',
            dataIndex: 'ip',
            search: false,
            render: (dom, _) => {
                return <span style={{ color: 'blueviolet' }}>{dom}</span>
            }
        },
        {
            title: '实例所在节点IP',
            dataIndex: 'hostIP',
            search: false,
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            valueType: 'select',
            request: async () => {
                var namespaces = [{ label: '全部', value: '' }]
                var ns = await getNamespaceList(String(clusterId))
                namespaces.push(...ns)
                return namespaces
            }
        },
        {
            title: '重启次数',
            dataIndex: 'restarts',
            search: false,
            render: (dom, _) => {
                return <span>{dom} 次</span>
            }
        },
        {
            title: '容器数',
            search: false,
            render: (_, row) => {
                return <span>{row.containers.length}个</span>
            }
        },
        {
            title: '性能(使用率)',
            search: false,
            render: (_, row) => {
                return <span style={{color:'green'}}>CPU:{(row.usage.cpu * 1000).toFixed(1)}m / 内存:{(row.usage.memory / 1024/1024).toFixed(1)} Mi</span>
            }
        },
        {
            title: '创建时间',
            search: false,
            render:(_,row)=>{
                const seconds = Math.round(Number(row.age) / 1000/1000/1000)
                var hh =  Math.round(seconds/3600)
                if (hh >1) { hh = hh-1 }
                const mm = Math.round((seconds%3600)/60)
                const ss = Math.round(seconds%60)
                return <Tooltip title={  (hh>0?hh+'小时':'') +  (mm>0?mm+'分钟':'') + (ss>0?ss+'秒':'0s')}><a href='#'>{row.startTime}</a> </Tooltip> 
            },
        },
        {
            title: '操作',
            dataIndex: 'x',
            valueType: 'option',
            render: (_, record) => {
                return [
                    <Popconfirm key="confirm_delete" title="确定要销毁实例吗?"
                        onConfirm={async () => {
                            const resp = await destroyPod({
                                clusterId: Number(clusterId),
                                namespace: record.namespace,
                                podName: record.name
                            })
                            if (resp.success) {
                                message.success("销毁操作成功")
                                setPolling(1000)
                            } else { message.error("销毁操作失败") }
                        }}>
                        <a key="delete">销毁重建</a></Popconfirm>,
                    <a key="remote" onClick={()=>{
                        setSelectedPodName(record.name)
                        handeContainerListState(record.containers)
                        setSelectedNamespace(record.namespace)
                        setVisibleWebConsole(true)
                    }}>远程登录</a>
                ]
            },
        },

    ]

    const expandedRowRender = (podItem: PodItem) => {
        return (
            <ProTable
                columns={[
                    { title: '容器名称', dataIndex: 'name', key: 'name' },
                    { title: '容器ID', dataIndex: 'id', key: 'id' },
                    { title: '镜像版本号', dataIndex: 'image', key: 'image' },
                    //   { title: 'CPU Request', dataIndex: 'cpuRequest', key: 'cpuRequest' },
                    //   { title: 'CPU Limit', dataIndex: 'cpuLimit', key: 'cpuLimit' },
                    //   { title: '内存 Request', dataIndex: 'memoryRequest', key: 'memoryRequest' },
                    //   { title: '内存 Limit', dataIndex: 'memoryLimit', key: 'memoryLimit' },
                    { title: '重启次数', dataIndex: 'restartCount', key: 'restartCount' },
                    {
                        title: '状态', dataIndex: 'status', key: 'status',
                        render: (_, row) => {
                            return [
                                <Tooltip title={row.state} color="geekblue" key="status">
                                    <Space direction="vertical">
                                        <span>Readly:  {row.ready ? <Tag color="geekblue">{String(row.ready)}</Tag> : <Tag color="#f50">String(row.ready)</Tag>}</span>
                                        <span>Started:  {row.started ? <Tag color="geekblue">{String(row.started)}</Tag> : <Tag color="#f50">String(row.started)</Tag>}</span>
                                    </Space>
                                </Tooltip>
                            ]
                        }
                    },
                ]}
                rowKey="id"
                headerTitle={false}
                search={false}
                options={false}
                dataSource={podItem.containers}
                pagination={false}
            />
        );
    };

    console.log(clusterId)
    console.log(node)
    var pageTitle = "实例管理     "
    var breadcrumb = [
        { path: '', breadcrumbName: '资源中心' },
        { path: '', breadcrumbName: '', }]
    if (appName) {
        breadcrumb[0] = { path: '', breadcrumbName: '应用中心' }
        breadcrumb[1] = { path: '', breadcrumbName: '实例管理' }
        pageTitle = pageTitle + ' - 部署环境:  ' + appName
    } else if (node) {
        breadcrumb[0] = { path: '', breadcrumbName: '资源中心' }
        breadcrumb[1] = { path: '', breadcrumbName: '节点管理' }

    }

    const bindLogsFunc = async () => {
        const req: podLogsRequest = {
            clusterId: Number(clusterId), namespace: namespace?.toString(),
            podName: selectedPodName, containerName: selectedContainerName, lines: selectedLines
        }
        console.log(req)
        if(!req.podName){
            return 
        }
        var lines = await getPodLogs(req)
        setLogContent(lines)
    }

    useEffect(() => {
        if (selectedPodName && selectedContainerName && namespace) {
            bindLogsFunc()
            var id: NodeJS.Timeout
            if (autoLogs) {
                id = setInterval(bindLogsFunc, 2000)
            }
            return () => { clearInterval(id) }
        }
    }, [selectedPodName, selectedContainerName, selectedLines, autoLogs])

    return (
        <PageContainer title={pageTitle}
            header={{
                breadcrumb: { routes: breadcrumb },
                extra: [<Button key="1" onClick={() => {
                    history.goBack()
                }}>返回上一级</Button>,],
            }}
        >
            <Content   > 
            <Tabs defaultActiveKey="1" size="large" type="line" tabBarStyle={{  paddingLeft:25 }}
                onChange={(e) => {
                    switch(e){
                        case "2":
                            console.log(podListState)
                            if (podListState.length > 0) {
                                handePodListState(podListState)
                                handeContainerListState(podListState[0].containers)
                                setSelectedPodName(podListState[0].name)
                                setSelectedContainerName(podListState[0].containers[0].name)
                            }
                            break;
                        case "4":
                            bindYaml()
                            setAutoLogs(false)
                            break
                        default:
                            setAutoLogs(false)
                    }
                }}>
                <TabPane tab="实例管理" key="1" >
                    <ProTable<PodItem>
                        rowKey={record => record.name}
                        columns={podColumns}
                        dateFormatter="string"
                        pagination={{ pageSize: 1000 }}
                        headerTitle={`实例列表 - 上次更新时间：${moment(time).format('HH:mm:ss')}`}
                        expandable={{ expandedRowRender }}
                        request={async (params, sort) => {
                            params.cid = clusterId
                            if(!params.namespace && namespace) {
                                params.namespace = namespace
                            }
                            if (appName) { params.app = appName } 
                            else { params.node = node }
                            var podsData = await getPodList(params, sort)
                            handePodListState(podsData.data)
                            setTime(Date.now());
                            return podsData
                        }}
                        polling={polling || undefined}
                        toolBarRender={() => [
                            <Button key='button' type="primary" icon={<CloudUploadOutlined />} style={{ display: did > 0 ? 'block' : 'none' }}
                                onClick={() => { 
                                    stepDpId(Number(deployId)) 
                                    setExecFormVisible(true) 
                                }}>部署应用</Button>,
                            <Button key='button' type="primary" icon={<ExpandAltOutlined />} style={{ display: did > 0 ? 'block' : 'none' }}
                                onClick={async () => {
                                    const hide = message.loading('正在加载部署信息...', 0);
                                    const resp = await GetDeploymentFormInfo(did)
                                    var replicas = 1
                                    if (resp.success) {
                                        replicas = resp.data.replicas
                                        deploymentInfo.expected = replicas
                                        setVisableScaleModal(true)
                                        setTimeout(() => {
                                            formScaleModalRef.current?.setFieldsValue({ replicas: replicas })
                                        }, 200)
                                    } else {
                                        message.error('实例伸缩失败,请重试！');
                                    }
                                    hide()
                                }}>伸缩实例</Button>,
                            <Popconfirm title="确定要清空实例吗?"
                                onConfirm={async () => {
                                    const resp = await setReplicasByDeployId(did, 0)
                                    setPolling(1000);
                                    if (resp.success) {
                                        message.success('清空实例成功');
                                    } else {
                                        message.error('清空实例失败！');
                                    }
                                }}> <Button key='button' danger style={{ display: did > 0 ? 'block' : 'none' }}>清空实例</Button></Popconfirm>,
                                <Popconfirm title="确定要删除部署吗?删除部署后,集群中的Deployment将被删除,所有对应实例将全部清空,但平台元数据将保留！"
                                onConfirm={async () => {
                                    console.log(deploymentInfo)
                                    const resp = await DeleteDeploymentWithOutDB(did)
                                    if (resp.success) {
                                            message.success('删除部署成功');
                                    } else {
                                            message.error('删除部署失败！');
                                    }
                                }}> <Button key='button' type="primary" danger style={{ display: did > 0 ? 'block' : 'none' }}>删除集群资源</Button></Popconfirm>,
                            <Button key="3"
                                onClick={() => { if (polling) { setPolling(undefined); return; } setPolling(2000); }} >
                                {polling ? <LoadingOutlined /> : <ReloadOutlined />}
                                {polling ? '停止轮询' : '开始轮询'}
                            </Button>,]}
                    />
                </TabPane>
                <TabPane tab="日志" key="2" disabled={ namespace==undefined?true:false } >
                    <div style={{ marginBottom: 10 }}>
                        <Select value={selectedPodName} bordered autoFocus style={{ width: 320 }} defaultActiveFirstOption
                            options={podListState.map(pod => ({ label: pod.name, value: pod.name }))}
                            onChange={(v, op) => {
                                setSelectedPodName(v)
                                const filter = podListState.filter(item => item.name == v)
                                if (filter.length > 0) {
                                    handeContainerListState(filter[0].containers)
                                    setSelectedContainerName(filter[0].containers[0].name)
                                }
                            }}
                        >
                        </Select>
                        <Select value={selectedContainerName} bordered style={{ width: 320, marginLeft: 5 }}
                            options={containerListState.map(c => ({ label: c.name, value: c.name }))}
                            onSelect={(val) => { setSelectedContainerName(val)  }} > </Select >
                        <Select value={selectedLines} bordered style={{ width: 320, marginLeft: 5 }}
                            onSelect={(value) => { setSelectedLines(value) }}>
                            <Option value={100} >显示100条数据</Option>
                            <Option value={200} >显示200条数据</Option>
                            <Option value={500} >显示500条数据</Option>
                            <Option value={1000}>显示1000条数据</Option>
                        </Select>
                        <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: 5 }}
                            onClick={() => {  bindLogsFunc() }}  >手动刷新</Button>
                        <Switch size="default" style={{ marginLeft: 15 }} checkedChildren="自动" unCheckedChildren="手动" checked={autoLogs}
                            onChange={(v) => {
                                setAutoLogs(v)
                            }}
                        />
                    </div>
                    <textarea value={logContent} ref={(text) => { if (text) { text.scrollTop = Number(text?.scrollHeight) } }}
                        rows={selectedLines} readOnly style={{
                            background: 'black', width: '100%', height: 780,
                            border: '1px solid rgb(221,221,221)', fontSize: '15px', color: 'whitesmoke'
                        }}>
                    </textarea>
                </TabPane>
                <TabPane tab="事件" key="3"  disabled={ namespace==undefined?true:false } >
                    <EventListComponent clusterId={ Number(clusterId) } deployment={ appName?.toString() } namespace={ namespace?.toString() } ></EventListComponent>
                </TabPane>
                <TabPane tab="YAML" key="4"  disabled={ namespace==undefined || did==0?true:false } >
                    <div >
                    <CodeMirror className="code-mirror"
                        editorDidMount={editor => {  editor.setSize('auto',document.body.clientHeight - 400) }}
                        value={yamlContent}
                        options={{ mode:{name:'text/yaml'}, theme: 'ayu-dark',
                            readOnly: true, lineNumbers:true, }} >
                    </CodeMirror>
                    </div>
                </TabPane>
                <TabPane tab="详情&路由" key="5"  disabled={ namespace==undefined || did<=0?true:false } >
                <ProDescriptions title="部署详情"  style={{ padding:15, } } dataSource={deploymentInfo} bordered  column={3} 
                  columns={[
                    { title: '应用名称', dataIndex: 'appName' },
                    { title: '部署名称', dataIndex: 'name' },
                    { title: '集群名称', dataIndex: 'clusterName' },
                    { title: '命名空间',  dataIndex: 'namespace' },
                    { title: '部署级别',  dataIndex: 'level' },
                    { title: '部署镜像',  dataIndex: 'lastImage' },
                    { title: '运行实例数',  dataIndex: 'running',render:(_,item)=>(<span>{item.running}/{item.expected}</span>) },
                    // { title: '预期实例数',  dataIndex: 'expected' }
                ]}/>

                <ProDescriptions title="服务详情" request={async(params)=>{
                    var data:any = deploymentInfo
                    const res:any = await getServiceInfo({clusterId:deploymentInfo.clusterId,
                           namespace:deploymentInfo.namespace,name:deploymentInfo.serviceName})
                    data.serviceType = res.data.type
                    data.sessionAffinity = res.data.sessionAffinity
                    data.servicePorts = res.data.port
                    res.data = data
                    console.log(res)
                    return res
                }} style={{ padding:15, } }  bordered  column={3}
                  columns={[
                    { title: '服务类型', dataIndex: 'serviceType' },
                    { title: '服务IP', dataIndex: 'serviceIP' },
                    { title: '服务端口',  dataIndex: 'servicePort',span:3 },
                    { title: '服务名称', dataIndex: 'serviceName',span:3 },
                    { title: '端口映射',  dataIndex: 'option',span:3,
                    render:(dom,item)=> (
                        <Table bordered dataSource={item.servicePorts} pagination={false}
                            columns={[ { title: '映射名称', dataIndex: 'name' },
                                { title: '协议', dataIndex: 'protocol' },
                                { title: '服务端口',dataIndex: 'port'},
                                {title: '主机端口',dataIndex: 'nodePort' },
                                {title: '容器端口',dataIndex: 'targetPort'}]}
                    /> ) },
                ]}/>


                <ProTable cardBordered  rowKey={"id"} search={false} headerTitle="路由信息"
                        columns={ [
                        { dataIndex: 'id', title: 'ID', hideInSearch:true,},
                        { dataIndex: 'name', title: '路由名称',},
                        { dataIndex: 'host',title: '域名',},
                        { dataIndex: 'uri',title: '路径',hideInSearch:true,},
                        { dataIndex: 'desc',title: '描述',},
                        { dataIndex:'liveness',title:'探针', render: (dom, row) => (<a key={'livenesslink' + row.id} href={row.liveness} target="_blank">{dom}</a>)},
                        { dataIndex: 'nodes',title: '绑定负载',hideInSearch:true,},]}
                    request={ (params)=>{
                        params.deployId = Number(deployId)
                        return getGatewayRouterList(params)
                    } } 
                    toolBarRender={() => [
                        <Button key='button'  type="primary" onClick={() => { history.push('/networks/gateway') }}>网关路由设置</Button>
                    ]} ></ProTable>

                </TabPane>

            </Tabs>
            </Content>
            <ModalForm<{ replicas: number; }>
                title="实例伸缩"
                formRef={formScaleModalRef}
                width={350}
                visible={visableScaleModal}
                onVisibleChange={setVisableScaleModal}
                onFinish={async (values) => {
                    if (deploymentInfo.expected == values.replicas) {
                        message.warning('伸缩无变化');
                    } else {
                        const resp = await setReplicasByDeployId(did, values.replicas)
                        setPolling(1000);
                        if (resp.success) {
                            message.success('实例伸缩成功');
                        } else {
                            message.error('实例伸缩失败！');
                        }
                    }
                    return true
                }}
                autoFocusFirstInput
                layout="horizontal"
                modalProps={{ forceRender: true, destroyOnClose: true, centered: true }} >
                <ProForm.Item label="副本数量" name='replicas' rules={[{ required: true, message: "请输入副本数量" }]}>
                    <InputNumber autoFocus={true} min={1} max={20}></InputNumber>
                </ProForm.Item>
            </ModalForm>

            <Modal title="容器登录" centered visible={visibleWebConsole} width={600}  destroyOnClose footer={[]} onCancel={()=>{ setVisibleWebConsole(false) } } >
                <p>该实例下共有 {containerListState?.length} 个容器 </p>
                <ProTable  dataSource={containerListState} 
                     columns={[ { title: '容器名称', dataIndex: 'name', key: 'name' },
                                { title: '状态', dataIndex: 'status', key: 'status', render: (_, row) => { return [ <Tooltip title={row.state} color="geekblue" key="status">
                                    {row.started ? <Tag color="geekblue">{String(row.started)}</Tag> : <Tag color="#f50">String(row.started)</Tag>}
                                </Tooltip>  ] } },
                                { title: '操作', render:(_,row)=>{
                                    return (<a onClick={()=>{ 
                                        setSelectedContainerName(row.name)
                                        setVisibleTerminal(true)
                                    }}>登录</a>)
                                } }
                              ]}
                     rowKey="id" headerTitle={false} search={false} options={false} pagination={false} />
                 <p>Shell环境（仅做默认环境，登录后可切换至其他环境）</p>
                 <p> 
                 <Radio.Group defaultValue={'/bin/bash'} onChange={(e) => {
                    terminalShellTypeHandler(e.target.value)
                 }}>
                    <Radio checked value={'/bin/bash'}>/bin/bash</Radio>
                    <Radio value={'/bin/sh'}>/bin/sh</Radio>
                 </Radio.Group>
                 </p>
            </Modal>

            <Modal title={`Web Console for KubeLilin --  Pod:${selectedPodName}, Container:${selectedContainerName}` } centered visible={visibleTerminal} width={1580}  destroyOnClose footer={[]} onCancel={()=>{ setVisibleTerminal(false) } } >
                <WebTerminal tenantId={ Number(currentUser?.group)} clusterId={Number(clusterId)} terminalShell={terminalShellType}
                        namespace={selectedNamespace} pod_Name={selectedPodName} container_Name={selectedContainerName}></WebTerminal>
            </Modal>
            <ExecDeployment tableRef={false} visibleFunc={[execFormVisible, setExecFormVisible]} deploymentId={dpId} deployImage={deploymentInfo?.lastImage} ></ExecDeployment>
        </PageContainer>)

}

export default Pods