import React,{useRef} from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Button , Space ,Tooltip,Progress,Tag} from 'antd'
import { HddTwoTone,ApartmentOutlined } from '@ant-design/icons'
import { BrowserRouter as Router, Route, Link,useHistory } from 'react-router-dom'
import { LeftCircleFilled } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-card'
import ProForm,{ ProFormSelect,ProFormInstance  } from '@ant-design/pro-form'
import { history, Link as UmiLink } from 'umi'

import { getNameSpaceList ,getWorkloads } from './service'

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
            valueType:'select',
            fieldProps:{
                onChange(value:any){
                    console.log(value)
                    form.current?.submit()
                }
            },
            request:async ()=>{
                var namespaceData = await getNameSpaceList(clusterId)
                return namespaceData
            }
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
            title:'操作',
            dataIndex:'option',
            hideInSearch:true,
            // render:(_,record)=>{

            // }
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

    form.current?.resetFields()
    form.current?.submit()

    return (
        <ProCard title={workloadType}   bordered headerBordered >
           <ProTable columns={nodeListColumns} rowKey={record=>record.name} headerTitle={false}  
                formRef={form}
                toolBarRender={false}
                request={async (params,sort) => {
                    if(clusterId){
                        params.cid = Number(clusterId)
                        console.log(params)
                        var res = await getWorkloads(params.cid,params.namespace,workloadType)
                        return res
                    } else {
                        return []
                    }
                }}
            
            />
        </ProCard>
    )
}

export default Workloads