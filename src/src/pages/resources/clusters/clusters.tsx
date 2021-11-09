import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Upload, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import FormItem from 'antd/lib/form/FormItem';
import { render } from '@umijs/deps/compiled/mustache';
import { string } from 'yargs';
import { result } from '@umijs/deps/compiled/lodash';
import { ClusterItem } from './cluster_data';
import { getClusterList } from './cluster_service';

const { TextArea } = Input;

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

    },
    {
        title: '集群版本',
        dataIndex: 'version',
    }, {
        title: '分配',
        dataIndex: 'distrbution'
    }, {
        title: '操作',
        valueType: 'option',
        render: (dom, record, index, action) => [
            <a
                key="移除">

            </a>
        ]
    }
]




function importK8sconfig(): void {

}

const Clusters: React.FC = () => {
    const [formVisible, formVisibleFunc] = useState<boolean>(false)
    const [previewInfo, previewInfoHandle] = useState<any>()
    const [previewRows, previewRowsHandle] = useState<number>(0)
    function previewConfig(file: any) {
        let reader = new FileReader();
        reader.onload = () => {
            previewInfoHandle(reader.result)
        }
        reader.readAsText(file)
    }
    const actionRef = useRef<ActionType>();
    return (
        <PageContainer>
            <ProTable<ClusterItem>
                columns={clusterColumns}
                actionRef={actionRef}
                headerTitle='集群管理2'
                request={ getClusterList}
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type='primary'
                        onClick={() => {
                            formVisibleFunc(true)
                        }}
                    >
                        新建
                    </Button>
                ]}>

            </ProTable>
            <ModalForm
                title="导入集群"
                visible={formVisible}
                onVisibleChange={formVisibleFunc}
            >
                <ProForm.Item>
                    <Upload
                        accept=".yaml"
                        onChange={(fileInfo) => {
                            previewConfig(fileInfo.file.originFileObj)
                            previewRowsHandle(10)
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
