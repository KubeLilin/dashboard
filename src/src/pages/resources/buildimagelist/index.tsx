import { PageContainer } from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { Drawer, Button, Radio, Space, List, notification, Form,Popconfirm } from 'antd';
import { GithubOutlined, GitlabOutlined,AppstoreAddOutlined, PlusOutlined,CodeSandboxOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormSelect, ProFormText,ProFormDigit } from '@ant-design/pro-form';
import {getAppLanguages , getBuildImageByLanguages ,deleteBuildImage ,addEditBuildImage} from './service'

const BuildImageList: React.FC = () => {
    const [repoDrawerVisible, setrepoDrawerVisible] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [repoFormRef] = Form.useForm();
    const actionRef = useRef<ActionType>();


    const columns: ProColumns<any>[] = [
        {
            dataIndex: 'id',
            valueType: 'indexBorder',
            width: 48
        },
        {
            dataIndex: 'aliasName',
            title: '编译环境',
        },
        {
            dataIndex:'languageId',
            title:'语言',
            hideInTable:true,
            valueType: 'select',
            request: getAppLanguages
        },
        {
            dataIndex: 'compileImage',
            title: '镜像名称',
            hideInSearch:true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a key="link_edit" onClick={() => { editBuildImage(record) }}>编辑</a>,
                <Popconfirm key="link-confirm" title="确定要删除这个编译环境吗?" onConfirm={async()=>{
                    const res = await deleteBuildImage(record.id)
                    if (res.success) {
                        notification.open({
                            message: '删除成功',
                            description: record.aliasName + '编译环境删除成功',
                        });
                        actionRef.current?.reload()
                    } 
                }}>
                   <a key="link_del">删除</a>
                </Popconfirm>
         
            ]
        }

    ]
    
    async function editBuildImage(record:any) {
        repoFormRef.setFieldsValue(record)
        setrepoDrawerVisible(true)
        setIsEdit(true)
    }

    return (
        <PageContainer>
              <DrawerForm form={repoFormRef} title={ isEdit?"编辑-编译环境":"新建-编译环境" }  width={450} visible={repoDrawerVisible} onVisibleChange={setrepoDrawerVisible}
                drawerProps={{ destroyOnClose: true, }}
                onFinish={ async fromdata => {
                        console.log(fromdata)
                        const res = await addEditBuildImage(fromdata)
                        if (res.success) {
                            notification.open({
                                message: '更新成功',
                                description: '编译环境更新成功',
                            });
                            actionRef.current?.reload()
                        }
                        setrepoDrawerVisible(false) 
                }}>
                <ProFormText name='id' hidden></ProFormText> 
                <ProFormSelect name='languageId' label="语言" placeholder="请选择支持的语言" request={getAppLanguages} rules={[{ required: true, message: "请选择支持的语言" }]}></ProFormSelect>
                <ProFormText name='aliasName' label='编译环境名' placeholder="请输入编译环境名" rules={[{ required: true, message: "请输入编译环境名" }]}></ProFormText>
                <ProFormText name='compileImage' label='镜像名称' placeholder="请输入镜像名称" rules={[{ required: true, message: "请输入镜像名称" }]}></ProFormText>
                <ProFormDigit label="排序" name="sort" width="sm" min={1} max={99} initialValue={1} />
            </DrawerForm>
            <ProTable actionRef={actionRef} columns={columns}
                request={ getBuildImageByLanguages }
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { repoFormRef.resetFields(); setrepoDrawerVisible(true) ;setIsEdit(false)}}  >
                        新建</Button>,]}
            ></ProTable>
        </PageContainer>
    )
}
export default BuildImageList