import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Typography, Button , Space } from 'antd'
const { Text,Paragraph } = Typography;
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { NodeItem } from './data'
import { getNodeList }  from './nodes.service'
import { history,Link } from 'umi';


const nodeListColumns: ProColumns<NodeItem>[] = [
    {
        dataIndex:'name',
        title:'节点名',
        render: (dom,row) =>{
           return   <Link to={'/resources/pods?node='+ row.name}>{dom}</Link> 
        }
    },
    {
        dataIndex: 'status',
        title:'状态',
        valueEnum: {
            'notready': {
              text:  <span style={{color: 'red'}}>未知错误</span>,
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
        title:'Kubernetes版本'
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
            <Space direction="vertical">
            {
                row.addresses.map(item=>{
                   return <Paragraph copyable>{ item.type + ':  ' +  item.address}</Paragraph>
                })
            }
            
            </Space>)
        }
    },
    {
        dataIndex: '',
        title:'已分配/总资源'
    },
]


const Nodes: React.FC = (props) => {
    
    const clusterId = history.location.query?.cid

    if (clusterId == undefined) {
        history.goBack()
    }


    return(
        <PageContainer title="节点列表">
            <ProTable<NodeItem>
                rowKey="uid"
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