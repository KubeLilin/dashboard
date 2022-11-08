import ProForm, { DrawerForm, ModalForm, ProFormGroup, ProFormInstance,
    ProFormSwitch,ProFormTextArea, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Checkbox, Divider, InputNumber, Switch,Input } from 'antd';
import Form from 'antd/lib/form';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { ProbeFormData } from './probe_data';

const { TextArea } = Input;


export interface Props {
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    deploymentId: number,
    tableRef: any,
}

const Probe: React.FC<Props> = (props: Props) => {
    const [lifecycleChecked , lifecycleCheckedHandler] = useState<boolean>(false);
    const [livenessChecked, livenessCheckedHandler] = useState<boolean>(false);
    const [readnessChecked, readnessCheckedHandler] = useState<boolean>(false);

    const actionRef = useRef<ProFormInstance>();
    const [form] = Form.useForm();
    return (
    <DrawerForm<ProbeFormData> title="生命周期设置"
        width={500}
        visible={props.visibleFunc[0]}
        form={form} formRef={actionRef}
        onFinish={ async (formData)=>{
            console.log(formData)
            return true
        }}

        onVisibleChange={props.visibleFunc[1]} >
        <ProFormGroup label='生命周期' >
            <ProFormSwitch name="enableLifecycle" width="lg" fieldProps={{
                    onChange:(checked:boolean)=>{
                        lifecycleCheckedHandler(checked)
                    }}}/>
            <div style={{ display: lifecycleChecked?'block':'none'  }}>
            <ProForm.Item name='terminationGracePeriodSeconds' initialValue={30} label='延时终止(秒)' required={lifecycleChecked}>
                    <InputNumber min={0}></InputNumber>
                </ProForm.Item>
            <ProForm.Item label='结束前执行:' name='lifecyclePreStop' >
                <TextArea rows={4} cols={60} placeholder="注意每个命令单独一行，每行的行首和行尾不要加空格
示例：
/bin/sh
-c
sleep 30" />
            </ProForm.Item>
            <ProForm.Item label='启动后执行:' name='lifecyclePreStart' >
                <TextArea rows={4} cols={60} placeholder="注意每个命令单独一行，每行的行首和行尾不要加空格
示例：
/bin/sh
-c
sleep 30" />
            </ProForm.Item>
            </div>
        </ProFormGroup>

        <Divider />

        <ProFormGroup label='Liveness探针配置'>
            <ProForm.Item name='enableLiveness' >
                <ProFormSwitch width="lg" fieldProps={{
                    onChange:(checked:boolean)=>{
                        livenessCheckedHandler(checked)
                    }}}/>
            </ProForm.Item>
            <div style={{ display: livenessChecked?'block':'none'  }}>
                <ProFormSelect name='livenessReqScheme' label='检查方法'  initialValue="HTTP"  options={[
                    { label: 'HTTP请求检查', value: 'HTTP' } ]} required={livenessChecked}>
                </ProFormSelect>
                <ProForm.Item name='livenessPort' label='检查端口' initialValue={80} required={livenessChecked}>
                    <InputNumber min={0} max={30000}></InputNumber>
                </ProForm.Item>
                <ProForm.Item name='livenessUrl' label='检查路径' initialValue={'/'} required={livenessChecked}>
                    <ProFormText width="lg" ></ProFormText>
                </ProForm.Item>
                <ProForm.Item name='livenessInitialDelaySeconds' initialValue={4} label='启动延时(秒)' required={livenessChecked}>
                    <InputNumber min={0}></InputNumber>
                </ProForm.Item>
                <ProForm.Item name='livenessTimeoutSeconds' initialValue={3} label='响应越时(秒)' required={livenessChecked}>
                    <InputNumber min={0}></InputNumber>
                </ProForm.Item>
                <ProForm.Item name='livenessPeriodSeconds' initialValue={20} label='间隔时间(秒)' required={livenessChecked}>
                    <InputNumber min={0}></InputNumber>
                </ProForm.Item>

            </div>
        </ProFormGroup>
        <Divider />
        <ProFormGroup label='Readiness探针配置'>
            <ProForm.Item name='enableReadiness'  >
                <ProFormSwitch width="lg" fieldProps={{
                    onChange:(checked:boolean)=>{
                        readnessCheckedHandler(checked)
                    }}}/>
            </ProForm.Item>
            <div style={{ display: readnessChecked?'block':'none'  }}>
               <ProFormSelect name='readinessReqScheme' label='检查方法' initialValue="HTTP" options={[
                    { label: 'HTTP请求检查', value: 'HTTP' } ]} required={readnessChecked}>
                </ProFormSelect>
                <ProForm.Item name='readinessPort' label='检查端口' initialValue={80} required={readnessChecked}>
                    <InputNumber min={0} max={30000}></InputNumber>
                </ProForm.Item>
                <ProForm.Item name='readinessUrl' label='检查路径' initialValue={'/'} required={readnessChecked}>
                    <ProFormText width="lg"></ProFormText>
                </ProForm.Item>
                <ProForm.Item name='readinessInitialDelaySeconds' initialValue={4} label='启动延时(秒)' required={readnessChecked}>
                    <InputNumber min={0}></InputNumber>
                </ProForm.Item>
                <ProForm.Item name='readinessTimeoutSeconds' initialValue={3} label='响应越时(秒)' required={readnessChecked}>
                    <InputNumber min={0}></InputNumber>
                </ProForm.Item>
                <ProForm.Item name='readinessPeriodSeconds' initialValue={20} label='间隔时间(秒)' required={readnessChecked}>
                    <InputNumber min={0} ></InputNumber>
                </ProForm.Item>

            </div>
        </ProFormGroup>
    </DrawerForm>);
}

export default Probe;