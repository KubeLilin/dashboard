import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message , Drawer } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';

import type { TableListItem,MenuListItem, TableListPagination } from './data';

const Role: React.FC = () => {


    const roleColumns: ProColumns<TableListItem>[] = [
        {
            title: '角色名称',
            width: 320,
            dataIndex: 'roleName',
        },
        {
            title: '角色描述',
            dataIndex: 'roleDesc',
            hideInForm: true,
            hideInSearch:true,
        },
        {
            title: '状态',
            width: 120,
            dataIndex: 'status',
            hideInForm: true,
            hideInSearch:true,
        },
    ]

    const menusColumns: ProColumns<MenuListItem>[] = [
        {
            title: '菜单',
            dataIndex: 'menuName',
        },
        {
            title: '状态',
            width: 120,
            dataIndex: 'status',
        },
    ]

    return (
      <PageContainer>
        <ProCard split="vertical">
            <ProCard colSpan="60%">
                <ProTable<TableListItem, TableListPagination> 
                    headerTitle="角色查询"
                    search={false}
                    options={{  search: true }}
                    columns={roleColumns}
                    toolBarRender={() => [
                        <Button type="primary" key="primary" onClick={() => {
                            
                          }}
                        > <PlusOutlined /> 新建 </Button>,
                        <Button  onClick={() => {
                        
                        }} > 删除 </Button>,
                   ]}
                />
            </ProCard>
            <ProCard >
                <ProTable<MenuListItem, TableListPagination> 
                    headerTitle="菜单查询"
                    search={false}
                    columns={menusColumns}
                    toolBarRender={() => [
                        <Button type="primary" key="primary" onClick={() => {
                            
                          }}
                        > <PlusOutlined /> 保存 </Button>,
                        <Button  onClick={() => {
                        
                        }} > 取消 </Button>,
                   ]}
                />
            </ProCard>
        </ProCard>
      </PageContainer>
    )
};

export default Role;