import { CloseCircleTwoTone, MinusCircleOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import ProForm, {ProFormInstance, DrawerForm, ModalForm, ProFormContext, ProFormGroup, ProFormItem, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns,ColumnsState,ActionType } from '@ant-design/pro-table';
import { Tag,Button, Form, FormInstance, Input, InputRef, notification, Popconfirm, Radio, Select, Space, Table,Typography, Tooltip } from 'antd';
import route from 'mock/route';
const { Paragraph, Text } = Typography;
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ServiceData, ServiceInfo, ServicePort } from './data';
import { ApplyService, BindNameSpace,BindNameSpaceByPAAS, getServiceInfo, queryServiceList,getClusterList,getDeploymentKVList } from './service';

const EditableContext = React.createContext<FormInstance<ServicePort> | null>(null);


interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof ServicePort;
    record: ServicePort;
    handleSave: (record: ServicePort) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const ServiceConfig: React.FC = () => {
    const [dataSource, setDataSource] = useState<ServicePort[]>([]);
    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter(item => item.index !== key);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '映射名称',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: '协议',
            dataIndex: 'protocol',
            width: '30%',
            editable: true,
            // colSpan: 
        },
        {
            title: '服务端口',
            dataIndex: 'port',
            editable: true,
        },
        {
            title: '主机端口',
            dataIndex: 'nodePort',
            editable: true,
        },
        {
            title: '容器端口',
            dataIndex: 'targetPort',
            editable: true,
            
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record: any, index) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(record.index)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData: ServicePort = { protocol: "TCP", port: 80, targetPort: 80,nodePort:30000, index: count, name: "tcp-1" };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: ServicePort) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.index === item.index);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        console.log(newData)
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ServicePort) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const getObjectKVString = (str:string)=> {
        var obj:any
        if (!str ||  str == 'null' || str==''){
            return ['无']
        } else {
            obj = JSON.parse(str)
        }
        
        var arrs = []
        const keys = Object.keys(obj)
        for(let i=0;i<keys.length;i++){
            const key = keys[i]
            const value=obj[key]
            arrs.push(key +':'+ value )
        }
        
        return arrs 
    }

    const BindingNamespaceByClusterAndPaaS = async (clusterId:number,onlyPaaS:boolean)=>{
        var res = []
        bindNamespaceListHandler([])
        setTimeout(async() => {
            if(clusterId){
                if (onlyPaaS) {
                    res = await BindNameSpaceByPAAS(clusterId)
                } else {
                    res = await BindNameSpace(clusterId)
                }
                bindNamespaceListHandler(res)
            }
        }, 200);
    }

    const seacthForm = useRef<ProFormInstance>()
    const [appForm] = Form.useForm()
    const [workloadForm] = Form.useForm()
    const serviceListActionRef =  useRef<ActionType>()

    const [continueStr, continueStrHandler] = useState<string>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false);
    const [workloadFormVisible, workloadFormVisibleHandler] = useState<boolean>(false);
    const [isAdd, isAddHandler] = useState<boolean>(false);

    const [serviceInfo, serviceInfoHandler] = useState<ServiceInfo>();
    const [namespace, nameSpaceHandler] = useState<string>("");
    const [bindNamespaceList, bindNamespaceListHandler] = useState<[]>();
    const [portMessage, portMessageHandler] = useState<string>();

    const [fromDisplayLabels, fromDisplayLabelsHandler] = useState<any>();
    const [fromDisplaySelector, fromDisplaySelectorHandler] = useState<any>();
    const [workflowDisplayLabels, workflowDisplayLabelsHandler] = useState<any>();

    const tableColumns: ProColumns<ServiceData>[] = [
        {
            title: '集群',
            hideInTable:true,
            dataIndex:'clusterId',
            renderFormItem: () => {
                return <ProFormSelect key="clssl" request={getClusterList} 
                    fieldProps={{onChange:async(value)=>{
                        const onlyPaaS = seacthForm.current?.getFieldValue('onlyPAAS')
                        BindingNamespaceByClusterAndPaaS(value,onlyPaaS)
                    }}} ></ProFormSelect>
            }
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            hideInForm: true,
            renderFormItem: () => {
                return <ProFormSelect key="nssl" allowClear={true} options={bindNamespaceList} ></ProFormSelect>
            },
            fieldProps:{
                autoClearSearchValue:true,
                allowClear:true,
            }
        },
        {
            title: '平台创建',
            dataIndex: 'onlyPAAS',
            hideInForm: true,
            hideInTable:true,
            valueType:'switch',
            initialValue:true,
            fieldProps:{
                onChange: async (onlyPaaS:any)=>{
                    const clusterId = Number(seacthForm.current?.getFieldValue('clusterId'))
                    BindingNamespaceByClusterAndPaaS(clusterId,onlyPaaS)
                }
            }
        },
        {
            title: '名称',
            dataIndex: 'name',
            hideInForm: true,
            hideInSearch: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            hideInSearch: true,
        },
        {
            title: 'IP地址',
            dataIndex: 'clusterIP',
            hideInSearch: true
        },
        // {
        //     title: 'Labels',
        //     dataIndex: 'labels',
        //     hideInSearch: true,
        //     render:(dom,item)=>{
        //         var json = String(dom?.toString())
        //         const labels  = getObjectKVString(json)
        //       return  (
        //         <Paragraph key={item.name+'_labels'} ellipsis={{ rows: 2, tooltip: labels.map(s=> (<Tag style={{fontSize:16}} color="purple">{s}</Tag>)) }} >
        //            {labels.map(s=> (<li>{s}</li>))}
        //         </Paragraph>
        //      )
        //     } 
        // }, 
        {
            title: 'Selector',
            dataIndex: 'selector',
            hideInSearch: true,
            render:(dom,item)=>{
                var json = String(dom?.toString())
                const labels  = getObjectKVString(json)
              return  (
                <Paragraph key={item.name+'_selector'} ellipsis={{ rows: 2, tooltip: labels.map(s=> (<Tag color="purple">{s}</Tag>)) }} >
                   {labels.map(s=> (<li>{s}</li>))}
                </Paragraph>
             )
            } 
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true
        },
        {
            title: 'k8s分页字符串',
            dataIndex: 'continueStr',
            hideInSearch: true,
            hideInTable: true,
            hideInForm: true,
        }, {
            title: '操作',
            valueType: 'option',
            width:130,
            render: (text, record, _, action) => [
                <a key={record.name+'option'} onClick={() => {
                    isAddHandler(false)
                    const clusterId = Number(seacthForm.current?.getFieldValue('clusterId'))
                    const onlyPaaS = seacthForm.current?.getFieldValue('onlyPAAS')
                    getServiceInfoDetail({ clusterId:clusterId,onlyPaaS:onlyPaaS, namespace: record.namespace, name: record.name })
                    formVisibleHandler(true);
                }}>编辑</a>,
            ]

        }
    ]



    async function getServiceInfoDetail(params: {clusterId:number, onlyPaaS:boolean,namespace: string, name: string }) {
        let req = await getServiceInfo(params);
        if (req.success) {
            serviceInfoHandler(req.data)
            req.data.port.forEach((x, index) => {
                x.index = index
            })
            //console.log(req.data.port)
            setDataSource(req.data.port)
            var data:any = req.data
            data.clusterId = params.clusterId
            appForm.setFieldsValue(data)
        } else {
            notification.open({
                message: req.message,
                icon: <CloseCircleTwoTone />,
            });
        }
    }


    return (
        <PageContainer>
            <DrawerForm<ServiceInfo>
                title={"服务详情"}
                width={800}
                visible={formVisible}
                form={appForm}
                onVisibleChange={(v)=>{ 
                    setTimeout(() => {
                        fromDisplayLabelsHandler( getObjectKVString( appForm.getFieldValue("labels")).map(s=>(<Tag color="purple">{s}</Tag>)))
                        fromDisplaySelectorHandler(getObjectKVString( appForm.getFieldValue("selector")).map(s=>(<Tag color="purple">{s}</Tag>)))
                        const portType = appForm.getFieldValue("type")
                        if(portType == 'ClusterIP'){
                            portMessageHandler('即ClusterIP类型，将提供一个可以被集群内其他服务或容器访问的入口，支持TCP/UDP协议，数据库类服务如Mysql可以选择集群内访问,来保证服务网络隔离性。')
                        } else {
                            portMessageHandler('即NodePort类型，提供一个主机端口映射到容器的访问方式，支持TCP&UDP， 可用于业务定制上层LB转发到Node。可通过云服务器IP+主机端口访问服务，端口范围30000~32767，不填自动分配.')
                        }
                    }, 200);
         
                    formVisibleHandler(v)
                }}
                onFinish={async (x)=>{
                    console.log(x)
                    if(x.selector!=""&&x.selector!=null&&x.selector!=undefined){
                        if((typeof JSON.parse(x.selector)) != "object"){
                            notification.open({
                                message: "selector必须是一个标准的json格式",
                                icon: <CloseCircleTwoTone />,
                            });
                        }
                    }

                    if (dataSource.length <= 0) {
                        notification.open({
                            message: "端口映射不能为空",
                            icon: <CloseCircleTwoTone />,
                        });
                        return
                    }
                    
                    x.port=dataSource
                    let res= await ApplyService(x)
                    if(res.success){
                        notification.open({
                            message: res.message,
                            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                        });
                        formVisibleHandler(false)
                    } else {
                        notification.open({
                            message: res.message,
                            icon: <CloseCircleTwoTone />,
                        });
                    }
                    serviceListActionRef.current?.reload()
                }}
            >
                <ProFormText name="name" label="服务名称" disabled={!isAdd}  rules={[ { required: true, message: '服务名称不能为空'},]} ></ProFormText>
                <ProFormText name="clusterId" label="集群ID" hidden ></ProFormText>
                <ProFormText name="namespace" label="命名空间" disabled ></ProFormText>
            
                <ProForm.Group  title="Labels">
                <div style={{marginTop:0,marginBottom:25}}>
                    {fromDisplayLabels}  
                </div>
                </ProForm.Group>

                <ProForm.Group title="Selector">
                <div style={{marginTop:0,marginBottom:25}}>
                    {fromDisplaySelector } 
                </div> 
                </ProForm.Group>

                <ProFormText name="labels" label="labels"  hidden ></ProFormText>
                <ProFormText name="selector" label="selector" hidden ></ProFormText>
                <ProFormRadio.Group name="type" label="服务类型" initialValue={0}
                    fieldProps={ {onChange:(e)=>{
                        console.log(e.target.value)
                        const portType = e.target.value
                        if(portType == 'ClusterIP'){
                            portMessageHandler('即ClusterIP类型，将提供一个可以被集群内其他服务或容器访问的入口，支持TCP/UDP协议，数据库类服务如Mysql可以选择集群内访问,来保证服务网络隔离性。')
                        } else {
                            portMessageHandler('即NodePort类型，提供一个主机端口映射到容器的访问方式，支持TCP&UDP， 可用于业务定制上层LB转发到Node。可通过云服务器IP+主机端口访问服务，端口范围30000~32767，不填自动分配.')
                        }
                    }}}
                    options={[
                        { label: 'ClusterIP', value: 'ClusterIP', }, { label: 'NodePort', value: 'NodePort', }
                    ]}></ProFormRadio.Group>
                
                <ProForm.Item style={{marginTop:0}}>
                    <Text mark>{portMessage}</Text>
                </ProForm.Item>
                <ProForm.Item>
                    <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        添加端口映射
                    </Button>
                </ProForm.Item>
              
                <ProForm.Item name="prots">
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns as any}
                    />
                </ProForm.Item>

                <ProForm.Group title="Workload绑定">
                    <div>
                    Selectors: 
                    <a href='#' onClick={()=>{
                        const data = seacthForm.current?.getFieldsValue()
                        data.deployment = ''
                        data.labels = ''
                        workflowDisplayLabelsHandler('')
                        workloadForm.setFieldsValue(data)
                        workloadFormVisibleHandler(true)
                    }}>引用Workload</a> <br/><br/>
                    标签键名称不超过63个字符,仅支持英文、数字、'/'、'-',且不允许以('/')开头。支持使用前缀，更多说明查看详情
                    标签键值只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母、数字开头和结尾
                    </div>
                </ProForm.Group>
            </DrawerForm>

            <DrawerForm  
                title="引用Workload资源"
                width={500}
                visible={workloadFormVisible}
                onVisibleChange={workloadFormVisibleHandler}
                form={workloadForm}
                onFinish={async(formdata)=>{
                    console.log(formdata)
                    appForm.setFieldsValue({selector:formdata.labels})
                    fromDisplaySelectorHandler(getObjectKVString(formdata.labels).map(s=>(<Tag color="purple">{s}</Tag>)))
                    return true
                }}>
                <ProFormText name="clusterId" hidden></ProFormText>
                <ProFormText name="namespace" hidden></ProFormText>

                <ProFormSelect allowClear={true} name='deployment' label="资源列表"   placeholder="请选择部署" showSearch 
                    request={(params)=>{
                        const data = workloadForm.getFieldsValue()
                        const clusterId = Number(data.clusterId)
                        const namespace = String(data.namespace)
                        return getDeploymentKVList(clusterId,namespace)
                    }}
                    fieldProps={{  filterOption:(input, option) =>  Boolean( option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ),
                    onChange:async (value, option:any) => {
                        console.log(value)
                        workloadForm.setFieldsValue({labels:value})
                        setTimeout(() => {
                            workflowDisplayLabelsHandler( getObjectKVString(value).map(s=>(<Tag color="purple">{s}</Tag>)))
                        }, 200);
                    }
                }}></ProFormSelect>
                <ProForm.Group title="Labels">
                <ProFormText name="labels" readonly></ProFormText>
                <div style={{marginTop:0,marginBottom:25}}>
                    {workflowDisplayLabels } 
                </div> 
                </ProForm.Group>
            </DrawerForm>


            <ProTable<ServiceData>
                columns={tableColumns}
                pagination={{ pageSize:50 }}
                actionRef={serviceListActionRef}
                formRef={seacthForm}
                rowKey={(i)=>i.name+i.createTime}
                toolBarRender={() => [
                    <Button key='button' icon={<PlusOutlined />} type="primary"
                        onClick={() => {
                            isAddHandler(true)
                            setDataSource([])
                            const clusterId = seacthForm.current?.getFieldValue("clusterId")
                            const ns = seacthForm.current?.getFieldValue("namespace")
                            appForm.resetFields()
                            appForm.setFieldsValue({clusterId:clusterId, namespace:ns,type:'ClusterIP'})
                            formVisibleHandler(true);
                        }}>新增服务</Button>
                ]}
                request={(x) => {
                    x.continueStr = continueStr;
                    nameSpaceHandler(x.namespace)
                    return queryServiceList(x)
                }}
                onDataSourceChange={(x) => {
                    if (x.length > 0) {
                        continueStrHandler(x[0].continueStr)
                        console.log(continueStr)
                    }
                }}
            >
            </ProTable></PageContainer>)
}

export default ServiceConfig;