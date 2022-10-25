import { PageContainer } from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns } from '@ant-design/pro-table';
import { GithubOutlined, GitlabOutlined, GoogleOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled ,SmileOutlined} from '@ant-design/icons';
import { Input, Button, Form,Divider, Checkbox, Radio, Select,notification,message,Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { DrawerForm, ProFormSelect, ProFormText,ProFormRadio } from '@ant-design/pro-form';
import { history,Link } from 'umi';
import { getRouterList,getAppList,getDeploymentList , createOrEditRoute ,deleteRoute} from './service'

const Routers: React.FC = () => {
    const teamId = history.location.query?.teamId
    const teamName= history.location.query?.teamName
    const clusterId = history.location.query?.clusterId
    const gatewayId = history.location.query?.gatewayId

    const [repoDrawerVisible, setrepoDrawerVisible] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [repoFormRef] = Form.useForm();
    const actionRef = useRef<ActionType>();

    const [deploymentListOptions, deploymentListOptionsHandler] = useState([])
    const [noRewrite, setNoRewrite] = useState(false)


    const columns: ProColumns<any>[] = [
        {
            dataIndex: 'id',
            title: 'ID',
            hideInSearch:true,
        },
        {
            dataIndex: 'name',
            title: '路由名称',
        },
        {
            dataIndex: 'host',
            title: '域名',
        },
        {
            dataIndex: 'uri',
            title: '路径',
            hideInSearch:true,
        },
        {
            dataIndex: 'desc',
            title: '描述',
        },
        {
            dataIndex:'liveness',
            title:'探针',
            render: (dom, row) => {
                return <a key={'livenesslink' + row.id} href={row.liveness} target="_blank">{dom}</a>
            }
        },
        {
            dataIndex: 'nodes',
            title: '绑定负载',
            hideInSearch:true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            width:130,
            render: (text, record, _, action) => [
                <a key="link_edit" onClick={async()=>{
                    var params = { appId:record.applicationId,clusterId: Number(clusterId) }
                    const res = await getDeploymentList(params)
                    deploymentListOptionsHandler(res)
                    setNoRewrite(Boolean( record.rewrite ))
                    setIsEdit(true)
                    repoFormRef.setFieldsValue(record)
                    setrepoDrawerVisible(true)
                }} >编辑</a>,
                ,
                <Popconfirm key="link-confirm" title="确定要删除这个路由吗?" onConfirm={async()=>{
                    const res = await deleteRoute({id:record.id,gatewayId:Number(gatewayId)})
                    if (res.success) {
                        notification.open({
                            message: '删除成功',
                            description: record.name + '路由删除成功',
                        });
                       
                    } 
                    actionRef.current?.reload()
                }}>
                   <a key="link_del">删除</a>
                </Popconfirm>
            ]
        }

    ]
    
    return (
        <PageContainer title={"网关路由管理 - "+ teamName}>
            <DrawerForm form={repoFormRef} title={ isEdit?"编辑-网关路由":"新增-网关路由" }  width={850} visible={repoDrawerVisible} onVisibleChange={setrepoDrawerVisible}
                drawerProps={{ destroyOnClose: true, }}
                onFinish={ async fromdata => {
                    fromdata.teamId = Number(teamId)
                    fromdata.gatewayId = Number(gatewayId)
                    console.log(fromdata)
                        const res = await createOrEditRoute(fromdata)
                         if (res.success == false) {
                            notification.error({
                                message: res.message,
                            });
                        } else {
                            message.success({content:'路由已生效,请联系管理员对域名进行DNS解析.',duration: 3});
                        }
                        setrepoDrawerVisible(false) 
                        actionRef.current?.reload()
                }}>
                <Divider orientation="left"  orientationMargin="0">基本信息</Divider>
                <ProFormText name='id' hidden></ProFormText> 
                <ProFormText name='name' label='路由名称' placeholder="请输入路由名称" rules={[{ required: true, message: "请输入路由名称" }]}></ProFormText>
                <ProFormText name='desc' label='描述' placeholder="请输描述"></ProFormText>
                <ProFormText name='liveness' label='存活探针' placeholder="请输入存活探针" ></ProFormText>

                <Divider orientation="left"  orientationMargin="0">负载信息</Divider>

                <ProFormSelect name='loadbalance' label="负载均衡算法" initialValue={'roundrobin'} options={[ {label:'带权轮询(Round Robin)',value:'roundrobin'},{label:'一致性哈希(CHash)',value:'chash'},{label:'指数加权移动平均法(EWMA)',value:'ewma'},{label:'最小连接数(least_conn)',value:'least_conn'} ] }
                    placeholder="请选择负载均衡算法"   rules={[{ required: true, message: "请选择负载均衡算法" }]}></ProFormSelect>
                <ProFormSelect name='upstreamType' label="上游类型" initialValue={'service'} options={[ {label:'应用中心(部署)',value:'service'} ] }
                    placeholder="请选择上游类型"   rules={[{ required: true, message: "请选择上游类型" }]}></ProFormSelect>
                <ProFormSelect name='applicationId' label="应用" placeholder="请选择应用" rules={[{ required: true, message: "请选择应用" }]}
                    showSearch request={ getAppList }
                    fieldProps={{ 
                        filterOption:(input, option) =>  Boolean( option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ),
                        onChange:async (value, option) => {
                            var params = { appId:value,clusterId: Number(clusterId) }
                            const res = await getDeploymentList(params)
                            console.log(params)
                            deploymentListOptionsHandler(res)
                        },
                    }}></ProFormSelect>
                <ProFormSelect allowClear={true} name='deploymentId' label="部署" options={deploymentListOptions} placeholder="请选择部署" showSearch rules={[{ required: true, message: "请选择部署" }]}
                    fieldProps={{ 
                        filterOption:(input, option) =>  Boolean( option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ),
                        onChange:async (value, option:any) => {
                            repoFormRef.setFieldsValue({ 
                                uri:`/${option.label}/*`,
                                regexUri: `^/${option.label}/(.*)` ,
                                regexTmp: "/$1",
                            })

                        }
                    }}></ProFormSelect>

                <Divider orientation="left"  orientationMargin="0">匹配条件</Divider>
                <ProFormText name='host' label='域名' placeholder="请输入域名,路由匹配的域名列表。支持泛域名，如：*.test.com" rules={[{ required: true, message: "请输入域名" }]}></ProFormText>
                <ProFormText name='uri' label='路径' placeholder="请输入路径,HTTP 请求路径，如 /foo/index.html，支持请求路径前缀 /foo/*。/* 代表所有路径" rules={[{ required: true, message: "请输入路径" }]}></ProFormText>
                
                <Divider orientation="left"  orientationMargin="0">请求改写</Divider>
                <ProFormRadio.Group name="rewrite" label="路径改写" initialValue={1} rules={[{ required: true, message: "请输入路径改写" }]}
                    options={[ { label: '保持原样', value: 0 }, { label: '正则改写', value: 1 }, ]} 
                    fieldProps={{onChange:(e)=>{
                            setNoRewrite(Boolean( e.target.value))
                            if(e.target.value==0) {
                                repoFormRef.setFieldsValue({ 
                                    uri:`/*`,
                                    regexUri: `` ,
                                    regexTmp: "",
                                })
                            }
                    }} } />
                <div style={{ display: noRewrite?'block':'none' }}>
                <ProFormText name='regexUri'  label='匹配正则表达式' placeholder="请输入匹配正则表达式"></ProFormText>
                <ProFormText name='regexTmp' label='转发路径模版' placeholder="请输入转发路径模版" ></ProFormText>
                </div>
            </DrawerForm>

            <ProTable rowKey={"id"} columns={columns} actionRef={actionRef} 
                request={ (params)=>{
                    params.teamId = teamId
                    return getRouterList(params)
                } }
                toolBarRender={() => [
                    <Button key='button' icon={<PlusOutlined />} type="primary"
                        onClick={() => {
                            repoFormRef.resetFields()
                            setNoRewrite(true)
                            setrepoDrawerVisible(true)
                            setIsEdit(false)
                        }}>新增路由</Button>
                ]} ></ProTable>
        </PageContainer>
    )
}
export default Routers