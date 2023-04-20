import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ApplicationItem, ApplicationModel } from './apps_data';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { DrawerForm, ProFormSelect, ProFormTextArea, ProFormText, ProFormGroup } from '@ant-design/pro-form';
import { Input, Button, Form, Checkbox, Radio, Select,Modal, message,Dropdown,Menu } from 'antd';
import { GithubOutlined, GitlabOutlined, GoogleOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled,ExclamationCircleOutlined } from '@ant-design/icons';
import { getAppLanguage, getAppLevel, createApp, getApps, updateApp,deleteApp, initGitRepoistry } from './apps_service';
import { Link } from 'umi';
import AppDrawForm from './new_app_form'
import ImportAppForm from './import_app_form'

const { Search } = Input;
const Apps: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false)
    const [importAppFormVisible, importAppFormVisibleHandler] = useState<boolean>(false)
    const [importAppForm] = Form.useForm()

    const [appForm] = Form.useForm()
    const [edit, editHandler] = useState<boolean>(false)
    const [gitRepo, gieRepoHandler] = useState<string>("");
    const [appName, appNamehandler] = useState<string>("");
    const [repoOptions, repoOptionsHandler] = useState<any>([{label:'公开',value:0}]);
    const columns: ProColumns<ApplicationItem>[] = [
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
            title: '租户id',
            dataIndex: 'tenantId',
            hideInTable: true,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: "部署环境",
            dataIndex: 'deployCount',
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
                }}>编辑</Button>,
                <Button danger key={"delete" + record.id} onClick={()=>{
                    Modal.confirm({
                        title: 'Confirm',
                        icon: <ExclamationCircleOutlined />,
                        content: `确认要删除${record.name}应用吗?`,
                        okText: '确认',
                        cancelText: '取消',
                        onOk:async ()=>{
                          if(record.deployCount > 0) {
                            message.error('应用中还存在部署环境,请删除所有部署环境后再进行应用删除操作!')
                          } else {
                            const res= await deleteApp(record.id)
                            if (res.success) {
                                message.success('删除成功')
                            } else {
                                message.error(res.message)
                            }
   
                          }
                          actionRef.current?.reload()
                        }
                      });


                }}>删除</Button>
            ]
        }
    ]
   

    return (
        <PageContainer >
            <ProTable<ApplicationItem>
                columns={columns}
                rowKey="id"
                actionRef={actionRef}
                headerTitle="应用列表"
                toolBarRender={() => [
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
                    // <Button key='button' icon={<PlusOutlined />} type="primary"
                    //     onClick={() => {
            
                    //     }}>创建应用</Button>,
                    //     <Button key='button' icon={<PlusOutlined />} type="primary"
                    // onClick={() => {
                  
                    // }}>导入应用</Button>
                    
                ]}
                request={getApps}
            ></ProTable>
            <AppDrawForm projectId={0} visbleAble={[formVisible,formVisibleHandler]} editable={edit} form={appForm}
                onFinish={(success:boolean)=>{
                    if (success){
                        actionRef.current?.reload()
                    }
                }} />
            <ImportAppForm projectId={0} visbleAble={[importAppFormVisible,importAppFormVisibleHandler]} form={importAppForm}
                onFinish={(success:boolean)=>{
                    if (success){
                        actionRef.current?.reload()
                    }
                }} />
        </PageContainer>
    )
}

export default Apps