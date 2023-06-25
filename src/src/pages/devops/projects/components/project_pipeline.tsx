import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormInstance,ProFormItem,ProFormSelect,ProFormText } from '@ant-design/pro-form';
import { history, Link,useModel } from 'umi';
import {Drawer, Tabs, Button, Space, Tooltip,Layout, Tag, Modal, InputNumber, message, 
    Popconfirm, Select, Switch, notification, Radio,Steps , Form } from 'antd'
import React, { useState, useRef, useEffect } from 'react';
import {  CloseCircleTwoTone,SyncOutlined, SmileOutlined, SolutionOutlined, UserOutlined,CodeTwoTone,
    LoadingOutlined,CheckCircleTwoTone,ReloadOutlined ,PlayCircleTwoTone,PauseCircleTwoTone ,ExclamationCircleOutlined} from '@ant-design/icons'
    
const { confirm } = Modal;
import moment from 'moment'; 
const { Step } = Steps;
import ProDescriptions from '@ant-design/pro-descriptions';

import { GetPipelineList,GetPipelineDetails,GetPipelineLogs,GetDeploymentFormInfo,
    RunPipeline,RunPipelineWithBranch,AbortPipeline ,GetAppGitBranches } from '../service'

type BuildItem = {
    id:number,
    title: string,
    taskId:number,
    appId:number,
    dsl:{},
    lastBuildRecords: {
        status: string  // normal,running,completed
        success:boolean 
        action: string
        time: string
        task: string
        start: string
    },
    lastCommit: {
        Message:string,
        Sha:string
    }
}

export type ProjectPipelineProps = {
    projectId : number;
    AutoLoad:boolean;
};


const ProjectPipelineList: React.FC<ProjectPipelineProps> = ( props ) => {
    const [onLoaded,_] = useState<boolean>()
    const [buildList, setBuildList] = useState<BuildItem[]>([]);

    const [visablePipelineLogForm, setVisablePipelineLogForm] = useState(false);
    const [currentBuildItem,setCurrentBuildItem] = useState<BuildItem|undefined>(undefined)
    const [autoLogs, setAutoLogs] = useState(false);
    const [currentLogs,setCurrentLogs] = useState<string>('Init Pod logs , please wait ..... ')

    const [time, setTime] = useState(() => Date.now());
    const [polling, setPolling] = useState<number | undefined>(undefined);
    var timerId: NodeJS.Timeout

    const [runPipelineFormVis, setRunPipelineFormVis] = useState(false);
    const [runPipelineForm] = Form.useForm();

    const formatDuration = (ms:any) => {
        var duration = moment.duration(ms);
        if (duration.asHours() > 1) {
          return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");
        } else {
          return moment.utc(duration.asMilliseconds()).format("mm:ss");
        }
    }


    const LoadData = async (projectId:number ) =>  {
            let appBuildList:BuildItem[] = []
            const res = await GetPipelineList(projectId)
            if(res) {
                var build = { success:false,status:'', action:'管理员: 手动触发', time:'-- 分钟', task:'' ,start:'', updateTime:''  } 
                appBuildList = res.data.map((v:any,i)=>
                     ({ id:v.id, title: v.name ,appId:v.appid,appName:v.appName,taskId:Number(v.lastTaskId),lastBuildRecords:build ,dsl:v.dsl?JSON.parse(v.dsl):undefined,lastCommit:v.lastCommit?JSON.parse(v.lastCommit):undefined , updateTime: v.updateTime  }))
                //console.log(appBuildList)
            }      
            const cpBuildList:BuildItem[] = [...appBuildList]
            let promises = appBuildList.map(async (v,i)=>{
                // if(v.taskId > 0) {
                   const res = await GetPipelineDetails(v.appId,v.id,v.taskId)
                   if (res && res.data) {
                        var buildItem = { success:false,status:'running', action:'管理员: 手动触发', time:'-- 分钟', task:v.taskId.toString() ,start:'', stages:res.data.stages } 
                        //cpBuildList[i].lastBuildRecords = buildItem
                        var date = new Date(res.data.startTimeMillis);
                        buildItem.time = formatDuration(res.data.durationMillis)
                        buildItem.start = date.toString()      
                        //buildItem.time = `${hh}小时${mm}分${ss}秒`
                        if(res.data.status == "IN_PROGRESS"){
                            buildItem.status = 'running'
                        } else if(res.data.status == "SUCCESS") {
                            buildItem.status = 'completed'
                            buildItem.success = true
                        } else if(res.data.status == "FAILED") {
                            buildItem.status = 'completed'
                            buildItem.success = false
                        } else if (res.data.status == "ABORTED") {
                            buildItem.status = 'aborted'
                            buildItem.success = false
                        }
                        cpBuildList[i].lastBuildRecords =  buildItem
                    }
                // }
            })
            // wait appBuildList
            await Promise.all(promises)

            return cpBuildList
    }
    
    useEffect(()=>{
        if (props.AutoLoad) {
            setPolling(5000)
        } else {
            setPolling(undefined)
        }

    },[onLoaded,props.AutoLoad])


    useEffect(()=>{
        var id: NodeJS.Timeout
        if (autoLogs) {
            id =  setInterval(()=>{
                GetPipelineLogs(Number(currentBuildItem?.appId),Number(currentBuildItem?.id),
                            Number(currentBuildItem?.taskId))
                .then((res)=>{
                    if(res&&res.data){
                        setCurrentLogs( res.data)
                    }
                })
            },5500)
        }
        return () => { clearInterval(id) }
    } ,[autoLogs])


    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 68,
        },
        {
            title:'流水线名称',
            width: 188,
            dataIndex:'title',
            render:(dom,item)=>(
                <a style={{  textDecorationLine: 'underline' }} onClick={()=>{
                    history.push(`/devops/pipeline?id=${item.id}&name=${item.title}&appid=${item.appId}&appname=${item.appName}`)
                }}>{dom}</a>
            )
        },
        {
            title: '应用名称',
            width: 188,
            dataIndex: 'appName',
        },
        {
            title:'任务ID',
            dataIndex:'taskId',
            render:(dom,row)=>( <Tag color="purple" key={"task_"+row.id}>#{dom}</Tag> )
        },
        {
            title:'代码分支',
            dataIndex:'git',
            render:(dom,row)=>(
                <span onClick={(e)=>{
                    var gitAddr:string = row.dsl[0]?.steps[0]?.content.git
                    if (gitAddr.length > 0 && row.lastCommit){
                        gitAddr = gitAddr.replace('.git','')
                        gitAddr = gitAddr + '/-/commit/' + row.lastCommit.Sha
                        window.open(gitAddr,'_blank')
                    }
                    e.stopPropagation()
                }}><Tooltip title={row.lastCommit?row.lastCommit.Message:'无,重要执行任务后会拉取最新提交记录。'}>
                <img style={{width:14,height:14}}  src='../../git_v2.png'  />
                <Tag color='blue'>{row.dsl?row.dsl[0]?.steps[0]?.content?.branch : 'unknow'}</Tag>
                </Tooltip>
                </span>
            )
            
        },
        {
            title:'阶段(当前进行阶段及耗时)',
            dataIndex:'steps',
            render:(_,item)=>{
                var currentStageIndex = 0
                var currentStageStatus = ''
                var stages:any[] = []
                if (item.lastBuildRecords.stages) {
                    currentStageIndex = item.lastBuildRecords.stages.length
                    stages = item.lastBuildRecords.stages
                    currentStageStatus = item.lastBuildRecords.stages[currentStageIndex-1]?.status
                    var stepsStatus = 'process'
                    if (currentStageStatus) {
                        if(currentStageStatus == "IN_PROGRESS"){
                            stepsStatus = 'process'
                        } else if(currentStageStatus == "SUCCESS") {
                            stepsStatus = 'finish'
                        } else if(currentStageStatus == "FAILED") {
                            stepsStatus = 'error'
                        } else if (currentStageStatus == "ABORTED") {
                            stepsStatus = 'error'
                        }
                    }
                }

                if (!item.dsl) {
                    item.dsl= { name:"-"}
                }

                return (
                    <Steps key={"item_steps"+item.id}    current={currentStageIndex-1} size="small">
                    {   item.dsl.map?item.dsl.map((x:any,index:number)=>{
                                return <Step key={"item_step"+x.name} 
                                         description={stages.length>0&&stages[index]?formatDuration(stages[index].durationMillis):'00:00'}
                                         title={x.name}  status={index==currentStageIndex-1?stepsStatus:''}  
                                        />
                        }):<Step key="start"></Step>
                    }
                    </Steps>
                )
            }
        },
        {
            title:'总任务耗时',
            render:(_,item:BuildItem)=> {
               return <span key={"tasktimeout"+item.id}>耗时: {item.lastBuildRecords.time} </span>
            }
        },
        {
            title: '最后构建',
            dataIndex: 'updateTime',
            valueType: 'dateTime'
        },
        {
            title:'任务状态',
            dataIndex:'taskStatus',
            width: 150,
            render:(_,item)=>(
                <div key={"task_status"+item.id}>
                       <div style={{ display: (item.lastBuildRecords?.status=='completed' && item.lastBuildRecords?.success)?'block':'none' }}>
                            <CheckCircleTwoTone style={{ fontSize:15}} twoToneColor="#52c41a" />
                            <span style={{marginLeft: 8,fontSize:15 , color:"green"}}>构建成功</span>
                        </div>
                        <div style={{ display: (item.lastBuildRecords?.status=='completed' && !(item.lastBuildRecords?.success))?'block':'none' }}>
                            <CloseCircleTwoTone style={{ fontSize:15}} twoToneColor="red" /> 
                            <span style={{marginLeft: 8,fontSize:15 , color:"red"}}>构建失败</span>
                        </div>
                        <div style={{ display: (item.lastBuildRecords?.status=='aborted' && !(item.lastBuildRecords?.success))?'block':'none' }}>
                            <CloseCircleTwoTone style={{ fontSize:15}} twoToneColor="red" /> 
                            <span style={{marginLeft: 8,fontSize:15 , color:"red"}}>停止构建</span>
                        </div>
                        <div style={{ display: item.lastBuildRecords?.status=='running'?'block':'none' }}>
                            <SyncOutlined style={{ fontSize:15 }}  twoToneColor="#06f"  spin /> 
                            <span style={{marginLeft: 8,fontSize:15 ,fontWeight:"bold", color:"#06f"}}>正在构建</span>
                        </div>
                </div>
            )
        },
        {
            title:'部署实例',
            dataIndex:'title',
            render:(dom,item)=>(
                <a style={{  textDecorationLine: 'underline' }} onClick={async()=>{
                    var deploymentId = 0
                    const deployStage =  item.dsl.filter((x:any)=>x.name=="部署")
                    if (deployStage.length > 0) {
                        const deployStep = deployStage[0].steps.filter((x:any)=>x.key=="app_deploy")
                        if (deployStep.length > 0) {
                            console.log(deployStep[0].content)
                            if (deployStep[0].content.depolyment) {
                                deploymentId = deployStep[0].content.depolyment
                            }
                        }
                    }
                    console.log(deploymentId)
                    if (deploymentId > 0) {
                        const res = await GetDeploymentFormInfo(deploymentId)
                        if (res.success) {
                            console.log(res.data)
                             // history.push(`/resources/pods?did=${deploymentId}`)
                            history.push(`/resources/pods?did=${deploymentId}&app=${res.data.name}&cid=${res.data.clusterId}&ns=${res.data.namespace}`)
                        }
                    } else {
                        message.error("无部署实例")
                    }
                }}>查看部署实例</a>
            )
        },
        {
            title: '操作',
            valueType: 'option',
            render: (dom, item, _, action) => [
                <Tooltip title="开始构建" key={"btn_start"+item.id}>
                <PlayCircleTwoTone  key="building" style={{ fontSize:23}} twoToneColor="#52c41a" 
                 onClick={(e)=>{  
                    e.stopPropagation()

                    runPipelineForm.setFieldsValue({
                        appId: item.appId,
                        id: item.id,

                    })
                    setRunPipelineFormVis(true)
                    
                  }} /></Tooltip>,
                <Tooltip title="停止构建" key={"btn_stop"+item.id}>
                <PauseCircleTwoTone style={{ fontSize:23}}
                 onClick={(e)=>{  
                    e.stopPropagation()
                    confirm({ title:`确定要停止#${item.taskId}任务吗？`,
                    onOk(){
                        const res = AbortPipeline(item.id,item.appId,Number(item.taskId))
                        console.log(res)
                        message.success("构建已停止...")
                    }})
                 }} />
                </Tooltip>,
                <Tooltip title="查看日志" key={"btn_logs"+item.id}>
                    <CodeTwoTone  style={{ fontSize:23}} onClick={async()=>{
                        setCurrentLogs('Init Pod logs , please wait ..... ')
                        setCurrentBuildItem(item)
                        setVisablePipelineLogForm(true)
                        const res = await GetPipelineLogs(item.appid,Number(item.id), Number(item.taskId))
                        if(res&&res.data){
                            setCurrentLogs( res.data)
                        }
                        setAutoLogs(true)
                        
                    }}/>
                </Tooltip>
            ]
        }

    ]


    return (
    <div>
    <ProTable
        rowKey={record => record.id + Date.now()}
        columns={columns}
        dateFormatter="string"
        pagination={{ pageSize: 1000 }}
        headerTitle={`流水线列表 - 上次更新时间：${moment(time).format('HH:mm:ss')}`}
        polling={polling || undefined}
        search={false}
        dataSource={buildList}
        request={async(param)=> {
            const data = await LoadData(props.projectId)
            setTimeout(() => {
                setBuildList(data)
            }, 200)
            setTime(Date.now())
            return data
        }}
        toolBarRender={() => [
            <Button key="3"
                onClick={() => { if (polling) { setPolling(undefined); return; } setPolling(5000); }} >
                {polling ? <LoadingOutlined /> : <ReloadOutlined />}
                {polling ? '停止轮询 (5s)' : '开始轮询 (5s)'}
            </Button>,]}
    />
          <Drawer title="流水线日志" width={1280} visible={visablePipelineLogForm} destroyOnClose  
                onClose={() => { 
                    console.log('close')
                    setCurrentLogs('Init Pod logs , please wait ..... ')
                    setVisablePipelineLogForm(false)
                    setAutoLogs(false)
                }} > 
            <ProDescriptions dataSource={currentBuildItem} column={2}  bordered	
                        columns={[
                            { title: '流水线ID', dataIndex: 'id' },
                            { title: '流水线名称', dataIndex: 'title' },
                            { title: '任务ID', dataIndex: 'taskId'},
                            { title: "任务开始时间",dataIndex: ['lastBuildRecords','start'],valueType:"dateTime" }
                            ]}/>
            <div style={{ marginBottom: 10 }}></div>
            <textarea value={currentLogs} ref={(text) => { if (text) { text.scrollTop = Number(text?.scrollHeight) } }}
                        rows={55} readOnly style={{
                            background: 'black', width: '100%', 
                            border: '1px solid rgb(221,221,221)', fontSize: '12px', color: 'whitesmoke'
                        }}>
            </textarea>
            </Drawer>

            <ModalForm title="构建流水线" modalProps={{ destroyOnClose:true }}
                form={runPipelineForm} width={400} visible={runPipelineFormVis} onVisibleChange={setRunPipelineFormVis}
                onFinish={async (fromData) => {
                    console.log(fromData)
                    message.success("构建已开始...")
                    var res
                    if (fromData.branche == '') {
                        res = await RunPipeline(fromData.id,fromData.appId)
                        if (res.success == false) {
                            res = await RunPipelineWithBranch(fromData.id,fromData.appId,fromData.branche)
                        }
                    } else {
                        res = await RunPipelineWithBranch(fromData.id,fromData.appId,fromData.branche)
                    }
                    if (res && res.success) {
                        notification.open({
                            message: '构建已开始',
                            description: `构建已开始，任务ID：${res.data}`,
                            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                        })
                    } else {
                       message.error("构建失败")
                    }
                  
                    
                    return true
                }} >
                <ProFormItem name="id" hidden >
                    <ProFormText></ProFormText>
                </ProFormItem>
                <ProFormItem name="appId" hidden >
                    <ProFormText></ProFormText>
                </ProFormItem>
                <ProFormItem name="branche" label="构建分支" initialValue={''}>
                    <ProFormSelect request={async()=>{
                            const appid = runPipelineForm.getFieldValue('appId')
                            var namesRes = await GetAppGitBranches( Number(appid) ) 
                            var list = [ {label:'初始化',value:''} ] 
                            if (namesRes.data.branches){
                                list.push(... namesRes.data.branches.map((item)=> ({label: item ,value:item}) ))
                            } 
                            return list
                    }} ></ProFormSelect>
                </ProFormItem>
            </ModalForm>
    </div>
    )
}

export default ProjectPipelineList;