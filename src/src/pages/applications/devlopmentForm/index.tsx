import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProForm, {
    StepsForm,
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormTextArea,
    ProFormCheckbox,
    ProFormInstance
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Select, Input, Checkbox, Modal, InputNumber, Space, Alert } from 'antd';
import ProFormItem from '@ant-design/pro-form/lib/components/FormItem';
import { BindCluster, BindNameSpace, CreateDeploymnet, CreateDeploymnetLimit } from './service';
import { DeploymentStep } from './devlopment_data';

export interface Props {
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    appId: any,
    appName: any,
    tableRef: any

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

const DevlopmentForm: React.FC<Props> = (props: Props) => {
    const [namespace, namespcaeHandler] = useState<any>();
    const [cluster, clusterHandler] = useState<any>();
    const [clusterId, clusterIdHandler] = useState<any>();
    const [openScv, openScvHandler] = useState<boolean>(false);
    const [dpStep, dpStepHandler] = useState<DeploymentStep>();
    const [dpLevel, dpLevelHandler] = useState<string>("");
    const [clusterName, clusterNameHandler] = useState<string>("")
    const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
    function BindClusterSelect() {
        let req = BindCluster()
        req.then(x => { clusterHandler(x) })
    }

    useEffect(() => {
        BindClusterSelect()
    }, props.visibleFunc)
    return (

        <ProCard>
            <StepsForm<DeploymentStep>
                formMapRef={formMapRef}
                onFinish={async (value) => {
                    value.id = dpStep?.id;
                    value.appId = props.appId;
                    console.log(value)
                    let res = await CreateDeploymnetLimit(value)
                    if (res.success) {
                        props.visibleFunc[1](false)
                    }
                    props.tableRef.current?.reload()
                    return res.success
                }}
                stepsFormRender={(dom, submitter) => {
                    return (
                        <Modal
                            title="创建部署"
                            width={600}
                            onCancel={() => { props.visibleFunc[1](false) }}
                            visible={props.visibleFunc[0]}
                            footer={submitter}
                            destroyOnClose={true}
                        >
                            {dom}
                        </Modal>
                    );
                }}
            >
                <StepsForm.StepForm<DeploymentStep>
                    title="部署方式"
                    onFinish={async (value) => {
                        value.clusterId = clusterId;
                        value.serviceEnable = openScv ? 1 : 0;
                        value.appId = parseInt(props.appId);
                        value.name = `${dpLevel}-${props.appName}-${clusterName}`
                        let res = await CreateDeploymnet(value)
                        if (res.success == false) {
                            <Alert message={res.message} type="error" />
                        }
                        dpStepHandler(res.data)
                        return res.success
                    }}
                >
                    <ProForm.Item label="部署名称" name='nickname'>
                        <Input ></Input>
                    </ProForm.Item>
                    <ProForm.Item label="环境级别" name='level'>
                        <Select
                            onChange={(x: string) => {
                                dpLevelHandler(x)
                            }}
                            options={[
                                {
                                    value: 'dev',
                                    label: 'dev',
                                },
                                { value: 'test', label: 'test' },
                                { value: 'prod', label: 'prod' },
                            ]}

                        ></Select>
                    </ProForm.Item>
                    <ProForm.Item label="集群" name='clusterId'>
                        <Select
                            labelInValue
                            options={cluster}
                            onChange={(value: any) => {
                                BindNamespaceSelect(value.value, namespcaeHandler)
                                clusterIdHandler(value.value)
                                clusterNameHandler(value.label)
                            }}
                        >
                        </Select>
                    </ProForm.Item>
                    <ProForm.Item label="命名空间" name='namespaceId'>
                        <Select
                            options={namespace}
                        >
                        </Select>
                    </ProForm.Item>
                    <Checkbox onChange={(value) => { openScvHandler(value.target.checked) }}>开启服务访问</Checkbox>
                    <ProForm.Item label="服务方式" name='serviceAway'>
                        <ProFormSelect options={[
                            {
                                value: 'ClusterPort',
                                label: 'ClusterPort',
                            },
                            { value: 'NodePort', label: 'NodePort' },
                        ]}
                        ></ProFormSelect>
                    </ProForm.Item>
                    <ProForm.Item label="服务端口" name='servicePort'>
                        <Input></Input>
                    </ProForm.Item>
                </StepsForm.StepForm>
                <StepsForm.StepForm<DeploymentStep>
                    title="实例配置"
                >
                    <ProForm.Item label="副本数量" name='replicas' rules={[{ required: true, message: "请输入副本数量" }]}>
                        <InputNumber min={0} max={20}></InputNumber>
                    </ProForm.Item>

                    <ProForm.Group label="CPU限制 0为不限制" >
                        <ProFormItem name='requestCpu' rules={[{ required: true, message: "requestCpu不可为空" }]}>
                            <Space>Request
                                <InputNumber step={0.1} min={0} max={1}></InputNumber>
                            </Space>
                        </ProFormItem>
                        <Space>
                            -
                        </Space>
                        <ProFormItem name='limitCpu' rules={[{ required: true, message: "limitCpu不可为空" }]}>
                            <Space>Limit
                                <InputNumber step={0.1} min={0} max={1}></InputNumber>
                            </Space>
                        </ProFormItem>
                        核
                    </ProForm.Group>
                    <ProForm.Group label="内存限制 0为不限制">
                        <ProFormItem name='requestMemory' rules={[{ required: true, message: "requestMemory不可为空" }]}>
                            <Space>Request
                                <InputNumber min={0}></InputNumber>
                            </Space>
                        </ProFormItem>
                        <Space>
                            -
                        </Space>
                        <ProFormItem name='limitMemory' rules={[{ required: true, message: "limitMemory不可为空" }]}>
                            <Space>Limit
                                <InputNumber min={0} ></InputNumber>
                            </Space>
                        </ProFormItem>
                        MB
                    </ProForm.Group>
                </StepsForm.StepForm>
            </StepsForm>
        </ProCard>
    )
}

export default DevlopmentForm