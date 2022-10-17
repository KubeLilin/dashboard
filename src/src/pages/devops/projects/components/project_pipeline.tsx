import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { history, Link,useModel } from 'umi';
import { Tabs, Button, Space, Tooltip,Layout, Tag, Modal, InputNumber, message, Popconfirm, Select, Switch, notification, Radio } from 'antd'
import React, { useState, useRef, useEffect } from 'react';
import { SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,LoadingOutlined,CheckCircleTwoTone,ReloadOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import moment from 'moment'; 

import { GetPipelineList,GetPipelineDetails } from '../service'

type BuildItem = {
    id:number,
    title: string,
    taskId:number,
    appId:number,
    lastBuildRecords: {
        status: string  // normal,running,completed
        success:boolean 
        action: string
        time: string
        task: string
        start: string
    }
}

export type ProjectPipelineProps = {
    projectId : number;
};


const ProjectPipelineList: React.FC<ProjectPipelineProps> = ( props ) => {
    const [onLoaded,_] = useState<boolean>()
    const [buildList, setBuildList] = useState<BuildItem[]>([]);

    const [time, setTime] = useState(() => Date.now());
    const [polling, setPolling] = useState<number | undefined>(undefined);
    var timerId: NodeJS.Timeout

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
                var build = { success:false,status:'', action:'管理员: 手动触发', time:'-- 分钟', task:'' ,start:''  } 
                appBuildList = res.data.map((v:any,i)=>
                     ({ id:v.id, title: v.name ,appId:v.appid,taskId:Number(v.lastTaskId),lastBuildRecords:build  }))
            }      
            const cpBuildList:BuildItem[] = [...appBuildList]
            appBuildList.forEach(async (v:BuildItem,i:number)=>{
                if(v.taskId > 0) {
                   const res = await GetPipelineDetails(v.appId,v.id,v.taskId)
                   if (res && res.data) {
                        var buildItem = { success:false,status:'running', action:'管理员: 手动触发', time:'-- 分钟', task:v.taskId.toString() ,start:''  } 
                        cpBuildList[i].lastBuildRecords = buildItem
                        const seconds = Math.round(res.data.durationMillis / 1000)
                        const hh =  Math.round(seconds/3600)
                        const mm = Math.round((seconds%3600)/60)
                        const ss = Math.round(seconds%60)
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
                        }
                        cpBuildList[i].lastBuildRecords =  buildItem
                        console.log(cpBuildList[i].lastBuildRecords)
                    }
                }
                return cpBuildList
            })
            return cpBuildList
    }
    
    useEffect(()=>{
        LoadData(props.projectId).then((data)=>{
            setTimeout(() => {
                setBuildList(data)
            }, 500);
        })
    },[onLoaded])


    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 68,
        },
        {
            title:'流水线名称',
            dataIndex:'title',
        },
        {
            title:'任务ID',
            dataIndex:'taskId',
            render:(dom,row)=>(<span>#{dom}</span>)
        },
        {
            title:'阶段',
            dataIndex:'option',
        },
        {
            title:'耗时',
            width: 80,
            render:(_,item:BuildItem)=> {
               return <span>{item.lastBuildRecords.time} </span>
            }
        },
        {
            title:'状态',
            dataIndex:'taskStatus',
            width: 100,
            render:(_,item)=>(
                <div>
                       <div style={{ display: (item.lastBuildRecords?.status=='completed' && item.lastBuildRecords?.success)?'block':'none' }}>
                            <CheckCircleTwoTone style={{ fontSize:14}} twoToneColor="#52c41a" />
                            <span style={{marginLeft: 8,fontSize:14 , color:"green"}}>构建成功</span>
                        </div>
                        <div style={{ display: (item.lastBuildRecords?.status=='completed' && !(item.lastBuildRecords?.success))?'block':'none' }}>
                            <CloseCircleTwoTone style={{ fontSize:14}} twoToneColor="red" /> 
                            <span style={{marginLeft: 8,fontSize:14 , color:"red"}}>构建失败</span>
                        </div>
                        <div style={{ display: item.lastBuildRecords?.status=='running'?'block':'none' }}>
                            <SyncOutlined style={{ fontSize:14 }}  twoToneColor="#06f"  spin /> 
                            <span style={{marginLeft: 8,fontSize:14 ,fontWeight:"bold", color:"#06f"}}>正在构建</span>
                        </div>
                </div>
            )
        },

    ]


    return (<ProTable
        rowKey={record => record.name}
        columns={columns}
        dateFormatter="string"
        pagination={{ pageSize: 1000 }}
        headerTitle={`流水线列表 - 上次更新时间：${moment(time).format('HH:mm:ss')}`}
        polling={polling || undefined}
        search={false}
        dataSource={buildList}
        request={async(param)=> {
            const data = await LoadData(props.projectId)
            clearInterval(timerId)
            timerId = setTimeout(() => {
                setBuildList(data)
            }, 800);
            setTime(Date.now())
            return data
        }}
        toolBarRender={() => [
            <Button key="3"
                onClick={() => { if (polling) { setPolling(undefined); return; } setPolling(5000); }} >
                {polling ? <LoadingOutlined /> : <ReloadOutlined />}
                {polling ? '停止轮询 (5s)' : '开始轮询 (5s)'}
            </Button>,]}
    />)
}

export default ProjectPipelineList;