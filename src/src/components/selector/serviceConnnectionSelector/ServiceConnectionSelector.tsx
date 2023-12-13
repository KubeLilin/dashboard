import { queryServiceConnectionSelector } from "@/pages/resources/serviceConnection/service"
import { ProFormSelect } from "@ant-design/pro-form"



export interface Props {
    serviceType: number
}

const ServiceConnectionSelector: React.FC<Props> = (prop: Props) => {

    return (
        <ProFormSelect label="连接器" name='serviceConnectionId'
            request={async (x) => {
                return await queryServiceConnectionSelector({ serviceType: prop.serviceType })
            }
            }
        >
        </ProFormSelect>
    )
}

export default ServiceConnectionSelector