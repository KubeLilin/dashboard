
import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Card, Col, Row,Drawer,Button, Modal ,notification,Space,DatePicker, Select, Checkbox} from 'antd';
import { CloseCircleTwoTone, ExclamationCircleOutlined, SmileOutlined, UndoOutlined,SyncOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import dayjs from 'dayjs';
import moment from 'moment';
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
dayjs.extend(weekday)
dayjs.extend(localeData)

import { getPodCPUUsage,getPodMemoryUsage,getPodMemoryRss,
  getPodNetworkReceiveBytes,getPodNetworkTransmitBytes,getPodMemorySwap } from './service'

const { RangePicker } = DatePicker;

interface Props {
    AppId: number,
    deployList: any[],
}

const BasicMonitor: React.FC<Props> = (props) => {

  const deploymentList = props.deployList.filter((item)=>item.running > 0)

  const [selectedDataRange, selectedDataRangeHandler] = useState<any>([dayjs().add(-15, 'minute'), dayjs()])
  const [selectedDeployment, selectedDeploymentHandler] = useState<any>(deploymentList?.[0] )

  const [autoLoad, setAutoLoad] = useState<boolean>(false)

  const [podCPUUsageData, setPodCPUUsage] = useState<any[]>([])
  const [podMemoryUsageData, setPodMemoryUsage] = useState<any[]>([])
  const [podMemoryRssData, setPodMemoryRss] = useState<any[]>([])
  const [podMemorySwapData, setPodMemorySwap] = useState<any[]>([])
  const [podNetworkReceiveBytesData, setPodNetworkReceiveBytes] = useState<any[]>([])
  const [podNetworkTransmitBytesData, setPodNetworkTransmitBytes] = useState<any[]>([])

  console.log(deploymentList)

  var dataTimeRange = [
    [dayjs().add(-15, 'minute'), dayjs()]  ,
    [dayjs().add(-1, 'hour'), dayjs()]  ,
    [dayjs().add(-3, 'hour'), dayjs()] ,
    [dayjs().add(-6, 'hour'), dayjs()] ,

    [dayjs().add(-1, 'd'), dayjs()] ,
    [dayjs().add(-7, 'd'), dayjs()] ,
    [dayjs().add(-30, 'd'), dayjs()] ,
    [dayjs().add(-90, 'd'), dayjs()] ,
  ]



  const processDataFunc = (dataList:[],label:string,valueConverter:any):any[] => {
    var chartDataset:any[] = []
    dataList.forEach((item:any)=>{
      item.values.forEach((values:any)=>{
        var chartDataItem = { metric: item.metric[label], time:  moment.unix(values[0]).format("YYYY/MM/DD HH:mm"), value: valueConverter?valueConverter(Number(values[1])):Number(values[1])  }
        chartDataset.push(chartDataItem)
      })
    })
    return chartDataset
  }
  const loadDataset =(metricsRequest:any)=>{
    getPodCPUUsage(metricsRequest).then((res)=>{
      if (res && res.success){
        const dataList = JSON.parse(res.data)
        setPodCPUUsage(processDataFunc(dataList,'pod',null))
      }
    })
    getPodMemoryUsage(metricsRequest).then((res)=>{ 
      if (res && res.success){
        const dataList = JSON.parse(res.data)
        setPodMemoryUsage(processDataFunc(dataList,'pod',(value:number)=>value/1024/1024))
      }
    })
    getPodMemoryRss(metricsRequest).then((res)=>{
      if (res && res.success){
        const dataList = JSON.parse(res.data)
        setPodMemoryRss(processDataFunc(dataList,'pod',(value:number)=>value/1024/1024))
      }
    })
    getPodMemorySwap(metricsRequest).then((res)=>{
      if (res && res.success){
        const dataList = JSON.parse(res.data)
        setPodMemorySwap(processDataFunc(dataList,'pod',(value:number)=>value/1024/1024))
      }
    })
    getPodNetworkReceiveBytes(metricsRequest).then((res)=>{
      if (res && res.success){
        const dataList = JSON.parse(res.data)
        setPodNetworkReceiveBytes(processDataFunc(dataList,'pod',(value:number)=>value/1024))
      }
    })
    getPodNetworkTransmitBytes(metricsRequest).then((res)=>{
      if (res && res.success){
        const dataList = JSON.parse(res.data)
        setPodNetworkTransmitBytes(processDataFunc(dataList,'pod',(value:number)=>value/1024))
      }
    })
  }

  useEffect(() => {
      if (selectedDeployment){
            var metricsRequest = {
              clusterId: selectedDeployment.clusterId,
              namespace: selectedDeployment.namespace,
              workload: selectedDeployment.name,
              startTime: selectedDataRange[0].unix(),
              endTime: selectedDataRange[1].unix(),
            }
            loadDataset(metricsRequest)

            var id: NodeJS.Timeout
            if (autoLoad) {
                id = setInterval(()=>{
                  loadDataset(metricsRequest)
                }, 10000)
            }
            return () => { clearInterval(id) }
        }
        return 
    }, [selectedDeployment, selectedDataRange,autoLoad ]);

    return (
    <div> 
      <Space style={{margin:25}}>
        部署环境:
        <Select style={{width:350}} defaultValue={0} options={ deploymentList.map((item,idx)=> ({ label: item.name, value: idx }))  }
          onChange={(v)=>{
            selectedDeploymentHandler(deploymentList[v])
          }}
        />

        时间筛选:
        <Select style={{width:300}} defaultValue={0}  options={[
          { label: '最近15分钟', value:  0 },
          { label: '最近一小时', value: 1 },
          { label: '最近三小时', value: 2 },
          { label: '最近六小时', value: 3 },
          { label: '最近一天', value:  4 },
          { label: '最近一周', value:  5 },
          { label: '最近一个月', value: 6 },
          { label: '最近三个月', value: 7 },
        ]} 
        onChange={(v)=>{
            console.log(v)
            console.log( dayjs().add(v, 'd'))
            selectedDataRangeHandler(dataTimeRange[v])

            const st = Number(dataTimeRange[v]?.[0]?.unix())
            console.log(st)

            const sts = moment.unix(st).format('YYYY/MM/DD HH:mm:ss')
            console.log(sts)      
          }} /> 

        <RangePicker showTime format="YYYY/MM/DD HH:mm:ss"
          value={selectedDataRange}
          onChange={(datas,dataString)=>{
            selectedDataRangeHandler(datas)
            const st = Number(datas?.[0]?.unix())
            console.log(st)

            const sts = moment.unix(st).format('YYYY/MM/DD HH:mm:ss')
            console.log(sts)
          }} />
          <Checkbox onChange={(e)=>{
             setAutoLoad(e.target.checked)
          }}>自动刷新(10)s</Checkbox>
          <Button icon={<SyncOutlined   /> } type='ghost' 
            onClick={()=>{
              var metricsRequest = {
                clusterId: selectedDeployment.clusterId,
                namespace: selectedDeployment.namespace,
                workload: selectedDeployment.name,
                startTime: selectedDataRange[0].unix(),
                endTime: dayjs().unix(),
              }
              loadDataset(metricsRequest)
            }}></Button>
      </Space>

      <Row gutter={16}>
      <Col span={8}>
        <Card title="Pod CPU利用率 (单位 %)" bordered={true} >
          <Area {...{ data:podCPUUsageData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Pod内存使用率 (单位 Mi)" bordered={true}>
          <Area {...{ data:podMemoryUsageData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
        </Card>
      </Col>
      <Col span={8}>
      <Card title="Pod内存RSS使用率 (单位 Mi)" bordered={true}>
          <Area {...{ data:podMemoryRssData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
      </Card>
      </Col>

    </Row>

    <Row gutter={16} style={{marginTop:18}}>
    <Col span={8}>
      <Card title="Pod内存Swap使用率 (单位 Mi)" bordered={true}>
          <Area {...{ data:podMemorySwapData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
      </Card>
      </Col>
      <Col span={8}>
      <Card title="Pod网络接收字节速率 (单位 KB/s)" bordered={true}>
          <Area {...{ data:podNetworkReceiveBytesData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
      </Card>
      </Col>
      <Col span={8}>
      <Card title="Pod网络发送字节速率 (单位 KB/s)" bordered={true}>
          <Area {...{ data:podNetworkTransmitBytesData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
      </Card>
      </Col>
    </Row>
    </div>
    )
}


export default BasicMonitor