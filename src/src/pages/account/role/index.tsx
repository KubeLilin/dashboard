import React, { useState, useRef } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { message, Button,Table , Form } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import type { TableListItem,MenuListItem, TableListPagination, CreateOrUpdateRoleMenuRequest } from './data';
import { roleQuery,queryMenuList, getMenuListByRoleId ,postRoleMenuMap } from './service';
import { useModel } from 'umi';


const Role: React.FC = () => {
    const actionRef = useRef<ActionType>();
    /** 新建窗口的弹窗 */
    const [ roleModalTitle, setRoleModalTitle ] = useState<string>("新建");
    const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
    const [ roleModalForm ] = Form.useForm();

    const [ selectedMenuIds,setSelectedMenuIds ] = useState<number[]>([])
    const [ currentRole , setCurrentRole ] = useState<TableListItem>()

    const { initialState } = useModel('@@initialState');
    const currentUser =  initialState?.currentUser
    //const token = initialState?.getUserToken?.()


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
            title: '租户',
            dataIndex: 'tenantId',
            hideInForm: false,
            hideInSearch:false,
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
            render: (_,entity) => [
                <a key="link" onClick={()=>{
                    //setCurrentRole(entity)
                    roleModalForm.setFieldsValue(entity)
                    setRoleModalTitle("更新")
                    handleModalVisible(true)
                }}>编辑</a> , 
                <a key="link" color="red" >删除</a>
            ],
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
            dataIndex: 'name',
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
                        onChange: async (_,selectedRows) => {
                            setSelectedMenuIds([])
                            if (selectedRows.length > 0) {
                                setCurrentRole(selectedRows[0])
                                const rsData =  await getMenuListByRoleId(selectedRows[0].id)
                                if(rsData.success && rsData.data != null){
                                    setSelectedMenuIds(rsData.data)
                                }
                            } else {
                                setSelectedMenuIds([])
                            }
                        }
                    }}
                    bordered={true}
                    request={(params)=> {  
                        params.tenantId = Number(currentUser?.group)
                        return roleQuery(params) 
                    }}
                    actionRef={actionRef}
                    rowKey="id"
                    search={false}
                    options={{  search: true }}
                    columns={roleColumns}
                    toolBarRender={() => [
                        <Button type="primary" key="primary" onClick={() => {
                            setRoleModalTitle("新建")
                            roleModalForm.setFieldsValue({ id: -1,roleName:'',roleCode:'',tenantId: currentUser?.group })
                            handleModalVisible(true)
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
                        checkStrictly: false,
                        selectedRowKeys: selectedMenuIds,
                        onChange: async (keys,selectedRows) => {
                            var d:number[] = []
                            keys.forEach((k)=>{
                                d.push(Number(k))
                            })
                           
                            setSelectedMenuIds(d)
                            console.log(d)
                        }
                    }}
                    bordered={true}
                    indentSize={10}
                    defaultExpandAllRows={true}
                    search={false}
                    rowKey="id"
                    childrenColumnName="routes"
                    columns={menusColumns}
                    request={queryMenuList}
                    toolBarRender={() => [
                        <Button type="primary" key="primary" onClick={ async () => {
                            if(currentRole != null) {
                                if(selectedMenuIds.length > 0) {
                                    var requestData: CreateOrUpdateRoleMenuRequest;
                                    requestData = { roleMenuList : []}
                                    selectedMenuIds.forEach(menu_id => {
                                        requestData.roleMenuList?.push({ roleId: currentRole.id, menuId: menu_id })
                                    });
                                    console.log( requestData )
                                    const res = await postRoleMenuMap(requestData)
                                    if (res.success) {
                                        message.success(res.message)
                                    }

                                } else {
                                    message.error("没有选择要分配的菜单！")
                                }

                            } else {
                                message.error("还没有选择角色！")
                            }
                        }}
                        > <PlusOutlined /> 保存 </Button>,
                        <Button  onClick={() => {
                            setCurrentRole(undefined)
                            setSelectedMenuIds([])
                            actionRef.current?.reset?.()
                        }} > 取消 </Button>,
                   ]}
                />
            </ProCard>
        </ProCard>

        <ModalForm<TableListItem>
            title={roleModalTitle}
            form={roleModalForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            width={450}
            visible={createModalVisible}
            onVisibleChange={handleModalVisible}
            onFinish={async (value) => {
                console.log(value)
                handleModalVisible(false);
                //actionRef.current?.reload();
            //const success = await handleAdd(value as TableListItem);
                // if (success) {
                //     
                //     if (actionRef.current) {
                //     actionRef.current.reload();
                //     }
                // }
            }}
       >
          <ProFormText   width="md" name="id" label="ID"  readonly={true} hidden={true} />
          <ProFormText  width="md" name="tenantId" label="租户ID"  readonly={true} hidden={true} />
          <ProFormText  width="md" name="roleName" label="角色名称" tooltip="英文名" placeholder="请输入角色名称" 
              rules={[ {  required: true, message: '角色名称为必填项',  }, { max:20 , message:'超过最大输入长度 > 10'}  ]}  />

          <ProFormText  width="md" name="roleCode" label="角色编码"  placeholder="请输入角色编码" 
              rules={[ {  required: true, message: '角色编码为必填项',   },{ max:13, message:'超过最大输入长度 > 10'}  ]}  />
      </ModalForm>

      </PageContainer>
    )
};

export default Role;