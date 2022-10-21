import { CloseCircleTwoTone, MinusCircleOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormContext, ProFormGroup, ProFormItem, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns,ColumnsState } from '@ant-design/pro-table';
import { Tag,Button, Form, FormInstance, Input, InputRef, notification, Popconfirm, Radio, Select, Space, Table,Typography, Tooltip } from 'antd';
import route from 'mock/route';
const { Paragraph, Text } = Typography;
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ServiceData, ServiceInfo, ServicePort } from './data';
import { ApplyService, BindNameSpace, getServiceInfo, queryServiceList,getClusterList } from './service';

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

    const [appForm] = Form.useForm()
    const [continueStr, continueStrHandler] = useState<string>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false);
    const [isAdd, isAddHandler] = useState<boolean>(false);
    const [serviceInfo, serviceInfoHandler] = useState<ServiceInfo>();
    const [namespace, nameSpaceHandler] = useState<string>("");
    const [bindNamespaceList, bindNamespaceListHandler] = useState<[]>();
    const [portMessage, portMessageHandler] = useState<string>();

    const [fromDisplayLabels, fromDisplayLabelsHandler] = useState<any>();
    const [fromDisplaySelector, fromDisplaySelectorHandler] = useState<any>();


    const tableColumns: ProColumns<ServiceData>[] = [
        {
            title: '集群',
            hideInTable:true,
            renderFormItem: () => {
                return <ProFormSelect key="clssl" request={getClusterList} 
                    fieldProps={{onChange:async(value)=>{
                        if(value){
                            const res = await BindNameSpace(value)
                            bindNamespaceListHandler(res)
                        }
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
            width:120,
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
            width:120,
        },
        {
            title: 'IP地址',
            dataIndex: 'clusterIP',
            hideInSearch: true
        },
        {
            title: 'Labels',
            dataIndex: 'labels',
            hideInSearch: true,
            render:(dom,item)=>{
                var json = String(dom?.toString())
                const labels  = getObjectKVString(json)
              return  (
                <Paragraph key={item.name+'_labels'} ellipsis={{ rows: 2, tooltip: labels.map(s=> (<Tag style={{fontSize:16}} color="purple">{s}</Tag>)) }} >
                   {labels.map(s=> (<li>{s}</li>))}
                </Paragraph>
             )
            } 
        }, 
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
            width:80,
            render: (text, record, _, action) => [
                <a key={record.name+'option'} onClick={() => {
                    getServiceInfoDetail({ namespace: namespace, name: record.name })
                    formVisibleHandler(true);
                }}>编辑</a>,
            ]

        }
    ]



    async function getServiceInfoDetail(params: { namespace: string, name: string }) {
        let req = await getServiceInfo(params);
        if (req.success) {
            serviceInfoHandler(req.data)
            req.data.port.forEach((x, index) => {
                x.index = index
            })
            //console.log(req.data.port)
            setDataSource(req.data.port)
            appForm.setFieldsValue(req.data)
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
                    if(x.labels!=""&&x.labels!=null&&x.labels!=undefined){
                        if(typeof JSON.parse(x.labels) == "object"){

                        }else{
                            notification.open({
                                message: "labels必须是一个标准的json格式",
                                icon: <CloseCircleTwoTone />,
                            });
                            return
                        }
                    }
                    if(x.selector!=""&&x.selector!=null&&x.selector!=undefined){
                        if(typeof JSON.parse(x.labels) == "object"){

                        }else{
                            notification.open({
                                message: "selector必须是一个标准的json格式",
                                icon: <CloseCircleTwoTone />,
                            });
                            return
                        }
                    }
                    

                    x.port=dataSource
                   let res= await ApplyService(x)
                   if(res.success){
                    notification.open({
                        message: res.message,
                        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                    });
                    formVisibleHandler(false)
                   }else{
                    notification.open({
                        message: res.message,
                        icon: <CloseCircleTwoTone />,
                    });
                   }
                }}
            >
                <ProFormText name="name" label="服务名称" disabled ></ProFormText>
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

                <ProFormText name="labels" label="labels" disabled hidden ></ProFormText>
                <ProFormText name="selector" label="selector" disabled hidden></ProFormText>
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
            </DrawerForm>
            <ProTable<ServiceData>
                columns={tableColumns}
                rowKey={(i)=>i.name+i.createTime}
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