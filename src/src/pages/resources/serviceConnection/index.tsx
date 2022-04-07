import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { ServiceConnectionItem } from './data';
import { queryServiceConnections } from './service';
import { Drawer, Button, Radio, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const ServiceConnection: React.FC = () => {
    const [firstDrawerVisible, setfirstDrawerVisible] = useState(false)
    const columns: ProColumns<ServiceConnectionItem>[] = [
        {
            dataIndex: 'id',
            valueType: 'indexBorder',
            width: 48
        },
        {
            dataIndex: 'name',
            title: '名称',
            copyable: true,
        },
        {
            dataIndex: 'tenantId',
            title: '租户',
            hideInTable: true,
            search: false,
        },
        {
            dataIndex: 'serviceType',
            title: '连接类型',
            search: false,
            valueEnum: {
                1: { text: '连接凭证' },
                2: { text: '连接信息' }
            }
        },
        {
            dataIndex: 'type',
            title: '连接来源',
            valueEnum: {
                1: { text: 'github' },
                2: { text: 'gitlab' },
                3: { text: 'gogs' },
                4: { text: 'gitee' }
            }
        },
        {
            dataIndex: 'detail',
            title: '连接明细',
            hideInTable: false,
            search: false,
        }

    ]
    return (
        <PageContainer>
            <Drawer visible={firstDrawerVisible} onClose={() => { setfirstDrawerVisible(false) }}>
                <Radio.Group  >
                    <Space direction="vertical">
                        <Radio value={1}>Option A</Radio>
                        <Radio value={2}>Option B</Radio>
                        <Radio value={3}>Option C</Radio>
                    </Space>
                </Radio.Group>
            </Drawer>
            <ProTable<ServiceConnectionItem>
                columns={columns}
                request={
                    async (params, sort) => {
                        let data = await queryServiceConnections(params)
                        return data.data
                    }
                }
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setfirstDrawerVisible(true) }}  >
                        新建
                    </Button>,

                ]}
            >
            </ProTable>
        </PageContainer>
    )
}
export default ServiceConnection