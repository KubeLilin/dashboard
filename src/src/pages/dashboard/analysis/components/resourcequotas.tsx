import React, { useState, useEffect} from 'react';
import { Progress,Space,Typography } from 'antd';
const { Paragraph } = Typography;
import { Link } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { GetNameSpaceList } from '../service'
import { NamespaceInfo } from '../data'

interface Props{
    ClusterId:number,
}

const ResourceQuotas:React.FC<Props> = (props:Props) => { 
    const NamespaceColumns: ProColumns<NamespaceInfo>[] = [
        {
            width:240,
            title: '租户',
            dataIndex: 'tenantName',
            search:false
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
            width:300,
            title: 'CPU配额',
            render:(_,row)=>(
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                    <Progress   percent={Number(((row.quotasSpec[0].usedValue / row.quotasSpec[0].limitValue) * 100).toFixed(1)) } status="active" />
                    <Paragraph style={{ marginRight:5 }}>CPU: { row.quotasSpec[0].displayUsedValue} / {row.quotasSpec[0].displayValue} 核</Paragraph>
                </Space>
            )
        },
        {
            width:300,
            title: '内存配额',
            render:(_,row)=>(
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                <Progress percent={Number(((row.quotasSpec[1].usedValue / row.quotasSpec[1].limitValue) * 100).toFixed(1)) } status="active" />
                <Paragraph style={{ marginRight:5 }}>内存: { row.quotasSpec[1].displayUsedValue} / {row.quotasSpec[1].displayValue} </Paragraph>
                </Space>
            )
        },
        {
            width:300,
            title: 'Pods配额',
            render:(_,row)=>(
                <Space direction="vertical" style={{ marginRight:30 ,width:300}}>
                <Progress percent={Number(((row.quotasSpec[2].usedValue / row.quotasSpec[2].limitValue) * 100).toFixed(1)) } status="active" />
                <Paragraph style={{ marginRight:5 }}>Pods数量: { row.quotasSpec[2].displayUsedValue} / {row.quotasSpec[2].displayValue} </Paragraph>
                </Space>
            )
        },
    ]
    



    return(
        <ProTable<NamespaceInfo>
            columns={NamespaceColumns}
            toolBarRender={false}
            rowKey="id"
            search={false}
            request={async (params, sort) => { 
                return await GetNameSpaceList(props.ClusterId,params.tenantName,Number(params.current),Number(params.pageSize))
            }} >

        </ProTable>
    )
}


export default ResourceQuotas;