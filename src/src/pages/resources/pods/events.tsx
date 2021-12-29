import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Tooltip,Typography } from 'antd'
import { EventsList,EventListProps } from './data'
const { Text } = Typography;
import { getEventList } from './service'


const EventListComponent: React.FC<EventListProps> = (props: EventListProps) => {

    return (
      <div>
          <ProTable<EventsList>
            headerTitle="事件列表"
            rowKey="id" search={false} pagination={false}
            columns={[
              { title: '首次时间', dataIndex: 'firstTime', key: 'firstTime' },
              { title: '最后时间', dataIndex: 'lastTime', key: 'lastTime' },
              { title: '事件名称', dataIndex: 'name', key: 'name' },
              { title: '级别', dataIndex: 'level', key: 'level' },
              { title: '资源', dataIndex: 'kind', key: 'kind' },
              { title: '原因', dataIndex: 'reason', key: 'reason' },
              { 
                title: '详细描述', dataIndex: 'infomation', key: 'infomation' ,
                render:(_,row) =>{
                    return [
                           <Tooltip title={row.infomation} color="geekblue" key="status">
                               <Text ellipsis >{row.infomation}</Text>
                            </Tooltip>
                    ]
                }
              },
              
            ]}

            request={async (params,sort) => {
                return await getEventList( {clusterId: props.clusterId , 
                    namespace: props.namespace , deployment: props.deployment }  )
            }}
          />
      </div>)
}





export default EventListComponent