import ProForm, { ModalForm, ProFormGroup, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Checkbox, InputNumber, Switch } from 'antd';
import Form from 'antd/lib/form';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { ProbeFormData } from './probe_data';



export interface Props {
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    deploymentId: number,
    tableRef: any,
}

const Probe: React.FC<Props> = (props: Props) => {
    const actionRef = useRef<ProFormInstance>();
    const [form] = Form.useForm();
    return (<ModalForm<ProbeFormData> title="POD探针设置" visible={props.visibleFunc[0]} form={form} formRef={actionRef} onVisibleChange={(visible) => {
        const setVisible = props.visibleFunc[1]
        setVisible?.(visible)
        if (visible) {

        }
    }} >
        <ProFormGroup title='Liveness'>
            <ProForm.Item name='enableLiveness' label='开启Liveness探针'>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
            </ProForm.Item>
            <ProForm.Item name='livenessport' label='请求端口'>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='livenessurl' label='请求路径'>
                <ProFormText></ProFormText>
            </ProForm.Item>
            <ProForm.Item name='livenessInitialDelaySeconds' label='首次执行延迟秒数'>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='livenessPeriodSeconds' label='检查间隔秒数'>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProFormSelect name='livenessreqScheme' label='请求协议' options={[
                { label: 'HTTP', value: 'HTTP' }
            ]}>
            </ProFormSelect>
        </ProFormGroup>
        <ProFormGroup title='Readiness'>
            <ProForm.Item name='enableReadiness' label='开启Readiness探针'>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
            </ProForm.Item>
            <ProForm.Item name='readinessPort' label='请求端口'>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='readinessUrl' label='请求路径'>
                <ProFormText></ProFormText>
            </ProForm.Item>
            <ProForm.Item name='readinessInitialDelaySeconds' label='首次执行延迟秒数'>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProForm.Item name='readinessPeriodSeconds' label='检查间隔秒数'>
                <InputNumber min={0}></InputNumber>
            </ProForm.Item>
            <ProFormSelect name='readinessReqScheme' label='请求协议' options={[
                { label: 'HTTP', value: 'HTTP' }
            ]}>
            </ProFormSelect>
        </ProFormGroup>
    </ModalForm>);
}

export default Probe;