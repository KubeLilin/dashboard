import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { ServiceData } from './data';
import { queryServiceList } from './service';

const columns:ProColumns<ServiceData>[]=[
    {
        title: '名称',
        dataIndex: 'name',
        hideInForm: true,
        hideInSearch: true
    },
    {
        title:'命名空间',
        dataIndex:'namespace'
    },
    {
        title:'labels',
        dataIndex:'labels'
    },{
        title:'selector',
        dataIndex:'selector'
    },
    {
        title:'创建时间',
        dataIndex:'creatTime'
    }
]

const ServiceConfig: React.FC = () => {

    
    return <ProTable<ServiceData>
        columns={columns}
        request={queryServiceList }
        >

    </ProTable>
}

export default ServiceConfig;