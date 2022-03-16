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


const nodeListColumns: ProColumns<NodeItem>[] = [
    {
        width:60,
        render:()=>{
            return <ApartmentOutlined style={{ fontSize: '150%'}} />
        }
    },
    {
        width:120,
        dataIndex:'name',
        title:'节点名',
        render: (dom,row) =>{
           return   <Link style={{color: 'blue', textDecorationLine: 'underline'}} to={'/resources/pods?node='+ row.name +'&cid='+clusterId }>{dom}</Link> 
        }
    },
    {
        width:120,
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
        render:(dom,row) => {
            return <span style={{color: 'blue'}}>{dom}</span>
        },
    },
    {
        width:160,
        dataIndex: 'containerRuntimeVersion',
        title:'运行时'
    },
    {
        width:160,
        dataIndex: '',
        title:'IP地址',
        render:(dom,row) => {
            return (
                <Paragraph ellipsis={true}>
                     {row.addresses.map(item=> (
                           <div>{item.type + ":"+item.address}<br/></div>
                      )) }
                </Paragraph>)
        }
    },
    {
        width:230,
        dataIndex: '',
        title:'可分配/总资源',
        render:(dom,row)=> {
            return (
            <Space key={row.uid} direction="vertical" size={0}>
               <Paragraph>CPU: { (row.allocatable.cpu).toFixed(2)} / {row.capacity.cpu.toFixed(2)} 核</Paragraph>
               <Paragraph>内存: { (row.allocatable.memory /1024/1024/1024 ).toFixed(2)} / {(row.capacity.memory / 1024/1024/1024).toFixed(2)} Gi</Paragraph>
            </Space>
        )}
    },
    {
        width:230,
        title:'CPU Usage',
        render:(dom,row)=>(
            <Space direction="vertical" style={{ marginRight:30 }}>
            <Progress  percent={ Number(((row.usage.cpu /row.capacity.cpu)*100).toFixed(2))  } status="active" />
            <Paragraph>CPU: { (row.allocatable.cpu).toFixed(2)} / {row.capacity.cpu.toFixed(2)} 核</Paragraph>
            </Space>
        ),
    },
    {
        width:230,
        title:'Memory Usage',
        render:(dom,row)=>(
            <Space direction="vertical" style={{ marginRight:30 }}>
            <Progress percent={ Number(((row.usage.memory /row.capacity.memory)*100).toFixed(2))  } status="active" />
            <Paragraph>内存: { (row.usage.memory / 1024/1024/1024 ).toFixed(2)} / {(row.capacity.memory /1024/1024/1024).toFixed(2)} Gi</Paragraph>
            </Space>
        ),
    },
    {
        width:230,
        title:'Storage Usage',
        render:(dom,row)=>(
            <Space direction="vertical" style={{ marginRight:30 }}>
            <Progress percent={ Number(((row.usage.storage /row.capacity.storage)*100).toFixed(2))  } status="active" />
            <Paragraph>Storage: { (row.usage.storage/1024/1024/1024).toFixed(2)} / {(row.capacity.storage/1024/1024/1024).toFixed(2)} GB</Paragraph>
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
        headerTitle='节点列表'
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
         toolBarRender={ props.ClusterId?false: ()=> [
            <Button type="primary" key="primary" onClick={() => {
                history.goBack()
            }}
            >  返回集群列表 </Button>,]
         }
    />)

    return(
        props.ClusterId?(<TableListContent/>):
           (<PageContainer title={ props.ClusterId?false:"节点列表"  } >
               <TableListContent/>
            </PageContainer>)
    )
}


export default Nodes;