import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import {Modal, Button ,Divider ,Space, message, Typography,InputNumber,Progress,Tag, Card} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined,CheckCircleOutlined ,ReloadOutlined,LoadingOutlined } from '@ant-design/icons';
import Form,{ DrawerForm ,ProFormInstance,ProFormSelect,ProFormText} from '@ant-design/pro-form';

import { TenantTableListItem, TenantTableListPagination,NamespaceInfo,NewQuota } from './data'
import { GetClusterList,GetNameSpaceList,PutNewNameSpace ,
     queryTenant ,PutNewK8sNameSpace, GetResourceQuota,PostResourceQuota } from './service';
import { Link } from 'umi';
const { confirm } = Modal;
const { Paragraph } = Typography;


const Namespaces: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const ref = useRef<ProFormInstance>();
    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const formNewNSRef = useRef<ProFormInstance>();
    const NewNSRefActionRef = useRef<ActionType>();
    const quotaActionRef = useRef<ProFormInstance>();
    const [quotaVisible, quotaVisibleFunc] = useState<boolean>(false);
    const [quotaEdit,quotaEditSet] = useState<boolean>(false);
    const [selectNsRow,selectNsRowSet] = useState<NamespaceInfo|undefined>(undefined);
    const [quotaInfo,quotaInfoSet] = useState<any>(undefined);
    const [time, setTime] = useState(() => Date.now());
    const [polling, setPolling] = useState<number | undefined>(2000);

    const [onLoaded,_] = useState<boolean>(false);

    useEffect(()=>{
        GetClusterList().then((res)=>{
            if (res.length > 0){
                ref.current?.setFieldsValue({clusterId:res[0].value})
                setTimeout(() => ref.current?.submit(), 500)                   
            }
        })
       
    },[onLoaded])



    const NamespaceColumns: ProColumns<NamespaceInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            search:false,
        },
        {
            title: '集群列表',
            valueType: 'select',
            dataIndex: 'clusterId',
            request: async()=>{
                const res = await GetClusterList()
                if (res.length > 0){
                    ref.current?.setFieldsValue({clusterId:res[0].value})
                    setTimeout(() => ref.current?.submit(), 800)                   
                }
                return res
            },
            formItemProps: { rules: [ { required: true, message: '此项为必填项', }, ], },
            hideInTable:true,
        },
        {
            title: '租户(团队)',
            dataIndex: 'tenantName',
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
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
            width:200,
            title: 'CPU配额',
            search:false,
            render:(_,row)=>(
                (row.quotasSpec&&row.quotasSpec.length>0)?
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                    <Progress   percent={Number(((row.quotasSpec[0].usedValue / row.quotasSpec[0].limitValue) * 100).toFixed(1)) } status="active" />
                    <Paragraph style={{ marginRight:5 }}>CPU: { row.quotasSpec[0].displayUsedValue} / {row.quotasSpec[0].displayValue} 核</Paragraph>
                </Space>:<div/>
            )
        },
        {
            width:200,
            title: '内存配额',
            search:false,
            render:(_,row)=>(
                (row.quotasSpec&&row.quotasSpec.length>0)?
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                <Progress percent={Number(((row.quotasSpec[1].usedValue / row.quotasSpec[1].limitValue) * 100).toFixed(1)) } status="active" />
                <Paragraph style={{ marginRight:5 }}>内存: { row.quotasSpec[1].displayUsedValue} / {row.quotasSpec[1].displayValue} </Paragraph>
                </Space>:<div/>
            )
        },
        {
            width:200,
            title: 'Pods配额',
            search:false,
            render:(_,row)=>(
                (row.quotasSpec&&row.quotasSpec.length>0)?
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                <Progress percent={Number(((row.quotasSpec[2].usedValue / row.quotasSpec[2].limitValue) * 100).toFixed(1)) } status="active" />
                <Paragraph style={{ marginRight:5 }}>Pods数量: { row.quotasSpec[2].displayUsedValue} / {row.quotasSpec[2].displayValue} </Paragraph>
                </Space>:<div/>
            )
        },
        {
            title: '操作',
            width:150,
            dataIndex: 'option',
            search:false,
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
        <PageContainer title="团队空间"
            subTitle="每个团队都与Kubernetes集群中的命名空间相对应,可以在团队空间中为团队创建一个与之对应的集群Namespace.">
            <ProTable<NamespaceInfo>
                polling={polling || undefined}
                columns={NamespaceColumns}
                formRef={ref}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="管理"
                form={{  ignoreRules: false, }}
                request={async (params, sort) => { 
                    if (params.clusterId){
                        return await GetNameSpaceList(params.clusterId,params.tenantName,Number(params.current),Number(params.pageSize))
                    } else {
                        return []
                    }
                }}
                toolBarRender={() => [
                    <Button key='button' type="primary" icon={<PlusOutlined />} 
                        onClick={() => { 
                            NewNSRefActionRef.current?.clearSelected?.()
                            formNewNSRef.current?.setFieldsValue({ namespace:'',cluster:'' ,tentantId:0  })
                            formVisibleFunc(true)
                         }}>新建</Button>,
                        
                     <Button key="3"   
                        onClick={() => {
                            if (polling) { setPolling(undefined); return; }
                            setPolling(2000);
                        }} >
                        {polling ? <LoadingOutlined /> : <ReloadOutlined />}
                        {polling ? '停止轮询' : '开始轮询'}
                    </Button>  ]  }
                
             >

            </ProTable>

            <DrawerForm title="新建命名空间" width={500} visible={formVisible} drawerProps={{ destroyOnClose:true }}  onVisibleChange={formVisibleFunc} formRef={formNewNSRef}
                onFinish={async (values) => {
                    console.log(values)
                    const resp = await PutNewNameSpace(values.cluster,values.namespace,values.tentantId)
                    if (resp.success) {
                        message.success("添加成功")
                        actionRef.current?.reload()
                    } else {
                        message.error(resp.message)
                    }
                    
                    var postData:any = {
                        namespace:values.namespace,
                        clusterId: values.cluster,
                        tenantId:values.tenantId,
                        cpu: values.cpu?values.cpu:0,
                        memory:values.memory?values.memory:0,
                        pods:values.pods?values.pods:0
                    }
                    console.log(postData)
                    const res = await PostResourceQuota(postData)
                    if (res.success) {
                        message.success("配额已生效")
                    }


                    return true
                }} >

            <ProFormText name="tentantId" hidden ></ProFormText>
            <ProFormText name="namespace" label="命名空间名称"  disabled={true} 
                tooltip="最长为 24 位" placeholder="请输入名称"
                rules={[ {  required: true, message: '命名空间为必填项',  }, { max:24 , message:'超过最大输入长度 > 24'}  ]} />
        

            <ProTable<TenantTableListItem, TenantTableListPagination>
                headerTitle="绑定团队"
                cardProps={{  bordered: true }}
                columns={ [ 
                    {  title: 'ID', dataIndex: 'id'  },
                    {  title: '租户(团队)名称',dataIndex: 'tName', filtered:true } 
                ]}
                request={ 
                    async ( params,sort,options) => {
                        let reqData = await queryTenant(params, options)
                        return {data: reqData.data.data,success: reqData.success,total: reqData.data.total }
                    }
                }
                rowKey="id" search={false}  options={{ search: true, }} actionRef={NewNSRefActionRef}
                rowSelection={{
                    type:"radio",
                    onSelect: (row)=>{
                        console.log(row)
                        formNewNSRef.current?.setFieldsValue({ namespace: 'klns-'+ row.tCode ,tentantId: row.id  })
                    },
                    onChange:(keys)=>{
                        if(keys.length <=0) {
                            console.log("取消")
                            formNewNSRef.current?.setFieldsValue({ namespace: '' ,tentantId: ''  })
                        }
                    }
                }}
                pagination={{
                    pageSize:5,showSizeChanger:true,
                }}
            />
            <Divider  />

            <ProFormSelect name="cluster" label="集群" rules={[{required:true,message:"请选择集群"}]}
                request={GetClusterList} ></ProFormSelect>
            <Divider  />
            
            <Card title="设置配额">
                <Form.Item label="CPU配额:" name="cpu" > 
                    <InputNumber  addonBefore="CPU:" addonAfter="CORE" defaultValue={0} />   
                </Form.Item>

                <Form.Item label="内存配额:" name="memory"> 
                    <InputNumber  addonBefore="内存:" addonAfter="Gi" defaultValue={0} />   
                </Form.Item>

                <Form.Item label="Pod 配额:" name="pods"> 
                    <InputNumber  addonBefore="Pods:" addonAfter="PCS" defaultValue={0} />   
                </Form.Item>
            </Card>

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