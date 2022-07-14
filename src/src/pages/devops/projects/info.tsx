import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Tabs,Layout,Badge } from 'antd';
import { Input, Button, Form,Transfer ,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm,  ProFormText } from '@ant-design/pro-form';
import { history, Link } from 'umi';
const { TabPane } = Tabs;
const { Content } = Layout;


const ProjectInfo: React.FC = () => {
    var projectId = history.location.query?.id
    var projectName = history.location.query?.name

    return (
        <PageContainer title={'项目名称: ' + projectName} 
            breadcrumb={{ routes:[
                { path: '', breadcrumbName: '应用中心' },
                { path: '', breadcrumbName: '应用管理', }
            ] }}
            header={{
                extra: [
                    <Button key="1" onClick={() => { history.replace('/devops/projects') }}>返回上一级</Button>]
            }}>
            <Content style={{ background:'white' }} > 
            <Tabs  size="large" type="line" tabBarStyle={{ background:'white' ,paddingLeft:25 }} 
                onChange={(key)=>{
                 
                }}
            >
                <TabPane tab="应用列表" key="1" >
                </TabPane>
                <TabPane tab="部署环境" key="2" >
                </TabPane>
                <TabPane tab="流水线" key="3" >
                </TabPane>
                <TabPane tab="权限管理" key="4" >
                </TabPane>
                <TabPane tab="资源情况" key="5" >
                </TabPane>
            </Tabs>
            </Content>
        </PageContainer>
    )
}


export default ProjectInfo