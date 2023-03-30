import { SmileOutlined } from '@ant-design/icons';
import ProForm, {
    DrawerForm, ModalForm, ProFormGroup, ProFormInstance,
    ProFormSwitch, ProFormTextArea, ProFormSelect, ProFormText,ProFormRadio
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Checkbox, Divider, InputNumber, Switch, Input, notification, message } from 'antd';
import Form from 'antd/lib/form';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';

import { getRouterByName,createOrEditRoute } from './service'
import { DeploymentStep } from '../../devlopment_data'


export interface RouteFormProps {
    deploymentId: number,
    tableRef: any,
    visibleFunc:Function,
    deployment?:DeploymentStep,
    isEdit:boolean,
}

const RouteForm: React.FC<RouteFormProps> = (props: RouteFormProps) => {
    const [noRewrite, setNoRewrite] = useState(false)
    const [repoFormRef] = Form.useForm();

    

    return (
        <ProCard title="部署负载路由(网关)" bordered headerBordered style={{ marginBlockEnd: 16, maxWidth: '100%', }} >
        <ProForm form={repoFormRef} submitter={{ resetButtonProps:{   },searchConfig:{ resetText:'取消',submitText:'提交'} }}
        request={async(r)=>{
            let deployId = 0
            console.log(props.deployment)
            if(props.deploymentId > 0) {
                deployId = props.deploymentId
            } else {
                deployId = Number(props.deployment?.id)
            }

            const routeName = 'default:route:deploy:' + deployId
            const res = await getRouterByName({ deployId: deployId,routeName:routeName })
            if(res.success){
                console.log(res.data)
                if (res.data.rewrite) {
                    setNoRewrite(true)
                }
            }
            return res.data
        }}
        onFinish={async(fromData)=>{
            console.log(fromData)
            // const res = await createOrEditRoute(fromData)
            // if (res.success){
            //     message.success("路由已生效,请联系管理员对域名进行DNS解析.")
            //     return true
            // }
            return false
        }}
        onReset={()=>{ props.visibleFunc(false) }}>
            <Divider orientation="left"  orientationMargin="0">基本信息</Divider>
                <ProFormText name='id' hidden></ProFormText> 
                <ProFormText name='name' label='路由名称' disabled  placeholder="请输入路由名称" rules={[{ required: true, message: "请输入路由名称" }]}></ProFormText>
                {/* <ProFormText name='desc' label='描述' placeholder="请输描述"></ProFormText>
                <ProFormText name='liveness' label='存活探针' placeholder="请输入存活探针" ></ProFormText> */}

                <Divider orientation="left"  orientationMargin="0">负载信息</Divider>

                <ProFormSelect name='loadbalance' label="负载均衡算法"  options={[ {label:'带权轮询(Round Robin)',value:'roundrobin'},{label:'一致性哈希(CHash)',value:'chash'},{label:'指数加权移动平均法(EWMA)',value:'ewma'},{label:'最小连接数(least_conn)',value:'least_conn'} ] }
                    placeholder="请选择负载均衡算法"   rules={[{ required: true, message: "请选择负载均衡算法" }]}></ProFormSelect>
                
                <ProFormText name='applicationId' hidden label="应用ID" placeholder="请选择部署" disabled ></ProFormText>

                <ProFormText name='deploymentId' hidden  label="部署ID" placeholder="请选择部署" disabled ></ProFormText>
                <ProFormText name='liveness' hidden  label="探针" placeholder="请选择探针" disabled ></ProFormText>

                <Divider orientation="left"  orientationMargin="0">匹配条件</Divider>
                <ProFormText name='host' label='域名' placeholder="请输入域名,路由匹配的域名列表。支持泛域名，如：*.test.com" rules={[{ required: true, message: "请输入域名" }]}></ProFormText>
                <ProFormText name='uri' label='路径' placeholder="请输入路径,HTTP 请求路径，如 /foo/index.html，支持请求路径前缀 /foo/*。/* 代表所有路径" rules={[{ required: true, message: "请输入路径" }]}></ProFormText>
                
                <Divider orientation="left"  orientationMargin="0">请求改写</Divider>
                <ProFormRadio.Group name="rewrite" label="路径改写" rules={[{ required: true, message: "请输入路径改写" }]}
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
        </ProForm>
        </ProCard>
    )
}



export default RouteForm;