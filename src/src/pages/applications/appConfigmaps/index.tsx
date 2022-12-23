import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { getConfigmapListByAppId } from './service';
import { getDeploymentList } from '../info/deployment.service'
import { Drawer,Button, Modal ,notification} from 'antd';
import { CloseCircleTwoTone, ExclamationCircleOutlined, SmileOutlined, UndoOutlined } from '@ant-design/icons';
import ConfigMapForm from '../advancedDeployment/forms/configmap'
import { DeploymentStep } from '../advancedDeployment/devlopment_data'

interface Props {
    AppId: number,
}

const AppConifigMaps: React.FC<Props> = (props) => {
    const ref = useRef<ActionType>();
    const [configmapFormVisible, setConfigmapFormVisible] = useState(false);
    const [deployment,setDeploymentHandler] = useState<DeploymentStep>()

    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true
        },
        {
            title: '配置名称',
            dataIndex: 'name',
            hideInSearch: true
        },
        {
            title: '集群',
            dataIndex: 'cluster',
            hideInSearch: true
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            hideInSearch: true
        },
        {
            title: '关联部署',
            dataIndex: 'deployment',
            hideInSearch: true
        },
        {
            title: '创建时间',
            dataIndex: 'creationTime',
            hideInSearch: true,
            valueType:"dateTime"
        }, 
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Button key="rollback" type="primary" icon={<SmileOutlined key="roll_icon" />} onClick={() => {
                    console.log(record)
                    let strName:string = record.name
                    
                    let deploy = {
                        id:record.deploymentId,
                        name: strName.replace('-configmap',''),
                        appId: record.appId,
                        clusterId: record.clusterId,
                        namespaceId: record.namespaceId,
                    }

                    setDeploymentHandler(deploy)
                    setConfigmapFormVisible(true)
                }}>编辑</Button>
            ]
        }
    ]

    return (
        <div>
            <ProTable columns={columns}
                rowKey="creationTime"
                style={{marginLeft:20,marginRight:20}}
                cardProps={{bordered: true}}
                search={false}
                request={async (params, sort) => {
                    const res = await getConfigmapListByAppId(props.AppId)
                    console.log(res)
                    return res
                }}
                actionRef={ref}
            >
            </ProTable>
        
            <Drawer title="应用配置管理(ConfigMap)" width="88%"
                onClose={() => { setConfigmapFormVisible(false) }}
                visible={configmapFormVisible} destroyOnClose={true} >
                 <ConfigMapForm deploymentId={Number(deployment?.id)} tableRef={ref} visibleFunc={setConfigmapFormVisible} deployment={deployment}>
                 </ConfigMapForm>
            </Drawer>
        </div>
    )
}

export default AppConifigMaps