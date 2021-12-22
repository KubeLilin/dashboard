import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Upload, Input, Alert ,Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ModalForm ,ProFormInstance} from '@ant-design/pro-form';
import { Link } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { K8sNamespcae,ClusterItem,GetClusterList,GetNameSpaceList } from './service';



const Namespaces: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const ref = useRef<ProFormInstance>();

    const NamespcaeColumns: ProColumns<K8sNamespcae>[] = [
        {
            title: '集群',
            dataIndex: 'cid',
            valueType: "select",
            request: async()=>{
                var cs = await GetClusterList()
                if(cs.length >0) {
                    ref.current?.setFieldsValue({cid:cs[0].value})
                }
                return cs
            } ,
        },
        {
            title: '命名空间',
            dataIndex: 'name',
            search:false
        },
        {
            title: '状态',
            dataIndex: 'status',
            search:false
        }
    ]


    return (
        <PageContainer>
            <ProTable<K8sNamespcae>
                columns={NamespcaeColumns}
                formRef={ref}
                actionRef={actionRef}
                rowKey="id"
                headerTitle="管理"
                request={async (params, sort) => {
                    console.log(params)
                    return []
                }}
             >

            </ProTable>
        </PageContainer>
        )
}







export default Namespaces