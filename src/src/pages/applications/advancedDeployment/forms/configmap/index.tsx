import ProForm, {
    DrawerForm, ModalForm, ProFormGroup, ProFormInstance,
    ProFormSwitch, ProFormTextArea, ProFormSelect, ProFormText,ProFormRadio
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Checkbox, Divider, InputNumber, Switch, Input, notification, message,Space,Button,Upload, Popconfirm} from 'antd';
import Form from 'antd/lib/form';
import { CloseCircleTwoTone, SmileOutlined ,MinusCircleOutlined, PlusOutlined,UploadOutlined} from '@ant-design/icons';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
const { TextArea } = Input;


import { DeploymentStep } from '../../devlopment_data'
import { applyConfigmap,getConfigmap,clearConfigmap } from './service'

export interface ConfigMapFormProps {
    deploymentId: number,
    isEdit:boolean,
    tableRef: any,
    visibleFunc:Function,
    deployment?:DeploymentStep
}

const ConfigMapForm: React.FC<ConfigMapFormProps> = (props: ConfigMapFormProps) => {
    const [previewInfo, previewInfoHandle] = useState<any>();
    const [configFile, configFileHandel] = useState<any>();
    const form = useRef<ProFormInstance>();


    function previewConfig(file: any,callback:Function) {
        let reader = new FileReader();
        reader.onload = () => {
            callback(reader.result)
        }
        reader.readAsText(file)
    }

    return (
        <ProForm  formRef={form}  submitter={{ resetButtonProps:{},searchConfig:{ resetText:'取消',submitText:'提交'} }}
            request={async(r)=>{
                let deployId = 0
                console.log(props.deployment)
                if(props.deploymentId > 0) {
                    deployId = props.deploymentId
                } else {
                    deployId = Number(props.deployment?.id)
                }
                const configmapName = props.deployment?.name + '-configmap'

                let result = {
                    name: configmapName,
                    items: [{
                        key:'',value:''
                    }]
                }

                if(props.isEdit) {
                    const res = await getConfigmap({ name:configmapName, clusterId:props.deployment?.clusterId , namespaceId:props.deployment?.namespaceId })
                    if (res.success) {
                        result.items = res.data!=''?res.data.items:[{ key:'',value:'' }]
                    }
                }

                return result
            }}
            onFinish={async(fromData)=>{
                fromData.deployId =  props.deployment?.id
                fromData.clusterId = props.deployment?.clusterId
                fromData.appId = props.deployment?.appId
                fromData.namespaceId = props.deployment?.namespaceId
                console.log(fromData)
                const res = await applyConfigmap(fromData)
                if (res.success){
                    message.success("部署配置已生效.")
                    return true
                }
                return false
            }}
            onReset={()=>{ props.visibleFunc(false) }}>
                <ProCard title="部署配置(ConfigMap)" bordered headerBordered 
                            collapsible style={{ marginBlockEnd: 16, minWidth: 800, maxWidth: '100%', }} >
                        <ProForm.Group>
                            <Form.Item name="name" label="配置名称">
                                <Input value={props.deployment?.name + '-configmap'} disabled style={{width:500}} ></Input>
                            </Form.Item>
                        </ProForm.Group>
                        <ProForm.Group>
                          
                            <Form.List name="items">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ marginBottom: 8  }} align='start' >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'key']}
                                                    rules={[{ required: true, message: 'key 不可为空' }]}
                                                >
                                                    <Input placeholder="key" style={{width:300}} />
                                                </Form.Item> 
                                                =
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']} 
                                                    rules={[{ required: true, message: 'value 不可为空' }]}
                                                >
                                                    <TextArea rows={1} placeholder="value" style={{width:700}} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Space direction="horizontal">
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    手动添加
                                                </Button>

                                                <Upload showUploadList={false} accept=".yaml,.yml,.json"
                                                    onChange={(fileInfo) => {
                                                        console.log(fileInfo)
                                                        if(fileInfo.file.status=='done') {
                                                            previewConfig(fileInfo.file.originFileObj,(text:string)=>{
                                                                let items:[] = form.current?.getFieldValue('items')
                                                                const item = { key: String(fileInfo.file.originFileObj?.name), value: text}
                                                                items.push(item)
                                                                form.current?.setFieldsValue({
                                                                    items:items
                                                                })
                                                                console.log(items)
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <Button icon={<UploadOutlined />}>文件导入</Button>
                                                </Upload>
                                                <Popconfirm title="确定要清除此配置吗?" onConfirm={async()=>{
                                                     const configmapName = props.deployment?.name + '-configmap'
                                                     const res = await clearConfigmap({ name:configmapName, clusterId:props.deployment?.clusterId , namespaceId:props.deployment?.namespaceId })
                                                     if (res.success) {
                                                        form.current?.setFieldsValue({ items:[{ key:'',value:'' }] })
                                                        message.success('配置清除成功')
                                                     }
                                                }} >
                                                <Button danger block > 清空配置 </Button>
                                                </Popconfirm>
                                            </Space>
                         
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </ProForm.Group>
                    </ProCard>      
            </ProForm>
    )
}



export default ConfigMapForm;