
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { history,Link } from 'umi';
import { PodItem } from './data';
import { Typography, Button , Space ,Tooltip,Tag} from 'antd'
import { getPodList,getNamespaceList }  from './service'
import React, { useState, useRef } from 'react';
import { CloudUploadOutlined,ExpandAltOutlined,LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment'; 

const Pods: React.FC = (props) => {
    const actionRef = useRef<ActionType>();
    const [time, setTime] = useState(() => Date.now());
    const [polling, setPolling] = useState<number | undefined>(undefined);


    var deployId = history.location.query?.did
    var namespace = history.location.query?.ns
    var appName = history.location.query?.app
    var clusterId = history.location.query?.cid
    var node = history.location.query?.node
    var did = 0
    if (deployId) {
        did = Number(deployId)
    }


    console.log(did)

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
            title:'容器数',
            search: false,
            render:(_,row) => {
                return <span>{row.containers.length}个</span>
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

    const expandedRowRender = (podItem:PodItem) => {
        
        return (
          <ProTable
            columns={[
              { title: '容器名称', dataIndex: 'name', key: 'name' },
              { title: '容器ID', dataIndex: 'id', key: 'id' },
      
              { title: '镜像版本号', dataIndex: 'image', key: 'image' },
            //   { title: 'CPU Request', dataIndex: 'cpuRequest', key: 'cpuRequest' },
            //   { title: 'CPU Limit', dataIndex: 'cpuLimit', key: 'cpuLimit' },
            //   { title: '内存 Request', dataIndex: 'memoryRequest', key: 'memoryRequest' },
            //   { title: '内存 Limit', dataIndex: 'memoryLimit', key: 'memoryLimit' },
              { title: '重启次数', dataIndex: 'restartCount', key: 'restartCount' },
              { 
                title: '状态', dataIndex: 'status', key: 'status' ,
                render:(_,row) =>{
                    return [
                           <Tooltip title={row.state} color="geekblue" key="status">
                                <Space direction="vertical">
                                    <span>Readly:  {row.ready?<Tag color="geekblue">{String(row.ready)}</Tag>:<Tag color="#f50">String(row.ready)</Tag>}</span>
                                    <span>Started:  {row.started?<Tag color="geekblue">{String(row.started)}</Tag>:<Tag color="#f50">String(row.started)</Tag>}</span>
                                </Space>
                            </Tooltip>
                    ]
                }
              },
              
            ]}
            rowKey="id"
            headerTitle={false}
            search={false}
            options={false}
            dataSource={podItem.containers}
            pagination={false}
          />
        );
      };

    console.log(clusterId)
    console.log(node)
    var pageTitle = "Pod 管理     "
    var breadcrumb =[ 
        { path: '', breadcrumbName: '资源中心'},
        { path: '', breadcrumbName: '', }]
    if (appName) {
        breadcrumb[0] = { path:'', breadcrumbName:'应用中心'  }
        breadcrumb[1] = { path:'', breadcrumbName:'Pod列表'  }
        pageTitle =  pageTitle + ' -- 应用部署: ' + appName
    } else if (node) {
        breadcrumb[0] = { path:'', breadcrumbName:'资源中心'  }
        breadcrumb[1] = { path:'', breadcrumbName:'集群管理'  }
         
    } 

    return(
        <PageContainer title={pageTitle}   
          header={{
            breadcrumb: {routes: breadcrumb},
            extra: [  <Button key="1" onClick={() => {
                history.goBack()
            }}>返回上一级</Button>,]
          }}
        >
            <ProTable<PodItem>
                rowKey={record=>record.name}
                actionRef={actionRef}
                columns={podColumns}
                dateFormatter="string"
                headerTitle={`Pod 列表 - 上次更新时间：${moment(time).format('HH:mm:ss')}`}
                expandable={{ expandedRowRender }}
                request={async (params,sort) => {
                    params.cid = clusterId
                    if (appName) {
                        params.app = appName
                    } else {
                        params.node = node
                    }
                    
                    var podsData = await getPodList(params,sort)
                    setTime(Date.now());
                    return podsData
                 }}
                 polling={polling || undefined}
                 toolBarRender={() => [
                    <Button key='button' type="primary"  icon={<CloudUploadOutlined />} style={{  display: did>0?'block':'none'}}
                        onClick={() => {
                            //部署请求
                            setPolling(1000);
                        }}>部署应用</Button>,
                    <Button key='button'  type="primary" icon={<ExpandAltOutlined />} style={{  display: did>0?'block':'none'}}
                        onClick={() => {
                            //伸缩请求
                            setPolling(1000);
                        }}>伸缩实例</Button>,
                    <Button key='button' danger  style={{  display: did>0?'block':'none'}}
                        onClick={() => {

                    }}>清空实例</Button>,
                    <Button key="3"  
                      onClick={() => { if (polling) { setPolling(undefined); return;  } setPolling(2000);  }} >
                        {polling ? <LoadingOutlined /> : <ReloadOutlined />}
                        {polling ? '停止轮询' : '开始轮询'}
                    </Button>,  ]}
            />
        </PageContainer>)

}

export default Pods