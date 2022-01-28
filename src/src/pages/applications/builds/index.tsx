import React, { SetStateAction, useState, Dispatch, useEffect, useRef, } from 'react';
import {List,Card ,Tooltip,Button,Space,Empty } from 'antd'
import { SettingOutlined,EditOutlined ,CloseCircleTwoTone
    ,EllipsisOutlined,PlayCircleFilled,PlusOutlined ,CheckCircleTwoTone} from '@ant-design/icons'

interface Props{
    // visibleFunc: [boolean, Dispatch<SetStateAction<boolean>>],
    // deploymentId:number,
    // tableRef:any,
    // deployImage?:string,
}

type AppState = {
    buildList: BuildItem[]
}


type BuildItem = {
    title: string
    lastBuildRecords?: {
        success:boolean
        action: string
        time: string
        task: string
    }
}


class AppBuildList extends React.Component<Props,AppState> {

    state: AppState = {
        buildList: []
    }

    componentDidMount(){
        
    }
    render() {
        const { buildList } = this.state;

        return ( 
            <div>
                <div  style={{ marginLeft: 56,}}> 
                <Button type="primary" size="large" icon={<PlusOutlined />} 
                    onClick={()=>{
                        buildList.push({title:'dev-nginx-cls-hbktlqm5', lastBuildRecords:undefined    })
                        buildList.push({title:'test-nginx-cls-hbktlqm5', lastBuildRecords:{ success:true, action:'管理员: 手动触发', time:'30分钟', task:'#22' }   })
                        buildList.push({title:'prod-nginx-cls-hbktlqm5', lastBuildRecords:{ success:false, action:'管理员: 手动触发', time:'21分钟', task:'#21' }  })

                        this.setState({
                            buildList: buildList
                        })
                    }} 
                >添加构建</Button>
                </div>
                <div style={{ marginLeft: 55,marginTop: 10,marginRight: 55 ,   background: "#ececec" ,padding: 30} }>
                    <List dataSource={buildList} grid={{ gutter: 0, xs:1, sm:2 , md:2,lg:3,xl:3,xxl:6 }}
                        renderItem={item => (
                            <List.Item>
                            <Card hoverable bordered style={{ width: 300 }} 
                                    title={item.title} 
                                    actions={[ 
                                    <Tooltip title="开始构建"> <PlayCircleFilled key="building" style={{ fontSize:23}} twoToneColor="#52c41a" /></Tooltip>,
                                    <Tooltip title="设置"><SettingOutlined key="setting" style={{ fontSize:23}} /></Tooltip>,
                                    <Tooltip title="more"><EllipsisOutlined key="ellipsis" style={{ fontSize:23}} /></Tooltip>,
                                ]}> 
                                
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  style={{ display: !item.lastBuildRecords?'block':'none' }}>
                                {/* <a href=''>立即构建  </a> */}
                                </Empty>

                                <Space direction='vertical' size={4} style={{ height:134, display: item.lastBuildRecords?'block':'none' }}>
                                    <div style={{ display: item.lastBuildRecords?.success?'block':'none' }}>
                                        <CheckCircleTwoTone style={{ fontSize:20}} twoToneColor="#52c41a" />
                                        <span style={{marginLeft: 8,fontSize:16 , color:"green"}}>构建成功</span>
                                    </div>
                                    <div style={{ display: !(item.lastBuildRecords?.success)?'block':'none' }}>
                                        <CloseCircleTwoTone style={{ fontSize:20}} twoToneColor="red" /> 
                                        <span style={{marginLeft: 8,fontSize:16 , color:"red"}}>构建失败</span>
                                    </div>
                                    <span>管理员: 手动触发 </span>
                                    <span>耗时: 30分钟 </span>
                                    <span>任务: <a href=''> #22 </a> </span>
                                </Space>
                             
                            </Card>
                            </List.Item>
                        )}
                    />
                </div>
            </div>)
    }

}


// const AppBuildList: React.FC<Props> = (props:Props) => {


    
//     return 
// }




export default AppBuildList