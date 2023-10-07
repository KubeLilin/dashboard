import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns,ActionType } from '@ant-design/pro-table';
import { Button, Space,Popconfirm } from 'antd';
import React, { useState,useRef } from 'react';
import Form,{ DrawerForm ,ProForm,ProFormCheckbox,ProFormInstance,ProFormSelect,ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import { SaveDaprComponent, GetDaprComponentList,DeleteDaprComponent } from './service';

const DaprComponents: React.FC = () => {  

    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const formNewNSRef = useRef<ProFormInstance>();
    const actionRef = useRef<ActionType>();


    const ComponentsColumns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            search:false,
        },
        {
            title: '模板名称',
            dataIndex: 'name',
            search:false,
        },
        {
            title: '组件类型',
            dataIndex: 'componentType',
        },
        {
            title: '文档',
            dataIndex: 'doc',
            render:(dom,row) => <a href={row.doc} target='_blank'>{dom}</a>
        },
        {
            title: '操作',
            width:200,
            dataIndex: 'option',
            search:false,
            render:(_,row)=> [
                <Space key="option">
                    <a onClick={()=>{
                        console.log(row)
                        formVisibleFunc(true)
                        setTimeout(() => {
                            formNewNSRef.current?.setFieldsValue(row)
                        }, 100)                      
                    }} >更新模板</a>

                    <Popconfirm key="link-confirm" title="确定要删除这个模板吗?" onConfirm={async()=>{
                        const res = await DeleteDaprComponent(row.id)
                        if(res){
                            actionRef.current?.reload()
                        }
                    }}>
                    <a>删除模板</a>
                    </Popconfirm>
                </Space>
             
            ]
            
        }
    ]



    return (  
    <PageContainer title='Dapr Runtime Components'>
            <ProTable
                columns={ComponentsColumns}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="组件模板列表"
                form={{  ignoreRules: false, }}
                search={false}
                request={async (params, sort) => { 
                    const data  = await GetDaprComponentList()
                    return data
                }}
                toolBarRender={() => [       
                     <Button key="add" type='primary' onClick={()=>{ 
                        formVisibleFunc(true)
                    }}>添加组件模板</Button>  ]  }
                
             >

            </ProTable>
            <DrawerForm title="运行时(Runtime)配置" width={500} visible={formVisible} formRef={formNewNSRef} drawerProps={{ destroyOnClose:true }}  
                 onVisibleChange={formVisibleFunc}
                 onFinish={async (formData) => {
                    const success = await SaveDaprComponent(formData)
                    if (success) {
                        formNewNSRef.current?.resetFields()
                        actionRef.current?.reload()
                    }
                    return true
                 }} >
                <ProFormText name="id" hidden ></ProFormText>
                <ProFormText name="name" label="模板名称" hidden></ProFormText>
                <ProFormText name="componentType"  label="模板类型" rules={[{ required: true }]}></ProFormText>
                <ProFormTextArea name="template" label="YAML"  rules={[{ required: true }]}  fieldProps={ {autoSize:{minRows: 25, maxRows: 40},style:{ background:"black" ,color: 'whitesmoke'}  } }  />
                <ProFormText name="doc"  label="文档地址"  ></ProFormText>

            </DrawerForm>
    </PageContainer>
   )
}

export default DaprComponents