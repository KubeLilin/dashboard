import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ReleaseRecordItem } from './releaseRecord_data';
import { GetReleaseRecord, RollBack } from './service';
import { getDeploymentList } from '../info/deployment.service'
import { Button, Modal ,notification} from 'antd';
import { CloseCircleTwoTone, CloudUploadOutlined, ExclamationCircleOutlined, SmileOutlined, UndoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
interface Props {
    AppId: number,
}
const ReleaseRecord: React.FC<Props> = (props) => {
    const { confirm } = Modal;
    const [rollbackVisible, setrollbackVisible] = useState(false);
    const ref = useRef<ActionType>();
    const columns: ProColumns<ReleaseRecordItem>[] = [
        {
            title: 'appId',
            dataIndex: 'appId',
            hideInTable: true,
            hideInSearch: true
        },
        {
            title: 'deploymentId',
            dataIndex: 'deploymentId',
            hideInTable: true,
            hideInSearch: true
        },
        {
            title: '部署环境名称',
            dataIndex: 'deploymentName',
            hideInSearch: true,
        },
        {
            title: '部署环境',
            dataIndex: 'dpId',
            hideInTable: true,
            request: async (p) => {
                const deployPage = await getDeploymentList({ appid: props.AppId, current: 1, pageSize: 50 })
                return deployPage.data.map((item) => ({ label: item.name, value: item.id }))
            }
        },
        {
            title: '触发类型',
            dataIndex: 'opsType',
            valueEnum: {
                manual: '手动触发',
                githook: 'GIT触发',
                rollback:'人为回滚'
            }
        },
        {
            title: '镜像名称',
            dataIndex: 'applyImage',
        },
        {
            title: '触发人',
            dataIndex: 'operatorName',
            hideInSearch: true
        },
        {
            title: '触发时间',
            dataIndex: 'creationTime',
            hideInSearch: true,
        }, {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Button key="rollback" type="primary" icon={<UndoOutlined />} onClick={() => {
                    confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: <p>确认要把部署环境<h3>{record.deploymentName}</h3>回滚到<h3 color='#DC143C'>{record.applyImage} </h3>镜像吗？</p>,
                        async onOk() {
                           let res=await RollBack({
                                wholeImage:record.applyImage,
                                dpId:record.deploymentId,
                                opsType:'rollback',
                                IsDiv:true
                            })
                            if (res.success == false) {
                                notification.open({
                                    message: res.message,
                                    icon: <CloseCircleTwoTone />,
                                });
                            } else {
                                notification.open({
                                    message: "回滚成功",
                                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                                });
                                ref.current?.reload()
                            }
                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                }}>回滚</Button>
            ]
        }
    ];

    function handleOk() {

    }

    function handleCancel() {

    }

    return (
        <PageContainer>
            <ProTable columns={columns}
                request={async (params, sort) => {
                    params.appId = props.AppId
                    let data = await GetReleaseRecord(params)
                    return data.data
                }}
                actionRef={ref}
            >
            </ProTable>
        </PageContainer>


    )
}

export default ReleaseRecord