import { Card, Col, Row, Space,Grid, Statistic,Progress,Select } from 'antd';
import type { FC } from 'react';
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';

import {  Liquid, Radar } from '@ant-design/charts';
import { GridContent } from '@ant-design/pro-layout';
import {ProFormSelect } from '@ant-design/pro-form';

import { BindCluster} from './service'


const Monitor: FC = () => {
  const [cluster, clusterHandler] = useState<string>();
  const [clusterId, clusterIdHandler] = useState<string>();


  return (
    <GridContent>
        <Row gutter={[16, 16]}>
          <Col  span={4}>
            <Card title="集群信息"  hoverable 
                bodyStyle={{ textAlign: 'left',height:170 }} bordered={false} >
                  <Space direction="vertical">
                  <ProFormSelect name="clusters" initialValue={clusterId}  label="集群列表" 
                    fieldProps={{ labelInValue:true,
                      onSelect:(val)=>{
                        clusterIdHandler(val.value)
                        clusterHandler(val.label)
                      }
                    }} 
                  request={async()=>{
                     const res = await BindCluster()
                     clusterHandler(res[0].label)
                     clusterIdHandler(res[0].value)
                     return res
                  }}    width={230} />                      
                  <div>集群标识: {cluster}</div>
                  <div>集群版本	: v1.18.4 ++	</div>
                  </Space>
            </Card>
          </Col>
          <Col span={4} >
            <Card title="节点信息"  hoverable
                bodyStyle={{ textAlign: 'left',height:170 }} bordered={false} >
                  <Space>
                    <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={() => '4/4'}   />
                    <Space direction="vertical" style={{ marginLeft:20 }}>
                      <div>Node Status:</div>
                      <div>  Online: 4</div>
                      <div>  All Nodes: 4</div>
                    </Space>
                  </Space>
               </Card>
          </Col>
          <Col span={4}  >
          <Card title="CPU Core" hoverable
              bodyStyle={{ textAlign: 'left',height:170,marginTop:0  }} bordered={false} 
            >
                <Space>
                  <Liquid height={130} width={130} min={0} max={10000} value={5639} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((100 * value) / 10000).toFixed(1)}%`,
                  }} />
                    <Space direction="vertical">
                      <div>Usage: 0.31</div>
                      <div>Allocatable: 20.00</div>
                      <div>Capacity: 20.00</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>

          <Col span={4}>
          <Card title="内存 GiB" hoverable
              bodyStyle={{ textAlign: 'left',height:170,marginTop:0  }}
              bordered={false}
            >
                       <Space>
                  <Liquid height={130} width={130} min={0} max={10000}
                  value={5639} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((100 * value) / 10000).toFixed(1)}%`,
                  }} />
                    <Space direction="vertical">
                      <div>Usage: 0.31</div>
                      <div>Allocatable: 20.00</div>
                      <div>Capacity: 20.00</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>

          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="本地存储 GB" hoverable
              bodyStyle={{ textAlign: 'left',height:170,marginTop:0  }}
              bordered={false}
            >
               <Space>
                  <Liquid height={130} width={130} min={0} max={10000}
                  value={5639} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((100 * value) / 10000).toFixed(1)}%`,
                  }} />
                    <Space direction="vertical">
                      <div>Usage: 0.31</div>
                      <div>Allocatable: 20.00</div> 
                      <div>Capacity: 20.00</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="容器组" hoverable
              bodyStyle={{ textAlign: 'left',height:170,marginTop:0  }}
              bordered={false}
            >
               <Space>
                  <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={() => '4/20'}   />
                    <Space direction="vertical">
                      <div>Usage: 4</div>
                      <div>Capacity: 20</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>
     
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={16}  style={{ marginBottom: 12 }}>
            <Card title="工作负载情况" bordered={true} hoverable >
              <Row >
                <Col span={4}>
                <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:18}}>
                        <span>Deployment</span> 
                        <span>{"4/4"}</span> 
                    </Space>
                } />
                </Col>
                <Col span={4}>
                <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:18}}>
                        <span>StatefulSet</span> 
                        <span>{"4/4"}</span> 
                    </Space>
                } />
                </Col>
                <Col span={4}>
                <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:18}}>
                        <span>DaemonSet</span> 
                        <span>{"4/4"}</span> 
                    </Space>
                } />             </Col>
                <Col span={4}>
                <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:18}}>
                        <span>CronJob</span> 
                        <span>{"4/4"}</span> 
                    </Space>
                } />              </Col>
                <Col span={4}>
                <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:18}}>
                        <span>Job </span> 
                        <span>{"4/4"}</span> 
                    </Space>
                } />              
                </Col>
                <Col span={4}>
                <Progress  type="dashboard" percent={100}  success={{ percent: 30 }}  format={(percent) => 
                    <Space direction="vertical" style={{fontSize:18}}>
                        <span>ReplicaSet</span> 
                        <span>{"4/4"}</span> 
                    </Space>
                } />           
                </Col>
                
              </Row>
            </Card>
          </Col>
        </Row>
    </GridContent>
  );
};

export default Monitor;
