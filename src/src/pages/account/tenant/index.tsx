
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { TenantTableListItem ,TenantTableListPagination} from './tenant_data';
const queryUsers = async (
    params: {
        pageIdnex?: number;
        pageSize?: number;
        current?: number;
    },
    sort: Record<string, any>,
    options?: { [key: string]: any }) => {
    params.pageIdnex = params.current

}


const Tenant: React.FC = () => {

    const columns: ProColumns<TenantTableListItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '租户名称',
            dataIndex: 'tName',

        },
        {
            title: '租户编号',
            dataIndex: 'tCode',
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                0: {
                    text: '停用',
                },
                1: {
                    text: '启用'
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render:(_,record)=>[
                <a>选择</a>
            ]

        }
    ]

    return (
        <PageContainer>
            <ProTable<TenantTableListItem,TenantTableListPagination>
                columns={columns}
                />
        </PageContainer>
    )
}