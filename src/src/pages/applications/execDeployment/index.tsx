import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormInstance,
} from '@ant-design/pro-form';
import { Checkbox, notification, Select } from 'antd';
import { ExecDeploymentData } from './execDeployment_data';
import { RequestDeployment } from './execDeployment_service';
import { ActionType } from '@ant-design/pro-table';
import { SmileOutlined } from '@ant-design/icons';

export interface Props{
    visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    deploymentId:number,
    tableRef:any
}

const ExecDeployment: React.FC<Props> = (props:Props) => {

    const[enableDivImage,setEnableDivImage]=useState<boolean>(false)
    const actionRef =  useRef<ProFormInstance>();
    return (

        <ModalForm<ExecDeploymentData>
        formRef={actionRef}
            title="部署实例"
            visible={props.visibleFunc[0]}
            width={500}           
            onVisibleChange={props.visibleFunc[1]}
            onFinish={async (x)=>{
                console.log(props.deploymentId)
                x.dpId=props.deploymentId
                x.isDiv=enableDivImage
               let res=await RequestDeployment(x)
                if(res.success){
                    actionRef.current?.setFieldsValue({ dpId:0,
                        image:'',
                        imageTag:'',
                        wholeImage:'',
                        isDiv:false})
                        setEnableDivImage(false)
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
            <ProForm.Item >
                <Checkbox onChange={(x)=>{setEnableDivImage(x.target.checked)}}>自定义镜像</Checkbox>
            </ProForm.Item>
            <ProForm.Item name='image' label='镜像仓库' hidden={enableDivImage}>
                <ProFormText></ProFormText>
            </ProForm.Item>
            <ProForm.Item name='imageTag' label='TAG' hidden={enableDivImage}>
                <Select></Select>
            </ProForm.Item>
            <ProForm.Item name='wholeImage' label='完整镜像地址' hidden={!enableDivImage}>
                <ProFormText></ProFormText>
            </ProForm.Item>
        </ModalForm>

    )
}
export default ExecDeployment