import { SmileOutlined } from '@ant-design/icons';
import ProForm, {
    DrawerForm, ModalForm, ProFormGroup, ProFormInstance,
    ProFormSwitch, ProFormTextArea, ProFormSelect, ProFormText
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Checkbox, Divider, InputNumber, Switch, Input, notification } from 'antd';
import Form from 'antd/lib/form';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { ProbeFormData } from './probe_data';
import { saveProbe } from './service';

const { TextArea } = Input;


export interface Props {
    deploymentId: number,
    tableRef: any,
    visibleFunc:Function
}

const ProbeForm: React.FC<Props> = (props: Props) => {
    const [lifecycleChecked, lifecycleCheckedHandler] = useState<boolean>(false);
    const [livenessChecked, livenessCheckedHandler] = useState<boolean>(false);
    const [readnessChecked, readnessCheckedHandler] = useState<boolean>(false);

    const actionRef = useRef<ProFormInstance>();
    const [form] = Form.useForm();
    return (
        <ProForm<ProbeFormData> title="生命周期设置" 
            submitter={{ resetButtonProps:{   },searchConfig:{ resetText:'取消',submitText:'提交'} }}
            onReset={()=>{ props.visibleFunc(false) }}
            form={form} formRef={actionRef}
            onFinish={async (formData) => {
                console.log(props);
                formData.dpId=props.deploymentId;
                let res = await saveProbe(formData);
                if (res.success) {
                    return true
                } else {
                    notification.open({
                        message: res.message,
                        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                    });
                    return false;
                }
            }}  >
        <ProCard title="生命周期管理" bordered headerBordered 
              style={{ marginBlockEnd: 16 , maxWidth: '100%', }} > 
             <ProFormGroup label='滚动更新策略' >
                <ProForm.Item name='maxSurge' initialValue={30} label='maxSurge(额外Pod)'  required>
                        <InputNumber min={1} max={100} value={25}></InputNumber> %
                </ProForm.Item>
                <ProForm.Item name='maxUnavailable' initialValue={30} label='maxUnavailable(最大不可用)' required >
                        <InputNumber min={1} max={100} value={25}></InputNumber> %
                </ProForm.Item>
                <ProForm.Item name='terminationGracePeriodSeconds' initialValue={30} label='延时终止(秒)' required={lifecycleChecked}>
                        <InputNumber min={0}></InputNumber>
                </ProForm.Item>
             </ProFormGroup>

            <ProFormGroup label='生命周期' >
                <ProFormSwitch name="enableLifecycle" width="lg" fieldProps={{
                    onChange: (checked: boolean) => {
                        lifecycleCheckedHandler(checked)
                    }
                }} />
                <div style={{ display: lifecycleChecked ? 'block' : 'none' }}>
  
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
                        onChange: (checked: boolean) => {
                            livenessCheckedHandler(checked)
                        }
                    }} />
                </ProForm.Item>
                <div style={{ display: livenessChecked ? 'block' : 'none' }}>
                    <ProFormSelect name='livenessReqScheme' label='检查方法' initialValue="HTTP" options={[
                        { label: 'HTTP请求检查', value: 'HTTP' }]} required={livenessChecked}>
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
                        onChange: (checked: boolean) => {
                            readnessCheckedHandler(checked)
                        }
                    }} />
                </ProForm.Item>
                <div style={{ display: readnessChecked ? 'block' : 'none' }}>
                    <ProFormSelect name='readinessReqScheme' label='检查方法' initialValue="HTTP" options={[
                        { label: 'HTTP请求检查', value: 'HTTP' }]} required={readnessChecked}>
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
            </ProCard>
        </ProForm> )
}

export default ProbeForm;