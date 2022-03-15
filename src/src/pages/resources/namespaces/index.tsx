import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import {Modal, Button ,Divider ,Space, message, Card,InputNumber, Input,Progress} from 'antd';
import React, { useState, useRef } from 'react';
import { ContactsOutlined, PlusOutlined } from '@ant-design/icons';
import Form,{ DrawerForm ,ProFormInstance,ProFormSelect,ProFormText} from '@ant-design/pro-form';

import { TenantTableListItem, TenantTableListPagination,NamespcaeInfo } from './data'
import { GetClusterList,GetNameSpaceList,PutNewNameSpace ,
     queryTenant ,PutNewK8sNameSpace, GetResourceQuota,PostResourceQuota } from './service';
const { confirm } = Modal;

const Namespaces: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const ref = useRef<ProFormInstance>();
    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const formNewNSRef = useRef<ProFormInstance>();
    const NewNSRefActionRef = useRef<ActionType>();
    const quotaActionRef = useRef<ProFormInstance>();
    const [quotaVisible, quotaVisibleFunc] = useState<boolean>(false);
    const [quotaEdit,quotaEditSet] = useState<boolean>(false);
    const [selectNsRow,selectNsRowSet] = useState<NamespcaeInfo|undefined>(undefined);
    const [quotaInfo,quotaInfoSet] = useState<any>(undefined);



    const NamespcaeColumns: ProColumns<NamespcaeInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            search:false,
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            search:false
        },
        {
            title: '租户',
            dataIndex: 'tenantName',
        },
        {
            title: '集群ID',
            dataIndex: 'clusterId',
            request:GetClusterList,
            hideInTable:true,
        },
        {
            title: '集群',
            dataIndex: 'clusterName',
            search:false,
        },
        {
            title: '操作',
            dataIndex: 'option',
            render:(_,row)=> [
                <Space key="option">
                <a key="nsdeploy" onClick={ async ()=>{
                    console.log(row)
                    confirm({
                        title: `确定要重新部署Namesapce吗?`,
                        content: '部署后PaaS中的Namespace会重新部署到K8s中！',
                        okText: '部署',
                        okType: 'danger',
                        onOk: async()=>{
                            console.log(row)
                           const res = await PutNewK8sNameSpace(row.clusterId,row.namespace)
                           if(res.success) {
                                message.success("部署成功")
                           } else {
                                message.error(res.message)
                           }
                        }
                      });

                }}>部署</a>

                <span>   </span>
                <a key="nsconfig" onClick={ ()=> {
                    
                    selectNsRowSet(row)
                    quotaVisibleFunc(true)
                    
                } }>配额</a>
                </Space>
             
            ]
            
        }
    ]


    return (
        <PageContainer>
            <ProTable<NamespcaeInfo>
                columns={NamespcaeColumns}
                formRef={ref}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="管理"
                request={async (params, sort) => { 
                    return await GetNameSpaceList(params.clusterId,params.tenantName,Number(params.current),Number(params.pageSize))
                }}
                toolBarRender={() => [
                    <Button key='button' type="primary" icon={<PlusOutlined />} 
                        onClick={() => { 
                            NewNSRefActionRef.current?.clearSelected?.()
                            formNewNSRef.current?.setFieldsValue({ namespace:'',cluster:'' ,tentantId:0  })
                            formVisibleFunc(true)
                         }}>新建</Button>]}
                
             >

            </ProTable>

            <DrawerForm title="新建命名空间" width={500} visible={formVisible}  onVisibleChange={formVisibleFunc} formRef={formNewNSRef}
                onFinish={async (values) => {
                    console.log(values)
                    const resp = await PutNewNameSpace(values.cluster,values.namespace,values.tentantId)
                    if (resp.success) {
                        message.success("添加成功")
                        actionRef.current?.reload()
                    } else {
                        message.error(resp.message)
                    }
                    return true
                }}
            >
                <ProFormText name="tentantId" hidden ></ProFormText>
                <ProFormText name="namespace" label="命名空间名称"  disabled={true} 
                    tooltip="最长为 24 位" placeholder="请输入名称"
                    rules={[ {  required: true, message: '命名空间为必填项',  }, { max:24 , message:'超过最大输入长度 > 24'}  ]} />
            
            <Divider  />

            <ProFormSelect name="cluster" label="集群" rules={[{required:true,message:"请选择集群"}]}
                request={GetClusterList} ></ProFormSelect>

            <Divider  />

            <ProTable<TenantTableListItem, TenantTableListPagination>
                columns={ [ 
                    {  title: 'ID', dataIndex: 'id', filters: true, onFilter: true, 
                    
                },
                    {  title: '租户名称',dataIndex: 'tName', filtered:true },
                    {  title: '租户Code', dataIndex: 'tCode', }, ]}
                request={ 
                    async ( params,sort,options) => {
                        let reqData = await queryTenant(params, options)
                        return {data: reqData.data.data,success: reqData.success,total: reqData.data.total }
                    }
                }
                rowKey="id" search={false} pagination={false}   options={{ search: true, }} actionRef={NewNSRefActionRef}
                rowSelection={{
                    type:"radio",
                    onSelect: (row)=>{
                        console.log(row)
                        formNewNSRef.current?.setFieldsValue({ namespace: 'klns-'+ row.tCode ,tentantId: row.id  })
                    }
                }}
            />
            </DrawerForm>

            <DrawerForm title="命名空间配额" width={460} visible={quotaVisible} formRef={quotaActionRef}
                onVisibleChange={async (visible)=>{  quotaVisibleFunc(visible) 
                    if (!visible) {   // on closed
                        quotaEditSet(false)
                    } else {         // on loaded
                        if(selectNsRow && !quotaEdit) {
                            const res = await GetResourceQuota(selectNsRow.clusterId,selectNsRow.namespace)
                            console.log(res.data)
                            quotaInfoSet(res.data)
                            quotaActionRef.current?.setFieldsValue({ 
                                cpu: res.data[0].limitValue ,
                                memory: Number(String(res.data[1].displayValue).replace('Gi','')) ,
                                pods: res.data[2].limitValue
                            })
                        }
                    }
                }} 
                onFinish={async (values) => {
                    console.log(selectNsRow)
                    if(selectNsRow) {
                        if (selectNsRow.tenantId == 0) {
                            message.error("必须选择租户！")
                            return false
                        }

                        values.namespace = selectNsRow.namespace
                        var postData = values
                        postData.clusterId = selectNsRow.clusterId
                        postData.tenantId  = selectNsRow.tenantId
                        const res = await PostResourceQuota(postData)
                        if (res.success) {
                            message.success("配额已生效")
                        }
                    }
                    return true
                }}
            >
             
                <div style={{ display: !quotaEdit?'block':'none'   }} >
                    <p><Button type="primary" onClick={()=>  quotaEditSet(true) } >编辑</Button><b/></p>
                    <Space direction="horizontal">
                        <div>CPU限制：</div>
                        <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[0].displayUsedValue:0} / {quotaInfo?quotaInfo[0].displayValue:0} </div>
                    </Space>
                    <Progress percent={quotaInfo?Number(((quotaInfo[0].usedValue / quotaInfo[0].limitValue) * 100).toFixed(1)):0 } status="active" />

                    <Space direction="horizontal">
                    <div>内存限制：</div>
                    <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[1].displayUsedValue:0} / {quotaInfo?quotaInfo[1].displayValue:0} </div>
                    </Space>
                    <Progress percent={quotaInfo?Number(((quotaInfo[1].usedValue / quotaInfo[1].limitValue) * 100).toFixed(1)):0 } status="active" />


                    <Space direction="horizontal">
                    <div>Pod限制：</div>
                    <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[2].displayUsedValue:0} / {quotaInfo?quotaInfo[2].displayValue:0} </div>
                    </Space>
                    <Progress percent={quotaInfo?Number(((quotaInfo[2].usedValue / quotaInfo[2].limitValue) * 100).toFixed(1)):0 } status="active" />


                </div>

                <div style={{ display: quotaEdit?'block':'none'   }}>
                <Form.Item label="CPU配额:" name="cpu" > 
                    <InputNumber addonBefore="CPU:" addonAfter="CORE" defaultValue={0} width="md" />   
                </Form.Item>

                <Form.Item label="内存配额:" name="memory"> 
                    <InputNumber  addonBefore="内存:" addonAfter="Gi" defaultValue={0} />   
                </Form.Item>

                <Form.Item label="Pod 配额:" name="pods"> 
                    <InputNumber  addonBefore="Pods:" addonAfter="PCS" defaultValue={0} />   
                </Form.Item>
                </div>
            </DrawerForm>

        </PageContainer>
        )
}







export default Namespaces