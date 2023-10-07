import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Typography, Button , Space ,Tooltip,Progress} from 'antd'
import { HddTwoTone,ApartmentOutlined } from '@ant-design/icons'
const { Text,Paragraph } = Typography;
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { NodeItem } from './data'
import { getNodeList }  from './nodes.service'
import { history,Link } from 'umi';
import type { FC } from 'react';
import ProCard from '@ant-design/pro-card';


const nodeListColumns: ProColumns<NodeItem>[] = [
    {
        width:60,
        hideInSearch:true,
        render:()=>{
            return <ApartmentOutlined key="icon" style={{ fontSize: '150%'}} />
        }
    },
    {
        width:170,
        dataIndex:'name',
        title:'节点名称',
        hideInSearch:true,
        render: (dom,row) =>{
             return <a  onClick={()=>{
                 history.push('/resources/pods?node='+ row.name +'&cid='+clusterId )
             }}>{dom}</a>
        //    return   <Link key="nodelink" style={{  textDecorationLine: 'underline'}} to={'/resources/pods?node='+ row.name +'&cid='+clusterId }>{dom}</Link> 
        }
    },
    {
        width:100,
        dataIndex: 'role',
        title:'Role',
        hideInSearch:true,

    },
    {
        width:120,
        title:'状态',
        hideInSearch:true,
        dataIndex: 'status',
        valueEnum: {
            'notready': {
              text:  <span style={{color: 'red' }}>未知错误</span>,
              status: 'Default',
            },
            'ready': {
              text: <span style={{color: 'green'}}>健康</span>,
              status: 'Success',
            },
          },
    },
    { 
        width:160,
        dataIndex: 'kubeletVersion',
        title:'Kubernetes版本',
        hideInSearch:true,
        render:(dom,row) => {
            return <span key="kubeletVersion"  >{dom}</span>
        },
    },
    {
        width:160,
        hideInSearch:true,
        dataIndex: 'containerRuntimeVersion',
        title:'运行时'
    },
    {
        width:160,
        hideInSearch:true,
        dataIndex: '',
        title:'IP地址',
        render:(dom,row) => {
            return (
                <Paragraph ellipsis={true} key="ip">
                     {row.addresses.map(item=> (
                           <div>{item.type + ":"+item.address}<br/></div>
                      )) }
                </Paragraph>)
        }
    },
    {
        width:230,
        dataIndex: '',
        hideInSearch:true,
        title:'Reuqests/Limits',
        render:(dom,row)=> {
            return (
            <Space key={row.uid} direction="vertical" size={0}>
               <Paragraph>CPU: { (row.request.cpu).toFixed(2)} / {row.limit.cpu.toFixed(2)} 核</Paragraph>
               <Paragraph>内存: { (row.request.memory /1024/1024/1024 ).toFixed(2)} / {(row.limit.memory / 1024/1024/1024).toFixed(2)} Gi</Paragraph>
            </Space>
        )}
    },
    {
        width:230,
        title:'CPU Usage',
        hideInSearch:true,
        render:(dom,row)=>(
            <Space key="resource_cpu" direction="vertical" style={{ marginRight:30 }}>
            <Progress  percent={ Number(((row.usage.cpu /row.capacity.cpu)*100).toFixed(2))  } status="active" />
            <Paragraph>CPU: { (row.usage.cpu).toFixed(2)} / {row.capacity.cpu.toFixed(2)} 核</Paragraph>
            </Space>
        ),
    },
    {
        width:230,
        title:'Memory Usage',
        hideInSearch:true,
        render:(dom,row)=>(
            <Space  key="resource_mem"  direction="vertical" style={{ marginRight:30 }}>
            <Progress key="m1" percent={ Number(((row.usage.memory /row.capacity.memory)*100).toFixed(2))  } status="active" />
            <Paragraph key="m2">内存: { (row.usage.memory / 1024/1024/1024 ).toFixed(2)} / {(row.capacity.memory /1024/1024/1024).toFixed(2)} Gi</Paragraph>
            </Space>
        ),
    },
    {
        width:230,
        title:'Storage Usage',
        hideInSearch:true,
        render:(dom,row)=>(
            <Space  key="resource_sag"  direction="vertical" style={{ marginRight:30 }}>
            <Progress key="s1" percent={ Number(((row.usage.storage /row.capacity.storage)*100).toFixed(2))  } status="active" />
            <Paragraph key="s2">存储: { (row.usage.storage/1024/1024/1024).toFixed(2)} / {(row.capacity.storage/1024/1024/1024).toFixed(2)} GB</Paragraph>
            </Space>
        ),
    },
    
]

interface Props{
    ClusterId:number,
}

var clusterId:any

const Nodes: React.FC<Props> = (props:Props) => { 
    clusterId = history.location.query?.cid
    if (props.ClusterId){
        clusterId=props.ClusterId
    }

    // if (clusterId == undefined) {
    //     history.goBack()
    // }

    const TableListContent: FC<Record<string, any>> = () =>  ( <ProTable<NodeItem>
        rowKey={record=>record.uid}
        columns={nodeListColumns}
        headerTitle="节点管理 (管理集群节点 & 节点基本信息)"
        search={false}
        request={async (params,sort) => {
            if(clusterId){
                params.cid = clusterId
                var nodesData = await getNodeList(params,sort)
                return nodesData
            } else {
                return []
            }
         }}
        //  toolBarRender={ props.ClusterId?false: ()=> [
        //     <Button type="primary" key="primary" onClick={() => {
        //         history.goBack()
        //     }}
        //     >  返回集群列表 </Button>,]
        //  }
    />)

    return(
         <TableListContent/>     
    )
}


export default Nodes;