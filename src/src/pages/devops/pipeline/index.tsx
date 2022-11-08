import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tag, Typography,Tabs,Layout,List,Card,Divider,Input, Space,Popconfirm, Drawer,Avatar,Tooltip,message,Spin } from 'antd';
import { history, Link } from 'umi';
import ProCard from '@ant-design/pro-card';
import { FormOutlined,SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,AppstoreAddOutlined,
    EllipsisOutlined,PlayCircleFilled,SaveTwoTone,PlusOutlined,ScheduleTwoTone ,CheckCircleTwoTone,DeleteOutlined} from '@ant-design/icons'
import type { ProFormInstance } from '@ant-design/pro-form';
import { CheckCard } from '@ant-design/pro-card';
import ProForm, {
  ProFormTextArea	,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';
const { TabPane } = Tabs;
const { Content } = Layout;

import { getDeploymentList,GetAppGitBranches,GetBuildScripts, SavePipeline, GetPipelineById ,GetNotifications  } from '../../applications/info/deployment.service'
import { getAppLanguages,getBuildImageByLanguageId } from './service'
import { StageItem, StepItem } from './data'

var initStages:StageItem[]

const Pipeline : React.FC = () => {
    var PipelineId = Number(history.location.query?.id)
    var PipelineName = history.location.query?.name

    var appId = history.location.query?.appid
    var appName =  history.location.query?.appname


    const StepCommands = [
        { name:'拉取代码',key:'git_pull',save:false },
        { name:'编译构建',key:'code_build' ,save:false},
        { name:'命令执行',key:'cmd_shell' ,save:false},
        { name:'应用部署',key:'app_deploy' ,save:false},
        { name:'发布通知',key:'publish_notify' ,save:false},
    ]

    if (!initStages) {
        initStages = [
            {
                name: '代码',
                steps:[
                    { name:'拉取代码',key:'git_pull',save:false },
                ]
            },
            {
               name: '编译构建',
               steps:[
                   { name:'编译命令',key:'code_build',save:false },
               ]
            },
            {
                name: '部署',
                steps:[
                    { name:'应用部署',key:'app_deploy' ,save:false},
                ]
            },
            {
                name: '通知',
                steps:[
                    { name:'通知',key:'publish_notify',save:false },            ]
            }
        ]
    }

    const [pipelineName, setPipelineName] = useState<string>(String(PipelineName));
    const [appLanuages, setAppLanuages] = useState<[]>();
    
    const [languageCompileOptions, setLanguageCompileOptions] = useState<any>([]);

    const [allStages, setAllStages] = useState<StageItem[]>([]);
    const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
    const [currentStageName, setCurrentStageName] = useState<string>("");
    const [currentStageSetpIndex, setCurrentStageSetpIndex] = useState<number>(0);
    const [visableStepsSelected, setVisableStepsSelected] = useState(false);
    const [onLoaded, setLoaded] = useState<boolean|undefined>(false);



    const gitForm =  useRef<ProFormInstance>();
    const buildForm =  useRef<ProFormInstance>();
    const shellForm =  useRef<ProFormInstance>();
    const deployForm =  useRef<ProFormInstance>();
    const notifyForm = useRef<ProFormInstance>();

    useEffect(()=>{
        console.log("page loaded: pipeline id="+ PipelineId)
        GetPipelineById(PipelineId).then(resp => {
            if (resp && resp.success && resp.data.dsl !="") {
                const pipeline = resp.data
                const stagesDSL:StageItem[] = JSON.parse(pipeline.dsl)
                setCurrentStageName(stagesDSL[0].name)
                setAllStages([...stagesDSL])
                setTimeout(()=>{
                    onStepItemClick(stagesDSL[0].steps[0],0,0)
                },50)
            } else {
                setCurrentStageName(initStages[0].name)
                setAllStages([...initStages])
            }
            setLoaded(true)
        })

        getAppLanguages().then((x)=>{
            setAppLanuages(x)
            console.log(x)
        })
        
    },[onLoaded])

    const addNewStage= (index:number) => {
        allStages.splice(index,0,{ name:'新阶段',steps:[{ name:'命令执行',key:'cmd_shell', save:false, }] })
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
            setAllStages([...allStages])
            setCurrentStageSetpIndex(0)
        }
    }

    const bindAllStages = () => {
        setAllStages([...allStages])
        setCurrentStageIndex(0)
        setCurrentStageSetpIndex(0)
    }

    const getCurrentStep = (index:number):(StepItem|undefined) =>  {
        if (allStages.length > 0) {
            return allStages[currentStageIndex].steps[index]
        } else {
            return undefined
        }
    }

    const onFormValuesChanged = async () => {
        allStages[currentStageIndex].steps[currentStageSetpIndex].save = false
        setAllStages([...allStages])
    }

    const onFormSave = async (formData: Record<string, any>) => {
        console.log(formData)
        allStages[currentStageIndex].steps[currentStageSetpIndex].content = formData
        allStages[currentStageIndex].steps[currentStageSetpIndex].save = true
        setAllStages([...allStages])

        const key = 'onSaveForm';
        message.loading({ content: '保存步骤中...', key });
        setTimeout(() => {
          message.success({ content: '保存步骤成功!', key, duration: 3 });
        }, 400);

        return true
    }

    const onSavePipeline = async () => {        
        const key = "savePipeline"
        message.loading({ content: '保存中...', key });
        const res = await SavePipeline({
            appid: Number(appId),
            id: PipelineId,
            name: pipelineName,
            dsl: JSON.stringify(allStages)
        })

        if (res && res.success){
            message.success({ content: '保存流水线成功!', key, duration: 3 , style: { marginTop: '20vh' } });
        } else {
            message.error({content:'保存流水线失败！',key ,  style: { marginTop: '20vh' }})
        }
    }


    const BindingLanguageComilpeImages = async (languageName:string)=>{
        const query:any = appLanuages?.filter((v:any)=>v.name == languageName)
        if (query && query.length > 0) {
            const script = query[0].compileScripts
            buildForm?.current?.setFieldsValue({buildScript: script})
            const languageId = query[0].id
            console.log(languageId)
            const dataList = await getBuildImageByLanguageId(languageId)
            setLanguageCompileOptions(dataList)
        }
    }


    const onStepItemClick = (item:StepItem,stageIndex:number,stepindex:number) => {
        if (allStages.length > 0 && allStages[stageIndex].steps.length > stepindex) {
            allStages[stageIndex].steps[stepindex].name = item.name
          
            setCurrentStageSetpIndex(stepindex)
            const currentSetpItem = allStages[stageIndex].steps[stepindex]
            if (currentSetpItem.content) {
                var currentForm:any
                switch (currentSetpItem.key) {
                case "git_pull":
                    currentForm = gitForm
                    break
                case "code_build":
                    currentForm = buildForm
                    console.log(currentSetpItem.content)
                    BindingLanguageComilpeImages(currentSetpItem.content.buildEnv)
                    break
                case "cmd_shell":
                    currentForm = shellForm
                    break
                case "app_deploy":
                    currentForm = deployForm    
                    break
                case "publish_notify":
                    currentForm = notifyForm
                    break
                }
                currentForm?.current?.resetFields()
                currentForm?.current.setFieldsValue(currentSetpItem.content)
            }
        }
    }
    

    return (        
    <PageContainer title={ 
        <div style={{width:600}} >流水线名称：
        <Input style={{width:300}} value={pipelineName} 
            onChange={(e)=>{ setPipelineName(e.target.value) }}></Input> 
        <span>  </span> 
        <Tooltip title="最终保存流水线,否则修改将不生效!">
        <Button type='primary' icon={<CheckCircleOutlined />} onClick={onSavePipeline}>保存流程线</Button>
        </Tooltip>
        </div> }

        breadcrumb={{ routes:[
            { path: '/applications/apps', breadcrumbName: '返回应用中心' },
            { path: '', breadcrumbName: `应用:${appName}`, },
            { path: '', breadcrumbName: '流水线编辑', }
        ] }}
        header={{
            extra: [
                <Button key="1" onClick={() => { 
                    console.log(appName)
                    if (appName){
                        const returnUrl = `/applications/info?id=${appId}&name=${appName}&returnkey=3`
                        history.replace(returnUrl)
                    } else {
                        history.goBack()
                    }
                 }}>返回上一级</Button>]
        }}>
        <Content style={{   }} > 
                <Tabs defaultActiveKey="1" size="large" type="line" tabBarStyle={{ paddingLeft:25 }} >
                    <TabPane tab="编辑泳道" key="1" >
                    <Spin spinning={!onLoaded}>
                    <div> <div style={{ fontSize:16,fontStyle:"oblique", marginLeft: 23,marginBottom:18,  }}>         
                        <Space direction='horizontal'>
                            当前阶段名称:
                            <Input value={currentStageName} onChange={(e)=>{ setCurrentStageName(e.currentTarget.value) }} />
                            <Tooltip title="修改当前阶段名称" key="purple">
                                <Button type="primary" onClick={()=>{
                                    allStages[currentStageIndex].name = currentStageName
                                    setAllStages([...allStages])
                                }} icon={<CheckCircleOutlined />}>更新名称</Button>
                            </Tooltip>
                            <Popconfirm title={`确定要删除"${currentStageName}"这个阶段吗?`} onConfirm={removeStage}>
                                <Tooltip title="删除当前阶段"  key="purple">
                                    <Button type="primary" danger icon={<DeleteOutlined />}>删除阶段</Button>
                                </Tooltip>
                            </Popconfirm>
                        </Space>
                    </div> </div>
           
                    <ProCard split="horizontal" >
                        <ProCard headerBordered >   
                        <Button size="large">开始节点</Button>———<Tooltip title="添加新阶段"><Button onClick={()=>addNewStage(0)} shape="circle" icon={<PlusOutlined />} size="small"/></Tooltip>
                        
                        { allStages.map((item,index)=>{ 
                           return <span key={item.name+index}>
                                ———<Button shape="round" type="primary" size="large" ghost={currentStageIndex!=index} icon={<FormOutlined />}
                                onClick={()=>{
                                    setCurrentStageIndex(index)
                                    setCurrentStageName(allStages[index].name)
                                    onStepItemClick(item.steps[0],index,0)
                                }}>{item.name}</Button>
                                ———<Tooltip title="添加新阶段"><Button onClick={()=>addNewStage(index+1)} shape="circle" icon={<PlusOutlined />} size="small"/></Tooltip></span>
                        }) }

                        ———<Button size="large">结束节点</Button>
                        </ProCard>
                        <ProCard split="vertical">
                            <ProCard colSpan="340px">
                                <List dataSource={allStages.length>0?allStages[currentStageIndex].steps:[]} bordered size="small"
                                header={<Tooltip title="为当前阶段添加步骤" > 
                                            <Button type="dashed"  size="large" block icon={<PlusOutlined />} onClick={()=>{  
                                                setVisableStepsSelected(true)
                                            }}>添加步骤</Button> </Tooltip> }
                                renderItem={(item,index) => (
                                    <List.Item>
                                         <Card key={ (index+1) + ":" +item.name } hoverable bordered style={{width:'100%',color:'#722ED1', borderColor: currentStageSetpIndex == index?'#722ED1':'' }} 
                                            onClick={()=>onStepItemClick(item,currentStageIndex,index)}> 
                                            <div >
                                            <AppstoreAddOutlined  /><span style={{ margin:20, fontSize:16,width:50,color:"#722ED1"}}>{item.name}</span><span style={{ width:50,color:"red"}}>{getCurrentStep(index)?.save?"        ":"**        "}</span>  
                                                <Popconfirm title="确定要删除这个步聚吗?" onConfirm={(e)=>{  removeStep(index); e?.stopPropagation() }}>
                                                    <Tooltip title="删除此步聚"  >
                                                        <Button type="primary" size="middle" danger icon={<DeleteOutlined />} style={{marginLeft:20 , width:40}} />
                                                    </Tooltip>
                                                </Popconfirm>
                                            </div>
                                         </Card>
                                    </List.Item>
                                )}   
                                // footer={} 
                                 />
                            </ProCard >
                            <ProCard >
                                <span style={{fontSize:16}}>步骤: { getCurrentStep(currentStageSetpIndex)?.name }  (每个步骤必须保存才能生效) </span>
                                <Divider />

                                <div id="git_pull" style={{ display:allStages.length>0&&allStages[currentStageIndex].steps.length>0?allStages[currentStageIndex].steps[currentStageSetpIndex].key=="git_pull"?"block":"none" :"none" }}  >
                                    <ProForm onValuesChange={onFormValuesChanged} formRef={gitForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存当前步骤</Button> ] }}
                                     onFinish={onFormSave} >
                                        <ProForm.Item name="git" >
                                            <ProFormText label="git" width="md" disabled></ProFormText>
                                        </ProForm.Item>

                                        <ProForm.Item name="branch" rules={[{ required: true, message: '请选择代码分支' }]}>
                                        <ProFormSelect label="代码分支" width="md"  request={async()=>{
                                            const namesRes = await GetAppGitBranches(Number(appId))
                                            gitForm.current?.setFieldsValue({ git: namesRes.data.git })
                                            if (namesRes.data.branches){
                                                return namesRes.data.branches.map((item)=> ({label: item ,value:item}) )
                                            } else {
                                                return [{label: 'master' ,value:'master'}]
                                            }
                                        }} ></ProFormSelect>
                                        </ProForm.Item>
                                    </ProForm>  
                                </div>
                                <div id="code_build" style={{ display: allStages.length>0&&allStages[currentStageIndex].steps.length>0?allStages[currentStageIndex].steps[currentStageSetpIndex].key=="code_build"?"block":"none" :"none"}}>
                                    <ProForm onValuesChange={onFormValuesChanged} formRef={buildForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存当前步骤</Button> ] }} 
                                        onFinish={onFormSave} >
                                    <ProForm.Item name="buildEnv" label="构建环境" initialValue={"java"} rules={[{ required: true, message: '请选择构建环境' }]}>
                                        <CheckCard.Group style={{ width: '100%'  }} defaultValue={""}
                                            onChange={async (val)=>{
                                                console.log(val)
                                                BindingLanguageComilpeImages(String(val))
                                            }}
                                        // CheckCard.Group end
                                        > { appLanuages?.map((language:any) => 
                                                <CheckCard key={language.id} title={language.alias} avatar={ <Avatar src={language.icon} 
                                                        size="large" /> } description={language.content} value={language.name} style={{ background:'#000' }} />) }
                                                </CheckCard.Group>
                                    </ProForm.Item>
                                    <ProForm.Item name="buildImage" rules={[{ required: true, message: '请选择构建环境' }]}>
                                        <ProFormSelect label="构建镜像" width="md" options={languageCompileOptions} ></ProFormSelect>
                                    </ProForm.Item>
                                    <ProForm.Item name="buildScript" initialValue={"# 编译命令，注：当前已在代码根路径下 \rmvn clean package "} rules={[{ required: true, message: '请选择填写构建脚本' }]} >
                                        <ProFormTextArea label="构建脚本"  
                                            fieldProps={ {autoSize:{minRows: 6, maxRows: 16},style:{ background:"black" ,color: 'whitesmoke'}  } }   ></ProFormTextArea>
                                    </ProForm.Item>
                                    <ProForm.Item name="buildFile" initialValue={"./Dockerfile"} >
                                        <ProFormText label="构建文件"  ></ProFormText>
                                    </ProForm.Item>
                                    </ProForm>  
                                    
                                </div>
                                <div id="cmd_shell" style={{ display: allStages.length>0&&allStages[currentStageIndex].steps.length>0?allStages[currentStageIndex].steps[currentStageSetpIndex].key=="cmd_shell"?"block":"none":"none" }}>
                                <ProForm onValuesChange={onFormValuesChanged} formRef={shellForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存当前步骤</Button> ] }} 
                                  onFinish={onFormSave} >
                                    <ProForm.Item name="shell" initialValue={"# bash"} rules={[{ required: true, message: '请填写命令行' }]}  >
                                        <ProFormTextArea 
                                            fieldProps={ {autoSize:{minRows: 16, maxRows: 28},style:{ background:"black" ,color: 'whitesmoke'}  } }   ></ProFormTextArea>
                                    </ProForm.Item>
                                </ProForm>
                                </div>
                   
                                <div id="app_deploy" style={{ display: allStages.length>0&&allStages[currentStageIndex].steps.length>0?allStages[currentStageIndex].steps[currentStageSetpIndex].key=="app_deploy"?"block":"none":"none" }}>
                                <ProForm onValuesChange={onFormValuesChanged} formRef={deployForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存当前步骤</Button> ] }} 
                                  onFinish={onFormSave} >
                                    <ProForm.Item name="depolyment" rules={[{ required: true, message: '请选择部署环境' }]}>
                                        <ProFormSelect label="部署环境" width="md" request={async()=>{
                                                            const deployPage = await getDeploymentList({appid:Number(appId),current:1,pageSize:50})
                                                            return deployPage.data.map((item)=> ({label: item.name ,value:item.id}) )
                                         }} ></ProFormSelect>
                                    </ProForm.Item>
                                </ProForm>                                
                                </div>

                                <div id="publish_notify" style={{ display: allStages.length>0&&allStages[currentStageIndex].steps.length>0?allStages[currentStageIndex].steps[currentStageSetpIndex].key=="publish_notify"?"block":"none":"none" }}>
                                <ProForm onValuesChange={onFormValuesChanged} formRef={notifyForm} submitter={{ render:()=> [<Button type="primary" htmlType="submit">保存当前步骤</Button> ] }} 
                                  onFinish={onFormSave} >
                                    <ProForm.Item name="notifyType" rules={[{ required: true, message: '请选择通知类型' }]}>
                                        <ProFormSelect label="通知类型" width="md"  
                                            request={async()=>(await GetNotifications()).data }
                                         ></ProFormSelect>
                                    </ProForm.Item>
                                    <ProForm.Item  name="notifyKey" rules={[{ required: true, message: '请填写通知标示' }]}>
                                         <ProFormText label="通知标示" width="md" ></ProFormText>
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
                    </Spin>
                    </TabPane>
                    <TabPane tab="环境变量" key="2" disabled >
                    </TabPane>
                    <TabPane tab="WebHooks" key="3" disabled >
                    </TabPane>
                </Tabs>
        </Content>

    </PageContainer>
    )

}

export default Pipeline