import React, { useState,useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Input, Button, Form, Checkbox, Radio, Select,Modal, message,Dropdown,Menu } from 'antd';
import { GithubOutlined, GitlabOutlined, GoogleOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled,ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'umi';

import { ApplicationItem } from '../../../applications/apps/apps_data';
import {  getAppLevel } from '../../../applications/apps/apps_service';
import { getApps } from '../service'

import AppDrawForm from '../../../applications/apps/new_app_form'
import ImportAppForm from '../../../applications/apps/import_app_form'

export type ProjectAppsProps = {
    projectId : number;
};

const ProjectAppList: React.FC<ProjectAppsProps> = ( props ) => {

    const AppsColumns: ProColumns<ApplicationItem>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            width: 48,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '应用名称',
            dataIndex: 'name',
            render: (dom, row) => {
                return <Link key={'linkapp' + row.id} style={{  textDecorationLine: 'underline' }} to={'/applications/info?id=' + row.id + '&name=' + row.name}>{dom}</Link>
            }
        },
        {
            title: "部署环境",
            dataIndex: 'deployCount',
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
            render: (dom, row) => {
                return <a key={'gitlink' + row.id} href={row.git} target="_blank">{dom}</a>
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
        }, {
            title: '语言',
            dataIndex: 'languageName',
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
            valueEnum: {
                '0': { text: '停用' },
                '1': { text: '启用' }
            }
        }, {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Link key={"link-id" + record.id} to={'/applications/info?id=' + record.id + '&name=' + record.name}>进入应用</Link>,
                <Button key={"edit" + record.id} onClick={() => {
                    formVisibleHandler(true)
                    editHandler(true)
                    record.sources = record.sCID
                    appForm.setFieldsValue(record)
                }}>编辑</Button>
            ]
        }
    ]

    // 导入应用
    const [importAppFormVisible, importAppFormVisibleHandler] = useState<boolean>(false)
    const [importAppForm] = Form.useForm()

    // 创建应用
    const [formVisible, formVisibleHandler] = useState<boolean>(false)
    const [appForm] = Form.useForm()
    const [edit, editHandler] = useState<boolean>(false)
    const actionRef = useRef<ActionType>();

    return (
        <div>
        <ProTable<ApplicationItem>  headerTitle="项目应用列表"  actionRef={actionRef}
            rowKey={record => record.id} columns={AppsColumns}
            request={async (p, s, f) => {  p.pid = props.projectId
                return getApps(p,s, f) }}
            toolBarRender={() => [
                // <Button key='button' icon={<PlusOutlined />} type="primary"
                //     onClick={() => {
                //         appForm.resetFields()
                //         formVisibleHandler(true);
                //         editHandler(false)
                //         appForm.setFieldsValue({ status: 1 })
                //     }}>创建应用</Button>
                <Dropdown.Button type="primary"  overlay={ <Menu items={[
                    { key:1,icon:<PlusOutlined /> ,label: '导入应用 (代码仓库)',onClick:()=>{
                        importAppForm.resetFields()
                        importAppFormVisibleHandler(true);
                    }},
                   
                    ]}/> }
                    onClick={() =>{
                        appForm.resetFields()
                        formVisibleHandler(true);
                        editHandler(false)
                        appForm.setFieldsValue({ status: 1 })
                    }}  > 创建应用 </Dropdown.Button>,  
            ]}
                >       
        </ProTable>
        <AppDrawForm projectId={props.projectId} visbleAble={[formVisible,formVisibleHandler]} editable={edit} form={appForm}
                onFinish={(success:boolean)=>{
                    if (success){
                        actionRef.current?.reload()
                    }
                }} />

        <ImportAppForm projectId={props.projectId} visbleAble={[importAppFormVisible,importAppFormVisibleHandler]} form={importAppForm}
                onFinish={(success:boolean)=>{
                    if (success){
                        actionRef.current?.reload()
                    }
                }} />
        </div>
    )
}

export default ProjectAppList