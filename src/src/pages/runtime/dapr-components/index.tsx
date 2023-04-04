import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns,ActionType } from '@ant-design/pro-table';
import { Button, Space,Popconfirm,Tag } from 'antd';
import React, { useState,useRef } from 'react';
import Form,{ DrawerForm ,ProForm,ProFormCheckbox,ProFormInstance,ProFormSelect,ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import { GetDaprComponentList } from './service';
import { history, Link,useModel } from 'umi';


const DaprComponents: React.FC = () => {  

    var cid = Number(history.location.query?.cid)
    var namespace = history.location.query?.namespace


    const actionRef = useRef<ActionType>();

    const ComponentsColumns: ProColumns[] = [
        {
            title: 'Name',
            dataIndex: ['metadata','name'],
            search:false,
            width:350,
            render:(dom,row)=> (
                <Tag color='blue' style={{fontSize:14}}> {dom}</Tag>
            )
        },
        {
            title: 'Kind',
            dataIndex: 'kind',
        },
        {
            title: 'API版本',
            dataIndex: 'apiVersion',
        },

        {
            title: '操作',
            width:200,
            dataIndex: 'option',
            search:false,
            render:(_,row)=> [
                <Space key="option">
                    <a onClick={()=>{
                 
                    }} >更新组件</a>

                    <Popconfirm key="link-confirm" title="确定要删除此组件吗?" onConfirm={async()=>{
                   
                    }}>
                    <a>删除组件</a>
                    </Popconfirm>
                </Space>
             
            ]
            
        }
    ]
    


    return (  
    <PageContainer title={`Dapr Runtime Components ( ${namespace} )`} >
            <ProTable
                columns={ComponentsColumns}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="组件模板列表"
                form={{  ignoreRules: false, }}
                search={false}
                request={async (params, sort) => { 
                    const res  = await GetDaprComponentList(cid,namespace )
                    return res
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={()=>{

                    } }> 添加组件 </Button>
                ]} >

            </ProTable>
    </PageContainer>
   )
}

export default DaprComponents