import React, { useState, useRef,useEffect } from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Avatar, Card, Col, List,Grid, Skeleton, Row, Statistic,Progress,Space,Button,Typography,Tabs} from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import {  Liquid } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';

import {  GetProjectDeployLevelCounts } from '../../../applications/info/deployment.service'
import { GetResourceMetrics } from '../service'

export type ProjectResourceProps = {
    projectId : number;
    projectName : string;
};


const ProjectResource: React.FC<ProjectResourceProps> = ( props ) => {
    const [onLoaded,_] = useState<boolean>()
    const [projectResourceInfo,projectResourceInfoHandler] = useState<any>()
    const [projectResourceMetrics,projectResourceMetricsHandler] = useState<any>()
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
            return datasource
        }).then((info)=>{

            GetResourceMetrics(props.projectId).then(res=>{
                projectResourceMetricsHandler(res.data)
               
                console.log(info)
                var copyInfo = {
                    ...info,
                    totalCpu: res.data.totalCpu,
                    totalMemory: res.data.totalMemory
                }
                console.log(copyInfo)
                projectResourceInfoHandler(copyInfo)

            })

        })

       


    },[onLoaded])

   
    const config = { appendPadding: 10, angleField: 'value',colorField: 'type',radius: 0.8,
        label: { type: 'outer',  content: '{name} {percentage}', },
        interactions: [ { type: 'pie-legend-active', },{ type: 'element-active',}],
        
    };


    return (
    <div>
      <Row>
      <Col span={5}>
        <Card title="部署环境数占比统计" bordered={false}      >
                <Pie data={projectEnvPie} {...config}  height={250} width={250} style={{marginTop:0,marginLeft:15}}  />
         </Card>
      </Col>
      <Col span={11}>
        <Card title="部署环境详情" bordered={false}   >
            <ProDescriptions  style={{ padding:20,height:250 } }  dataSource={projectResourceInfo}
                column={3}  bordered
                columns={[
                    { title: '项目名称', dataIndex: 'projectName',span:3 },
                    { title: '实例总数', dataIndex: 'allCount' },
                    { title: '生产环境实例数',  dataIndex: 'prodCount' },
                    { title: '预生产环境实例数',  dataIndex: 'releaseCount' },
                    { title: '开发环境实例数',  dataIndex: 'devCount' },
                    { title: '测试环境实例数',  dataIndex: 'testCount' ,span:3},
                    { title: '申请CPU数量(Core)',  dataIndex: 'totalCpu' },
                    { title: '申请内存数量(MBi)',  dataIndex: 'totalMemory' },
                ]}/>
        </Card>
      </Col>
    </Row>
    <Row  style={{ marginTop:20}}>
        <Col span={4} >
        <Card title="项目生产环境CPU占比(%)" hoverable
            bodyStyle={{ textAlign: 'center',height:270,width:300,marginTop:0  }}
            bordered={false} >
            <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalCpu)}
                value={ (Number(projectResourceMetrics?.prod.sumCpu)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.prod.sumCpu)/Number(projectResourceMetrics?.totalCpu))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.prod.sumCpu} Core</div>
                    <div>Total:{projectResourceMetrics?.totalCpu} Core</div>
                </Space>
            </Space>
        </Card>
        </Col>
        <Col span={4}  style={{ marginBottom: 12 }}>
        <Card title="项目生产环境内存占比(%)MBi" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }} bordered={false} >
            <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalMemory)}
                value={ (Number(projectResourceMetrics?.prod.sumMemory)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.prod.sumMemory)/Number(projectResourceMetrics?.totalMemory))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.prod.sumMemory} MBi</div>
                    <div>Total:{projectResourceMetrics?.totalMemory} MBi</div>
                </Space>
            </Space>
        </Card>
        </Col>
  
        <Col span={4}  style={{ marginBottom: 12 }}>
        <Card title="项目预生产环境CPU占比(%)" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
            bordered={false} >
           <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalCpu)}
                value={ (Number(projectResourceMetrics?.release.sumCpu)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.release.sumCpu)/Number(projectResourceMetrics?.totalCpu))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.release.sumCpu} Core</div>
                    <div>Total:{projectResourceMetrics?.totalCpu} Core</div>
                </Space>
            </Space>
        </Card>
        </Col>
        <Col span={4}  style={{ marginBottom: 12 }}>
        <Card title="项目预生产环境内存占比(%)MBi" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
            bordered={false} >
           <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalMemory)}
                value={ (Number(projectResourceMetrics?.release.sumMemory)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.release.sumMemory)/Number(projectResourceMetrics?.totalMemory))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.release.sumMemory} MBi</div>
                    <div>Total:{projectResourceMetrics?.totalMemory} MBi</div>
                </Space>
            </Space>
        </Card>
        </Col>
        </Row>
        <Row>
        <Col span={4}  >
        <Card title="项目开发环境CPU占比(%)" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
            bordered={false} >
             <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalCpu)}
                value={ (Number(projectResourceMetrics?.dev.sumCpu)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.dev.sumCpu)/Number(projectResourceMetrics?.totalCpu))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.dev.sumCpu} Core </div>
                    <div>Total:{projectResourceMetrics?.totalCpu} Core </div>
                </Space>
            </Space>
        </Card>
        </Col>
        
        <Col span={4}  style={{ marginBottom: 12 }}>
        <Card title="项目开发环境内存占比(%)MBi" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
            bordered={false} >
            <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalMemory)}
                value={ (Number(projectResourceMetrics?.dev.sumMemory)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.dev.sumMemory)/Number(projectResourceMetrics?.totalMemory))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.dev.sumMemory} MBi</div>
                    <div>Total:{projectResourceMetrics?.totalMemory} MBi</div>
                </Space>
            </Space>
        </Card>
        </Col>

        <Col span={4}>
        <Card title="项目测试环境CPU占比(%)" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
            bordered={false} >
            <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalCpu)}
                value={ (Number(projectResourceMetrics?.test.sumCpu)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.test.sumCpu)/Number(projectResourceMetrics?.totalCpu))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.test.sumCpu} Core </div>
                    <div>Total:{projectResourceMetrics?.totalCpu} Core </div>
                </Space>
            </Space>
        </Card>
        
        </Col>

        <Col span={4}  style={{ marginBottom: 12 }}>
        <Card title="项目测试环境内存占比(%)MBi" hoverable
            bodyStyle={{ textAlign: 'center',height:270,marginTop:0  }}
            bordered={false} >
             <Space direction="vertical">
                <Liquid height={130} width={130} min={0} max={Number(projectResourceMetrics?.totalMemory)}
                value={ (Number(projectResourceMetrics?.test.sumMemory)) } forceFit padding={[0, 0, 0, 0]}
                statistic={{
                    formatter: (value) => `${((Number(projectResourceMetrics?.test.sumMemory)/Number(projectResourceMetrics?.totalMemory))*100).toFixed(2)}%`,
                }} />
                <Space direction="vertical" >
                    <div>Usage:{projectResourceMetrics?.test.sumMemory} MBi</div>
                    <div>Total:{projectResourceMetrics?.totalMemory} MBi</div>
                </Space>
            </Space>
        </Card>
        </Col>
    </Row>
    </div>
    )
}


export default ProjectResource