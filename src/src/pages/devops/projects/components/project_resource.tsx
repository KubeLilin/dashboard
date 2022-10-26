import React, { useState, useRef,useEffect } from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Avatar, Card, Col, List,Grid, Skeleton, Row, Statistic,Progress,Space,Button,Typography,Tabs} from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import {  Liquid } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';

import {  GetProjectDeployLevelCounts} from '../../../applications/info/deployment.service'


export type ProjectResourceProps = {
    projectId : number;
    projectName : string;
};


const ProjectResource: React.FC<ProjectResourceProps> = ( props ) => {
    const [onLoaded,_] = useState<boolean>()
    const [projectResourceInfo,projectResourceInfoHandler] = useState<any>()
    const [projectEnvPie,projectEnvPieHandler] = useState<any>([{type:'-',value:0}])


    useEffect(()=>{
        GetProjectDeployLevelCounts(props.projectId).then(res=>{
            var pieDataStruct:any[] = []
            var datasource:any = { projectName: props.projectName }
            var allCount = 0
            res.data.forEach(val=>{ 
                allCount += val.count
                switch (val.value) {
                    case 'dev':
                        datasource.devCount = val.count
                        break
                    case 'test':
                        datasource.testCount = val.count
                        break
                    case 'release':
                        datasource.releaseCount = val.count
                        break
                    case 'prod':
                        datasource.prodCount = val.count
                        break
                } 
                pieDataStruct.push({type:val.value,value:val.count})
            })
            datasource.allCount = allCount
            projectResourceInfoHandler(datasource)
            projectEnvPieHandler(pieDataStruct)
        })
    },[onLoaded])

   
    const config = { appendPadding: 10, angleField: 'value',colorField: 'type',radius: 0.8,
        label: { type: 'outer',  content: '{name} {percentage}', },
        interactions: [ { type: 'pie-legend-active', },{ type: 'element-active',}],
        
    };


    return (
        <div>
        <ProDescriptions  style={{ padding:25, } }  dataSource={projectResourceInfo}
            column={3}  bordered	 size="middle"
            columns={[
                { title: '项目名称', dataIndex: 'projectName',span:3 },
                { title: '实例总数', dataIndex: 'allCount' },
                { title: '生产环境实例数',  dataIndex: 'prodCount' },
                { title: '预生产环境实例数',  dataIndex: 'releaseCount' },
                { title: '开发环境实例数',  dataIndex: 'devCount' },
                { title: '测试环境实例数',  dataIndex: 'testCount' },

            ]}/>
        <GridContent>
        <Row>
          <Col span={4}>
          <Card title="各部署环境数占比(个)" hoverable
              bodyStyle={{ textAlign: 'center',height:270 ,padding:0 }}
              bordered={false} >
             
                <Pie data={projectEnvPie} {...config}  height={250} width={250} style={{marginTop:0,marginLeft:15}}  />
            
         </Card>
          </Col>
          <Col span={4} >
          <Card title="生产环境CPU申请量占比(%)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 600 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `35%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="预生产环境CPU申请量占比(%)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 600 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `35%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          </Col>
          <Col span={4}  >
          <Card title="开发环境CPU申请量占比(%)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 600 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `35%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          
          </Col>

          <Col span={4}>
          <Card title="测试环境CPU申请量占比(%)" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 500 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `35%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          
          </Col>

          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="生产环境内存申请量占比(%)MBi" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 500 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `56%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="预生产环境内存申请量占比(%)MBi" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 500 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `56%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="开发环境内存申请量占比(%)MBi" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 500 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `56%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          </Col>
          <Col span={4}  style={{ marginBottom: 12 }}>
          <Card title="测试环境内存申请量占比(%)MBi" hoverable
              bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
              bordered={false} >
                <Space direction="vertical">
                  <Liquid height={130} width={130} min={0} max={1024}
                    value={ 500 } forceFit padding={[0, 0, 0, 0]}
                    statistic={{
                        formatter: (value:any) => `56%`,
                    }} />
                    <Space direction="vertical" >
                      <div>Usage:2 GiB</div>
                      <div>Allocatable:2 GiB</div>
                    </Space>
                </Space>
         </Card>
          </Col>
        </Row>
        </GridContent>
        </div>
        )
}


export default ProjectResource