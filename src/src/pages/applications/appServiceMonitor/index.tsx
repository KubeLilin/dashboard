import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { DrawerForm, ModalForm, ProFormGroup, ProFormInstance, ProFormSwitch, ProFormTextArea, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Tag,Form,Select,Switch,Drawer,Button, Modal ,notification, InputNumber, Checkbox,Space} from 'antd';
import { CloseCircleTwoTone, ExclamationCircleOutlined, SmileOutlined, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card'

import { DeploymentItem } from '../info/data'
import { getServiceByLabel } from './service'


interface Props {
    appId: number,
    appName: string,
    deployList: DeploymentItem[],
}

const AppServiceMonitor: React.FC<Props> = (props) => {
    const ref = useRef<ActionType>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false);
    const [selectedDeployment, selectedDeploymentHandler] = useState<DeploymentItem>()
    const deploymentList = props.deployList.filter((item)=>item.running > 0)
    const formRef = useRef<ProFormInstance>()

    const [serviceloading, setServiceloading] = useState<boolean>(false)
    const [serviceVerificationState, serviceVerificationStateHandler] = useState<string>('')


    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true
        },
        {
            title: '名称',
            dataIndex: 'name',
            hideInSearch: true
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            hideInSearch: true
        },
        {
            title: '关联部署',
            dataIndex: 'deployment',
            hideInSearch: true
        },
        {
            title: '目标服务名称',
            dataIndex: 'destServiceName',
            hideInSearch: true
        },
        {
            title: '目标服务命名空间',
            dataIndex: 'destNamespace',
            hideInSearch: true
        },
        {
            title: '路径端口',
            dataIndex: 'portPath',
            hideInSearch: true
        },
        {
            title: '创建时间',
            dataIndex: 'creationTime',
            hideInSearch: true,
            valueType:"dateTime"
        }, 
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Button key="rollback" type="primary" icon={<SmileOutlined key="roll_icon" />} onClick={() => {
                    console.log(record)
                    let strName:string = record.name
                    
                }}>编辑</Button>
            ]
        }
    ]


    useEffect(() => {
        const deploymentList = props.deployList.filter((item)=>item.running > 0)
        if (deploymentList.length > 0){
          selectedDeploymentHandler(deploymentList[0])
        }
      }, [props.deployList])

    return (
        <div>
            <ProTable columns={columns}
                headerTitle='Service Monitor 列表 , 生成对应 Prometheus Targets,监控指标将显示在, 性能监控 >> 服务监控 (应用语言)'
                rowKey="id"
                style={{marginLeft:20,marginRight:20}}
                cardProps={{bordered: true}}
                search={false}
                request={async (params, sort) => {
                    return []
                }}
                actionRef={ref}
                toolBarRender={() => [
                    <div style={{marginRight:20}}>同步集群内 ServiceMontior   <Switch size='default' style={{width:70}} checkedChildren="on" unCheckedChildren="关闭" /></div>,
                    <Button type="primary" onClick={() => {
                        formVisibleHandler(true)
                    }} icon={<PlusOutlined />}>添加 ServiceMontior</Button>,
                ]}
            >
            </ProTable>
        
            <DrawerForm title="Service Monitor 配置" layout='horizontal' 
                colon width={650} visible={formVisible} 
                formRef={formRef} drawerProps={{ destroyOnClose:true  }} 
                onVisibleChange={(v)=>{
                    formVisibleHandler(v)
                    if (!v) {
                        formRef.current?.resetFields()
                       
                    }
                    selectedDeploymentHandler(undefined)
                    serviceVerificationStateHandler('')
                }} 
>
                <ProCard title="部署配置 (只显示该应用下已运行的所有部署)" bordered>
                    <ProForm.Item name="clusterId" label="选择部署" style={{marginBottom:45}}>
                        <Select  allowClear options={ deploymentList.map((item,idx)=> ({ label: item.name, value: item.id }))  }
                            onChange={(id)=>{
                                const deploy = deploymentList.filter((item)=>item.id == id)[0]
                                selectedDeploymentHandler(deploy)
                                serviceVerificationStateHandler('')
                                formRef.current?.setFieldsValue({
                                    name: 'sm-'+ deploy.name ,
                                    clusterName:deploy.clusterName,
                                    namespace:deploy.namespace,
                                    serviceName:deploy.serviceName
                                })
                            }} />
                    </ProForm.Item>
                    <ProForm.Item name="name" label="服务监控" >
                        <ProFormText  disabled  initialValue={'sm-'+selectedDeployment?.name} />
                    </ProForm.Item>
                    <ProForm.Item name="clusterName" label="部署集群" >
                        <ProFormText  disabled  initialValue={selectedDeployment?.clusterName} />
                    </ProForm.Item>
                    <ProForm.Item name="namespace"  label="命名空间" >
                        <ProFormText disabled initialValue={selectedDeployment?.namespace} />
                    </ProForm.Item>
                    <ProForm.Item name="serviceName" hidden label="服务名称" >
                        <ProFormText disabled initialValue={selectedDeployment?.serviceName} />
                    </ProForm.Item>
                    <ProForm.Item>
                        <Space>
                        <Button type="primary" loading={serviceloading} icon={<ExclamationCircleOutlined/>} onClick={async()=>{
                            setServiceloading(true)
                            setTimeout(() => {
                                setServiceloading(false)
                            }, 500)
                            const res = await getServiceByLabel(Number(selectedDeployment?.clusterId),String(selectedDeployment?.namespace),`k8s-app=${selectedDeployment?.name}` )
                            if (res && res.success){
                                formRef.current?.setFieldsValue({port:res.data.portName})
                                serviceVerificationStateHandler(res.data.serviceName)
                            }
                          
                        }}>校验服务可用性</Button> 
                        <Tag color={selectedDeployment?.serviceName == serviceVerificationState?'green':'red' }>匹配服务名:{serviceVerificationState}</Tag>
                        </Space>
                    </ProForm.Item>
                    <ProForm.Item>
                    ( Selector: k8s-app 与部署名对应的服务名称是否匹配,并提取服务端口号用于采集指标 )
                    </ProForm.Item>
                </ProCard>

                <ProCard title="Targets 采集配置" bordered style={{marginTop:20}}>
                   
                    <ProForm.Item name="path" label="指标端点"  >
                        <ProFormText  initialValue={"/actuator/metrics"} rules={[{ required: true, message: '请填写指标端点' }]}/>
                    </ProForm.Item>
                    <ProForm.Item name="port" label="服务端口" >
                       <ProFormText  width='sm' initialValue="default-tcp" rules={[{ required: true, message: '请填写服务端口,请使用校验服务可用性功能获取！' }]}/>
                    </ProForm.Item>
                    <ProForm.Item name="interval" label="间隔时间" rules={[{ min:10,max:100, message: '请填写间隔时间' }]}>
                        <InputNumber value={15}></InputNumber> 秒
                    </ProForm.Item>
                </ProCard>


            </DrawerForm>
        </div>
    )
}

export default AppServiceMonitor