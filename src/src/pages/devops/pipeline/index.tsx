import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tag, Typography,Tabs,Layout,List,Card,Divider,Input, Space,Popconfirm } from 'antd';
import { history, Link } from 'umi';
import ProCard from '@ant-design/pro-card';
import { FormOutlined,SettingOutlined,EditOutlined ,CloseCircleTwoTone,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined,
    EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone,DeleteOutlined} from '@ant-design/icons'
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormTextArea	,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';
const { TabPane } = Tabs;
const { Content } = Layout;

import { StageItem } from './data'

const Pipeline : React.FC = () => {

    const Stages:StageItem[] = [
        {
           name: '编译构建',
           steps:[
               { name:'拉取代码',key:'git_pull' },
               { name:'编译命令',key:'code_build' },
               { name:'打包构建',key:'docker_push' },
           ]
        },
        {
            name: '部署',
            steps:[
                { name:'打包构建',key:'app_deploy' },
            ]
        }
    ]
    const [allStages, setAllStages] = useState<StageItem[]>(Stages);
    const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
    const [currentStageName, setCurrentStageName] = useState<string>(Stages[0].name);
    const [currentStageSetpIndex, setCurrentStageSetpIndex] = useState<number>(0);


    const addNewStage= (index:number)=>{
        allStages.splice(index,0,{ name:'新阶段',steps:[ { name:'打包构建',key:'app_deploy' }] })
        setAllStages([...allStages])
        setCurrentStageIndex(0)
        setCurrentStageSetpIndex(0)
    }

    const removeStage = () => {
        if(allStages.length > 0){
            allStages.splice(currentStageIndex,1)
            setAllStages([...allStages])
            setCurrentStageIndex(0)
            setCurrentStageSetpIndex(0)
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
                           return <span key={item.name}>
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
                            <ProCard colSpan="20%">
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
                                            onClick={()=>{
                                                allStages[currentStageIndex].steps[index].name = item.name
                                                setCurrentStageSetpIndex(index)
                                            }}>{item.name}</Card>
                                    </List.Item>
                                )}   footer={<a style={{fontSize:16}}>添加子任务+</a>}  />
                            </ProCard >
                            <ProCard >
                                <span style={{fontSize:16}}>{allStages[currentStageIndex].steps[currentStageSetpIndex].name}</span>
                                <Divider />

                                <div id="git">
                                <ProForm>
                                </ProForm>  
                                </div>

                            </ProCard>
                        </ProCard>
                    </ProCard>
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