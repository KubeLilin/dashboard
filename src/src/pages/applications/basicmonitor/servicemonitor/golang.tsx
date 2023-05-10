import React from 'react';
import { Card, Col, Row,Drawer,Button, Modal ,notification,Space,DatePicker, Select, Checkbox,Spin,Tabs} from 'antd'
import { ServiceMonitorProps } from '../service' 
import ServiceMonitor from './servicemonitor'


const GolangServiceMonitor: React.FC<ServiceMonitorProps> = (props) => {

    return (
        <div>        
        <Row gutter={16} style={{marginTop:18}}>
        <Col span={8}>
          <ServiceMonitor title='GC Duration Quantile (ms)'
            clusterId={props.clusterId} 
            pql={`sum(go_gc_duration_seconds{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Goroutines ( number )'
            clusterId={props.clusterId} 
            pql={`go_goroutines{namespace="${props.namespace}", service="${props.serviceName}"}`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Memory in Heap ( MB )'
                clusterId={props.clusterId} 
                pql={`go_memstats_heap_alloc_bytes{ namespace="${props.namespace}", service="${props.serviceName}"}`}
                startTime={props.startTime} endTime={props.endTime}
                refresh={props.refresh}
                valueConverter={(value:number)=>{return value/1024/1024}}
            />
        </Col>
      </Row>


      <Row gutter={16} style={{marginTop:18}}>
        <Col span={8}>
          <ServiceMonitor title='Memory in Stack ( MB )'
            clusterId={props.clusterId} 
            pql={`sum(go_memstats_stack_inuse_bytes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Number of Live Objects ( K )'
            clusterId={props.clusterId} 
            pql={`go_memstats_mallocs_total{namespace="${props.namespace}", service="${props.serviceName}"} - go_memstats_frees_total{namespace="${props.namespace}", service="${props.serviceName}"}`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Total Used Memory ( MB )'
                clusterId={props.clusterId} 
                pql={`go_memstats_sys_bytes{ namespace="${props.namespace}", service="${props.serviceName}"}`}
                startTime={props.startTime} endTime={props.endTime}
                refresh={props.refresh}
                valueConverter={(value:number)=>{return value/1024/1024}}
            />
        </Col>
      </Row>


      <Row gutter={16} style={{marginTop:18}}>
        <Col span={8}>
          <ServiceMonitor title='Rates of Allocation ( KB/s )'
            clusterId={props.clusterId} 
            pql={`rate(go_memstats_alloc_bytes_total{ namespace="${props.namespace}", service="${props.serviceName}"}[1m])`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Number of Live Objects (单位 K)'
            clusterId={props.clusterId} 
            pql={`rate(go_memstats_mallocs_total{ namespace="${props.namespace}", service="${props.serviceName}"}[1m])`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
     
      </Row>
      </div>
    )
}

export default GolangServiceMonitor