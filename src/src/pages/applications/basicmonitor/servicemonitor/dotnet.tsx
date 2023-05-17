import React from 'react';
import { Card, Col, Row,Drawer,Button, Modal ,notification,Space,DatePicker, Select, Checkbox,Spin,Tabs} from 'antd'
import { ServiceMonitorProps } from '../service' 
import ServiceMonitor from './servicemonitor'




const DotNETServiceMonitor: React.FC<ServiceMonitorProps> = (props) => {

    return (
        <div>        
        <Row gutter={16} style={{marginTop:18}}>
        <Col span={8}>
          <ServiceMonitor title='CPU Usage ( % )'
            clusterId={props.clusterId} 
            pql={`sum(rate(process_cpu_seconds_total{ namespace="${props.namespace}", service="${props.serviceName}"  }[3m])) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='GC Time rate ( bp/s )'
            clusterId={props.clusterId} 
            pql={`sum(increase(dotnet_collection_count_total{ namespace="${props.namespace}", service="${props.serviceName}" }[30s])) by (generation,instance)`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Threads Count'
            clusterId={props.clusterId} 
            pql={`sum(process_num_threads{ namespace="${props.namespace}", service="${props.serviceName}"  }) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            refresh={props.refresh}
            />
        </Col>
      </Row>


      <Row gutter={16} style={{marginTop:18}}>
     
        <Col span={8}>
          <ServiceMonitor title='Memory Working Set ( MB )'
            clusterId={props.clusterId} 
            pql={`sum(process_working_set_bytes{  namespace="${props.namespace}", service="${props.serviceName}"  }) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='Memory Private ( MB )'
                clusterId={props.clusterId} 
                pql={`sum(process_private_memory_bytes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
                startTime={props.startTime} endTime={props.endTime}
                refresh={props.refresh}
                valueConverter={(value:number)=>{return value/1024/1024}}
            />
        </Col>
        <Col span={8}>
          <ServiceMonitor title='.NET Objects ( MB)'
            clusterId={props.clusterId} 
            pql={`sum(dotnet_total_memory_bytes{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
            startTime={props.startTime} endTime={props.endTime}
            valueConverter={(value:number)=>{return value/1024/1024}}
            refresh={props.refresh}
            />
        </Col>
     
      </Row>


      <Row gutter={16} style={{marginTop:18}}>
    
       <Col span={8}>
          <ServiceMonitor title='CLR Open Handles Count'
                clusterId={props.clusterId} 
                pql={`sum(process_open_handles{namespace="${props.namespace}", service="${props.serviceName}"}) by (instance)`}
                startTime={props.startTime} endTime={props.endTime}
                refresh={props.refresh}
            />
        </Col>
    
      </Row>
      </div>
    )
}

export default DotNETServiceMonitor