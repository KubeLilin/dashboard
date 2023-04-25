import React,{useRef, useState} from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Button , Space ,Tooltip,Progress,Tag,Popconfirm,message,Form} from 'antd'
import { HddTwoTone,ApartmentOutlined } from '@ant-design/icons'
import { BrowserRouter as Router, Route, Link,useHistory } from 'react-router-dom'
import { LeftCircleFilled } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-card'
import ProForm,{ ProFormSelect,ProFormInstance, DrawerForm, ProFormText  } from '@ant-design/pro-form'
import { history, Link as UmiLink } from 'umi'

import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/yaml/yaml';
import '../pods/monokai-bright.css'
import 'codemirror/theme/ayu-dark.css';
import { UnControlled as CodeMirror } from 'react-codemirror2'

import { getNameSpaceList ,getWorkloads,ApplyYaml } from './service'
import { getYaml,deleteDeployment } from '../pods/service'

const { Paragraph, Text } = Typography;


const Workloads: React.FC = (prop:any) => {
    const nodeListColumns: ProColumns[] = [
        {
            title:'名称',
            dataIndex:'name',
            hideInSearch:true,
            render:(dom,item)=> ( <a  onClick={()=>{
                history.push(`/resources/pods?did=-99&app=${item.name}&cid=${clusterId}&ns=${item.namespace}`)
            }}>{dom}</a> )
        },
        {
            title:'命名空间',
            dataIndex:'namespace',
        },
        {
            title:'Labels',
            dataIndex:'labels',
            hideInSearch:true,
            render:(dom,item)=>{
                const labels  = getObjectKV(item.labels)
                return  (
                    <Paragraph key={item.name+'_selector'} ellipsis={{ rows: 2, tooltip: labels.map(s=> (<Tag color="purple">{s}</Tag>)) }} >
                    {labels.map(s=> (<li>{s}</li>))}
                    </Paragraph>
                )
            } 
        },
        {
            title:'Selectors',
            dataIndex:'selectors',
            hideInSearch:true,
            render:(dom,item)=>{
                const labels  = getObjectKV(item.selectors)
                return  (
                    <Paragraph key={item.name+'_selector'} ellipsis={{ rows: 2, tooltip: labels.map(s=> (<Tag color="purple">{s}</Tag>)) }} >
                    {labels.map(s=> (<li>{s}</li>))}
                    </Paragraph>
                )
            } 
        },
        {
            title:'运行/期望Pod数量',
            dataIndex:'runningPods',
            hideInSearch:true,
            render:(dom,item)=> <span>{item.readyReplicas}/{item.replicas}</span>
            
        },
        {
            title:'Request/Limits',
            dataIndex:'requestLimits',
            hideInSearch:true,
            render:(dom,item)=> (
                <Space direction='vertical'>
                    <span>CPU:{ getResourceVal(item.requestCPU) } / {getResourceVal(item.limitsCPU)} 核 </span>
                    <span>内存:{ getResourceVal(item.requestMemory / 1024 /1024 /1024 ) } / {getResourceVal(item.limitsMemory / 1024 /1024 /1024)} Gi  </span>
                </Space>
            )
        },

        {
            title: '操作',
            dataIndex: 'x',
            valueType: 'option',
            render: (_, record) => {
                return [
                    <a key="remote" onClick={async()=>{
                        const res = await getYaml(0,clusterId,record.namespace,record.name)
                        console.log(res)
                        if (res && res.success){
                            setYamlIsEdit(false)
                            setYamlDrawFormVisible(true)
                            setTimeout(()=>{
                            setyamlContent(res.data)
                            },100)
                        } else {
                            message.error('获取YAML失败')
                        }

                    }}>查看YAML</a>,
                    <Popconfirm key="confirm_delete" title="确定要删除这个工作负载吗?"
                    onConfirm={async () => {
                        const res = await deleteDeployment(0,clusterId,record.namespace,record.name)
                        if (res && res.success){
                            message.success('删除成功！')
                        }
                        actionRef.current?.reload()
                    }}>
                    <a key="delete">删除</a></Popconfirm>,
                ]
            },
        },
    ]

    const getObjectKV = (obj:any)=> {
        if (!obj){
            return ['无']
        }  
        var arrs = []
        const keys = Object.keys(obj)
        for(let i=0;i<keys.length;i++){
            const key = keys[i]
            const value=obj[key]
            arrs.push(key +':'+ value )
        }
        
        return arrs 
    }

    const getResourceVal = (val:any)=> {
        if (val>0)
            // 保留三位小数，不足不补0
            return  val.toFixed(3).replace(/\.?0+$/,"")
        else
            return '无限制'
    }


    console.log(prop)
    const clusterId = prop.location.query?.cid
    const workloadType = prop.location.query?.wtype
    const form = useRef<ProFormInstance>();
    const [namespaceState, setNamespaceState] = useState<string>("")
    const [yamlContent, setyamlContent] = useState<string>("# yaml")

    const [yamlDrawFormVisible, setYamlDrawFormVisible] = useState<boolean>(false);
    const [yamlIsEdit, setYamlIsEdit] = useState<boolean>(false);
    const [formRef] = Form.useForm();
    const actionRef = useRef<ActionType>();

    actionRef.current?.reload()
    return (
        <ProCard title={<span> <a onClick={()=>{
            history.push(`/resources/clusterinfo?cid=${clusterId}`)
        }}>返回集群管理</a>  </span> }   bordered headerBordered >
           <ProTable  columns={nodeListColumns} rowKey={record=>record.name} headerTitle={"工作负载类型:   " + workloadType}
                formRef={form}  search={false} actionRef={actionRef} pagination={{pageSize:9}}
                toolBarRender={() => [
                    <Space>
                     <span>命名空间:</span>   
                    <ProFormSelect  style={{marginTop:25, width:270}}  
                        fieldProps={{ onChange(value:any){
                                setNamespaceState(value)
                                actionRef.current?.reload()
                             } }}
                        request={async ()=>{
                            var namespaceData = await getNameSpaceList(clusterId)
                            return namespaceData
                        }}></ProFormSelect>
                    <Button type='primary' onClick={()=>{
                        setYamlIsEdit(true)
                        setTimeout(() => {
                            setyamlContent("# Yaml")
                        }, 100)
                        setYamlDrawFormVisible(true)
                    }}>创建YAML资源</Button>
                    </Space>
                 
                ]}
                request={async (params,sort) => {
                    if(clusterId){
                        params.cid = Number(clusterId)
                        console.log(params)
                        var res = await getWorkloads(params.cid,namespaceState,workloadType)
                        return res
                    } else {
                        return []
                    }
                }}
            
            />
            <DrawerForm title="创建YAML资源" width={1200 } form={formRef} visible={yamlDrawFormVisible}  onVisibleChange={setYamlDrawFormVisible} drawerProps={{ forceRender: true }}
               submitter={{ searchConfig:{ resetText:'Cancal',submitText:'Apply'} }}
               onFinish={async (values) => {
                    if (yamlIsEdit){
                        console.log(values)
                        const res = await ApplyYaml(Number(clusterId),values.content)
                        if (res && res.success){
                            message.success('创建成功')
                            actionRef.current?.reload()
                        }
                    } else{
                        message.error('查看模式下,YAML为只读资源,不可编辑！')
                        return false
                    }
                    actionRef.current?.reload()
                    return true
               }}
               >
                <ProForm.Item name="content">
                    <ProFormText hidden></ProFormText>
                </ProForm.Item>
                <ProForm.Item>
                    <CodeMirror value={yamlContent} editorDidMount={editor => {  editor.setSize('auto',document.body.clientHeight - 200) }}
                        onChange={(editor, data, value) => {
                            formRef.setFieldValue('content',value)
                        }}
                        options={{ mode:{name:'text/yaml'},readOnly:false, theme: 'ayu-dark', autofocus:true }} >
                    </CodeMirror>
                </ProForm.Item>
            </DrawerForm>
        </ProCard>
    )
}

export default Workloads