
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns , ActionType } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { TenantTableListItem, TenantTableListPagination } from './tenant_data';
import { queryTenant,addTenant,changeTenantStatus } from './teanant_service';
import { Button, message ,Form,Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';



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

    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    const [ createModalForm ] = Form.useForm();

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
                <a key="id" onClick={async ()=>{
                    let res=await changeTenantStatus(record)
                    console.log(res)
                    actionRef.current?.reload()
                }}>{record.status==0?"启用":"停用"}</a>
            ]

        }
    ];



    return (
        <PageContainer>
            <ProTable<TenantTableListItem, TenantTableListPagination>
                columns={columns}
                request={queryTenantList}
                headerTitle="租户查询"
                rowKey="id"
                actionRef={actionRef}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        onClick={() => {
                            createModalForm.setFieldsValue({
                                tName:"",
                                tCode:"",
                                status:1
                            })
                            handleModalVisible(true)
                        }}
                    >
                        <PlusOutlined /> 新增租户
                    </Button> 
                ]
                }

            />
            <ModalForm<TenantTableListItem>
                title="新建租户"
                width={450}
                form={createModalForm}
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value)=> {
                   let res= await addTenant(value)
                    if(res?.success) {
                        message.success("添加成功")
                    } else {
                        message.error("添加失败")
                    }
                   handleModalVisible(false)
                   actionRef.current?.reload()
                   return  res.success
                }}
            >
                <ProFormText width="md" name="tName" label="租户名称" placeholder="请输入租户名称" rules={[{ required: true, message: "租户名称不可为空" }]} />
                <ProFormText width="md" name="tCode" label="租户编码" placeholder="请输入租户编码" rules={[{ required: true, message: "租户编码不可为空" }]} />
                <ProFormSelect 
                    options={[
                        {
                            value: 0,
                            label: "停用"            
                        },
                        {
                            value: 1,
                            label: "启用",
                        }
                    ]}
                    initialValue={1}
                    name="status"
                    width="md"
                    label="状态"
                    rules={[{required:true,message:"请选择状态"}]}
                    
                ></ProFormSelect>
            </ModalForm>
        </PageContainer>
    )
};
export default Tenant;