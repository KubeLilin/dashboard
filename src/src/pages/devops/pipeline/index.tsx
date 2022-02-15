import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tag, Typography,Tabs,Layout,List,Card,Divider,Input, Space,Popconfirm, Drawer,Avatar } from 'antd';
import { history, Link } from 'umi';
import ProCard from '@ant-design/pro-card';
import { FormOutlined,SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone,DeleteOutlined} from '@ant-design/icons'
import type { ProFormInstance } from '@ant-design/pro-form';
import { CheckCard } from '@ant-design/pro-card';
import ProForm, {
  ProFormTextArea	,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';
const { TabPane } = Tabs;
const { Content } = Layout;

import { getDeploymentList,GetAppGitBranches,GetBuildScripts } from '../../applications/info/deployment.service'
import { StageItem, StepItem } from './data'
var buildScriptList:any

const Pipeline : React.FC = () => {

    var appId = history.location.query?.appid
   
    if (!buildScriptList){
        GetBuildScripts().then((v)=>{
            buildScriptList =  v.data
            console.log(buildScriptList)
        })
    }   


    const StepCommands = [
        { name:'拉取代码',key:'git_pull' },
        { name:'编译构建',key:'code_build' },
        { name:'命令执行',key:'cmd_shell' },
        { name:'应用部署',key:'app_deploy' },
    ]

    const initStages:StageItem[] = [
        {
           name: '编译构建',
           steps:[
               { name:'拉取代码',key:'git_pull' },
               { name:'编译命令',key:'code_build' },
               { name:'命令执行',key:'cmd_shell' },
           ]
        },
        {
            name: '部署',
            steps:[
                { name:'应用部署',key:'app_deploy' },
            ]
        }
    ]
    const [allStages, setAllStages] = useState<StageItem[]>(initStages);
    const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
    const [currentStageName, setCurrentStageName] = useState<string>(initStages[0].name);
    const [currentStageSetpIndex, setCurrentStageSetpIndex] = useState<number>(0);
    const [visableStepsSelected, setVisableStepsSelected] = useState(false);

    const gitForm =  useRef<ProFormInstance>();
    const buildForm =  useRef<ProFormInstance>();
    const shellForm =  useRef<ProFormInstance>();
    const deployForm =  useRef<ProFormInstance>();


    const addNewStage= (index:number) => {
        allStages.splice(index,0,{ name:'新阶段',steps:[{ name:'命令执行',key:'cmd_shell' }] })
        bindAllStages()
    }

    const removeStage = () => {
        if(allStages.length > 0){
            allStages.splice(currentStageIndex,1)
            bindAllStages()
        }
    }

    const removeStep = (stepIndex:number) => {
        if(allStages[currentStageIndex].steps.length > 0) {
            allStages[currentStageIndex].steps.splice(stepIndex,1)
            bindAllStages()
        }
    }

    const bindAllStages = () => {
        setAllStages([...allStages])
        setCurrentStageIndex(0)
        setCurrentStageSetpIndex(0)
    }

    const onFormSave = async (formData: Record<string, any>) => {
        console.log(formData)
        allStages[currentStageIndex].steps[currentStageSetpIndex].content = formData
        return true
    }

    const onStepItemClick = (item:StepItem,index:number) => {
        if (allStages[currentStageIndex].steps.length > index) {
            allStages[currentStageIndex].steps[index].name = item.name
          
            
            const currentSetpItem = allStages[currentStageIndex].steps[index]
            if (currentSetpItem.content) {
                var currentForm:any
                switch (currentSetpItem.key) {
                case "git_pull":
                    currentForm = gitForm
                    break
                case "code_build":
                    currentForm = buildForm
                    break
                case "cmd_shell":
                    currentForm = shellForm
                    break
                case "app_deploy":
                    currentForm = deployForm    
                    break
                }
                currentForm?.current?.resetFields()
                currentForm?.current.setFieldsValue(currentSetpItem.content)
            }
            setCurrentStageSetpIndex(index)
        }
    }


    return (        
    <PageContainer title={'流水线名称: xxx'} 
        breadcrumb={{ routes:[
            { path: '/applications/apps', breadcrumbName: '返回应用中心' },
            { path: '', breadcrumbName: 'xxx应用', },
            { path: '', breadcrumbName: '流水线编辑', }
        ] }}
        header={{
            extra: [
                <Button key="1" onClick={() => { history.goBack() }}>返回上一级</Button>]
        }}>
        <Content style={{ background:'white' }} > 
                <Tabs defaultActiveKey="1" size="large" type="line" tabBarStyle={{ background:'white' ,paddingLeft:25 }} >
                    <TabPane tab="编辑泳道" key="1" >
                    <ProCard split="horizontal" >
                        <ProCard headerBordered >   
                        <Button size="large">开始</Button>--<Button onClick={()=>addNewStage(0)} shape="circle" icon={<PlusOutlined />} size="small"/>
                        
                        { allStages.map((item,index)=>{ 
                           return <span key={item.name+index}>
                                --<Button shape="round" type="primary" size="large" icon={<FormOutlined />}
                                onClick={()=>{
                                    setCurrentStageIndex(index)
                                    setCurrentStageName(allStages[index].name)
                                    setCurrentStageSetpIndex(0)
                                }}>{item.name}</Button>
                                --<Button onClick={()=>addNewStage(index+1)} shape="circle" icon={<PlusOutlined />} size="small"/></span>
                        }) }

                        --<Button size="large">结束</Button>
                        </ProCard>
                        <ProCard split="vertical">
                            <ProCard colSpan="17%">
                            <Space direction='horizontal'>
                                <Input value={currentStageName} onChange={(e)=>{ setCurrentStageName(e.currentTarget.value) }} />
                                <Button type="primary" onClick={()=>{
                                    allStages[currentStageIndex].name = currentStageName
                                    setAllStages([...allStages])
                                }} icon={<CheckCircleOutlined />} />
                                <Popconfirm title="确定要删除这个阶段吗?" onConfirm={removeStage}>
                                    <Button type="primary" danger icon={<DeleteOutlined />}/>
                                </Popconfirm>
                            </Space>
                                <Divider />
                                <List dataSource={allStages[currentStageIndex].steps} header={<span style={{fontSize:16}}> 步骤(子任务列表):</span>}
                                renderItem={(item,index) => (
                                    <List.Item>
                                         <Card hoverable bordered style={{ textAlign:"center",height:"10",width:"100%", backgroundColor: currentStageSetpIndex== index?"whitesmoke":""}} 
                                            onClick={()=>onStepItemClick(item,index)}>
                                            <div> {item.name}  
                                            <Popconfirm title="确定要删除这个阶段吗?" onConfirm={()=>removeStep(index)}>
                                            <Button type="primary" danger icon={<DeleteOutlined />} style={{marginLeft:20}} />
                                            </Popconfirm>
                                            </div>
                                         </Card>
                                    </List.Item>
                                )}   footer={<a style={{fontSize:16}} onClick={()=>{  
                                    setVisableStepsSelected(true)
                                }} >添加子任务+</a>}  />
                            </ProCard >
                            <ProCard >
                                <span style={{fontSize:16}}>{allStages[currentStageIndex].steps[currentStageSetpIndex].name}</span>
                                <Divider />

                                <div id="git_pull" style={{ display: allStages[currentStageIndex].steps[currentStageSetpIndex].key=="git_pull"?"block":"none" }}  >
                                    <ProForm formRef={gitForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存</Button> ] }}
                                     onFinish={onFormSave} >
                                        <ProForm.Item name="branch">
                                        <ProFormSelect label="代码分支" width="md"  request={async()=>{
                                            const namesRes = await GetAppGitBranches(Number(appId))
                                            return namesRes.data.map((item)=> ({label: item ,value:item}) )
                                        }} ></ProFormSelect>
                                        </ProForm.Item>
                                    </ProForm>  
                                </div>
                                <div id="code_build" style={{ display: allStages[currentStageIndex].steps[currentStageSetpIndex].key=="code_build"?"block":"none" }}>
                                    <ProForm formRef={buildForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存</Button> ] }} 
                                        onFinish={onFormSave} >
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
                                            fieldProps={ {autoSize:{minRows: 6, maxRows: 16},style:{ background:"black" ,color: 'whitesmoke'}  } }   ></ProFormTextArea>
                                    </ProForm.Item>
                                    <ProForm.Item name="buildFile" initialValue={"./Dockerfile"} >
                                        <ProFormText label="构建文件"  ></ProFormText>
                                    </ProForm.Item>
                                    </ProForm>  
                                    
                                </div>
                                <div id="cmd_shell" style={{ display: allStages[currentStageIndex].steps[currentStageSetpIndex].key=="cmd_shell"?"block":"none" }}>
                                <ProForm formRef={shellForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存</Button> ] }} 
                                  onFinish={onFormSave} >
                                    <ProForm.Item name="shell" initialValue={"# 编译命令，注：当前已在代码根路径下 \rmvn clean package "}  >
                                        <ProFormTextArea 
                                            fieldProps={ {autoSize:{minRows: 16, maxRows: 28},style:{ background:"black" ,color: 'whitesmoke'}  } }   ></ProFormTextArea>
                                    </ProForm.Item>
                                </ProForm>
                                </div>
                   
                                <div id="app_deploy" style={{ display: allStages[currentStageIndex].steps[currentStageSetpIndex].key=="app_deploy"?"block":"none" }}>
                                <ProForm formRef={deployForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存</Button> ] }} 
                                  onFinish={onFormSave} >
                                    <ProForm.Item name="depolyment">
                                        <ProFormSelect label="部署环境" width="md" request={async()=>{
                                                            const deployPage = await getDeploymentList({appid:1,current:1,pageSize:50})
                                                            return deployPage.data.map((item)=> ({label: item.name ,value:item.id}) )
                                         }} ></ProFormSelect>
                                    </ProForm.Item>
                                </ProForm>                                
                                </div>
                            </ProCard>
                        </ProCard>
                    </ProCard>

                    <Drawer title="新增子任务" visible={visableStepsSelected} destroyOnClose  onClose={() => { setVisableStepsSelected(false) }} >
                     <List dataSource={StepCommands} 
                     renderItem={(item,index) => (
                        <List.Item>
                            <div>
                                <span>{item.name} </span>
                                <Button type="primary" onClick={()=>{
                                    allStages[currentStageIndex].steps.push(item)
                                    setVisableStepsSelected(false)
                                }}>创建</Button>
                            </div>
                        </List.Item>
                    )}>
                     
                     </List>
                    </Drawer>

                    </TabPane>
                    <TabPane tab="环境变量" key="2" >
                    </TabPane>
                    <TabPane tab="WebHooks" key="3" >
                    </TabPane>
                </Tabs>
        </Content>

    </PageContainer>
    )

}

export default Pipeline