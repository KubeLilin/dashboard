
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { TenantTableListItem, TenantTableListPagination } from './tenant_data';
import { queryTenant } from './teanant_service';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const queryTenantList = async (
    params: {
        pageIdnex?: number;
        pageSize?: number;
        current?: number;
    },
    sort: Record<string, any>,
    options?: { [key: string]: any }) => {
    params.pageIdnex = params.current

    let reqData = await queryTenant(params, options)

    let resData: {
        data: TenantTableListItem[];
        total?: number;
        success?: boolean;
    } = {
        data: reqData.data.data,
        success: reqData.success,
        total: reqData.data.total
    }
    return new Promise<any>(resolve => {
        resolve(resData)
    })
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
            search: false

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
            render: (_, record) => [
                <a>选择</a>
            ]

        }
    ]

    return (
        <PageContainer>
            <ProTable<TenantTableListItem, TenantTableListPagination>
                columns={columns}
                request={queryTenantList}
                headerTitle="租户查询"
                rowKey="id"
                toolBarRender={() => [
                    <Button
                        type="primary"
                    >

                        <PlusOutlined /> 新增租户
                    </Button>
                ]
                }

            />
        </PageContainer>
    )
};
export default Tenant;