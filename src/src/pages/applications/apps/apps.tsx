import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ApplicationItem, ApplicationModel } from './apps_data';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
    DrawerForm,
    ProFormSelect,
    ProFormTextArea,
    ProFormInstance,
    ProFormText
} from '@ant-design/pro-form';
import { Input, Button, Tag, Space, Menu, Form } from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { getAppLanguage, getAppLevel, createApp, getApps, updateApp } from './apps_service';
import { history,Link } from 'umi';

const Apps: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const formRef = useRef<ProFormInstance>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false)
    const [appForm] = Form.useForm()
    const [edit, editHandler] = useState<boolean>(false)
    const columns: ProColumns<ApplicationItem>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
        },
        {
            title: '应用名称',
            dataIndex: 'name',
            copyable: true,
            render: (dom,row) =>{
                return   <Link id={'linkapp' +row.id} style={{color: 'blue', textDecorationLine: 'underline'}} to={'/applications/info?appid='+ row.id }>{dom}</Link> 
             }
        },
        {
            title: '租户id',
            dataIndex: 'tenantId',
            hideInTable: true,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: "标签",
            dataIndex: 'labels',
        }, {
            title: "Git地址",
            dataIndex: 'git',
            hideInSearch: true,
            render:(dom,row)=>{
                return <a id={'gitlink'+row.id} href={row.git} target="_blank">{dom}</a>
            }
        }, {
            title: '级别',
            dataIndex: 'level',
            hideInTable: true,
            valueType: 'select',
            request: getAppLevel
        }, {
            title: '级别',
            dataIndex: 'levelName',
            hideInSearch: true
        },
        {
            title: "备注",
            dataIndex: 'remarks',
            hideInSearch: true

        }, {
            title: '状态',
            dataIndex: 'status',
            valueType: 'select',
            hideInSearch: true,
            valueEnum: {
                '0': { text: '停用' },
                '1': { text: '启用' }
            }
        }, {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Link key={"link-id"+record.id} to={'/applications/info?appid='+ record.id }>进入应用</Link>,
                <a id={"edit"+record.id} onClick={() => {
                    formVisibleHandler(true)
                    console.log(record)
                    appForm.setFieldsValue(record)
                    editHandler(true)
                }}>编辑</a>,

            ]
        }
    ]


    return (
        <PageContainer>
            <ProTable<ApplicationItem>
                columns={columns}
                actionRef={actionRef}
                key="id"
                headerTitle="应用列表"
                toolBarRender={() => [
                    <Button key='button' icon={<PlusOutlined />} onClick={() => { formVisibleHandler(true); editHandler(false) }}>创建应用</Button>
                ]}
                request={getApps}
            ></ProTable>
            <DrawerForm<ApplicationModel>
                form={appForm}
                title="创建应用"
                visible={formVisible}
                onVisibleChange={formVisibleHandler}
                onFinish={async (x) => {
                    let res
                    if (edit) {
                        res = await updateApp(x)
                    } else {
                        res = await createApp(x)
                    }

                    if (res.success) {
                        actionRef.current?.reload()
                    }
                    return res.success
                }}
                drawerProps={{
                    forceRender: true,
                    destroyOnClose: true,
                }}
            >

                <ProFormText width="md" name="id" label="id" readonly={true} hidden={true} />
                <ProForm.Item name="name" label="应用名称" rules={[{ required: true, message: '请输入应用名' }]} >
                    <Input placeholder="请输入应用名称(仅限英文)" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^\w_]/g, ''); }} disabled={edit} />
                </ProForm.Item>
                <ProForm.Item name="labels" label="应用标签">
                    <Input placeholder="" />
                </ProForm.Item>
                <ProForm.Item name="git" label="Git地址" rules={[{ required: true, message: '请录入应用Git地址!' }]}>
                    <Input placeholder="请输入Git地址" disabled={edit} />
                </ProForm.Item>
                <ProForm.Item name='level' label="应用等级" >
                    <ProFormSelect
                        request={getAppLevel}
                    ></ProFormSelect>
                </ProForm.Item>
                <ProForm.Item name='language' label="开发语言" rules={[{ required: true, message: '请选择开发语言!' }]}>
                    <ProFormSelect
                        request={getAppLanguage}
                        disabled={edit}
                    ></ProFormSelect>
                </ProForm.Item>
                <ProForm.Item name='remark' label='备注'>
                    <ProFormTextArea></ProFormTextArea>
                </ProForm.Item>
            </DrawerForm>
        </PageContainer>
    )
}

export default Apps