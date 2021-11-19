import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Typography, Button , Space ,Tooltip} from 'antd'
import { HddTwoTone } from '@ant-design/icons'
const { Text,Paragraph } = Typography;
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { NodeItem } from './data'
import { getNodeList }  from './nodes.service'
import { history,Link } from 'umi';


const nodeListColumns: ProColumns<NodeItem>[] = [
    {
        width:8,
        render:()=>{
            return <HddTwoTone />
        }
    },
    {
        dataIndex:'name',
        title:'节点名',
        render: (dom,row) =>{
           return   <Link style={{color: 'blue', textDecorationLine: 'underline'}} to={'/resources/pods?node='+ row.name +'&cid='+clusterId }>{dom}</Link> 
        }
    },
    {
        dataIndex: 'status',
        title:'状态',
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
        dataIndex: 'kubeletVersion',
        title:'Kubernetes版本',
        render:(dom,row) => {
            return <span style={{color: 'blue'}}>{dom}</span>
        },
    },
    {
        dataIndex: 'containerRuntimeVersion',
        title:'运行时'
    },
    {
        dataIndex: '',
        title:'IP地址',
        render:(dom,row) => {
            return (
            <Space key={row.uid} direction="vertical" size={0}>{
                row.addresses.map(item=>{
                   return (
                       <Tooltip key={row.uid} title={item.type + ':    ' + item.address}>
                           <Paragraph copyable>{item.address}</Paragraph>
                      </Tooltip> )
                })
            }</Space>)
        }
    },
    {
        dataIndex: '',
        title:'可用/总资源',
        render:(dom,row)=> {
            return (
            <Space key={row.uid} direction="vertical" size={0}>
               <Paragraph>CPU: { (row.allocatable.cpu).toFixed(2)} / {row.capacity.cpu.toFixed(2)} 核</Paragraph>
               <Paragraph>内存: { (row.allocatable.memory / 1024 / 1024 / 1024 ).toFixed(2)} / {(row.capacity.memory / 1024 / 1024 / 1024).toFixed(2)} Gi</Paragraph>
            </Space>
        )}
    },
]

var clusterId:any

const Nodes: React.FC = (props) => {
    
    clusterId = history.location.query?.cid

    if (clusterId == undefined) {
        history.goBack()
    }


    return(
        <PageContainer title="节点列表">
            <ProTable<NodeItem>
                rowKey={record=>record.uid}
                columns={nodeListColumns}
                headerTitle='节点列表'
                search={false}
                request={async (params,sort) => {
                    params.cid = clusterId
                    var nodesData = await getNodeList(params,sort)
                    return nodesData
                 }}
                 toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => {
                        history.goBack()
                    }}
                    >  返回集群列表 </Button>,
               ]}
            />
        </PageContainer>
    )
}


export default Nodes;