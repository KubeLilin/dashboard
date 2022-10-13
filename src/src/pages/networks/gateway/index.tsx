import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Link } from 'umi';
import { getAllGateway,getClusterList } from './service'


const Gateway: React.FC = () => {

    const columns: ProColumns<any>[] = [
        {
            dataIndex: 'id',
            width: 48,
            hideInSearch:true,
        },
        {
            dataIndex: 'name',
            title: '网关名称',
            hideInSearch:true,
            render: (dom, row) => {
                return <Link key={'linkgateway' + row.id} style={{ color: 'blue', textDecorationLine: 'underline' }} to={'/networks/gateway/teams?id=' + row.id + '&name=' + row.name + `&clusterId=${row.clusterId}`}>{dom}</Link>
            }
        },
        {
            dataIndex:'exportIp',
            title:'集群IP',
            hideInSearch:true,
        },
        {
            dataIndex:'vip',
            title:'内网vip',
            hideInSearch:true,
        },
        {
            dataIndex:'desc',
            title:'描述',
            hideInSearch:true,
        },
        {
            dataIndex: 'adminUri',
            title: '集群',
            valueType:'select',
            request: getClusterList
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a key="link_edit" disabled >编辑</a>,
                <a key="link_del" disabled>删除</a>
            ]
        }

    ]
    


    return (
        <PageContainer>
            <ProTable rowKey={"id"} columns={columns} request={ getAllGateway } ></ProTable>
        </PageContainer>
    )
}
export default Gateway