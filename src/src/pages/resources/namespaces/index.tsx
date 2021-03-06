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
            title: '????????????',
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
            formItemProps: { rules: [ { required: true, message: '??????????????????', }, ], },
            hideInTable:true,
        },
        {
            title: '??????(??????)',
            dataIndex: 'tenantName',
        },
        {
            title: '????????????',
            dataIndex: 'namespace',
            search:false,
            render:(_,record)=>(
                <Link to={`/resources/pods?cid=${record.clusterId}&ns=${record.namespace}`}>{record.namespace}</Link>
            )
        },
        {
            title: '??????',
            width:340,
            dataIndex: 'clusterName',
            search:false,
            render:(_,record)=>(
                <Tag style={{fontSize:13}} icon={<CheckCircleOutlined />} color="processing" key={record.id}>{record.clusterName}</Tag>
            )
        },
        {
            width:200,
            title: 'CPU??????',
            search:false,
            render:(_,row)=>(
                (row.quotasSpec&&row.quotasSpec.length>0)?
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                    <Progress   percent={Number(((row.quotasSpec[0].usedValue / row.quotasSpec[0].limitValue) * 100).toFixed(1)) } status="active" />
                    <Paragraph style={{ marginRight:5 }}>CPU: { row.quotasSpec[0].displayUsedValue} / {row.quotasSpec[0].displayValue} ???</Paragraph>
                </Space>:<div/>
            )
        },
        {
            width:200,
            title: '????????????',
            search:false,
            render:(_,row)=>(
                (row.quotasSpec&&row.quotasSpec.length>0)?
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                <Progress percent={Number(((row.quotasSpec[1].usedValue / row.quotasSpec[1].limitValue) * 100).toFixed(1)) } status="active" />
                <Paragraph style={{ marginRight:5 }}>??????: { row.quotasSpec[1].displayUsedValue} / {row.quotasSpec[1].displayValue} </Paragraph>
                </Space>:<div/>
            )
        },
        {
            width:200,
            title: 'Pods??????',
            search:false,
            render:(_,row)=>(
                (row.quotasSpec&&row.quotasSpec.length>0)?
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                <Progress percent={Number(((row.quotasSpec[2].usedValue / row.quotasSpec[2].limitValue) * 100).toFixed(1)) } status="active" />
                <Paragraph style={{ marginRight:5 }}>Pods??????: { row.quotasSpec[2].displayUsedValue} / {row.quotasSpec[2].displayValue} </Paragraph>
                </Space>:<div/>
            )
        },
        {
            title: '??????',
            width:150,
            dataIndex: 'option',
            search:false,
            render:(_,row)=> [
                <Space key="option">
                <a key="nsdeploy" onClick={ async ()=>{
                    console.log(row)
                    confirm({
                        title: `?????????????????????Namesapce????`,
                        content: '?????????PaaS??????Namespace??????????????????K8s??????',
                        okText: '??????',
                        okType: 'danger',
                        onOk: async()=>{
                           console.log(row)
                           const res = await PutNewK8sNameSpace(row.clusterId,row.namespace)
                           if(res.success) {
                                message.success("????????????")
                           } else {
                                message.error(res.message)
                           }
                        }
                      });

                }}>??????</a>

                <span>   </span>
                <a key="nsconfig" onClick={ ()=> {
                    selectNsRowSet(row)
                    quotaVisibleFunc(true)
                } }>??????</a>
                </Space>
             
            ]
            
        }
    ]


    return (
        <PageContainer title="????????????"
            subTitle="??????????????????Kubernetes?????????????????????????????????,??????????????????????????????????????????????????????????????????Namespace.">
            <ProTable<NamespaceInfo>
                polling={polling || undefined}
                columns={NamespaceColumns}
                formRef={ref}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="??????"
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
                         }}>??????</Button>,
                        
                     <Button key="3"   
                        onClick={() => {
                            if (polling) { setPolling(undefined); return; }
                            setPolling(2000);
                        }} >
                        {polling ? <LoadingOutlined /> : <ReloadOutlined />}
                        {polling ? '????????????' : '????????????'}
                    </Button>  ]  }
                
             >

            </ProTable>

            <DrawerForm title="??????????????????" width={500} visible={formVisible} drawerProps={{ destroyOnClose:true }}  onVisibleChange={formVisibleFunc} formRef={formNewNSRef}
                onFinish={async (values) => {
                    console.log(values)
                    const resp = await PutNewNameSpace(values.cluster,values.namespace,values.tentantId)
                    if (resp.success) {
                        message.success("????????????")
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
                        message.success("???????????????")
                    }


                    return true
                }} >

            <ProFormText name="tentantId" hidden ></ProFormText>
            <ProFormText name="namespace" label="??????????????????"  disabled={true} 
                tooltip="????????? 24 ???" placeholder="???????????????"
                rules={[ {  required: true, message: '????????????????????????',  }, { max:24 , message:'???????????????????????? > 24'}  ]} />
        

            <ProTable<TenantTableListItem, TenantTableListPagination>
                headerTitle="????????????"
                cardProps={{  bordered: true }}
                columns={ [ 
                    {  title: 'ID', dataIndex: 'id'  },
                    {  title: '??????(??????)??????',dataIndex: 'tName', filtered:true } 
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
                            console.log("??????")
                            formNewNSRef.current?.setFieldsValue({ namespace: '' ,tentantId: ''  })
                        }
                    }
                }}
                pagination={{
                    pageSize:5,showSizeChanger:true,
                }}
            />
            <Divider  />

            <ProFormSelect name="cluster" label="??????" rules={[{required:true,message:"???????????????"}]}
                request={GetClusterList} ></ProFormSelect>
            <Divider  />
            
            <Card title="????????????">
                <Form.Item label="CPU??????:" name="cpu" > 
                    <InputNumber  addonBefore="CPU:" addonAfter="CORE" defaultValue={0} />   
                </Form.Item>

                <Form.Item label="????????????:" name="memory"> 
                    <InputNumber  addonBefore="??????:" addonAfter="Gi" defaultValue={0} />   
                </Form.Item>

                <Form.Item label="Pod ??????:" name="pods"> 
                    <InputNumber  addonBefore="Pods:" addonAfter="PCS" defaultValue={0} />   
                </Form.Item>
            </Card>

            </DrawerForm>

            <DrawerForm title="??????????????????" width={460} visible={quotaVisible} formRef={quotaActionRef}
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
                            message.error("?????????????????????")
                            return false
                        }

                        values.namespace = selectNsRow.namespace
                        var postData = values
                        postData.clusterId = selectNsRow.clusterId
                        postData.tenantId  = selectNsRow.tenantId
                        const res = await PostResourceQuota(postData)
                        if (res.success) {
                            message.success("???????????????")
                        }
                    }
                    return true
                }}
            >
             
                <div style={{ display: !quotaEdit?'block':'none'   }} >
                    <p><Button type="primary" onClick={()=>  quotaEditSet(true) } >??????</Button><b/></p>
                    <Space direction="horizontal">
                        <div>CPU?????????</div>
                        <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[0].displayUsedValue:0} / {quotaInfo?quotaInfo[0].displayValue:0} </div>
                    </Space>
                    <Progress percent={quotaInfo?Number(((quotaInfo[0].usedValue / quotaInfo[0].limitValue) * 100).toFixed(1)):0 } status="active" />

                    <Space direction="horizontal">
                    <div>???????????????</div>
                    <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[1].displayUsedValue:0} / {quotaInfo?quotaInfo[1].displayValue:0} </div>
                    </Space>
                    <Progress percent={quotaInfo?Number(((quotaInfo[1].usedValue / quotaInfo[1].limitValue) * 100).toFixed(1)):0 } status="active" />


                    <Space direction="horizontal">
                    <div>Pod?????????</div>
                    <div style={{ marginRight:5 }}>{ quotaInfo?quotaInfo[2].displayUsedValue:0} / {quotaInfo?quotaInfo[2].displayValue:0} </div>
                    </Space>
                    <Progress percent={quotaInfo?Number(((quotaInfo[2].usedValue / quotaInfo[2].limitValue) * 100).toFixed(1)):0 } status="active" />


                </div>

                <div style={{ display: quotaEdit?'block':'none'   }}>
                <Form.Item label="CPU??????:" name="cpu" > 
                    <InputNumber addonBefore="CPU:" addonAfter="CORE" defaultValue={0} width="md" />   
                </Form.Item>

                <Form.Item label="????????????:" name="memory"> 
                    <InputNumber  addonBefore="??????:" addonAfter="Gi" defaultValue={0} />   
                </Form.Item>

                <Form.Item label="Pod ??????:" name="pods"> 
                    <InputNumber  addonBefore="Pods:" addonAfter="PCS" defaultValue={0} />   
                </Form.Item>
                </div>
            </DrawerForm>

        </PageContainer>
        )
}







export default Namespaces