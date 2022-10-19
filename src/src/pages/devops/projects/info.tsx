import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Tabs,Layout,Input, Button, Badge,Form,Transfer ,message } from 'antd';
import { history, Link } from 'umi';
const { TabPane } = Tabs;
const { Content } = Layout;
import { ApplicationItem } from '../../applications/apps/apps_data';
import {  getApps } from './service';
import { AppsColumns } from './components/project_apps'
import ProjectDeployList from './components/project_deploys'
import ProjectPipelineList from './components/project_pipeline'
import { Item } from 'gg-editor';

const ProjectInfo: React.FC = () => {
    var projectId = Number(history.location.query?.id)
    var projectName = history.location.query?.name
    const [autoLoadPipelineData, setAutoLoadPipelineData] = useState<boolean>(false)


    return (
        <PageContainer title={'项目名称: ' + projectName} 
            breadcrumb={{ routes:[
                { path: '#', breadcrumbName: 'DevOps' },
                { path: '/devops/projects', breadcrumbName: '项目管理', }
            ] }}
            header={{
                extra: [
                    <Button key="1" onClick={() => { history.replace('/devops/projects') }}>返回项目列表</Button>]
            }}>
            <Content style={{ background:'white'}} > 
            <Tabs  size="large" type="line" tabBarStyle={{ background:'white' ,paddingLeft: 25 }} 
                onChange={(key)=>{
                    console.log(key)
                    if(key=="3") {
                        setAutoLoadPipelineData(true)
                    } else {
                        setAutoLoadPipelineData(false)
                    }
                }}>
                <TabPane tab="应用列表" key="1" >
                    <ProTable<ApplicationItem>  headerTitle="项目应用列表"  rowKey={record => record.id} columns={AppsColumns}
                        request={async (p, s, f) => {  p.pid = projectId
                            return getApps(p,s, f) }} >       
                    </ProTable>
                </TabPane>
                <TabPane tab="部署环境" key="2" >
                    <ProjectDeployList projectId={projectId} />
                </TabPane>
                <TabPane tab="流水线" key="3" >
                    <ProjectPipelineList projectId={projectId} AutoLoad={autoLoadPipelineData} />
                </TabPane>
                <TabPane tab="权限管理" key="4" disabled>
                </TabPane>
                <TabPane tab="资源情况" key="5" disabled>
                </TabPane>
            </Tabs>
            </Content>
        </PageContainer>
    )
}


export default ProjectInfo