import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProForm, {
    StepsForm,
    ProFormSelect,
    ProFormInstance,
    ProFormCheckbox,
    ProFormRadio
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Select, Input, Checkbox, Modal, InputNumber, Space, Alert, notification, Drawer,
    Form,  Button,Tabs, message } from 'antd';
import ProFormItem from '@ant-design/pro-form/lib/components/FormItem';
import { BindCluster, BindNameSpace, CreateDeploymnet, CreateDeploymnetLimit, 
    GetDeploymentFormInfo, GetDeploymentLevels,IsInstalledRuntime } from './service';
import { DeploymentStep,DeploymentLevel } from './devlopment_data';
import { CloseCircleTwoTone, SmileOutlined ,MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import ProbeForm from './forms/probe' 
import RouteForm from './forms/route'
import ConfigMapForm from './forms/configmap'
import VolumeForm from './forms/volume'

export interface Props {
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    appId: any,
    appName: any,
    tableRef: any,
    isEdit: boolean,
    id?: number,
    envLevel:string,
}
function BindNamespaceSelect(clusterId: any, handler: any) {
    let req = BindNameSpace(clusterId)
    req.then(x => {
        if (x.success) {
            console.log(x)
            handler(x.data.map(y => { return { value: y.id, label: y.namespace } }))
        }
    })
}

function BindClusterName(clusterId: number, clusterArr: any, nameHandler: any) {
    clusterArr.forEach((element: { value: number, label: string }) => {
        if (clusterId == element.value) {
            nameHandler(element.label)
        }
    });
}

const AdvancedDevlopment: React.FC<Props> = (props: Props) => {
    const [tabActiveKey, tabActiveKeyHandler] = useState<string>();


    const [namespace, namespcaeHandler] = useState<any>();
    const [cluster, clusterHandler] = useState<any>();
    const [clusterId, clusterIdHandler] = useState<any>();
    const [openScv, openScvHandler] = useState<boolean>(false);
    const [dpStep, dpStepHandler] = useState<DeploymentStep>();
    const [clusterName, clusterNameHandler] = useState<string>("")
    // const [deployment, deploymentHandler] = useState<DeploymentStep>()
    const [deploymentLevels, deploymentLevelsHandler] = useState<any>()
    const [formEditable, formEditableHandler] = useState<boolean>(props.isEdit);
    //runtime可用性状态
    const [runtimeStatus, runtimeStatusHandler] = useState<string>('');
    // 可用的运行时

    const baseForm = useRef<ProFormInstance>();
    const instanceForm = useRef<ProFormInstance>();

    function BindClusterSelect() {
        let req = BindCluster()
        req.then(x => { clusterHandler(x) })
    }

    const setNamespaceRuntimeStates = async(id:number) => {
        const res = await IsInstalledRuntime(id)
        if (res && res.success && res.data != "") {
            runtimeStatusHandler(res.data)
        } else {
            runtimeStatusHandler('')
        }
    }

    const BindDeploymentLevels = ()=> GetDeploymentLevels().then(res=> deploymentLevelsHandler(res))

    useEffect(() => {
        console.log('loaded')
        formEditableHandler(props.isEdit)
        BindDeploymentLevels()
        BindClusterSelect()
        tabActiveKeyHandler("1")
        if (props.isEdit) {
            let req = GetDeploymentFormInfo(props.id)
            req.then(x => {
                if (!x.success) {
                    props.visibleFunc[1](false)
                }
                setTimeout(() => {
                    dpStepHandler(x.data)
                    BindClusterName(x.data.clusterId, cluster, clusterNameHandler)
                    BindNamespaceSelect(x.data.clusterId, namespcaeHandler)
                    openScvHandler(x.data.serviceEnable)
                    openScvHandler(true)
                    setNamespaceRuntimeStates(x.data.namespaceId)
                    baseForm.current?.setFieldsValue(x.data)
                    instanceForm.current?.setFieldsValue(x.data)
                }, 150)
            })

        } else {
            openScvHandler(true)

            var levelSelected = 'dev'
            if(props.envLevel != 'all'){
                levelSelected = props.envLevel
            }

            const arrays = [baseForm,instanceForm]
            arrays.forEach((formInstanceRef) => {
                console.log(formInstanceRef)
                formInstanceRef.current?.setFieldsValue({
                    level: levelSelected,
                    serviceEnable: 'true',
                    serviceAway: 'ClusterPort',
                    servicePort: '8080',
                    replicas: 1,
                    requestCpu: 0.25,
                    requestMemory: 128,
                    limitCpu: 0.25,
                    limitMemory: 256
                })
            })
        }
    }, props.visibleFunc)
    return (
        <Drawer title="高级部署环境配置" width="88%"
            onClose={() => { 
                props.visibleFunc[1](false)
                tabActiveKeyHandler("1")
             }}
            visible={props.visibleFunc[0]} destroyOnClose={true} maskClosable={false} >
        <Tabs defaultActiveKey="1" tabPosition='left' activeKey={tabActiveKey}
            onChange={(activeKey=>{
                tabActiveKeyHandler(activeKey)
            })} >
            <Tabs.TabPane tab="基本信息(必填)" key="1" forceRender={true}>
                <ProForm formRef={baseForm} submitter={{ resetButtonProps:{   },searchConfig:{ resetText:'取消',submitText:'下一步'} }}
                 onReset={()=>{ props.visibleFunc[1](false) }}
                 onFinish={async (value) => {
                    value.clusterId = clusterId;
                    value.serviceEnable = openScv;
                    if (props.isEdit) {
                        value.appId = dpStep?.appId;
                        //value.name = deployment?.name;
                        value.id = props.id;
                    } else {
                        value.appId = parseInt(props.appId);
                        value.clusterId = clusterId;
                        // if(dpStep?.id){
                        //     value.id = dpStep?.id
                        // }
                        //value.name = (`${value.nickname}-${props.appName}-${clusterName}`).trim();
                    }
                    console.log(value)
                    value.name = (`${props.appName}-${value.nickname}`).trim();
                    let res = await CreateDeploymnet(value)
                    if (res && res.success) {
                        message.success("部署基础信息保存成功")
                        formEditableHandler(true)
                        props.tableRef.current?.reload()
                   
                    } else {
                        message.error("部署基础信息保存失败!")
                        props.visibleFunc[1](false)
                        return false
                    }
                    dpStepHandler(res.data)
                    tabActiveKeyHandler("2")
                    return res.success
                }}
                >
                <ProCard title="部署目标(必填)" bordered headerBordered
                        collapsible style={{ marginBlockEnd: 16, minWidth: 800, maxWidth: '100%', }} >
                    <ProForm.Item label="部署名称" name='nickname' rules={[{ required: true, message: '请输入部署名称' }, { pattern: /^[a-z][a-z0-9-]*[a-z]$/,message: '字段只能包含小写字母，数字和中划线，且必须以小写字母开头并以字母结尾!',}]}>
                        <Input placeholder="请输入应用名称(仅限英文)" 
                            onInput={(e) => { 
                                // e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z]/g, '') 
                                let value = e.currentTarget.value;
                                if (!/^[a-z]/.test(value)) {
                                  e.currentTarget.value = ''
                                  return
                                }
                              
                                value = value.replace(/[^a-z0-9-]/g, '');
                                e.currentTarget.value = value;
                            }}  disabled={props.isEdit}></Input>
                    </ProForm.Item>
                    <ProForm.Item label="环境级别" name='level' rules={[{ required: true, message: '请选择环境级别' }]}>
                        <Select options={deploymentLevels}  disabled={props.isEdit}></Select>
                    </ProForm.Item>
                    <ProForm.Item label="集群" name='clusterId' rules={[{ required: true, message: '请选择集群' }]} >
                        <Select allowClear
                            disabled={props.isEdit}
                            options={cluster}
                            onChange={(value: any) => {
                                BindNamespaceSelect(value, namespcaeHandler)
                                clusterIdHandler(value)
                                BindClusterName(value, cluster, clusterNameHandler)
                            }}
                        >
                        </Select>
                    </ProForm.Item>
                    <ProForm.Item label="命名空间" name='namespaceId' rules={[{ required: true, message: '请选择命名空间' }]} >
                        <Select allowClear disabled={props.isEdit} options={namespace} 
                            onChange={async(id)=>{
                                console.log(id)
                                await setNamespaceRuntimeStates(id)
                            }} >
                        </Select>
                    </ProForm.Item>
                    </ProCard>
                    <ProCard title="运行时(Runtime Engine)" bordered headerBordered  
                            collapsible style={{ marginBlockEnd: 16, minWidth: 800, maxWidth: '100%', }} >
                                <ProFormRadio.Group name="runtime"  initialValue={''}
                                    options={[
                                        { label: '未配置', value: '',  },
                                        { label: 'Dapr', value: 'Dapr',disabled: runtimeStatus!='Dapr' },
                                        { label: 'Istio', value: 'Istio',disabled: runtimeStatus!='Istio'  },
                                    ]} />
                                提示: 运行时引擎需要在团队空间中开通，并且在集群中安装相应的运行时引擎组件，如有疑问请联系管理员。
                    </ProCard>
                    <ProCard title={`网络配置 (服务端口号:${baseForm.current?.getFieldValue('servicePort')})`} bordered headerBordered defaultCollapsed
                        collapsible style={{ marginBlockEnd: 16, minWidth: 800, maxWidth: '100%', }} >
                        < ProForm.Item name='serviceEnable'>
                            <Checkbox disabled onChange={(value) => { openScvHandler(value.target.checked) }} checked={openScv}>开启服务访问</Checkbox>
                        </ProForm.Item>

                        <ProForm.Item label="服务方式" name='serviceAway' rules={[{ required: true, message: '请输入网络服务方式' }]}>
                            <ProFormSelect options={[
                                { value: 'ClusterPort', label: 'ClusterPort', },
                                // { value: 'NodePort', label: 'NodePort' },
                            ] } disabled={props.isEdit} ></ProFormSelect>
                        </ProForm.Item>
                        <ProForm.Item label="服务端口  (应与服务启动端口保持一致,多容器端口应当不同)" name='servicePort' rules={[{ required: true, message: '请输入服务端口' }]}>
                            <Input></Input>
                        </ProForm.Item>
                       
                    </ProCard>
          
                </ProForm>
            </Tabs.TabPane>
            <Tabs.TabPane tab="实例配置(必填)" key="2" forceRender={true} disabled={!formEditable}>
                <ProForm formRef={instanceForm} submitter={{ resetButtonProps:{   },searchConfig:{ resetText:'取消',submitText:'下一步'} }}
                 onReset={()=>{ props.visibleFunc[1](false) }}
                 onFinish={async (value) => {
                    console.log(dpStep)
                    value.id = props.id
                    value.appId = Number(props.appId)
                    if(dpStep){
                        value.id = dpStep.id
                        value.appId = dpStep.appId
                    }
                    console.log(value)
                    let res = await CreateDeploymnetLimit(value)
                    if (res.success) {
                        message.success('实例信息保存成功!')
                    }
                    props.tableRef.current?.reload()
                    tabActiveKeyHandler("3")
                    return res.success
                }}>
                    <ProCard title="实例配置(必填)" bordered headerBordered
                            collapsible style={{ marginBlockEnd: 16, minWidth: 800, maxWidth: '100%', }} >
                        <ProForm.Item name='replicas' rules={[{ required: true, message: "请输入副本数量" }]}>
                            <InputNumber addonBefore="实例数" addonAfter="个"  min={1} max={20}></InputNumber>
                        </ProForm.Item>

                        <ProForm.Group label="CPU限制 0为不限制" >
                            <ProFormItem name='requestCpu' rules={[{ required: true, message: "requestCpu不可为空" }]}>
                                <InputNumber addonBefore="request"  step={0.1} min={0} max={8}></InputNumber>
                            </ProFormItem>
                            <Space>
                                -
                            </Space>
                            <ProFormItem name='limitCpu' rules={[{ required: true, message: "limitCpu不可为空" }]}  >
                                <InputNumber addonBefore="limit" addonAfter="核" step={0.1} min={0} max={32}></InputNumber>
                            </ProFormItem>

                        </ProForm.Group>
                        <ProForm.Group label="内存限制(MB) 0为不限制">
                            <ProFormItem name='requestMemory'   rules={[{ required: true, message: "requestMemory不可为空" }]}>
                                <InputNumber addonBefore="request"  min={0}></InputNumber>
                            </ProFormItem>
                            <Space>
                                -
                            </Space>
                            <ProFormItem name='limitMemory'  rules={[{ required: true, message: "limitMemory不可为空" }]}>
                                <InputNumber addonBefore="limit" addonAfter="MiB"  min={0} ></InputNumber>
                            </ProFormItem>
                        </ProForm.Group>
                        </ProCard>
                        <ProCard title="环境" bordered headerBordered defaultCollapsed
                            collapsible style={{ marginBlockEnd: 16, minWidth: 800, maxWidth: '100%', }} >
                        <ProForm.Group label="环境变量">
                            <Form.List name="environments">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'key']}
                                                    rules={[{ required: true, message: 'key 不可为空' }]}
                                                >
                                                    <Input placeholder="key" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    rules={[{ required: true, message: 'value 不可为空' }]}
                                                >
                                                    <Input placeholder="value" />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                添加环境变量
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </ProForm.Group>
                    </ProCard>       
                </ProForm>
            </Tabs.TabPane>
            <Tabs.TabPane tab="生命周期" key="3" disabled={!formEditable}>
               <ProbeForm deploymentId={Number(props.id)} tableRef={props.tableRef} visibleFunc={props.visibleFunc[1]} isEdit={props.isEdit}></ProbeForm>
            </Tabs.TabPane>
            <Tabs.TabPane tab="负载路由" key="4" disabled={!formEditable}>
                <RouteForm deploymentId={Number(props.id)} tableRef={props.tableRef} visibleFunc={props.visibleFunc[1]} deployment={dpStep} isEdit={props.isEdit}></RouteForm>
            </Tabs.TabPane>
            <Tabs.TabPane tab="部署配置" key="5" disabled={!formEditable} >
                <ConfigMapForm deploymentId={Number(props.id)} tableRef={props.tableRef} visibleFunc={props.visibleFunc[1]} deployment={dpStep} isEdit={props.isEdit}></ConfigMapForm>
            </Tabs.TabPane>
            <Tabs.TabPane tab="卷&挂接点" key="6"  disabled={!formEditable} >
                <VolumeForm deploymentId={Number(props.id)} tableRef={props.tableRef} visibleFunc={props.visibleFunc[1]} deployment={dpStep} isEdit={props.isEdit}></VolumeForm>
            </Tabs.TabPane>
            <Tabs.TabPane tab="日志采集" key="7" disabled >
            </Tabs.TabPane>
            <Tabs.TabPane tab="应用监控" key="8" disabled >
            </Tabs.TabPane>
        </Tabs>
    </Drawer>
       
    )
}

export default AdvancedDevlopment