import React, { useState, useRef } from 'react';
import { ApplicationModel } from './apps_data';
import ProForm, { DrawerForm, ProFormSelect, ProFormTextArea, ProFormText, ProFormGroup } from '@ant-design/pro-form';
import { Input, Button, Form, Checkbox, Radio, Select,Modal, message } from 'antd';
import { GithubOutlined, GitlabOutlined, GoogleOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled,ExclamationCircleOutlined, ContactsOutlined } from '@ant-design/icons';

import { getAppLanguage, getAppLevel, createApp, updateApp } from './apps_service';
import { queryRepoConnections } from '@/pages/resources/serviceConnection/service';

export type AppDrawFormProps = {
    projectId : number;
    onFinish: Function;
    visbleAble: [boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    editable:boolean;
    form: any;
};

const AppDrawForm: React.FC<AppDrawFormProps> = (props) => {
    console.log(props)
    const [repoOptions, repoOptionsHandler] = useState<any>([{label:'公开',value:0}]);
    const [appName, appNamehandler] = useState<string>("");

    function bindRepo(repoType: string,selectedRecord:any) {
        let res = queryRepoConnections(repoType)
        res.then(x => {    
            console.log(x)
            repoOptionsHandler(x)
            props.form.setFieldsValue({ sources:x.value })
            if (selectedRecord){
                props.form.setFieldsValue({ sources:selectedRecord.sources }) 
            }           
        })
    }

    return (
        <DrawerForm<ApplicationModel>
            form={props.form}
            title="创建应用"
            visible={props.visbleAble[0]}
            onVisibleChange={ (vis) =>{
                if(vis){
                    const record = props.form.getFieldsValue()
                    bindRepo(record.sourceType,record)
                }
                props.visbleAble[1](vis)
            } }
            onFinish={async (formData) => {
                console.log(formData)
                console.log(props)
                formData.pid = props.projectId
                let res
                if (props.editable) {
                    res = await updateApp(formData)
                } else {
                    res = await createApp(formData)
                }

                if (res.success) {
                    props.onFinish(res.success)
                    //actionRef.current?.reload()
                }
                props.form.resetFields()
                return res.success
            }}
            drawerProps={{
                forceRender: true,
                destroyOnClose: true,
            }}
        >

        <ProFormText width="md" name="id" label="id" readonly={true} hidden={true} />
        <ProForm.Item name="name" label="应用名称" rules={[{ required: true, message: '请输入应用名' }]} >
            <Input placeholder="请输入应用名称(仅限小写字母、数字、-)" disabled={props.editable} 
                onInput={(e) => { 
                    let value = e.currentTarget.value;
                    if (!/^[a-z]/.test(value)) {
                      e.currentTarget.value = ''
                      return
                    }
                  
                    value = value.replace(/[^a-z0-9-]/g, '');
                    e.currentTarget.value = value;
                    // e.currentTarget.value = e.currentTarget.value.replace(/[^a-z]/g, '');
                    appNamehandler(e.currentTarget.value) 
                }}  />
        </ProForm.Item>
        <ProForm.Item name="labels" label="应用标签">
            <Input placeholder="" />
        </ProForm.Item>
        <ProForm.Item name="sourceType" label="选择代码源类型" rules={[{ required: true, message: '请选择代码源类型' }]} >
            <Radio.Group onChange={(x) => { bindRepo(x.target.value,null) }}>
                <Radio value="github"><GithubOutlined style={{ fontSize: '25px' }} />Github</Radio>
                <Radio value="gitee"><GooglePlusOutlined style={{ fontSize: '25px' }} />Gitee</Radio>
                <Radio value="gitlab"><GitlabOutlined style={{ fontSize: '25px' }} />Gitlab</Radio>
                {/* <Radio value="gogs"><SettingFilled style={{ fontSize: '25px' }} />Gogs</Radio> */}
            </Radio.Group>
        </ProForm.Item>
        <ProForm.Item name="sources" label="代码源" initialValue={0} rules={[{ required: true, message: '请选择代码源' }]}>
            <Select options={repoOptions} ></Select>
        </ProForm.Item>
        <ProFormText name="git" label="git地址" rules={[{ required: true, message: '请输入git地址' }]}>
        </ProFormText>
        <ProForm.Item name='level' label="应用等级" rules={[{ required: true, message: '请选择应用级别!' }]}>
            <ProFormSelect initialValue={0}
                request={getAppLevel}
            ></ProFormSelect>
        </ProForm.Item>
        <ProForm.Item name='language' label="开发语言" rules={[{ required: true, message: '请选择开发语言!' }]}>
            <ProFormSelect request={getAppLanguage} ></ProFormSelect>
        </ProForm.Item>
        <ProForm.Item name='remark' label='备注'>
            <ProFormTextArea></ProFormTextArea>
        </ProForm.Item>
        <ProForm.Item name='status' label="状态" >
            <ProFormSelect initialValue={1}
                request={async () => [
                    { label: '启用', value: 1 },
                    { label: '停用', value: 0 }
                ]}
            ></ProFormSelect>
        </ProForm.Item>
    </DrawerForm>
    )
}

export default AppDrawForm