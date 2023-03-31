import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormInstance,
} from '@ant-design/pro-form';
import { Checkbox, notification, Select ,Form, Input } from 'antd';
import { ExecDeploymentData } from './execDeployment_data';
import { RequestDeployment } from './execDeployment_service';
import { ActionType } from '@ant-design/pro-table';
import { SmileOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

export interface Props{
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    deploymentId:number,
    tableRef:any,
    deployImage?:string,
}

const ExecDeployment: React.FC<Props> = (props:Props) => {
    const { initialState } = useModel('@@initialState');
    const tenantId = Number(initialState?.currentUser?.group)

    const[enableDivImage,setEnableDivImage]=useState<boolean>(false)
    const actionRef =  useRef<ProFormInstance>();
    const [form] = Form.useForm();

    return (
        <ModalForm<ExecDeploymentData> title="更新部署" visible={props.visibleFunc[0]} width={500} 
            form={form} formRef={actionRef} modalProps={{ destroyOnClose:true }}
            onVisibleChange={ (visible)=>{
               const setVisible = props.visibleFunc[1]
               setVisible?.(visible)
               if(visible){
                    console.log(props.deployImage)
                    setEnableDivImage(true)
                    form.setFieldsValue({ image:'', imageTag:'',  wholeImage: props.deployImage })
                }
            }} 
            onFinish={async (x)=>{
                x.dpId=props.deploymentId
                x.isDiv=enableDivImage
                x.opsType='manual'
                x.tenantId = tenantId
                x.wholeImage = x.wholeImage.trim()
                console.log(x)
                let res=await RequestDeployment(x)
                if(res.success){
                    actionRef.current?.setFieldsValue({ dpId:0,
                        image:'',
                        imageTag:'',
                        wholeImage:'',
                        isDiv:false})
                        setEnableDivImage(true)
                    props.visibleFunc[1](false)
                    notification.open({
                        message: res.message,
                        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                    });
                    props.tableRef.current?.reload()
                }else{
                    notification.open({
                        message: res.message                  
                    });
                }
            }}
        >
            <ProForm.Item hidden>
                <Checkbox name='isDiv' checked={enableDivImage} onChange={(x)=>{setEnableDivImage(x.target.checked)}}>自定义镜像</Checkbox>
            </ProForm.Item>
            <ProForm.Item name='image' label='镜像仓库' hidden={enableDivImage}>
                <ProFormText></ProFormText>
            </ProForm.Item>
            <ProForm.Item name='imageTag' label='TAG' hidden={enableDivImage}>
                <Select></Select>
            </ProForm.Item>
            <ProForm.Item name='wholeImage' label='最后一次部署的镜像 (可修改)' hidden={!enableDivImage} rules={[  { required: true, message: '镜像地址为必填项'} ]}>
               <Input placeholder='请输入完整的镜像地址'/>
            </ProForm.Item>
        </ModalForm>

    )
}
export default ExecDeployment