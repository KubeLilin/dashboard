import React ,{ SetStateAction, useState,Dispatch } from 'react';
import ProForm, {
    StepsForm,
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormTextArea,
    ProFormCheckbox
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Button, Input, Checkbox ,Modal} from 'antd';


export interface Props{
visibleFunc:[boolean, Dispatch<SetStateAction<boolean>>]
}

const DevlopmentForm: React.FC<Props> = (props:Props) => {
   
    return (
        <ProCard>
            <StepsForm
            stepsFormRender={(dom, submitter) => {
                return (
                  <Modal
                    title="分步表单"
                    width={800}
                    onCancel={() => {props.visibleFunc[1](false)}}
                    visible={props.visibleFunc[0]}
                    footer={submitter}
                    destroyOnClose
                  >
                    {dom}
                  </Modal>
                );
              }}
            >

                <StepsForm.StepForm
                    title="部署方式"
                >
                    <ProForm.Item name="部署名称">
                        <Input></Input>
                    </ProForm.Item>
                    <ProForm.Item name="环境级别">
                        <ProFormSelect
                        ></ProFormSelect>
                    </ProForm.Item>
                    <ProForm.Item name="集群">
                        <ProFormSelect
                        ></ProFormSelect>
                    </ProForm.Item>
                    <ProForm.Item name="命名空间">
                        <ProFormSelect
                        ></ProFormSelect>
                    </ProForm.Item>
                    <ProForm.Item >
                    <Checkbox >开启服务访问</Checkbox>
                    </ProForm.Item>
                </StepsForm.StepForm>


            </StepsForm>
        </ProCard>
    )
}

export default DevlopmentForm