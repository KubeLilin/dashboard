import ProForm, { DrawerForm, ModalForm, ProFormGroup, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Checkbox, Divider, InputNumber, Switch } from 'antd';
import Form from 'antd/lib/form';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { ProbeFormData } from './probe_data';



export interface Props {
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    deploymentId: number,
    tableRef: any,
}

const Probe: React.FC<Props> = (props: Props) => {
    const [livenessRequire, livenessRequireHandler] = useState<boolean>();
    const [readnessRequire, readnessRequireHandler] = useState<boolean>();
    const actionRef = useRef<ProFormInstance>();
    const [form] = Form.useForm();
    return (<DrawerForm<ProbeFormData> title="POD探针设置"
        width={500}
        visible={props.visibleFunc[0]}
        form={form} formRef={actionRef}
        onVisibleChange={(visible) => {
            const setVisible = props.visibleFunc[1]
            setVisible?.(visible)
            if (visible) {

            }
        }} >
        <ProFormGroup label='Liveness探针配置'>
            <ProForm.Item name='enableLiveness' >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked onChange={(checked: boolean) => {
                    livenessRequireHandler(checked)
                }} />
            </ProForm.Item>
            <ProForm.Item name='livenessurl' label='请求路径' required={livenessRequire}>
                <ProFormText width={400}></ProFormText>
            </ProForm.Item>
            <ProForm.Item name='livenessport' label='请求端口' required={livenessRequire}>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='livenessInitialDelaySeconds' label='首次执行延迟秒数' required={livenessRequire}>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='livenessPeriodSeconds' label='检查间隔秒数' required={livenessRequire}>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProFormSelect name='livenessreqScheme' label='请求协议' width={400} options={[
                { label: 'HTTP', value: 'HTTP' }
            ]} required={livenessRequire}>
            </ProFormSelect>
        </ProFormGroup>
        <Divider />
        <ProFormGroup label='Readiness探针配置'>
            <ProForm.Item name='enableReadiness' label=''>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked onChange={(checked: boolean) => {
                    readnessRequireHandler(checked)
                }} />
            </ProForm.Item>
            <ProForm.Item name='readinessUrl' label='请求路径' required={readnessRequire}>
                <ProFormText width={400}></ProFormText>
            </ProForm.Item>
            <ProForm.Item name='readinessPort' label='请求端口' required={readnessRequire}>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='readinessInitialDelaySeconds' label='首次执行延迟秒数' required={readnessRequire}>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='readinessPeriodSeconds' label='检查间隔秒数' required={readnessRequire}>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProFormSelect name='readinessReqScheme' label='请求协议' width={400} options={[
                { label: 'HTTP', value: 'HTTP' }
            ]} required={readnessRequire}>
            </ProFormSelect>
        </ProFormGroup>
    </DrawerForm>);
}

export default Probe;