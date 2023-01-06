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

import {saveVolumes ,getVolumeAndMounts} from './service'

export interface ConfigMapFormProps {
    deploymentId: number,
    isEdit:boolean,
    tableRef: any,
    visibleFunc:Function,
    deployment?:DeploymentStep
}

const VolumeForm: React.FC<ConfigMapFormProps> = (props: ConfigMapFormProps) => {
    const [previewInfo, previewInfoHandle] = useState<any>();
    const [displayConfigMap, displayConfigMapHandler] = useState<boolean>(false);
    const configmapName = props.deployment?.name + '-configmap'
    const form = useRef<ProFormInstance>();

    return (
        <ProForm  formRef={form}  submitter={{ resetButtonProps:{},searchConfig:{ resetText:'取消',submitText:'保存'} }}
            request={async(r)=>{
                let deployId = 0
                console.log(props.deployment)
                if(props.deploymentId > 0) {
                    deployId = props.deploymentId
                } else {
                    deployId = Number(props.deployment?.id)
                }
               

                if(props.isEdit) {
                    const res = await getVolumeAndMounts(deployId)
                    return res.data
                }

                return {}
            }}
            onFinish={async(fromData)=>{
                fromData.deployId =  props.deployment?.id
                fromData.clusterId = props.deployment?.clusterId
                fromData.appId = props.deployment?.appId
                fromData.namespaceId = props.deployment?.namespaceId
                console.log(fromData)
                const res = await saveVolumes(fromData)
                if (res.success){
                    message.success("重启部署后,卷&挂载点将生效.")
                    return true
                }
                return false
            }}
            onReset={()=>{ props.visibleFunc(false) }}>
                <div>
                <ProCard title="数据卷" bordered headerBordered  style={{ marginBlockEnd: 16, minWidth: 700, maxWidth: '100%', }} >
                        <ProForm.Group>
                            <Form.List name="volumes">
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field) => { 
                                            console.log(field)
                                            return (
                                            <Space key={field.key} style={{ marginBottom: 8 ,width:1200 }} align='start' >
                                                <Form.Item  name={[field.name, 'volumeType']} rules={[{ required: true, message: '数据卷类型不可为空' }]} >
                                                    <ProFormSelect placeholder={'请选择'} width='md'
                                                      options={[{label:'临时目录',value:'emptydir'} ,{label:'部署配置',value:'configmap'} ]} 
                                                      fieldProps={{ onChange(value, option) {
                                                            const volumes =  form.current?.getFieldValue('volumes')
                                                            volumes[field.name].volumeName = value
                                                            if(value == 'configmap'){
                                                                volumes[field.name].value = configmapName
                                                            }


                                                            var volumeMounts =  form.current?.getFieldValue('volumeMounts')
                                                            if (!volumeMounts) {
                                                                volumeMounts = []
                                                            }
                                                            volumeMounts.push({volume:value,desPath:'/data/'+value,subPathType:'',mountType:'readonly'})
                                                            form.current?.setFieldsValue( {volumes:volumes,volumeMounts:volumeMounts})
                                                      },}}
                                                    ></ProFormSelect>
                                                </Form.Item> 
                                                <Form.Item name={[field.name, 'volumeName']}  rules={[{ required: true, message: '数据卷名称不可为空' }]} >
                                                   <Input placeholder="请输入volume名称"  style={{ width:280 }}/>
                                                </Form.Item>


                                                    
                                                {form.current?.getFieldValue('volumes')[field.name].volumeType == 'configmap'?
                                                <Form.Item name={[field.name, 'value']} >
                                                        <Input placeholder="请输入volume名称"  style={{ width:280 }} disabled/>
                                                </Form.Item>:''}
                                        
                                                
                                                <MinusCircleOutlined onClick={() => { 
                                                    var volumeMounts =  form.current?.getFieldValue('volumeMounts')
                                                    if(volumeMounts && volumeMounts.length > 0) {
                                                        volumeMounts.splice(field.name,1)
                                                        form.current?.setFieldsValue( { volumeMounts:volumeMounts})
                                                    }
                                                    remove(field.name) 
                                                }} />
                                            </Space>
                                        )} )}
                                        <Form.Item>
                                            <Space direction="horizontal" >
                                                <Button type="dashed"  onClick={() =>{ 
                                                    add({} )
                                                }} block icon={<PlusOutlined />}>添加数据卷</Button>
                                            </Space>
                         
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.List>
                        </ProForm.Group>
                    </ProCard>      
                    <ProCard title="挂载点" bordered headerBordered style={{ marginBlockEnd: 16, minWidth: 1200, maxWidth: '100%', }} >
                        <ProForm.Group>
                            <Form.List name="volumeMounts">
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field) => { 
                                            console.log(field)
                                            return (
                                            <Space key={field.key} style={{ marginBottom: 8 ,width:700 }} align='start' >
                                                <Form.Item  name={[field.name, 'volume']} rules={[{ required: true, message: '数据卷类型不可为空' }]} >
                                                    <ProFormSelect placeholder={'请选择'} width='sm' disabled ></ProFormSelect>
                                                </Form.Item> 
                                                <Form.Item name={[field.name, 'desPath']} rules={[{ required: true, message: '目标路径不能为空' }]}  >
                                                   <Input placeholder="目标路径,如/mnt"  style={{ width:300 }}/>
                                                </Form.Item>
                                                <Form.Item  name={[field.name, 'subPathType']}  >
                                                    <ProFormSelect placeholder={'请选择'} width='sm' options={[{label:'无',value:''},{label:'subPath',value:'subPath'}]} ></ProFormSelect>
                                                </Form.Item> 
                                                <Form.Item name={[field.name, 'subPath']} tooltip="仅挂载选中数据卷中的子路径或单一文件" >
                                                   <Input placeholder="挂载子路径"  style={{ width:300 }}/>
                                                </Form.Item>
                                                <Form.Item  name={[field.name, 'mountType']}   >
                                                    <ProFormSelect placeholder={'请选择'} width='sm' options={[{label:'只读',value:'readonly'},{label:'读写',value:'readWrite'}]} ></ProFormSelect>
                                                </Form.Item> 
                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            </Space>
                                        )} )}
                                        {/* <Form.Item>
                                            <Space direction="horizontal" >
                                                <Button type="dashed"  onClick={() =>{ 
                                                    add({} )
                                                }} block icon={<PlusOutlined />}>添加挂载点</Button>
                                            </Space>
                         
                                        </Form.Item> */}
                                    </div>
                                )}
                            </Form.List>
                        </ProForm.Group>
                    </ProCard>  
                    </div>
            </ProForm>
    )
}



export default VolumeForm;