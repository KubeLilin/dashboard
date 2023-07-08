import type { FC } from 'react';
import React, { useState, useEffect} from 'react';

import { Avatar, Card, Col, List,Grid, Skeleton, Row, Statistic,Progress,Space,Button,Typography,Tabs} from 'antd';
const { Text } = Typography;
const { TabPane } = Tabs;
import { Link, useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import {  Liquid } from '@ant-design/charts';
import {RadialBar} from '@ant-design/plots'
import { GridContent } from '@ant-design/pro-layout';
import {ProFormSelect } from '@ant-design/pro-form';
import styles from './style.less';
import { ClusterMetricsInfo,WorkloadsMetricsInfo,ProjectsMetricsInfo  } from './data';
import { BindCluster , GetClusterMetrics ,GetWorkloadsMetrics ,GetProjectsMetrics} from './service'
import Nodes from '../../resources/nodes'
import ResourceQuotas from './components/resourcequotas'

const Analysis: FC = () => {
  const [cluster, clusterHandler] = useState<string|undefined>(undefined);
  const [clusterId, clusterIdHandler] = useState<string|undefined>(undefined);
  const [clusterMetrics,clusterMetricsHandler] = useState<ClusterMetricsInfo|undefined>(undefined);
  const [workloadsMetrics,workloadsMetricsHandler] = useState<WorkloadsMetricsInfo|undefined>(undefined);
  const [projectMetrics,projectMetricsHandler] = useState<ProjectsMetricsInfo|undefined>(undefined);

  
  const [clusterList,clusterListHandler] = useState<any>()
  const [onLoaded,_] = useState<boolean>(false)
  var timer: NodeJS.Timeout


  useEffect(()=>{
    BindCluster().then((res)=>{
      if (res) {
        clusterListHandler(res)
        clusterHandler(res[0].label)
        clusterIdHandler(res[0].value)
      }
    })

    GetProjectsMetrics().then((res)=>{
      projectMetricsHandler(res.data)
    })

  },[onLoaded])

  useEffect(()=>{
    loadMetrics( clusterId)
  },[clusterId])


  const loadMetrics = (cid:any) =>{
    if (cid){
        GetClusterMetrics(cid).then((resm)=>{
            clusterMetricsHandler(resm.data)
        })
        GetWorkloadsMetrics(cid).then((res)=>{
            workloadsMetricsHandler(res.data)
        })
    }
  }

  const PageHeaderContent: FC<{ currentUser: Partial<any> }> = ({ currentUser }) => {
    const loading = currentUser && Object.keys(currentUser).length;
    if (!loading) {
      return <Skeleton avatar paragraph={{ rows: 1 }} active />;
    }
    return (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="/icon.svg" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            KubeLilin Dashboard
          </div>
          <div>
            KubeLilin is an PaaS Platform, An Cloud-Native Application Platform for Kubernetes.
          </div>
          <div>
              <ProFormSelect name="clusters" label="Cluster List:" width={270}
                options={clusterList}
                fieldProps={{ labelInValue:true,
                  value: clusterId,
                    onChange:async(val:any)=>{
                    clusterHandler(val.label)
                    clusterIdHandler(val.value)
                  }
                }} />  
          </div>
        </div>
      </div>
    );
  };

  const ExtraContent: FC<Record<string, any>> = () => (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <Statistic title="应用数量" value={projectMetrics?.applications} />
      </div>
      <div className={styles.statItem}>
        <Statistic title="部署数量" value={projectMetrics?.deploys}  />
      </div>
      <div className={styles.statItem}>
        <Statistic title="发布数量" value={projectMetrics?.publish} />
      </div>
    </div>
  );

  const TableListContent: FC<Record<string, any>> = () => {
      const [activeTabKey, setActiveTabKey] = useState('tab1')

      const tabList = [ { key: 'tab1', tab: 'Node Usage Top'  },
          { key: 'tab2', tab: 'Namespace Usage Top' }, ]
      
      const TabContentList = {
        tab1: <Nodes ClusterId={Number(clusterId)} />,
        tab2: <ResourceQuotas ClusterId={Number(clusterId)} />,
      }

      return ( 
        <Card style={{ width: '100%' }}
          title="Rsource Usage"
          extra={<a href="#">Refresh</a>}
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={key => {
            setActiveTabKey(key);
          }}
        >
          {TabContentList[activeTabKey]}
        </Card>)
  };
  
  const CpuRequestLimitsConfig = {
    data:[
      { name:'Limits', star: clusterMetrics?.limit?.cpu, color: '#1ad5de', },
      { name:'Requests', star: clusterMetrics?.requests?.cpu , color: '#a0ff03',},
      { name:'Usage', star: clusterMetrics?.usage?.cpu ,color: '#e90b3a' },
    ], 
    theme: 'dark',
    barBackground: {
      style: {
        fill: 'rgba(255,255,255,0.45)',
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name:datum.name,
          value: datum.star.toFixed(2) + ' Cores',
        };
      },
    },
    xField: 'name', yField: 'star',
    width:180,  height:180, autoFit:false,label: { style: { fill: 'black', opacity: 0.1, fontSize: 8 }, rotate: true },
    maxAngle: 270, radius: 0.8, innerRadius: 0.2, colorField: 'star',   barStyle: { lineCap: 'round', },

  };

  const MemoryRequestLimitsConfig = {
    data:[
      { name:'Limits', star: Number(clusterMetrics?.limit?.memory) / 1024 / 1024 /1024 },
      { name:'Requests', star: Number(clusterMetrics?.requests?.memory) / 1024 / 1024 / 1024  },
      { name:'Usage', star: (Number(clusterMetrics?.usage?.memory) / 1024 / 1024/ 1024) },
    ], 
    theme: 'dark',
    barBackground: {
      style: {
        fill: 'rgba(255,255,255,0.45)',
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name:datum.name,
          value: datum.star.toFixed(2) + ' GiB',
        };
      },
    },
    xField: 'name', yField: 'star',
    width:180,  height:180, autoFit:false,label: { style: { fill: 'black', opacity: 0.1, fontSize: 8 }, rotate: true },
    maxAngle: 270, radius: 0.8, innerRadius: 0.2, colorField: 'star',  barStyle: { lineCap: 'round', },

  };
  
  return (
    <PageContainer 
      header={{ title:'Welcome ', subTitle:"kubernetes base",
      // extra:
      //   [<Button key="1" type="primary" onClick={()=>{
      //     loadMetrics(clusterId)
      //   }}>刷新</Button>,] 
      }}
      content={ <PageHeaderContent currentUser={{userid: '00000001', }} /> }
      extraContent={<ExtraContent />} >
    <GridContent>
        <Row gutter={[16, 16]}>

        <Col span={4}  >
          <Card title="CPU Usage (Cores)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }} bordered={true}  >
                <Space  direction="vertical" style={{width:240}}>
                  <Liquid height={180} width={180} min={0} max={Number(clusterMetrics?.capacity.cpu)} value={Number(clusterMetrics?.usage.cpu)} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((Number(clusterMetrics?.usage.cpu)/Number(clusterMetrics?.capacity.cpu))*100).toFixed(2)}%`,
                  }} />
                    <Space direction="vertical">
                      <div>CPU(%): { clusterMetrics?.usage.cpu.toFixed(2)} / {clusterMetrics?.capacity.cpu.toFixed(2)} Cores</div>
                    </Space>
                </Space>
            </Card>
          </Col>

          <Col span={4}>
          <Card title="Memory Usage (GiB)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={true} >
                <Space direction="vertical"  style={{width:240}}>
                  <Liquid height={180} width={180} min={0} max={Number(clusterMetrics?.capacity.memory)}
                  value={Number(clusterMetrics?.usage.memory)} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((Number(clusterMetrics?.usage.memory)/Number(clusterMetrics?.capacity.memory))*100).toFixed(2)}%`,
                  }} />
                    <Space direction="vertical" >
                      <div>Memory(%): { (Number(clusterMetrics?.usage.memory)/1024/1024/1024).toFixed(2)} / {(Number(clusterMetrics?.capacity.memory)/1024/1024/1024).toFixed(2)} GiB</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>

          <Col span={4}>
            <Card hoverable title="CPU Core (Requests/Limits)" 
                bodyStyle={{ textAlign: 'center',height:270 }} bordered={true} >
                   <Space direction="vertical" style={{ marginTop:0 }}>  
             <RadialBar {...CpuRequestLimitsConfig} />
             <Text>Requests:{(Number(clusterMetrics?.requests?.cpu) ).toFixed(2)} Limits: { (Number(clusterMetrics?.limit?.cpu) ).toFixed(2) }</Text>
             </Space>
            </Card>
          </Col>

          <Col span={4}>
            <Card hoverable title="Memory GiB (Requests/Limits)" 
                bodyStyle={{ textAlign: 'center',height:270 }} bordered={true} >
                   <Space direction="vertical" style={{ marginTop:0 }}>  
             <RadialBar {...MemoryRequestLimitsConfig} />
             <Text>Requests:{(Number(clusterMetrics?.requests?.memory) / 1024 / 1024 / 1024).toFixed(2)} Limits: { (Number(clusterMetrics?.limit?.memory) / 1024 / 1024 /1024).toFixed(2) }</Text>

             </Space>
            </Card>
          </Col>

        

          <Col span={4} >
            <Card title="Nodes"  hoverable
                bodyStyle={{ textAlign: 'center', height:270 }} bordered={true} >
                  <Space direction="vertical">
                    <Progress width={180}  type="circle" percent={100}  success={{ percent: (Number(clusterMetrics?.nodes.available)/ Number(clusterMetrics?.nodes.count)) *100 }}  format={() => clusterMetrics?.nodes.available +'/'+  clusterMetrics?.nodes.count }   />
                    <Space direction="vertical" >
                      <Text>Node Ready:  {clusterMetrics?.nodes.available} /  {clusterMetrics?.nodes.count}</Text>

                    </Space>
                  </Space>
               </Card>
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="Pods" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={true} >
               <Space direction="vertical">
                  <Progress  width={180} type="circle" percent={100}  success={{ percent: (Number(clusterMetrics?.usage.pods)/Number(clusterMetrics?.capacity.pods))*100 }} 
                     format={() =>  clusterMetrics?.capacity.pods}   />
                    <Space direction="vertical">
                      <div>Pods Ready: {clusterMetrics?.usage.pods} / {clusterMetrics?.capacity.pods}  </div>
                    </Space>
                </Space>
            </Card>
          </Col>

          {/* <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="Local Storage (GB)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
               <Space direction="vertical" style={{width:240}}>
                  <Liquid height={180} width={180} min={0} max={Number(clusterMetrics?.capacity.storage)}
                  value={Number(clusterMetrics?.usage.storage)} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => Number(clusterMetrics?.usage.storage)>0?`${((Number(clusterMetrics?.usage.storage)/Number(clusterMetrics?.capacity.storage))*100).toFixed(2)}%`:'0.00%',
                  }} />
                    <Space direction="vertical">
                    <div>Storage(%): { (Number(clusterMetrics?.usage.storage)/1024/1024/1024).toFixed(2)} /  {(Number(clusterMetrics?.capacity.storage)/1024/1024/1024).toFixed(2)} GBi</div>
                    </Space>
                </Space>
            </Card>
          </Col> */}
 
        </Row>
        <Row gutter={[18, 18]}>

          <Col span={24}  style={{  alignItems:'center',justifyContent:'center' }} >
            <Card title="Workloads Information" bordered={true}  >
              <Row >
              <Col span={1}  >
 
              </Col>

                <Col span={3} style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }}  >
                <Space>
                  <Progress  width={160}  type="dashboard" percent={100}  success={{ percent: (Number(workloadsMetrics?.podsRunning)/Number(workloadsMetrics?.podsCount))*100 }} 
                    format={(percent) => 
                      <Space direction="vertical" style={{fontSize:16}}>
                          <span>Pods</span> 
                          <span>{ workloadsMetrics?.podsRunning + '/' + workloadsMetrics?.podsCount  }</span> 
                      </Space> }
                    />
                 </Space>  
                 </Card>
                </Col>
                <Col span={3} style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  width={160} type="circle" percent={100}   format={(percent) => 
                    <Space direction="vertical" style={{fontSize:16}}>
                        <span>Deployment</span> 
                        <span>{workloadsMetrics?.deployment + '/' +workloadsMetrics?.deployment  }</span> 
                    </Space>
                } />
                </Card>
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  width={160} type="circle" percent={100}    format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16}}>
                  <span>StatefulSets</span> 
                  <span>{workloadsMetrics?.statefulSets + '/' +workloadsMetrics?.statefulSets  }</span> 
              </Space>
                } />
                </Card>
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  width={160} type="circle" percent={100}   format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16 }}>
                    <span>DaemonSets</span> 
                    <span>{workloadsMetrics?.daemonSets + '/' +workloadsMetrics?.daemonSets  }</span> 
                  </Space>
                } />
                </Card>             
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  width={160}  type="circle" percent={100}  format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16 }}>
                    <span>CronJob</span> 
                    <span>{workloadsMetrics?.cronJobs + '/' +workloadsMetrics?.cronJobs  }</span> 
                  </Space>
                } />              
                </Card>
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  width={160} type="circle" percent={100}  success={{ percent: 100 }}  format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16 }}>
                    <span>Job</span> 
                    <span>{workloadsMetrics?.jobs + '/' +workloadsMetrics?.jobs  }</span> 
                  </Space>
                } />            
                </Card>  
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  width={160}  type="circle" percent={100}  success={{ percent: 100 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:16 }}>
                      <span>ReplicaSet</span> 
                      <span>{workloadsMetrics?.replicaSets + '/' +workloadsMetrics?.replicaSets  }</span> 
                    </Space>
                } />    
                </Card>       
                </Col>
                <Col span={1}> </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row style={{marginTop:15}} >
          <TableListContent/>
        </Row>
    </GridContent>


    </PageContainer>
  );
};

export default Analysis;
