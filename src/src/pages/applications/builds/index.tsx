import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import {List,Card ,Tooltip,Button,Space,Empty,Tag,Modal,Dropdown,Menu, message,Form } from 'antd'
import { SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone,ReloadOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import { ProFormSelect, ModalForm ,ProFormItem}  from '@ant-design/pro-form';
import { Drawer } from 'antd'
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import { history } from 'umi';

const { confirm } = Modal;
import ProDescriptions from '@ant-design/pro-descriptions';


import { NewPipeline,GetPipelineList,RunPipeline,AbortPipeline,DeletePipeline,
        GetPipelineDetails,GetPipelineLogs,GetDeploymentFormInfo ,GetAppGitBranches, RunPipelineWithBranch } from '../info/deployment.service'


interface Props{
    AppId:number,
    AppName:string,
    AutoLoad:boolean
}


type BuildItem = {
    id:number,
    title: string,
    taskId:number,
    lastBuildRecords?: {
        status: string  // normal,running,completed
        success:boolean 
        action: string
        time: string
        task: string
        start: string
    },
    dsl:string,
    lastCommit: {
        Message:string,
        Sha:string
    }
}



var appBuildList:BuildItem[] = []

const AppBuildList : React.FC<Props> = (props) => {
    const [onLoaded, _] = useState<boolean|undefined>(false);
    const [visableForm, setVisableForm] = useState(false);
    const [visablePipelineLogForm, setVisablePipelineLogForm] = useState(false);

    const [buildList, setBuildList] = useState<BuildItem[]>([]);

    const [runPipelineFormVis, setRunPipelineFormVis] = useState(false);
    const [runPipelineForm] = Form.useForm();


    const [currentBuildItem,setCurrentBuildItem] = useState<BuildItem|undefined>(undefined)
    const [autoLogs, setAutoLogs] = useState(false);

    const [currentLogs,setCurrentLogs] = useState<string>('Init Pod logs , please wait ..... ')

    const LoadData = (appId:number )=> {
        GetPipelineList(appId).then((res)=>{
            if(res) {
                appBuildList = res.data.map((v,i)=>{
                    var buildItem:BuildItem
                    var commit = { Message:'--',Sha:'' }
                    if (v.lastCommit != '') {
                        commit = JSON.parse(v.lastCommit)
                    }

                    buildItem = { id:v.id, title: v.name ,taskId:Number(v.taskid) , lastBuildRecords:undefined ,lastCommit:commit,dsl:v.dsl }
                    return buildItem
                })
                console.log(appBuildList)
            }
            // setBuildList(appBuildList)
        }).then(()=>{
            const cpBuildList:any = [...appBuildList]
            const allTasks = cpBuildList.map(async (v,i)=>{
                if(v.taskId > 0){
                   const res = await GetPipelineDetails(props.AppId,v.id,v.taskId)
                   if (res && res.data){
                        cpBuildList[i].lastBuildRecords = { success:false,status:'running', action:'管理员: 手动触发', time:'-- 分钟', task:v.taskId.toString()   } 
                        const seconds = Math.round(res.data.durationMillis / 1000)
                        const hh =  Math.round(seconds/3600)
                        const mm = Math.round((seconds%3600)/60)
                        const ss = Math.round(seconds%60)
                        var date = new Date(res.data.startTimeMillis);
                        cpBuildList[i].lastBuildRecords.start = date.toString()      
                        
                        cpBuildList[i].lastBuildRecords.time = `${hh}小时${mm}分${ss}秒`
                        if(res.data.status == "IN_PROGRESS"){
                                cpBuildList[i].lastBuildRecords.status = 'running'
                        } else if(res.data.status == "SUCCESS") {
                                cpBuildList[i].lastBuildRecords.status = 'completed'
                                cpBuildList[i].lastBuildRecords.success = true
                        } else if(res.data.status == "FAILED") {
                                cpBuildList[i].lastBuildRecords.status = 'completed'
                                cpBuildList[i].lastBuildRecords.success = false
                        } else {
                                cpBuildList[i].lastBuildRecords = undefined
                        }
                        //setBuildList(cpBuildList)
                        appBuildList = cpBuildList
                } 
                return appBuildList
            }})

            Promise.all(allTasks).then(tasks=>{
                console.log(tasks)
                setBuildList(appBuildList)
            })
        }).catch(()=>{
            setBuildList(appBuildList)
        })
    }

    useEffect(()=>{
        console.log("page loaded")
        console.log(props.AppId)
        LoadData(props.AppId)

        var id: NodeJS.Timeout
        if (props.AutoLoad) {
            id =  setInterval(()=>{
                LoadData(props.AppId)
            },5500)
        }
        return () => { clearInterval(id) }



        // var buildList1:BuildItem[] =[]
        // buildList1.push({title:'dev-nginx-cls-hbktlqm5', lastBuildRecords:undefined    })
        // buildList1.push({title:'test-nginx-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'completed', action:'管理员: 手动触发', time:'30分钟', task:'#22' }   })
        // buildList1.push({title:'prod-nginx-cls-hbktlqm5', lastBuildRecords:{ success:false,status:'completed', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })
        // buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })
        // buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })

    },[onLoaded,props.AutoLoad])


    useEffect(()=>{
        var id: NodeJS.Timeout
        if (autoLogs) {
            id =  setInterval(()=>{
                GetPipelineLogs(props.AppId,Number(currentBuildItem?.id),
                            Number(currentBuildItem?.lastBuildRecords?.task))
                .then((res)=>{
                    if(res&&res.data){
                        setCurrentLogs( res.data)
                    }
                })
            },5500)
        }
        return () => { clearInterval(id) }
    } ,[autoLogs])


    return (<div>
            <div  style={{ marginRight: 55, textAlign:"right" }}> 
            <Space>
                <Button icon={<ReloadOutlined />}
                onClick={()=> {
                    LoadData(props.AppId)
                }}
                ></Button>
                <Button type="primary" icon={<PlusOutlined />}  
                onClick={()=> {
                    setVisableForm(true)
                }} >新建构建</Button>
            </Space>
            </div>
            <div style={{  marginLeft: 55,marginTop: 10,marginRight: 55 ,padding: 30} }>
                <div  >
                <List dataSource={buildList}  grid={{ gutter: 16, xs: 1, sm: 2, md: 3,lg: 3,xl: 4,xxl: 5,}}
                    renderItem={item => (
                        <List.Item>
                        <Card hoverable bordered 
                                onClick={ async()=>{
                                    setCurrentLogs('Init Pod logs , please wait ..... ')
                                    setCurrentBuildItem(item)
                                    setVisablePipelineLogForm(true)
                                    if(item.lastBuildRecords?.status=='completed'){
                                        GetPipelineLogs(props.AppId,Number(item.id),
                                            Number(item.lastBuildRecords?.task))
                                        .then((res)=>{
                                            if(res&&res.data){
                                                setCurrentLogs( res.data)
                                            }
                                        })
                                    } else {
                                        setAutoLogs(true)
                                    }
                                }}
                                title={  <Tooltip title={item.title}>{item.title}</Tooltip>  } 
                                actions={[ 
                                <Tooltip title="开始构建">
                                    <PlayCircleFilled  key="building" style={{ fontSize:23}} twoToneColor="#52c41a" 
                                     onClick={(e)=>{ e.stopPropagation()
                                        setRunPipelineFormVis(true)
                                        runPipelineForm.setFieldsValue({ id:item.id, })
                                      }} /></Tooltip>,
                                <Tooltip title="设置"><SettingOutlined onClick={()=>{ 
                                    history.push(`/devops/pipeline?id=${item.id}&name=${item.title}&appid=${props.AppId}&appname=${props.AppName}`)
                                }} key="setting" style={{ fontSize:23}}  /></Tooltip>,
                                <Tooltip title="more"> <Dropdown.Button overlay={
                                    <Menu onClick={async(e)=>{
                                        if (e.key == 'stop') {
                                            confirm({ title:'确定要停止正在运行的任务吗？',
                                                    onOk(){
                                                        if(item.lastBuildRecords?.task){
                                                            AbortPipeline(item.id,props.AppId,Number(item.lastBuildRecords?.task))
                                                            .then((res)=>{
                                                                if(res.data) {
                                                                    message.success('已停止！')
                                                                }
                                                            })
                                                        }
                                                    } })
                                        } else if (e.key == 'delete') {
                                            confirm({ title:`确定删除${item.title}流水线吗？`, onOk(){
                                                DeletePipeline(item.id)
                                                .then((res)=>{
                                                    if(res.data) {
                                                        message.success(item.title+'已删除！')
                                                    }
                                                })
                                            }})
                                        }

                                        e.domEvent.stopPropagation()
                                    }}>
                                        <Menu.Item key="stop"><span style={{color:'blue'}}>停止此任务</span></Menu.Item>
                                        <Menu.Item key="delete"><span style={{color:'red'}}>删除流水线</span></Menu.Item>
                                    </Menu>
                                } ></Dropdown.Button> </Tooltip>,
                            ]}> 
                            
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  style={{ height:30, display: !item.lastBuildRecords?'block':'none' }}>
                            {/* <a href=''>立即构建  </a> */}
                            </Empty>

                            <Space direction='vertical' size={8} style={{ height:110, display: item.lastBuildRecords?'block':'none' }}>
                                <div style={{ display: (item.lastBuildRecords?.status=='completed' && item.lastBuildRecords?.success)?'block':'none' }}>
                                    <CheckCircleTwoTone style={{ fontSize:18}} twoToneColor="#52c41a" />
                                    <span style={{marginLeft: 8,fontSize:18 , color:"green"}}>构建成功</span>
                                </div>
                                <div style={{ display: (item.lastBuildRecords?.status=='completed' && !(item.lastBuildRecords?.success))?'block':'none' }}>
                                    <CloseCircleTwoTone style={{ fontSize:18}} twoToneColor="red" /> 
                                    <span style={{marginLeft: 8,fontSize:18 , color:"red"}}>构建失败</span>
                                </div>
                                <div style={{ display: item.lastBuildRecords?.status=='running'?'block':'none' }}>
                                    <SyncOutlined style={{ fontSize:18 }}  twoToneColor="#06f"  spin /> 
                                    <span style={{marginLeft: 8,fontSize:18 ,fontWeight:"bold", color:"#06f"}}>正在构建</span>
                                </div>
                                <span>当前任务:  <a > #{item.lastBuildRecords?.task} </a> </span>
                                <span>执行耗时:  {item.lastBuildRecords?.time} </span>
                                <span onClick={(e)=>{
                                    const jobj = JSON.parse(item.dsl)
                                    var gitAddr:string = jobj[0]?.steps[0]?.content.git
                                    if (gitAddr.length > 0){
                                        gitAddr = gitAddr.replace('.git','')
                                        console.log(gitAddr)
                                        gitAddr = gitAddr + '/-/commit/' + item.lastCommit.Sha
                                        window.open(gitAddr,'_blank')

                                    }
                                    e.stopPropagation()
                                }}>代码提交: <Tooltip title={item.lastCommit?.Message}>
                                <img style={{width:14,height:14}}  src='../git_v2.png'  />
                                <Tag color='blue'>{item.dsl?JSON.parse(item.dsl)[0]?.steps[0]?.content.branch:'unkown'}</Tag>
                                </Tooltip>
                                </span>
                                <span>当前部署:
                                <a style={{  textDecorationLine: 'underline' }} onClick={async(e)=>{
                                    e.stopPropagation()
                                    var deploymentId = 0
                                    const itemDsl = JSON.parse(item.dsl)
                                    const deployStage =  itemDsl.filter((x:any)=>x.name=="部署")
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
                                }}>  查看部署实例</a>
                                </span>
                            </Space>
                        
                        </Card>
                        </List.Item>
                    )}
                />
                </div>
            </div>
            <Drawer title="应用构建设置" width={720} visible={visableForm} destroyOnClose  onClose={() => { setVisableForm(false) }} > 
            <ProForm onFinish={async (values)=>{
                const res = await NewPipeline(props.AppId,values.name)
                if (res.success){
                    history.push(`/devops/pipeline?id=${res.data}&name=${values.name}&appid=${props.AppId}&appname=${props.AppName}`)
                }
                return true
            }} >
                <ProForm.Item name="name" initialValue="" rules={[{ required: true, message: '请填写流水线名称' }]}>
                   <ProFormText label="流水线名称:" ></ProFormText>
                </ProForm.Item>
                
             </ProForm>
            </Drawer>
            
            <Drawer title="流水线日志" width={1280} visible={visablePipelineLogForm} destroyOnClose  
                onClose={() => { 
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
                        rows={35} readOnly style={{
                            background: 'black', width: '100%', 
                            border: '1px solid rgb(221,221,221)', fontSize: '15px', color: 'whitesmoke'
                        }}>
            </textarea>
            </Drawer>


            <ModalForm title="构建流水线" form={runPipelineForm} width={400} visible={runPipelineFormVis} onVisibleChange={setRunPipelineFormVis}
                onFinish={async (fromData) => {
                    console.log(fromData)
                    if (fromData.branche == '') {
                         await RunPipeline(fromData.id,props.AppId)
                    } else {
                        await RunPipelineWithBranch(fromData.id,props.AppId,fromData.branche)
                    }
                    
                    LoadData(props.AppId)
                    return true
                }} >
                <ProFormItem name="id" hidden >
                    <ProFormText ></ProFormText>
                </ProFormItem>
                <ProFormItem name="branche" label="构建分支" initialValue={''}>
                    <ProFormSelect request={async()=>{
                            var namesRes = await GetAppGitBranches( props.AppId) 
                            var list = [ {label:'默认',value:''} ] 
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


export default AppBuildList