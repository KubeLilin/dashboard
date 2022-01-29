import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import {List,Card ,Tooltip,Button,Space,Empty,Tag } from 'antd'
import { SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone} from '@ant-design/icons'
import { CheckCard } from '@ant-design/pro-card';

import { Drawer,Avatar } from 'antd'
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormTextArea	,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';

import { getDeploymentList } from '../info/deployment.service'


interface Props{
    // deploymentId:number,
    // tableRef:any,
    // deployImage?:string,
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

const buildScriptList = {
    golang: `# 编译命令，注：当前已在代码根路径下
go env -w GOPROXY=https://goproxy.cn,direct
go build -ldflags="-s -w" -o app .
    `,
    java: `# 编译命令，注：当前已在代码根路径下
mvn clean package                         
    `,
    nodejs: `# 编译命令，注：当前已在代码根路径下
npm config set registry https://registry.npm.taobao.org --global
npm install
npm run build
`
}


const AppBuildList : React.FC<Props> = (props) => {
    const [onLoaded, setOnLoaded] = useState<boolean|undefined>(false);
    const [visableForm, setVisableForm] = useState(false);
    const [buildList, setBuildList] = useState<BuildItem[]>([]);
    const buildForm =  useRef<ProFormInstance>();

    useEffect(()=>{
        console.log('onload')
        var buildList1:BuildItem[] =[]
        buildList1.push({title:'dev-nginx-cls-hbktlqm5', lastBuildRecords:undefined    })
        buildList1.push({title:'test-nginx-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'completed', action:'管理员: 手动触发', time:'30分钟', task:'#22' }   })
        buildList1.push({title:'prod-nginx-cls-hbktlqm5', lastBuildRecords:{ success:false,status:'completed', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })
        buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })
        buildList1.push({title:'prod-yoyogodemo-cls-hbktlqm5', lastBuildRecords:{ success:true,status:'running', action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })

        setBuildList(buildList1)
    },[onLoaded])


    return (<div>
            <div  style={{ marginLeft: 56,}}> 
            <Button type="primary" size="large" icon={<PlusOutlined />} 
            onClick={()=>{
                setVisableForm(true)
            }} >新建构建</Button>
                
            </div>
            <div style={{width:1580,  marginLeft: 55,marginTop: 10,marginRight: 55 ,   background: "#f0f2f5" ,padding: 30} }>
                <div  style={{width:1580, }}>
                <List dataSource={buildList} grid={{ gutter: 0,column:5,xs:2,xl:3,xxl:5 }}
                    renderItem={item => (
                        <List.Item>
                        <Card hoverable bordered style={{ width: 260 }} 
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
            <ProForm formRef={buildForm}>
                <ProForm.Item name="depolyment">
                    <ProFormSelect label="部署环境" width="md" request={async()=>{
                         const deployPage = await getDeploymentList({appid:1,current:1,pageSize:50})
                         return deployPage.data.map((item)=> ({label: item.name ,value:item.id}) )
                    }} ></ProFormSelect>
                </ProForm.Item>
                <ProForm.Item name="branch">
                    <ProFormSelect label="代码分支" width="md"  ></ProFormSelect>
                </ProForm.Item>
                <ProForm.Item name="buildEnv" label="构建环境" initialValue={"java"}>
                    <CheckCard.Group style={{ width: '100%' }} onChange={(val)=>{
                        console.log(val)
                        var script = buildScriptList[String(val)]
                        buildForm.current?.setFieldsValue({buildScript: script})
                    }}>
                        <CheckCard  title="Spring Boot" avatar={  <Avatar src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg"
                            size="large" /> } description="通过业界流行的技术栈来快速构建 Java 后端应用" value="java" />
                        <CheckCard title="Golang" avatar={ <Avatar
                            src="https://gw.alipayobjects.com/zos/bmw-prod/6935b98e-96f6-464f-9d4f-215b917c6548.svg"
                            size="large" /> } description="使用Golang来快速构建分布式后端应用" value="golang" />
                        <CheckCard title="Node JS" avatar={ <Avatar
                            src="https://gw.alipayobjects.com/zos/bmw-prod/d12c3392-61fa-489e-a82c-71de0f888a8e.svg"
                            size="large" /> } description="使用前后端统一的语言方案快速构建后端应用" value="nodejs" />
                    </CheckCard.Group>
                </ProForm.Item>

                <ProForm.Item name="buildScript" initialValue={"# 编译命令，注：当前已在代码根路径下 \rmvn clean package "}  >
                    <ProFormTextArea label="构建脚本"  
                        fieldProps={ {autoSize:{minRows: 4, maxRows: 8},style:{ background:"black" ,color: 'whitesmoke'}  } }   ></ProFormTextArea>
                </ProForm.Item>
                <ProForm.Item name="buildFile" initialValue={"./Dockerfile"} >
                    <ProFormText label="构建文件"  ></ProFormText>
                </ProForm.Item>
             </ProForm>
            </Drawer>
        </div>
        
        )
    

}


export default AppBuildList