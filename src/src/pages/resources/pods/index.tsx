
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { history,Link } from 'umi';
import { PodItem } from './data';
import { Typography, Button , Space ,Tooltip} from 'antd'
import { getPodList,getNamespaceList }  from './service'
import React, { useState, useRef } from 'react';


const Pods: React.FC = (props) => {
    const actionRef = useRef<ActionType>();
    var appName = history.location.query?.app
    var clusterId = history.location.query?.cid
    var node = history.location.query?.node

    if (clusterId == undefined && ( node == undefined || appName ==undefined )) {
        history.goBack()
    }

    const podColumns: ProColumns<PodItem>[] = [
        {
            title:'实例名称',
            dataIndex:'name',
            search:false,
            render:(dom,_) => {
                return <span style={{color:'blue'}}>{dom}</span>
            }
        },
        {
            title:'状态',
            dataIndex:'status',
            search:false,
            render:(dom,row) => {
                if (row.status == 'Running') {
                    return <span style={{color:'green'}}>{dom}</span>
                }
                return <span style={{color:'red'}}>{dom}</span>
            }
        },
        {
            title:'实例IP',
            dataIndex:'ip',
            search: false,
            render:(dom,_) => {
                return <span style={{color:'blue'}}>{dom}</span>
            }
        },
        {
            title:'实例所在节点IP',
            dataIndex:'hostIP',
            search: false,
        },
        {
            title:'命名空间',
            dataIndex:'namespace',
            valueType:'select',
            request: async() =>{
                var namespaces = [ { label:'全部',value:'' }  ]
                var ns = await getNamespaceList(String(clusterId))
                namespaces.push(...ns)
                return namespaces
            }
        },
        {
            title:'重启次数',
            dataIndex:'restarts',
            search: false,
            render:(dom,_) => {
                return <span>{dom} 次</span>
            }
        },
        {
            title:'创建时间',
            dataIndex:'startTime',
            search: false,
        },
        {
          title: '操作',
          dataIndex: 'x',
          valueType: 'option',
          render: (_, record) => {
            return [<a key="delete">销毁重建</a>,<a key="remote">远程登录</a>];
          },
        },
    
    ]

    const expandedRowRender = () => {
        const data = [];
        for (let i = 0; i < 3; i += 1) {
          data.push({
            key: i,
            date: '2014-12-24 23:12:00',
            name: 'This is production name',
            upgradeNum: 'Upgraded: 56',
          });
        }
        return (
          <ProTable
            columns={[
              { title: 'Date', dataIndex: 'date', key: 'date' },
              { title: 'Name', dataIndex: 'name', key: 'name' },
      
              { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
              {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                valueType: 'option',
                render: () => [<a key="Pause">Pause</a>, <a key="Stop">Stop</a>],
              },
            ]}
            headerTitle={false}
            search={false}
            options={false}
            dataSource={data}
            pagination={false}
          />
        );
      };

    console.log(clusterId)
    console.log(node)
    var pageTitle = "Pod 管理     "
    if (appName) {
        pageTitle =  pageTitle + ' -- 应用: ' + appName
    } 

    return(
        <PageContainer title={pageTitle}>
            <ProTable<PodItem>
                rowKey={record=>record.name}
                actionRef={actionRef}
                columns={podColumns}
                headerTitle='Pod 列表'
                expandable={{ expandedRowRender }}
                request={async (params,sort) => {
                    params.cid = clusterId
                    if (appName) {
                        params.app = appName
                    } else {
                        params.node = node
                    }
                    
                    var podsData = await getPodList(params,sort)
                    console.log(podsData)
                    return podsData
                 }}
                 toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => {
                        history.goBack()
                    }}
                    >  返回 </Button>,
               ]}
            />
        </PageContainer>)

}

export default Pods