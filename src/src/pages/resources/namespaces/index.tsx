import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Upload, Input, Alert ,Modal, message,Select } from 'antd';
import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { ModalForm ,ProFormInstance,ProFormSelect,ProFormText} from '@ant-design/pro-form';
import { K8sNamespcae,GetClusterList,GetNameSpaceList,PutNewNameSpace } from './service';
import ProCard from '@ant-design/pro-card';



const Namespaces: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const ref = useRef<ProFormInstance>();
    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const [selectedCluster,setSelectedCluster] = useState<number | undefined>(undefined);

    const NamespcaeColumns: ProColumns<K8sNamespcae>[] = [
        {
            title: '集群',
            dataIndex: 'cid',
            // valueType: "select",
            // request: async()=>{
            //     var cs = await GetClusterList()
            //     if(cs.length >0) {
            //         ref.current?.setFieldsValue({cid:cs[0].value})
            //         setTimeout(()=>{
            //             ref.current?.submit()
            //         },500)
            //     }
            //     return cs
            // },    
            hideInTable:true
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            search:false
        },
        {
            title: '状态',
            search:false,
            dataIndex: 'status',
            valueEnum: {
              0: {
                text: '失效',
                status: 'Default',
              },
              1: {
                text: '生效',
                status: 'Success',
              },
            },
          },
    ]


    return (
        <PageContainer>
            <ProCard>
            <ProFormSelect name="clusters" width={260} label="集群" rules={[{required:true,message:"请选择集群"}]}
                fieldProps={{
                    value: selectedCluster,
                    onChange:(val)=>{
                        console.log(val)
                        setSelectedCluster(Number(val))
                        actionRef.current?.reload()
                    }
                 }}
                request={async()=>{
                            var cs = await GetClusterList()
                            if(cs.length >0) {
                                setSelectedCluster(cs[0].value)
                                setTimeout(() => {
                                    actionRef.current?.reload()
                                }, 500);
                            }
                            return cs
                }}
            ></ProFormSelect>
            </ProCard>
            <ProTable<K8sNamespcae>
                columns={NamespcaeColumns}
                formRef={ref}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="管理"
                search={false}
                request={async (params, sort) => { 
                    console.log(selectedCluster)                  
                    return await GetNameSpaceList(Number(selectedCluster))
                }}
                toolBarRender={() => [
                    <Button key='button' type="primary" icon={<PlusOutlined />} 
                        onClick={() => { 
                            formVisibleFunc(true)
                         }}>新建</Button>]}
             >

            </ProTable>

            <ModalForm title="新建命名空间" width={500} visible={formVisible} onVisibleChange={formVisibleFunc} modalProps={{ destroyOnClose:true }}
                onFinish={async (values) => {
                    var cid = Number(selectedCluster)
                    let rv = {
                        cid: cid,
                        ns: values.namespace
                    }
                    console.log(rv)
                    const resp = await PutNewNameSpace(cid,values.namespace)
                    if (resp.success) {
                        message.success("添加成功")
                        actionRef.current?.reload()
                    } else {
                        message.error(resp.message)
                    }
                    return true
                }}
            >
                <ProFormText width="md" name="namespace" label="命名空间名称" 
                    tooltip="最长为 24 位" placeholder="请输入名称"
                    rules={[ {  required: true, message: '命名空间为必填项',  }, { max:24 , message:'超过最大输入长度 > 24'}  ]} />
            </ModalForm>
        </PageContainer>
        )
}







export default Namespaces