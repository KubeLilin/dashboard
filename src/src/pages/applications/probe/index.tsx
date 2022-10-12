import ProForm, { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { Checkbox } from 'antd';
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
        <ProForm.Item name='image' label='镜像仓库'>
            <ProFormText></ProFormText>
        </ProForm.Item>

    </ModalForm>);
}

export default Probe;