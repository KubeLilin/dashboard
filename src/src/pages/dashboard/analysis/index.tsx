import type { FC } from 'react';
import React, { useState, useEffect} from 'react';

import { Avatar, Card, Col, List,Grid, Skeleton, Row, Statistic,Progress,Space,Button,Typography} from 'antd';
const { Text } = Typography;
import { Link, useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import {  Liquid,Radar } from '@ant-design/charts';
import { GridContent } from '@ant-design/pro-layout';
import {ProFormSelect } from '@ant-design/pro-form';
import styles from './style.less';
import { ClusterMetricsInfo,WorkloadsMetricsInfo,ProjectsMetricsInfo  } from './data';
import { BindCluster , GetClusterMetrics ,GetWorkloadsMetrics ,GetProjectsMetrics} from './service'




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
      clusterListHandler(res)
      clusterHandler(res[0].label)
      clusterIdHandler(res[0].value)
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
            KubeLilin
          </div>
          <div>
            An Cloud-Native application platform for Kubernetes.
          </div>
          <div>
          <Space direction="horizontal"  style={{   textAlign:"start"}}>
          <ProFormSelect name="clusters" label="集群列表:" width={270}
            options={clusterList}
            fieldProps={{ labelInValue:true,
              value: clusterId,
              onChange:async(val:any)=>{
                clusterHandler(val.label)
                clusterIdHandler(val.value)
              }
            }}   />  
           
            </Space> 
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



  return (
    <PageContainer
      content={ <PageHeaderContent currentUser={{userid: '00000001', }} /> }
      extraContent={<ExtraContent />}
    >
    
    <GridContent>
        <Row gutter={[16, 16]}>
          <Col  span={4}>
            <Card title="Cluster Information"  hoverable 
                bodyStyle={{ textAlign: 'center',height:270 }} bordered={false} >
                  <Space direction="vertical">  
                  <div>Cluster ID: {cluster}</div>
                  <div>Cluster Version: v1.18.4 ++	</div>
                  </Space>
            </Card>
          </Col>
          <Col span={4} >
            <Card title="Node Information"  hoverable
                bodyStyle={{ textAlign: 'center',height:270 }} bordered={false} >
                  <Space direction="vertical">
                    <Progress  type="dashboard" percent={100}  success={{ percent: (Number(clusterMetrics?.nodes.available)/ Number(clusterMetrics?.nodes.count)) *100 }}  format={() => clusterMetrics?.nodes.available +'/'+  clusterMetrics?.nodes.count }   />
                    <Space direction="vertical" >
                      <Text>Ready: {clusterMetrics?.nodes.available}</Text>
                      <Text>All Nodes: {clusterMetrics?.nodes.count}</Text>
                      <Text>Usage: - / - </Text>
                    </Space>
                  </Space>
               </Card>
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="Pods Limit" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
               <Space direction="vertical">
                  <Progress  type="dashboard" percent={100}  success={{ percent: (Number(clusterMetrics?.usage.pods)/Number(clusterMetrics?.capacity.pods))*100 }} 
                     format={() =>  clusterMetrics?.capacity.pods}   />
                    <Space direction="vertical">
                      <div>Capacity: {clusterMetrics?.capacity.pods}</div>
                      <div>Limit: {clusterMetrics?.capacity.pods}</div>
                      <div>Usage: - / - </div>
                    </Space>
                </Space>
            </Card>
          </Col>
          <Col span={4}  >
          <Card title="Total CPU (Core)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }} bordered={false} 
            >
                <Space  direction="vertical">
                  <Liquid height={130} width={130} min={0} max={Number(clusterMetrics?.capacity.cpu)} value={Number(clusterMetrics?.usage.cpu)} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((Number(clusterMetrics?.usage.cpu)/Number(clusterMetrics?.capacity.cpu))*100).toFixed(2)}%`,
                  }} />
                    <Space direction="vertical">
                      <div>Usage: { clusterMetrics?.usage.cpu.toFixed(2)}</div>
                      <div>Allocatable: {clusterMetrics?.allocatable.cpu.toFixed(2)}</div>
                      <div>Capacity: {clusterMetrics?.capacity.cpu.toFixed(2)}</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>

          <Col span={4}>
          <Card title="Total Memory (GiB)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={Number(clusterMetrics?.capacity.memory)}
                  value={Number(clusterMetrics?.usage.memory)} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((Number(clusterMetrics?.usage.memory)/Number(clusterMetrics?.capacity.memory))*100).toFixed(2)}%`,
                  }} />
                    <Space direction="vertical" >
                      <div>Usage: { (Number(clusterMetrics?.usage.memory)/1024/1024/1024).toFixed(2)} GiB</div>
                      <div>Allocatable: {(Number(clusterMetrics?.allocatable.memory)/1024/1024/1024).toFixed(2)} GiB</div>
                      <div>Capacity: {(Number(clusterMetrics?.capacity.memory)/1024/1024/1024).toFixed(2)} GiB</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>

          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="Local Storage (GB)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false}
            >
               <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={Number(clusterMetrics?.capacity.storage)}
                  value={Number(clusterMetrics?.usage.storage)} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => Number(clusterMetrics?.usage.storage)>0?`${((Number(clusterMetrics?.usage.storage)/Number(clusterMetrics?.capacity.storage))*100).toFixed(2)}%`:'0.00%',
                  }} />
                    <Space direction="vertical">
                    <div>Usage: { (Number(clusterMetrics?.usage.storage)/1024/1024/1024).toFixed(2)} GB</div>
                      <div>Allocatable: {(Number(clusterMetrics?.allocatable.storage)/1024/1024/1024).toFixed(2)} GB</div>
                      <div>Capacity: {(Number(clusterMetrics?.capacity.storage)/1024/1024/1024).toFixed(2)} GB</div>
                    </Space>
                </Space>
            </Card>
          </Col>
 
        </Row>
        <Row gutter={[18, 18]}>
          <Col span={24}  style={{ marginBottom: 12 }}>
            <Card title="Workloads Information" bordered={true}  >
              <Row >
                <Col span={3} style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }}  >
                <Space>
                  <Progress  type="dashboard" percent={100}  success={{ percent: (Number(workloadsMetrics?.podsRunning)/Number(workloadsMetrics?.podsCount))*100 }} 
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
                <Progress  type="circle" percent={100}   format={(percent) => 
                    <Space direction="vertical" style={{fontSize:16,color:'ButtonText'}}>
                        <span>Deployment</span> 
                        <span>{workloadsMetrics?.deployment + '/' +workloadsMetrics?.deployment  }</span> 
                    </Space>
                } />
                </Card>
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  type="circle" percent={100}    format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16,color:'ButtonText'}}>
                  <span>StatefulSets</span> 
                  <span>{workloadsMetrics?.statefulSets + '/' +workloadsMetrics?.statefulSets  }</span> 
              </Space>
                } />
                </Card>
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  type="circle" percent={100}   format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16,color:'ButtonText'}}>
                    <span>DaemonSets</span> 
                    <span>{workloadsMetrics?.daemonSets + '/' +workloadsMetrics?.daemonSets  }</span> 
                  </Space>
                } />
                </Card>             
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  type="circle" percent={100}  format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16,color:'ButtonText'}}>
                    <span>CronJob</span> 
                    <span>{workloadsMetrics?.cronJobs + '/' +workloadsMetrics?.cronJobs  }</span> 
                  </Space>
                } />              
                </Card>
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  type="circle" percent={100}  success={{ percent: 100 }}  format={(percent) => 
                  <Space direction="vertical" style={{fontSize:16,color:'ButtonText'}}>
                    <span>Job</span> 
                    <span>{workloadsMetrics?.jobs + '/' +workloadsMetrics?.jobs  }</span> 
                  </Space>
                } />            
                </Card>  
                </Col>
                <Col span={3}  style={{marginLeft:12}}>
                <Card hoverable bodyStyle={{ textAlign: 'center' }} >
                <Progress  type="circle" percent={100}  success={{ percent: 100 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:16,color:'ButtonText'}}>
                      <span>ReplicaSet</span> 
                      <span>{workloadsMetrics?.replicaSets + '/' +workloadsMetrics?.replicaSets  }</span> 
                    </Space>
                } />    
                </Card>       
                </Col>
              
              </Row>
            </Card>
          </Col>
        </Row>
    </GridContent>


    </PageContainer>
  );
};

export default Analysis;
