import { Card, Col, Row, Space, Statistic } from 'antd';
import type { FC } from 'react';
import {  Liquid, RingProgress } from '@ant-design/charts';
import { GridContent } from '@ant-design/pro-layout';



const Monitor: FC = () => {

  return (
    <GridContent>
        <Row gutter={32}>
          <Col  xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card title="节点信息"  
                bodyStyle={{ textAlign: 'left' }} bordered={false} >
                  <Space>
                    <RingProgress color="#2FC25B"  height={200} width={200} percent={0.32}  />
                    <Space direction="vertical">
                      <div>节点在线状态</div>
                      <div>在线节点: 4</div>
                      <div>全部节点: 2</div>
                    </Space>
                  </Space>
               </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
          <Card title="CPU Core"
              bodyStyle={{ textAlign: 'left'  }}
              bordered={false}
            >
                <Space>
                  <Liquid height={200} width={200} min={0} max={10000}
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

          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
          <Card title="内存 GiB"
              bodyStyle={{ textAlign: 'left'  }}
              bordered={false}
            >
                       <Space>
                  <Liquid height={200} width={200} min={0} max={10000}
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

          <Col xl={6} lg={24} md={24} sm={24} xs={24}  style={{ marginBottom: 24 }}>
          <Card title="本地存储 GB"
              bodyStyle={{ textAlign: 'left' }}
              bordered={false}
            >
               <Space>
                  <Liquid height={200} width={200} min={0} max={10000}
                  value={5639} forceFit padding={[0, 0, 0, 0]}
                  statistic={{
                    formatter: (value) => `${((100 * value) / 10000).toFixed(1)}%`,
                  }} />
                    <Space direction="vertical">
                      <div>Usage: 0.31</div>
                      <div>Capacity: 20.00</div>
                    </Space>
                </Space>
            </Card>
          
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="工作负载情况" bordered={false} >
              <Row >
                <Col span={8}>
                  <RingProgress forceFit height={128} percent={0.28} />
                </Col>
                <Col span={8}>
                  <RingProgress color="#5DDECF" forceFit height={128} percent={0.22} />
                </Col>
                <Col span={8}>
                  <RingProgress color="#2FC25B" forceFit height={128} percent={0.32} />
                </Col>
                <Col span={8}>
                  <RingProgress color="#2FC25B" forceFit height={128} percent={0.32} />
                </Col>
              </Row>
            </Card>
          </Col>
 
        </Row>
    </GridContent>
  );
};

export default Monitor;
