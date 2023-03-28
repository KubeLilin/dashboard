import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import {Modal, Button ,Divider ,Space, message, Typography,InputNumber,Progress,Tag, Card, Checkbox} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined,CheckCircleOutlined ,ReloadOutlined,LoadingOutlined } from '@ant-design/icons';
import Form,{ DrawerForm ,ProForm,ProFormCheckbox,ProFormInstance,ProFormSelect,ProFormText} from '@ant-design/pro-form';

import { TenantTableListItem, TenantTableListPagination,NamespaceInfo } from './data'
import { GetClusterList,GetNameSpaceList,GetResourceQuota , PutUpateRuntime,IsInstalledDaprRuntime } from './service';
import { Link } from 'umi';
import { validateLngLat } from '@antv/l7';
const { confirm } = Modal;
const { Paragraph } = Typography;


const namespace: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const ref = useRef<ProFormInstance>();
    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const formNewNSRef = useRef<ProFormInstance>();
    const quotaActionRef = useRef<ProFormInstance>();
    const [quotaVisible, quotaVisibleFunc] = useState<boolean>(false);
    const [selectNsRow,selectNsRowSet] = useState<NamespaceInfo|undefined>(undefined);
    const [quotaInfo,quotaInfoSet] = useState<any>(undefined);
    const [isInstalledDapr,setInstalledDapr] = useState<boolean>(false);

    const [onLoaded,_] = useState<boolean>(false);

    useEffect(()=>{
        // GetClusterList().then((res)=>{
        //     if (res && res.length > 0){
        //         ref.current?.setFieldsValue({clusterId:res[0].value})
        //         setTimeout(() => ref.current?.submit(), 500)                   
        //     }
        // })
       
    },[onLoaded])



    const NamespaceColumns: ProColumns<NamespaceInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            search:false,
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            width:280,
            search:false,
            render:(_,record)=>(
                <Link to={`/resources/pods?cid=${record.clusterId}&ns=${record.namespace}`}>{record.namespace}</Link>
            )
        },
        {
            title: '集群',
            width:340,
            dataIndex: 'clusterName',
            search:false,
            render:(_,record)=>(
                <Tag style={{fontSize:13}} icon={<CheckCircleOutlined />} color="processing" key={record.id}>{record.clusterName}</Tag>
            )
        },
        {
            title: '部署数量',
            dataIndex: 'deployCount',
        },
        {
            title: '实例数量',
            dataIndex: 'insCount',
        },
        {
            title: '运行时(Runtime)',
            dataIndex: 'clusterName',
            search:false,
            render:(_,record)=>(
                <Tag style={{fontSize:13}} icon={<CheckCircleOutlined />} color="gold" key={record.id}>无</Tag>
            )
        },
    
        {
            title: '操作',
            width:200,
            dataIndex: 'option',
            search:false,
            render:(_,row)=> [
                <Space key="option">
                 <a key="enableRuntime" onClick={ ()=> {
                    selectNsRowSet(row)
                    formVisibleFunc(true)
                    setTimeout(() => {
                        formNewNSRef.current?.setFieldsValue({
                            namespaceId:row.id,
                            cluster:row.clusterName,
                            namespace:row.namespace,
                            enableRuntime: row.enableRuntime,
                            runtimeName: row.runtimeName
                        })
                    }, 50);
                } }>运行时配置</a>

                <span>   </span>
                <a key="nsconfig" onClick={ ()=> {
                    selectNsRowSet(row)
                    quotaVisibleFunc(true)
                } }>查看配额</a>
                </Space>
             
            ]
            
        }
    ]


    return (
        <PageContainer title="团队空间"
            subTitle="每个团队都与Kubernetes集群中的命名空间相对应,可以在团队空间中为团队创建一个与之对应的集群Namespace.">
            <ProTable<NamespaceInfo>
                columns={NamespaceColumns}
                formRef={ref}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="命名空间管理"
                form={{  ignoreRules: false, }}
                search={false}
                request={async (params, sort) => { 
                    return await GetNameSpaceList(0,params.tenantName,Number(params.current),Number(params.pageSize))
                }}
                // toolBarRender={() => [       
                //      <Button key="" >  </Button>  ]  }
                
             >

            </ProTable>


            <DrawerForm title="运行时(Runtime)配置" width={500} visible={formVisible} formRef={formNewNSRef} drawerProps={{ destroyOnClose:true }}  
                // onVisibleChange={formVisibleFunc} 
                onVisibleChange={async (visible)=>{ formVisibleFunc(visible)
                        IsInstalledDaprRuntime(Number(selectNsRow?.clusterId)).then((res)=>{
                            if (res.success) {
                                setInstalledDapr(res.data)
                            }
                        }).catch(()=>{
                            setInstalledDapr(false)
                        })  
                }}
                onFinish={async (v) => {
                    console.log(v)
                    const res = await PutUpateRuntime(v.namespaceId,v.enableRuntime,v.runtimeName)
                    if(res.success){
                        message.info('更新运行时设置成功!')
                    }
                    return true
                }} >
            
            <ProFormText name="tentantId" hidden ></ProFormText>
            <ProFormText name="namespaceId" hidden ></ProFormText>
            <ProFormText name="cluster" label="集群" disabled={true}></ProFormText>
            <ProFormText name="namespace" label="命名空间名称"  disabled={true}  />
        
            <Divider  />
            
            <Card title="运行时(Runtime)设置">
                <ProFormCheckbox name="enableRuntime" fieldProps={{ 
                    onChange(e) {
                        console.log(e.target.checked)
                        if (!e.target.checked) {
                            formNewNSRef.current?.setFieldsValue({                    
                                runtimeName: ''
                            })
                        }
                    },
                  }}>Enable Runtime</ProFormCheckbox>
                <ProFormSelect name="runtimeName" options={["Dapr","Istio"]} >
                </ProFormSelect>
                <ProForm.Item>
                    <Tag style={{fontSize:13}} icon={<CheckCircleOutlined />} color={isInstalledDapr?'green':'red'}>{isInstalledDapr?'':'未'}检测到 Dapr 运行时</Tag>
                    {/* <Tag style={{fontSize:13}} icon={<CheckCircleOutlined />} color={isInstalledIstio?'green':'red'}>{isInstalledIstio?'':'未'}检测到 Istio 运行时</Tag> */}
                    <Tag  color='red'>未检测到 Istio 运行时</Tag>
                </ProForm.Item>
                <ProForm.Item>
                </ProForm.Item>
            </Card>

            </DrawerForm>

            <DrawerForm title="空间配额" width={460} visible={quotaVisible} formRef={quotaActionRef}
                onVisibleChange={async (visible)=>{  quotaVisibleFunc(visible) 
                        quotaInfoSet(null)
                        if(selectNsRow) {
                            const res = await GetResourceQuota(selectNsRow.clusterId,selectNsRow.namespace)
                            if (res && res.success) {
                                console.log(res.data)
                                quotaInfoSet(res.data)
                                quotaActionRef.current?.setFieldsValue({ 
                                    cpu: res.data[0].limitValue ,
                                    memory: Number(String(res.data[1].displayValue).replace('Gi','')) ,
                                    pods: res.data[2].limitValue
                                })
                            } else {
                                message.warning(`${selectNsRow.namespace} 未设置配额!`)
                            }
                        }
                    
                }} >
             
                <div style={{ display:'block' }} >
                    <Space direction="horizontal">
                        <div>CPU限制：</div>
                        <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[0].displayUsedValue:0} / {quotaInfo?quotaInfo[0].displayValue:0} core </div>
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

            </DrawerForm>

        </PageContainer>
        )
}







export default namespace