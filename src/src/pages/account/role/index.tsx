import React, { useState, useRef } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { message, Button,Table } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import type { TableListItem,MenuListItem, TableListPagination } from './data';
import { roleQuery,queryMenuList } from './service';


const Role: React.FC = () => {
    const actionRef = useRef<ActionType>();

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
            valueEnum: {
                0: {
                  text: '失效',
                  status: 'Default',
                },
                1: {
                  text: '生效',
                  status: 'Success',
                },
            },
        },
        {
            title: '操作',
            width: 120,
            key: 'option',
            valueType: 'option',
            fixed: 'right',
            render: () => [<a key="link">编辑</a> , <a key="link" color="red" >删除</a>],
        }
    ]

    const menusColumns: ProColumns<MenuListItem>[] = [
        {
            width: 8,
            align: 'center',
            title: '',
        },
        {
            title: '菜单名称',
            dataIndex: 'menuName',
        },
        {
            title: '状态',
            width: 120,
            dataIndex: 'status',
            valueEnum: {
                0: {
                  text: '失效',
                  status: 'Default',
                },
                1: {
                  text: '生效',
                  status: 'Success',
                },
            },
        },
    ]

    return (
      <PageContainer>
        <ProCard split="vertical">
            <ProCard colSpan="60%">
                <ProTable<TableListItem, TableListPagination> 
                    headerTitle="角色查询"
                    rowSelection={{
                        type: "radio",
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        onChange: (_,selectedRows) => {
                            message.success(selectedRows.length)
                            console.log(selectedRows.length)
                        }
                    }}
                    bordered={true}
                    request={roleQuery}
                    actionRef={actionRef}
                    rowKey="id"
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
                    headerTitle="菜单-角色权限分配"
                    rowSelection={{
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        checkStrictly: false
                    }}
                    bordered={true}
                    indentSize={10}
                    defaultExpandAllRows={true}
                    search={false}
                    rowKey="id"
                    childrenColumnName="childrenMenu"
                    columns={menusColumns}
                    request={queryMenuList}
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