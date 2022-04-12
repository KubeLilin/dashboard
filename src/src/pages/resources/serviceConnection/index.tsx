import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { ServiceConnectionItem } from './data';
import { addGitRepo, editGitRepo, getServiceConnectionInfo, queryServiceConnections } from './service';
import { Drawer, Button, Radio, Space, List, notification, Form } from 'antd';
import { GithubOutlined, GitlabOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled } from '@ant-design/icons';
import ProForm, { DrawerForm, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { ApiResponse } from '@/services/public/service';
const ServiceConnection: React.FC = () => {
    const [firstDrawerVisible, setfirstDrawerVisible] = useState(false)
    const [repoDrawerVisible, setrepoDrawerVisible] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [radioValue, setRadioValue] = useState(0)
    const [mainId, setMainId] = useState(0)
    const [repoFormRef] = Form.useForm();
    const columns: ProColumns<ServiceConnectionItem>[] = [
        {
            dataIndex: 'id',
            valueType: 'indexBorder',
            width: 48
        },
        {
            dataIndex: 'name',
            title: '名称',
            copyable: true,
            render: (text, record, _, action) => <a onClick={() => { editServiceConnection(record.id) }}>{text}</a>
        },
        {
            dataIndex: 'tenantId',
            title: '租户',
            hideInTable: true,
            search: false,
        },
        {
            dataIndex: 'serviceType',
            title: '连接类型',
            search: false,
            valueEnum: {
                1: '连接凭证',
                2: '连接信息'
            }
        },
        {
            dataIndex: 'type',
            title: '连接来源',
            hideInTable: true,
            valueEnum: {
                1: 'github',
                2: 'gitlab',
                3: 'gogs',
                4: 'gitee'
            },
            search: false
        },
        {
            dataIndex: 'detail',
            title: '连接明细',
            hideInTable: true,
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a
                    key="del"
                >删除</a>
            ]
        }

    ]
    const listData = [
        {
            title: 'github',
            avatar: <GithubOutlined />,
            value: 1
        },
        {
            title: 'gitlab',
            avatar: <GitlabOutlined />,
            value: 2
        },
        {
            title: 'gogs',
            avatar: <SettingFilled />,
            value: 3
        },
        {
            title: 'gitee',
            avatar: <GooglePlusOutlined />,
            value: 4
        }
    ]
    async function editServiceConnection(id: number) {
        setMainId(id)
        let res = await getServiceConnectionInfo(id)
        if (res.success == false) {
            notification.open({
                message: '获取信息失败',
                description: res.message,
            });
        }

        setRadioValue(res.data.type)
        let repoData = JSON.parse(res.data.detail)
        repoFormRef.setFieldsValue(repoData)
        setfirstDrawerVisible(true)
        setrepoDrawerVisible(true)
        setIsEdit(true)
    }

    return (
        <PageContainer>
            <Drawer visible={firstDrawerVisible}
                title='创建连接器'
                onClose={() => { setfirstDrawerVisible(false) }}
                footer={
                    <Space>
                        <Button onClick={() => { setfirstDrawerVisible(false) }} >Cancel</Button>
                        <Button type="primary" onClick={() => {
                            if (radioValue == 1 || radioValue == 2 || radioValue == 3 || radioValue == 4) {
                                setrepoDrawerVisible(true)
                            }
                        }}>
                            Next
                        </Button>
                    </Space>

                }
            >
                <Radio.Group onChange={x => { setRadioValue(x.target.value) }} value={radioValue}>
                    <List
                        dataSource={listData}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={item.avatar}
                                    title={<Radio value={item.value} onChange={x => { setRadioValue(x.target.value) }}>{item.title}</Radio>}
                                />
                            </List.Item>
                        )}
                    >
                    </List>
                </Radio.Group>
                <DrawerForm<{
                    name: string
                    repo: string
                    userName: string
                    password: string
                    token: string
                    type: number
                }>
                    form={repoFormRef}
                    visible={repoDrawerVisible}
                    onVisibleChange={setrepoDrawerVisible}
                    drawerProps={{
                        destroyOnClose: true,
                    }}
                    width={350}
                    onFinish={
                        async x => {
                            x.type = radioValue
                            let res:ApiResponse<any>
                            if(isEdit){
                                res = await editGitRepo(x,mainId)
                            }else{
                                res = await addGitRepo(x)
                            }
                            if (res.success == false) {
                                notification.open({
                                    message: '操作失败',
                                    description: res.message,
                                });
                            } else {
                                setfirstDrawerVisible(false)
                                setrepoDrawerVisible(false)
                            }
                        }
                    }
                >
                    <ProFormText name='name' label='连接名称' placeholder="请输入连接名称" rules={[{ required: true, message: "请输入连接名称" }]}></ProFormText>
                    <ProFormText name='repo' label='仓库地址' placeholder="请输入仓库地址" rules={[{ required: true, message: "请输入仓库地址" }]}></ProFormText>
                    <ProFormText name='userName' label='用户名' placeholder="请输入用户名" rules={[{ required: true, message: "请输入用户名" }]}></ProFormText>
                    <ProFormText name='password' label='密码' placeholder="请输入密码" rules={[{ required: true, message: "请输入密码" }]}></ProFormText>
                    <ProFormText name='token' label='token' placeholder="请输入token" ></ProFormText>
                </DrawerForm>
            </Drawer>
            <ProTable<ServiceConnectionItem>
                columns={columns}
                request={
                    async (params, sort) => {
                        let data = await queryServiceConnections(params)
                        return data.data
                    }
                }
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setfirstDrawerVisible(true) ;setIsEdit(false)}}  >
                        新建
                    </Button>,
                ]}
            >
            </ProTable>
        </PageContainer>
    )
}
export default ServiceConnection