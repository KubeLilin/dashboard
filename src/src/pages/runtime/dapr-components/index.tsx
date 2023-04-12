import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns,ActionType } from '@ant-design/pro-table';
import { Button, Space,Popconfirm,Tag,Card,message } from 'antd';
import React, { useState,useRef } from 'react';
import Form,{ DrawerForm ,ProForm,ProFormCheckbox,ProFormInstance,ProFormSelect,ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import { history, Link,useModel } from 'umi';

import { GetDaprComponentList,GetDaprComponentTypeList,GetDaprComponentTemplateByType,
    CreateOrUpdateDaprComponent, DeleteDaprComponent } from './service';


const DaprComponents: React.FC = () => {  

    var cid = Number(history.location.query?.cid)
    var namespace = history.location.query?.namespace

    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const [runtimeTemp, runtimeTempFunc] = useState<any>(null);
    // isEditState 
    const [isEdit, isEditFunc] = useState<boolean>(false);

    const formNewNSRef = useRef<ProFormInstance>();

    const actionRef = useRef<ActionType>();

    const ComponentsColumns: ProColumns[] = [
        {
            title: 'Name',
            dataIndex: ['metadata','name'],
            search:false,
            width:350,
            render:(dom,row)=> (
                <Tag key={row.name + '_tag'} color='blue' style={{fontSize:14}}> {dom}</Tag>
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
                <Space key={row.name + "option"}>
                    <a onClick={()=>{
                        isEditFunc(true)
                        formVisibleFunc(true)

                        setTimeout(()=>{
                            runtimeTempFunc(row)
                            formNewNSRef.current?.setFieldsValue({
                                id:row.id,
                                name:row.metadata.name,
                                namespace:row.metadata.namespace,
                                type:row.spec.type,
                                version: row.spec.version,
                            })
                        },20)
                      
                    }} >更新组件</a>

                    <Popconfirm key="link-confirm" title="确定要删除此组件吗?" onConfirm={async()=>{
                        const success = await DeleteDaprComponent(cid,row.metadata.namespace,row.metadata.name)
                        if (success) {
                            message.success('组件删除成功！')
                            actionRef.current?.reload()
                        }
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
                rowKey="name"
                headerTitle="组件模板列表"
                form={{  ignoreRules: false, }}
                search={false}
                request={async (params, sort) => { 
                    const res  = await GetDaprComponentList(cid,namespace )
                    return res
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={()=>{
                        runtimeTempFunc(null)
                        isEditFunc(false)
                        formVisibleFunc(true)
                    } }> 添加组件 </Button>
                ]} >

            </ProTable>
            <DrawerForm title="Component Configuration" width={500} visible={formVisible} formRef={formNewNSRef} drawerProps={{ destroyOnClose:true }}
                 onVisibleChange={(v)=>{
                    if (v == false) {
                        runtimeTempFunc(null)
                    }
                    formVisibleFunc(v)
                }}
                 onFinish={async (formData) => {
                    console.log(formData)
                    const success = await CreateOrUpdateDaprComponent(formData)
                    if (success) {
                        message.success('组件操作成功！')
                        formNewNSRef.current?.resetFields()
                        actionRef.current?.reload()
                    }
                    return true
                 }} >
 
                <ProFormText name="id" hidden ></ProFormText>
                <ProFormText name="cid" hidden initialValue={cid} ></ProFormText>
                <ProFormText name="version" hidden initialValue={'v1'} ></ProFormText>
                <ProFormText name="namespace" label="Namesapce" initialValue={namespace} disabled ></ProFormText>
                <ProFormText name="name" label="Name" disabled={isEdit} rules={[{ required: true ,  message: '请填写组件名称' }]} ></ProFormText>
            
                <ProFormSelect name="type" label="Type" disabled={isEdit}   rules={[{ required: true ,  message: '请选择组件类型' }]}
                 request={async()=> {
                    const res = await GetDaprComponentTypeList()
                    return res.data
                }}
                fieldProps={{
                    onChange: async (value) => {
                        const res = await GetDaprComponentTemplateByType(value)
                        if (res.success)  {
                            console.log(res)
                            runtimeTempFunc(res.data)
                        }
                    }}}
                ></ProFormSelect>

                <Card title="Metadata">
                    { runtimeTemp?.spec?.metadata?.map((item:any,index:number)=> 
                        item.name.toLowerCase().includes('password')?
                            <ProFormText.Password key={item.name} name={['metadata',item.name]} label={item.name} initialValue={item.value} /> :
                            <ProFormText key={item.name}  name={['metadata',item.name]} label={item.name} initialValue={item.value}/>  
                      )
                    }

                </Card>
            </DrawerForm>
    </PageContainer>
   )
}

export default DaprComponents