import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { RepoServiceConnection, ServiceConnectionItem } from './data';
import { addGitRepo, editGitRepo, getServiceConnectionInfo, queryServiceConnections } from './service';
import { Drawer, Button, Radio, Space, List, notification, Form } from 'antd';
import { GithubOutlined, GitlabOutlined, GooglePlusOutlined,AppstoreAddOutlined, PlusOutlined, SettingFilled,CodeSandboxOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { ApiResponse } from '@/services/public/service';
import { Item } from 'gg-editor';

const ServiceConnection: React.FC = () => {
    const [firstDrawerVisible, setfirstDrawerVisible] = useState(false)
    const [repoDrawerVisible, setrepoDrawerVisible] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [serviceType, setServiceType] = useState(0)
    const [vcsType, setVcsType] = useState(0)
    const [mainId, setMainId] = useState(0)
    const [repoFormRef] = Form.useForm();

    const servicesList = [
        {
            title: 'Github',
            avatar: <GithubOutlined />,
            serviceType: 1,
            value: 1
        },
        {
            title: 'Gitlab',
            avatar: <GitlabOutlined />,
            serviceType: 1,
            value: 2
        },
        {
            title: 'Gogs',
            avatar: <CodeSandboxOutlined />,
            serviceType: 1,
            value: 3
        },       
        {
            title: 'Gitee',
            avatar: <CodeSandboxOutlined />,
            serviceType: 1,
            value: 4
        },
        {
            title:'Docker Registy',
            avatar: <AppstoreAddOutlined />,
            serviceType: 2,
            value: 5
        },
        

    ]



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
            render: (text, record, _, action) => <a key="link_edit" onClick={() => { editServiceConnection(record.id) }}>{text}</a>
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
                1: '代码仓库',
                2: '镜像仓库',
                3: '流水线集成',
                4: 'URL集成'
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
                <a key="del" >删除</a>
            ]
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

        setVcsType(res.data.type)
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
                        <Button onClick={() => { setfirstDrawerVisible(false) }} >取消</Button>
                        <Button type="primary" onClick={() => {
                            repoFormRef.resetFields()
                            setrepoDrawerVisible(true)
                        }}> 下一步 </Button>
                    </Space>
                } >
                <Radio.Group onChange={x => { 
                        console.log(x.target["data-item"].serviceType)
                        setVcsType(x.target.value) 
                        setServiceType(x.target["data-item"].serviceType)
                    }} value={vcsType}>
                    <List dataSource={servicesList}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta key={item.value}
                                    avatar={item.avatar}
                                    title={<Radio data-item={item} value={item.value} >{item.title}</Radio>}
                                />
                            </List.Item>
                        )} >
                    </List>
                </Radio.Group>
                <DrawerForm<RepoServiceConnection>
                    form={repoFormRef}
                    visible={repoDrawerVisible}
                    onVisibleChange={setrepoDrawerVisible}
                    drawerProps={{
                        destroyOnClose: true,
                    }}
                    width={350}
                    onFinish={
                        async x => {
                            x.type = vcsType
                            let res:ApiResponse<any>
                            if(isEdit){
                                res = await editGitRepo(x,mainId,serviceType)
                            }else{
                                res = await addGitRepo(x,serviceType)
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
                    <ProFormText name='repo' label='连接地址' placeholder="请输入连接地址" rules={[{ required: true, message: "请输入连接地址" }]}></ProFormText>
                    <ProFormText name='userName' label='用户名' placeholder="请输入用户名" ></ProFormText>
                    <ProFormText name='password' label='密码' placeholder="请输入密码" ></ProFormText>
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