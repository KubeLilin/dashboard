import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import {List,Card ,Tooltip,Button,Space,Empty,Tag,Modal,Dropdown,Menu, message } from 'antd'
import { SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone,ReloadOutlined,ExclamationCircleOutlined} from '@ant-design/icons'

import { Drawer } from 'antd'
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import { history } from 'umi';

const { confirm } = Modal;
import ProDescriptions from '@ant-design/pro-descriptions';


import { NewPipeline,GetPipelineList,RunPipeline,AbortPipeline,DeletePipeline,
        GetPipelineDetails,GetPipelineLogs } from '../info/deployment.service'


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
    }
}



var appBuildList:BuildItem[] = []

const AppBuildList : React.FC<Props> = (props) => {
    const [onLoaded, _] = useState<boolean|undefined>(false);
    const [visableForm, setVisableForm] = useState(false);
    const [visablePipelineLogForm, setVisablePipelineLogForm] = useState(false);

    const [buildList, setBuildList] = useState<BuildItem[]>([]);

    const [currentBuildItem,setCurrentBuildItem] = useState<BuildItem|undefined>(undefined)
    const [autoLogs, setAutoLogs] = useState(false);

    const [currentLogs,setCurrentLogs] = useState<string>("")

    const LoadData = (appId:number )=> {
        GetPipelineList(appId).then((res)=>{
            if(res) {
                appBuildList = res.data.map((v,i)=>{
                    var buildItem:BuildItem
                    buildItem = { id:v.id, title: v.name ,taskId:Number(v.taskid) , lastBuildRecords:undefined }
                    return buildItem
                })
                console.log(appBuildList)
            }
            // setBuildList(appBuildList)
        }).then(()=>{
            const cpBuildList:any = [...appBuildList]
            cpBuildList.forEach(async (v,i)=>{
                if(v.taskId > 0){
                   const res = await GetPipelineDetails(props.AppId,v.id,v.taskId)
                   if (res && res.data){
                        cpBuildList[i].lastBuildRecords = { success:false,status:'running', action:'?????????: ????????????', time:'-- ??????', task:v.taskId.toString()   } 
                        const seconds = Math.round(res.data.durationMillis / 1000)
                        const hh =  Math.round(seconds/3600)
                        const mm = Math.round((seconds%3600)/60)
                        const ss = Math.round(seconds%60)
                        var date = new Date(res.data.startTimeMillis);
                        cpBuildList[i].lastBuildRecords.start = date.toString()      
                        
                        cpBuildList[i].lastBuildRecords.time = `${hh}??????${mm}???${ss}???`
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
                        setBuildList(cpBuildList)
                    } else {
                        setBuildList(appBuildList)
                    }
                } else {
                    setBuildList(appBuildList)
                }
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
            },2500)
        }
        return () => { clearInterval(id) }

        // var buildList1:BuildItem[] =[]
        // buildList1.push({title:'dev-nginx-cls-hbktlqm5', lastBuildRecords:undefined    })
        // buildList1.push({title:'test-nginx-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'completed', action:'?????????: ????????????', time:'30??????', task:'#22' }   })
        // buildList1.push({title:'prod-nginx-cls-hbktlqm5', lastBuildRecords:{ success:false,status:'completed', action:'?????????: ????????????', time:'21??????', task:'#21' }  })
        // buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'?????????: ????????????', time:'21??????', task:'#21' }  })
        // buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'?????????: ????????????', time:'21??????', task:'#21' }  })

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
            },1500)
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
                }} >????????????</Button>
            </Space>
            </div>
            <div style={{  marginLeft: 55,marginTop: 10,marginRight: 55 ,   background: "#f0f2f5" ,padding: 30} }>
                <div  >
                <List dataSource={buildList}  grid={{ gutter: 16, xs: 1, sm: 2, md: 3,lg: 3,xl: 4,xxl: 5,}}
                    renderItem={item => (
                        <List.Item>
                        <Card hoverable bordered 
                                onClick={ async()=>{
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
                                <Tooltip title="????????????">
                                    <PlayCircleFilled  key="building" style={{ fontSize:23}} twoToneColor="#52c41a" 
                                     onClick={(e)=>{  
                                                    e.stopPropagation()
                                                    confirm({
                                                    title: '??????????????????????',
                                                    icon: <ExclamationCircleOutlined />,
                                                    content: '????????????????????????????????????',
                                                    onOk : async ()=> {
                                                        const res = await RunPipeline(item.id,props.AppId)
                                                        LoadData(props.AppId)
                                                        console.log(res.data)
                                                    } })
                                      }} /></Tooltip>,
                                <Tooltip title="??????"><SettingOutlined onClick={()=>{ 
                                    history.push(`/devops/pipeline?id=${item.id}&name=${item.title}&appid=${props.AppId}&appname=${props.AppName}`)
                                }} key="setting" style={{ fontSize:23}}  /></Tooltip>,
                                <Tooltip title="more"> <Dropdown.Button overlay={
                                    <Menu onClick={async(e)=>{
                                        if (e.key == 'stop') {
                                            confirm({ title:'??????????????????????????????????????????',
                                                    onOk(){
                                                        if(item.lastBuildRecords?.task){
                                                            AbortPipeline(item.id,props.AppId,Number(item.lastBuildRecords?.task))
                                                            .then((res)=>{
                                                                if(res.data) {
                                                                    message.success('????????????')
                                                                }
                                                            })
                                                        }
                                                    } })
                                        } else if (e.key == 'delete') {
                                            confirm({ title:`????????????${item.title}???????????????`, onOk(){
                                                DeletePipeline(item.id)
                                                .then((res)=>{
                                                    if(res.data) {
                                                        message.success(item.title+'????????????')
                                                    }
                                                })
                                            }})
                                        }

                                        e.domEvent.stopPropagation()
                                    }}>
                                        <Menu.Item key="stop"><span style={{color:'blue'}}>???????????????</span></Menu.Item>
                                        <Menu.Item key="delete"><span style={{color:'red'}}>???????????????</span></Menu.Item>
                                    </Menu>
                                } ></Dropdown.Button> </Tooltip>,
                            ]}> 
                            
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  style={{ height:30, display: !item.lastBuildRecords?'block':'none' }}>
                            {/* <a href=''>????????????  </a> */}
                            </Empty>

                            <Space direction='vertical' size={8} style={{ height:95, display: item.lastBuildRecords?'block':'none' }}>
                                <div style={{ display: (item.lastBuildRecords?.status=='completed' && item.lastBuildRecords?.success)?'block':'none' }}>
                                    <CheckCircleTwoTone style={{ fontSize:20}} twoToneColor="#52c41a" />
                                    <span style={{marginLeft: 8,fontSize:16 , color:"green"}}>????????????</span>
                                </div>
                                <div style={{ display: (item.lastBuildRecords?.status=='completed' && !(item.lastBuildRecords?.success))?'block':'none' }}>
                                    <CloseCircleTwoTone style={{ fontSize:20}} twoToneColor="red" /> 
                                    <span style={{marginLeft: 8,fontSize:16 , color:"red"}}>????????????</span>
                                </div>
                                <div style={{ display: item.lastBuildRecords?.status=='running'?'block':'none' }}>
                                    <SyncOutlined style={{ fontSize:20 }}  twoToneColor="#06f"  spin /> 
                                    <span style={{marginLeft: 8,fontSize:16 ,fontWeight:"bold", color:"#06f"}}>????????????</span>
                                </div>
                                <span>?????????: ???????????? </span>
                                <span>??????: {item.lastBuildRecords?.time} </span>
                                <span>??????: <a href=''> #{item.lastBuildRecords?.task} </a> </span>
                            </Space>
                        
                        </Card>
                        </List.Item>
                    )}
                />
                </div>
            </div>
            <Drawer title="??????????????????" width={720} visible={visableForm} destroyOnClose  onClose={() => { setVisableForm(false) }} > 
            <ProForm onFinish={async (values)=>{
                const res = await NewPipeline(props.AppId,values.name)
                if (res.success){
                    history.push(`/devops/pipeline?id=${res.data}&name=${values.name}&appid=${props.AppId}&appname=${props.AppName}`)
                }
                return true
            }} >
                <ProForm.Item name="name" initialValue="" rules={[{ required: true, message: '????????????????????????' }]}>
                   <ProFormText label="???????????????:" ></ProFormText>
                </ProForm.Item>
                
             </ProForm>
            </Drawer>
            
            <Drawer title="???????????????" width={1280} visible={visablePipelineLogForm} destroyOnClose  
                onClose={() => { 
                    setVisablePipelineLogForm(false)
                    setAutoLogs(false)
                }} > 
            <ProDescriptions dataSource={currentBuildItem} column={2}  bordered	
                        columns={[
                            { title: '?????????ID', dataIndex: 'id' },
                            { title: '???????????????', dataIndex: 'title' },
                            { title: '??????ID', dataIndex: 'taskId'},
                            { title: "??????????????????",dataIndex: ['lastBuildRecords','start'] }
                            ]}/>
            <div style={{ marginBottom: 10 }}></div>
            <textarea value={currentLogs} ref={(text) => { if (text) { text.scrollTop = Number(text?.scrollHeight) } }}
                        rows={35} readOnly style={{
                            background: 'black', width: '100%', 
                            border: '1px solid rgb(221,221,221)', fontSize: '15px', color: 'whitesmoke'
                        }}>
            </textarea>
            </Drawer>
        </div>
        
        )
    

}


export default AppBuildList