import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Upload, Input, Alert } from 'antd';
import React, { useState, useRef } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import { ClusterItem } from './cluster_data';
import { getClusterList, importConfigFile, removeCluster } from './cluster_service';
import { Link } from 'umi';

const { TextArea } = Input;



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
            title: '集群名称',
            dataIndex: 'name',
            copyable: true,
            render: (dom, row) => {
                return <Link to={'/resources/nodes?cid=' + row.id}>{dom}</Link>
            }
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
                        let res = await removeCluster(record.id)
                        if (res.success) {
                            actionRef.current?.reload()
                        } else {
                            <Alert message="" type="error" />
                        }
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
                onFinish={async () => {
                    console.log(configFile)
                    let res = await importConfigFile(configFile)
                    return res.data
                }}
            >
                <ProForm.Item>
                    <Upload
                        accept=".yaml"
                        onChange={(fileInfo) => {
                            previewConfig(fileInfo.file.originFileObj)
                            previewRowsHandle(10)
                            configFileHandel(fileInfo.file.originFileObj)
                        }}
                    >
                        <Button icon={<UploadOutlined />}>选择集群配置文件</Button>
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
