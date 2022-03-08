import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ReleaseRecordItem } from './releaseRecord_data';
import { GetReleaseRecord } from './service';
import { getDeploymentList } from '../info/deployment.service'
interface Props{
    AppId:number,
}
const ReleaseRecord: React.FC<Props> = (props) => {
    const columns: ProColumns<ReleaseRecordItem>[] = [
        {
            title: 'appId',
            dataIndex: 'appId',
            hideInTable: true,
            hideInSearch: true
        },
        {
            title: 'deploymentId',
            dataIndex: 'deploymentId',
            hideInTable: true,
            hideInSearch: true
        },
        {
            title: '部署环境名称',
            dataIndex: 'deploymentName',
            hideInSearch:true,
        },
        {
            title:'部署环境',
            dataIndex:'dpId',
            hideInTable:true,
            request: async(p)=>{
                const deployPage = await getDeploymentList({appid:props.AppId,current:1,pageSize:50})
                return deployPage.data.map((item)=> ({label: item.name ,value:item.id}) )
            }
        },
        {
            title: '触发类型',
            dataIndex: 'opsType',
            valueEnum: {
                manual: '手动触发',
                githook: 'GIT触发'
            }
        },
        {
            title: '镜像名称',
            dataIndex: 'applyImage',
        },
        {
            title: '触发人',
            dataIndex: 'operatorName',
            hideInSearch: true
        },
        {
            title: '触发时间',
            dataIndex: 'creationTime',
            hideInSearch:true,
        }
    ];

    return (
        <ProTable columns={columns}
            request={async (params, sort) => {
                params.appId = props.AppId
                let data = await GetReleaseRecord(params)
                return data.data
            }}
        >
        </ProTable>
    )
}

export default ReleaseRecord