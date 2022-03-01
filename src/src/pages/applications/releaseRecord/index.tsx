import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ReleaseRecordItem } from './releaseRecord_data';
import { GetReleaseRecord } from './service';
const ReleaseRecord: React.FC = () => {

    const columns: ProColumns<ReleaseRecordItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
            hideInSearch: true
        },
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
        },
        {
            title: '镜像名称',
            dataIndex: 'applyImage',
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
            title: '触发人',
            dataIndex: 'operatorName',
            hideInSearch: true
        },
        {
            title: '触发时间',
            dataIndex: 'creationTime'
        }
    ];

    return (
        <ProTable columns={columns}
            request={async (params, sort) => {
                let data = await GetReleaseRecord(params)
                return data.data
            }}
        >
        </ProTable>
    )
}

export default ReleaseRecord