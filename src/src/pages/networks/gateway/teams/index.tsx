import { PageContainer } from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns } from '@ant-design/pro-table';
import { GithubOutlined, GitlabOutlined, GoogleOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled ,SmileOutlined} from '@ant-design/icons';
import { Input, Button, Form, Checkbox, Radio, Select,notification } from 'antd';
import React, { useState, useRef } from 'react';
import { DrawerForm, ProFormSelect, ProFormText,ProFormDigit } from '@ant-design/pro-form';
import { history ,Link} from 'umi';
import { getTeamList,createOrEditTeam } from './service'

const Teams: React.FC = () => {
    const gatewayId = history.location.query?.id
    const gatewayName= history.location.query?.name
    const clusterId = history.location.query?.clusterId

    const [repoDrawerVisible, setrepoDrawerVisible] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [repoFormRef] = Form.useForm();
    const actionRef = useRef<ActionType>();


    const columns: ProColumns<any>[] = [
        {
            dataIndex: 'id',
            title: 'ID',
            hideInSearch:true,
        },
        {
            dataIndex: 'name',
            title: '团队目录名称',
            hideInSearch:true,
            render: (dom, row) => {
                return <Link key={'linkgateway' + row.id} style={{  textDecorationLine: 'underline' }} to={'/networks/gateway/routers?teamId=' + row.id + '&teamName=' + row.name + `&clusterId=${clusterId}` + `&gatewayId=${gatewayId}` }>{dom}</Link>
            }
        },
        {
            dataIndex:'level',
            title:'服务等级',
            hideInSearch:true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a key="link_edit" onClick={()=>{
                    console.log(record)
                    setIsEdit(true)
                    repoFormRef.setFieldsValue(record)
                    setrepoDrawerVisible(true)
                }} >编辑</a>,
            ]
        }

    ]
    
    return (
        <PageContainer title={"网关团队管理 - "+gatewayName}>
            <DrawerForm form={repoFormRef} title={ isEdit?"编辑-网关团队目录":"新建-网关团队目录" }  width={450} visible={repoDrawerVisible} onVisibleChange={setrepoDrawerVisible}
                drawerProps={{ destroyOnClose: true, }}
                onFinish={ async fromdata => {
                        fromdata.gatewayId = Number(gatewayId)
                        console.log(fromdata)
                        const res = await createOrEditTeam(fromdata)
                         if (res.success == false) {
                            notification.error({
                                message: res.message,
                            });
                        } else {
                            notification.success({
                                message: "保存成功" });
                        }
                        setrepoDrawerVisible(false) 
                        actionRef.current?.reload()
                }}>
                <ProFormText name='id' hidden></ProFormText> 
                <ProFormText name='name' label='团队目录名称' placeholder="请输入团队目录名称" rules={[{ required: true, message: "请输入团队目录名称" }]}></ProFormText>
                <ProFormSelect name='level' label="服务等级" options={[ {label:'P0',value:'P0'},{label:'P1',value:'P1'},{label:'P2',value:'P2'},{label:'P3',value:'P3'},{label:'P4',value:'P4'} ] }
                    placeholder="请选择服务等级"   rules={[{ required: true, message: "请选择服务等级" }]}></ProFormSelect>

            </DrawerForm>

            <ProTable rowKey={"id"} columns={columns} actionRef={actionRef} request={ (params)=>{
                params.gatewayId = gatewayId
                return getTeamList(params)
            } }
            search={false}
            toolBarRender={() => [
                <Button key='button' icon={<PlusOutlined />} type="primary"
                    onClick={() => {
                        repoFormRef.setFieldsValue({id:0,name:'',level:''})
                        setrepoDrawerVisible(true)
                        setIsEdit(false)
                    }}>创建团队目录</Button>
            ]} ></ProTable>
        </PageContainer>
    )
}
export default Teams