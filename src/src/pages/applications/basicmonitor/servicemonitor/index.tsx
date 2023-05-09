import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import { Area } from '@ant-design/plots';
import { Card, Col, Row,Drawer,Button, Modal ,notification,Space,DatePicker, Select, Checkbox,Spin,Tabs} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

import { getCustomMetrics } from '../service'

interface Props {
    title:string,
    clusterId:number,
    pql:string,
    startTime:any,
    endTime:any,
    refresh:number,
    valueConverter?:any,
}

const ServiceMonitor: React.FC<Props> = (props) => {
    const [serviceMonitorData, serviceMonitorDataHandler] = useState<any[]>([])

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

    useEffect(() => {
        if (props.clusterId) {
            getCustomMetrics({ clusterId:props.clusterId, pql:props.pql,startTime:props.startTime.unix(),endTime:props.endTime.unix() }).then((res:any)=>{
                var chartDataset:any[] = []
                const dataList = JSON.parse(res.data)
                chartDataset = processDataFunc(dataList,'instance',props.valueConverter)
                serviceMonitorDataHandler(chartDataset)
            })
        }

    }, [props.startTime,props.endTime,props.refresh])



    return (
        <Card title={props.title} bordered={true}>
            <Area {...{ data:serviceMonitorData, xField: 'time', yField: 'value', seriesField: 'metric', }} />
        </Card>
    )
}


export default ServiceMonitor