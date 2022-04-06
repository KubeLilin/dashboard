import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { ServiceConnectionItem } from './data';
import { queryServiceConnections } from './service';

const ServiceConnection: React.FC = () => {

    const columns: ProColumns<ServiceConnectionItem>[] = [
        {
            dataIndex:'id',
            valueType:'indexBorder',
            width:48
        },
        {
            dataIndex:'name',
            title:'名称',
            copyable:true,
        },
        {
            dataIndex:'tenantId',
            title:'租户',
            hideInTable:true,
            search: false,
        },
        {
            dataIndex:'serviceType',
            title:'连接类型',
            search: false,
            valueEnum:{
                1:{text:'连接凭证'},
                2:{text:'连接信息'}
            }
        },
        {
            dataIndex:'type',
            title:'连接来源',
            valueEnum:{
                1:{text:'github'},
                2:{text:'gitlab'},
                3:{text:'gogs'},
                4:{text:'gitee'}
            }
        },
        {
            dataIndex:'detail',
            title:'连接明细',
            hideInTable: false,
            search: false,
        }

    ]
    return (<ProTable<ServiceConnectionItem>
        columns={columns}
        request={
            async (params, sort) => {
                let data = await queryServiceConnections(params)
                return data.data
            }
        }
        >

    </ProTable>)
}
export default ServiceConnection