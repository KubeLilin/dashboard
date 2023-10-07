import React from 'react';
import { Card, Col, Row,Drawer,Button, Modal ,notification,Space,DatePicker, Select, Checkbox,Spin,Tabs} from 'antd'
import { ServiceMonitorProps } from '../service' 
import ServiceMonitor from './servicemonitor'




const JavaServiceMonitor: React.FC<ServiceMonitorProps> = (props) => {

    return (
        <div>        
        <Row gutter={16} style={{marginTop:18}}>
        <Col span={8}>
          <ServiceMonitor title='JVM Memory Used ( MB )'
            clusterId={props.clusterId} 
            pql={`sum(jvm_memory_used_bytes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='JVM Memory Committed ( MB )'
            clusterId={props.clusterId} 
            pql={`sum(jvm_memory_committed_bytes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='JVM Memory Max ( GB )'
            clusterId={props.clusterId} 
            pql={`sum(jvm_memory_max_bytes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
      </Row>


      <Row gutter={16} style={{marginTop:18}}>
     
        <Col span={8}>
          <ServiceMonitor title='GC Count Increase (times)'
            clusterId={props.clusterId} 
            pql={`sum(increase(jvm_gc_pause_seconds_count{namespace="${props.namespace}", service="${props.serviceName}"}[5m])) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='GC Time Increase ( ms )'
                clusterId={props.clusterId} 
                pql={`sum(increase(jvm_gc_pause_seconds_sum{namespace="${props.namespace}", service="${props.serviceName}"}[5m])) by (instance)`}
                startTime={props.startTime} endTime={props.endTime}
                refresh={props.refresh}
                valueConverter={(value:number)=>{return value*1000}}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='JVM Threads Count'
            clusterId={props.clusterId} 
            pql={`sum(jvm_threads_live_threads{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
     
      </Row>


      <Row gutter={16} style={{marginTop:18}}>
    
       <Col span={8}>
          <ServiceMonitor title='Classes Loaded Count'
                clusterId={props.clusterId} 
                pql={`sum(jvm_classes_loaded_classes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
                startTime={props.startTime} endTime={props.endTime}
                refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Class loaded Increase'
            clusterId={props.clusterId} 
            pql={`sum(increase(jvm_classes_loaded_classes{namespace="${props.namespace}", service="${props.serviceName}"}[5m])) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='JVM Threads Count Increase'
            clusterId={props.clusterId} 
            pql={`sum(increase(jvm_threads_live_threads{ namespace="${props.namespace}", service="${props.serviceName}"}[1m])) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
    
     
       
      </Row>
      </div>
    )
}

export default JavaServiceMonitor