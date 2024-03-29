import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Upload, Input, Alert ,Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import { ClusterItem } from './cluster_data';
import { getClusterList, importConfigFile, removeCluster } from './cluster_service';
import { Link } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { confirm } = Modal;



const Clusters: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [formVisible, formVisibleFunc] = useState<boolean>(false);
    const [previewInfo, previewInfoHandle] = useState<any>();
    const [previewRows, previewRowsHandle] = useState<number>(0);
    const [configFile, configFileHandel] = useState<any>();
    const clusterColumns: ProColumns<ClusterItem>[] = [
        {
            dataIndex: 'id',
            valueType: 'indexBorder',
            width: 48
        },
        {
            title: '集群标示',
            dataIndex: 'name',
            render: (dom, row) => {
                // return <Link to={'/resources/nodes?cid=' + row.id}>{dom}</Link>
                return <Link to={`/resources/clusterinfo?cid=${row.id}&name=${row.name}&nickname=${row.nickname}`}>{dom}</Link>
            }
        },
        {
            title: '集群名称',
            dataIndex: 'nickname',
            search: false,
        },
        {
            title: '集群版本',
            dataIndex: 'version',
            search: false,
        }, {
            title: '分配',
            dataIndex: 'distrbution',
            search: false

        }, {
            title: '操作',
            valueType: 'option',
            render: (dom, record, index, action) => [
                <a
                    key="移除"
                    onClick={async () => {
                        confirm({
                            title: `确定要删除 ${record.name} 集群吗?`,
                            icon: <ExclamationCircleOutlined />,
                            content: '删除集群后平台上关联的资源将失效！',
                            okText: '删除',
                            okType: 'danger',
                            onOk: async()=>{
                                let res = await removeCluster(record.id)
                                if (res.success) {
                                    actionRef.current?.reload()
                                } else {
                                    <Alert message="" type="error" />
                                }
                            }
                          });



                    }}>
                    移除
                </a>
            ]
        }
    ]
    function previewConfig(file: any) {
        let reader = new FileReader();
        reader.onload = () => {
            previewInfoHandle(reader.result)
        }
        reader.readAsText(file)
    }

    return (
        <PageContainer>
            <ProTable<ClusterItem>
                columns={clusterColumns}
                actionRef={actionRef}
                headerTitle='集群列表'
                rowKey="id"
                request={getClusterList}
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type='primary'
                        onClick={() => {
                            formVisibleFunc(true)
                        }}
                    >
                        导入集群
                    </Button>
                ]}>

            </ProTable>
            <ModalForm
                title="导入集群"
                visible={formVisible}
                onVisibleChange={formVisibleFunc}
                onFinish={async (formData:any) => {
                    console.log(configFile)
                    let res = await importConfigFile(configFile,formData.name)
                    return res.data
                }}
            >
                <ProForm.Item name="name" label="集群名称" rules={[{ required: true, message: '请输入集群名称' }]} >
                    <Input placeholder="请输入应用名称(仅限英文)"  />
                </ProForm.Item>
                <ProForm.Item>
                    <Upload
                        accept=".yaml"
                        onChange={(fileInfo) => {
                            previewConfig(fileInfo.file.originFileObj)
                            previewRowsHandle(10)
                            configFileHandel(fileInfo.file.originFileObj)
                        }}
                    >
                        <Button icon={<UploadOutlined />}>选择集群YAML配置文件</Button>
                    </Upload>
                </ProForm.Item>
                <ProForm.Item>
                    <h2>配置文件预览</h2>
                    <TextArea value={previewInfo} rows={previewRows} readOnly ></TextArea>
                </ProForm.Item>

            </ModalForm>
        </PageContainer>
    )
}
export default Clusters
