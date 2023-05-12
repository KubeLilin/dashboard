import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { DrawerForm, ModalForm, ProFormGroup, ProFormInstance, ProFormSwitch, ProFormTextArea, ProFormSelect, ProFormText, ProFormDigit } from '@ant-design/pro-form';
import { Tag,Form,Select,Switch,Drawer,Button, Modal ,notification, InputNumber, Checkbox,Space, message ,Typography} from 'antd';
import { CloseCircleTwoTone, ExclamationCircleOutlined, SmileOutlined, PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card'
import { history } from 'umi';
const { Text, Paragraph } = Typography;
import { DeploymentItem } from '../info/data'
import { ServiceMonitorRequestData } from './data'
import { getServiceByLabel,createOrUpdateServiceMonitor,getServiceMonitorList } from './service'


interface Props {
    appId: number,
    appName: string,
    deployList: DeploymentItem[],
}

const AppServiceMonitor: React.FC<Props> = (props) => {
    var appLanguage = history.location.query?.language
    console.log(appLanguage)
    const ref = useRef<ActionType>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false);
    const [selectedDeployment, selectedDeploymentHandler] = useState<DeploymentItem>()
    var deploymentList = props.deployList.filter((item)=>item.running > 0)
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
            dataIndex: 'deploymentName',
            hideInSearch: true
        },
        {
            title: '目标服务命名空间',
            dataIndex: 'namespace',
            hideInSearch: true
        },
        {
            title: '路径端口',
            dataIndex: 'path',
            hideInSearch: true
        },
        {
            title: '服务端口名称',
            dataIndex: 'port',
            hideInSearch: true,
        }, 
        //interval
        {
            title: '采集间隔(秒)',
            dataIndex: 'interval',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Button key="rollback" type="primary"  
                 onClick={() => {
                    console.log(record)
                    formVisibleHandler(true)
                    const query = deploymentList.filter((item)=>item.id == record.deploymentId)
                    if (query.length > 0){
                        setTimeout(() => {
                            selectedDeploymentHandler(query[0])
                            record.clusterName = query[0].clusterName
                            formRef.current?.setFieldsValue(record)
                        }, 200)
                    } else {
                        notification.error({ message: '未找到对应的部署与服务' })
                    }
                

                }}>查看</Button>
            ]
        }
    ]


    useEffect(() => {
        deploymentList = props.deployList.filter((item)=>item.running > 0)
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
                    return getServiceMonitorList(props.appId)
                }}
                actionRef={ref}
                toolBarRender={() => [
                    // <div style={{marginRight:20}}>同步集群内 ServiceMontior   <Switch size='default' style={{width:70}} checkedChildren="on" unCheckedChildren="关闭" /></div>,
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
                onFinish={async (values) => {
                    console.log(values)
                    console.log(selectedDeployment)
                    if(values.id > 0) {
                        notification.error({ message: '不支持更新操作,需要删除重建！' })
                        return true
                    }

                    if (selectedDeployment) {
                        const data:ServiceMonitorRequestData = {
                            id: Number(values.id),
                            name:   values.name,
                            appId:  props.appId,
                            namespace:  values.namespace,
                            clusterId:  selectedDeployment.clusterId,
                            deploymentId:   selectedDeployment.id,
                            deploymentName: selectedDeployment.name,
                            path:   values.path,
                            port:   values.port,
                            interval:   values.interval,                            
                        }
                        console.log(data)
                        notification.info({ message: '正在创建 ServiceMonitor', duration: 0 })
                        const res = await createOrUpdateServiceMonitor(data)
                        if (res && res.success) {
                            notification.success({ message: '更新资源成功' })
                            return true

                        } else {
                            notification.error({ message: '更新资源失败' })
                        }
                        ref.current?.reload()
                    }
                }}
>
                <ProCard title="部署配置 (只显示该应用下已运行的所有部署)" bordered>
                    <ProForm.Item name="deploymentId" label="选择部署" style={{marginBottom:45}} rules={[{ required: true, message: '请选择部署' }]}>
                        <ProFormSelect  allowClear options={ deploymentList.map((item,idx)=> ({ label: item.name, value: item.id }))  }
                           fieldProps={{ onChange(id){
                            const deploy = deploymentList.filter((item)=>item.id == id)[0]
                            if (deploy) {
                                selectedDeploymentHandler(deploy)
                                serviceVerificationStateHandler('')
                                formRef.current?.setFieldsValue({
                                    name: 'sm-'+ deploy.name ,
                                    clusterName:deploy.clusterName,
                                    namespace:deploy.namespace,
                                    serviceName:deploy.serviceName,
                                    path: appLanguage=="java"?"/actuator/prometheus" : "/actuator/metrics",
                                    interval: 15,
                                })
                            }
                           } }} />
                    </ProForm.Item>
                    <ProForm.Item name="id" hidden >
                        <ProFormText  disabled />
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
                                formRef.current?.setFieldsValue({port:res.data.portName })
                                serviceVerificationStateHandler(res.data.serviceName)
                                // 确认对话框
                                Modal.confirm({ title:'请使检查指标端点是否可用', 
                                    content:<Paragraph copyable  > {`http://${res.data.serviceName}.${selectedDeployment?.namespace}:${res.data.port}${formRef.current?.getFieldValue('path')}`}</Paragraph>, 
                                    okText: '确认',style:{width:700}, })
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
                   
                    <ProForm.Item name="path"  label="指标端点"  >
                        <ProFormText name="path" rules={[{ required: true, message: '请填写指标端点' }]}/>
                        <Tag color='blue'>请检查指标端点是否可以访问</Tag>
                    </ProForm.Item>
                    <ProForm.Item name="port"   label="服务端口" >
                       <ProFormText name="port"  width='sm' rules={[{ required: true, message: '请填写服务端口,请使用校验服务可用性功能获取！' }]}/>
                    </ProForm.Item>
                    <ProForm.Item  name="interval" label="间隔时间" rules={[{  required: true, message: '请填写间隔时间' }]}>
                        <ProFormDigit  min={15} max={60} width='sm' name="interval"  />
                    </ProForm.Item>
                </ProCard>


            </DrawerForm>
        </div>
    )
}

export default AppServiceMonitor