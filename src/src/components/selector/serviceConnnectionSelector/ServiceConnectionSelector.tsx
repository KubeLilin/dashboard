import { queryServiceConnectionSelector } from "@/pages/resources/serviceConnection/service"
import { ProFormSelect } from "@ant-design/pro-form"



export interface Props {
    sserviceType: number
}

const ServiceConnectionSelector: React.FC<Props> = (prop: Props) => {

    return (
        <ProFormSelect
            request={async (x) => {
                return await queryServiceConnectionSelector({ serviceType: prop.sserviceType })
            }
            }
        >
        </ProFormSelect>
    )
}

export default ServiceConnectionSelector