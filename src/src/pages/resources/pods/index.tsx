
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { history,Link } from 'umi';
import { PodItem } from './data';
import { Typography, Button , Space ,Tooltip} from 'antd'
import { getPodList }  from './service'




const podColumns: ProColumns<PodItem>[] = [
]



const Pods: React.FC = (props) => {

    var clusterId = history.location.query?.cid
    var node = history.location.query?.node

    if (clusterId == undefined || node == undefined) {
        history.goBack()
    }

    console.log(clusterId)
    console.log(node)

    return(
        <PageContainer title="Pod 管理">
            <ProTable<PodItem>
                rowKey={record=>record.name}
                columns={podColumns}
                headerTitle='Pod 列表'
                search={false}
                request={async (params,sort) => {
                    params.cid = clusterId
                    params.node = node
                    var nodesData = await getPodList(params,sort)
                    return nodesData
                 }}
                 toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => {
                        history.goBack()
                    }}
                    >  返回集群列表 </Button>,
               ]}
            />
        </PageContainer>)

}

export default Pods