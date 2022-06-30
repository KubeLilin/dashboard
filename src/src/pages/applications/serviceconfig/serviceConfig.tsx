import { CloseCircleTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormContext, ProFormGroup, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Form, FormInstance, Input, InputRef, notification, Popconfirm, Radio, Select, Space, Table } from 'antd';
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ServiceData, ServiceInfo, ServicePort } from './data';
import { ApplyService, BindNameSpace, getServiceInfo, queryServiceList } from './service';

const EditableContext = React.createContext<FormInstance<any> | null>(null);


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

interface DataType {
    key: React.Key;
    name: string;
    age: string;
    address: string;
}

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
            title: '协议',
            dataIndex: 'protocol',
            width: '30%',
            editable: true,
        },
        {
            title: '服务端口',
            dataIndex: 'port',
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
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.index)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData: ServicePort = { protocol: "TCP", port: 0, targetPort: 0, index: count, name: "" };
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
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });


    const [appForm] = Form.useForm()
    const [continueStr, continueStrHandler] = useState<string>();
    const [formVisible, formVisibleHandler] = useState<boolean>(false);
    const [serviceInfo, serviceInfoHandler] = useState<ServiceInfo>();
    const [namespace, nameSpaceHandler] = useState<string>("");
    const tableColumns: ProColumns<ServiceData>[] = [

        {
            title: '命名空间',
            dataIndex: 'namespace',
            hideInForm: true,
            renderFormItem: () => {

                return <ProFormSelect request={BindNameSpace} ></ProFormSelect>
            }
        },
        {
            title: '名称',
            dataIndex: 'name',
            hideInForm: true,
            hideInSearch: true
        },

        {
            title: 'labels',
            dataIndex: 'labels',
            hideInSearch: true
        }, {
            title: 'selector',
            dataIndex: 'selector',
            hideInSearch: true
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
            render: (text, record, _, action) => [
                <a onClick={() => {
                    getServiceInfoDetail({ namespace: namespace, name: record.name })
                    formVisibleHandler(true);
                }}>查看</a>,
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
            console.log(req.data.port)
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
                onVisibleChange={formVisibleHandler}
                onFinish={async (x)=>{
                    x.port=dataSource
                    await ApplyService(x)
                }}
            >
                <ProFormGroup>
                    <ProFormText name="namespace" label="命名空间" disabled={true}></ProFormText>
                    <ProFormText name="name" label="服务名称" disabled={true}></ProFormText>
                    <ProFormRadio.Group name="type" label="服务类型" options={[
                        {
                            label: 'ClusterIP',
                            value: 'ClusterIP',
                        },
                        {
                            label: 'NodePort',
                            value: 'NodePort',
                        }
                    ]}></ProFormRadio.Group>
                </ProFormGroup>
                <ProFormText name="labels" label="labels" disabled={true}></ProFormText>
                <ProFormText name="selector" label="selector" disabled={true}></ProFormText>
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
                        columns={columns as ColumnTypes}
                    />
                </ProForm.Item>
            </DrawerForm>
            <ProTable<ServiceData>
                columns={tableColumns}
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