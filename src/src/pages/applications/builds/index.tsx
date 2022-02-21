import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import {List,Card ,Tooltip,Button,Space,Empty,Tag } from 'antd'
import { SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone} from '@ant-design/icons'

import { Drawer } from 'antd'
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import { history } from 'umi';



import { NewPipeline,GetPipelineList } from '../info/deployment.service'




interface Props{
    AppId:number,
    AppName:string,
}


type BuildItem = {
    title: string
    lastBuildRecords?: {
        status: string  // normal,running,completed
        success:boolean 
        action: string
        time: string
        task: string
    }
}




const AppBuildList : React.FC<Props> = (props) => {
    const [onLoaded, _] = useState<boolean|undefined>(false);
    const [visableForm, setVisableForm] = useState(false);
    const [buildList, setBuildList] = useState<BuildItem[]>([]);

    useEffect(()=>{
        console.log("page loaded")
        console.log(props.AppId)

        GetPipelineList(props.AppId).then((res)=>{
            
            const appBuildList = res.data.map(v=>{
                var buildItem:BuildItem
                buildItem = { title: v.name , lastBuildRecords:undefined }
                if (v.taskid) {
                    buildItem.lastBuildRecords = { success:false,status:'completed', action:'管理员: 手动触发', time:'30分钟', task:v.taskid   } 
                    if (v.status == 1) {
                        buildItem.lastBuildRecords.status = 'running'
                    }
                    if (v.status == 2 || v.status == 3) {
                        buildItem.lastBuildRecords.status = 'completed'
                        buildItem.lastBuildRecords.success = v.status == 2?true:false
                    }

                }
                return buildItem
            })
            console.log(appBuildList)
            setBuildList(appBuildList)

        })

        // var buildList1:BuildItem[] =[]
        // buildList1.push({title:'dev-nginx-cls-hbktlqm5', lastBuildRecords:undefined    })
        // buildList1.push({title:'test-nginx-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'completed', action:'管理员: 手动触发', time:'30分钟', task:'#22' }   })
        // buildList1.push({title:'prod-nginx-cls-hbktlqm5', lastBuildRecords:{ success:false,status:'completed', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })
        // buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })
        // buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })

    },[onLoaded])


    return (<div>
            <div  style={{   marginRight: 55, textAlign:"right" }}> 
            <Button type="primary" icon={<PlusOutlined />}  
            onClick={()=>{
                setVisableForm(true)
            }} >新建构建</Button>
                
            </div>
            <div style={{  marginLeft: 55,marginTop: 10,marginRight: 55 ,   background: "#f0f2f5" ,padding: 30} }>
                <div  >
                <List dataSource={buildList}  grid={{ gutter: 16, xs: 1, sm: 2, md: 3,lg: 3,xl: 4,xxl: 5,}}
                    renderItem={item => (
                        <List.Item>
                        <Card hoverable bordered  
                                title={  <Tooltip title={item.title}>{item.title}</Tooltip>  } 
                                actions={[ 
                                <Tooltip title="开始构建"> <PlayCircleFilled key="building" style={{ fontSize:23}} twoToneColor="#52c41a" /></Tooltip>,
                                <Tooltip title="设置"><SettingOutlined key="setting" style={{ fontSize:23}} /></Tooltip>,
                                <Tooltip title="more"><EllipsisOutlined key="ellipsis" style={{ fontSize:23}} /></Tooltip>,
                            ]}> 
                            
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  style={{ height:30, display: !item.lastBuildRecords?'block':'none' }}>
                            {/* <a href=''>立即构建  </a> */}
                            </Empty>

                            <Space direction='vertical' size={8} style={{ height:95, display: item.lastBuildRecords?'block':'none' }}>
                                <div style={{ display: (item.lastBuildRecords?.status=='completed' && item.lastBuildRecords?.success)?'block':'none' }}>
                                    <CheckCircleTwoTone style={{ fontSize:20}} twoToneColor="#52c41a" />
                                    <span style={{marginLeft: 8,fontSize:16 , color:"green"}}>构建成功</span>
                                </div>
                                <div style={{ display: (item.lastBuildRecords?.status=='completed' && !(item.lastBuildRecords?.success))?'block':'none' }}>
                                    <CloseCircleTwoTone style={{ fontSize:20}} twoToneColor="red" /> 
                                    <span style={{marginLeft: 8,fontSize:16 , color:"red"}}>构建失败</span>
                                </div>
                                <div style={{ display: item.lastBuildRecords?.status=='running'?'block':'none' }}>
                                    <SyncOutlined style={{ fontSize:20 }}  twoToneColor="#06f"  spin /> 
                                    <span style={{marginLeft: 8,fontSize:16 ,fontWeight:"bold", color:"#06f"}}>正在构建</span>
                                </div>
                                <span>管理员: 手动触发 </span>
                                <span>耗时: 30分钟 </span>
                                <span>任务: <a href=''> #22 </a> </span>
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
        </div>
        
        )
    

}


export default AppBuildList