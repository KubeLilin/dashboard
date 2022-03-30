import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ReleaseRecordItem } from './releaseRecord_data';
import { GetReleaseRecord, RollBack } from './service';
import { getDeploymentList } from '../info/deployment.service'
import { Button, Modal ,notification} from 'antd';
import { CloseCircleTwoTone, ExclamationCircleOutlined, SmileOutlined, UndoOutlined } from '@ant-design/icons';

import { GetDeploymentLevels } from '../devlopmentForm/service'

interface Props {
    AppId: number,
}

const ReleaseRecord: React.FC<Props> = (props) => {
    const { confirm } = Modal;
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
            title: '部署环境级别',
            dataIndex: 'dpLevel',
            valueType:'select',
            hideInTable: true,
            request: async ()=>{
                const resData = await GetDeploymentLevels()
                return resData
            } 
        },
        {
            title: '环境级别',
            dataIndex: 'level',
            hideInSearch: true
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
                rollback:'人为回滚',
                undefined:'自动触发',
            },
            hideInSearch: true,
        },
        {
            title: '镜像名称',
            dataIndex: 'applyImage',
            hideInSearch: true,
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
        }, 
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Button key="rollback" type="primary" icon={<UndoOutlined key="roll_icon" />} onClick={() => {
                    confirm({
                        icon: <ExclamationCircleOutlined key="confirm_icon" />,
                        content: <p key="a1">确认要把部署环境<h3 key="a2">{record.deploymentName}</h3>回滚到<h3 color='#DC143C'>{record.applyImage} </h3>镜像吗？</p>,
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
    ]

    return (
            <ProTable columns={columns}
                rowKey="creationTime"
                toolBarRender={false}
                style={{marginLeft:20,marginRight:20}}
                cardProps={{bordered: true}}
                request={async (params, sort) => {
                    params.appId = props.AppId
                    let data = await GetReleaseRecord(params)
                    return data.data
                }}
                actionRef={ref}
                dateFormatter={(value, valueType) => {
                    console.log('====>', value, valueType);
                    return value.format('YYYY-MM-DD HH:mm:ss');
                  }}
            >
            </ProTable>


    )
}

export default ReleaseRecord