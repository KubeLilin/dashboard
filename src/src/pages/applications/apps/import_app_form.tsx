import React, { useState, useRef } from 'react';
import { ApplicationModel } from './apps_data';
import ProForm, { DrawerForm, ProFormSelect, ProFormTextArea, ProFormText, ProFormGroup } from '@ant-design/pro-form';
import { Input, Button, Form, Checkbox, Radio, Select,Modal, message,Divider,Table, Space,Avatar,Spin } from 'antd';
import { ClearOutlined,SearchOutlined,GithubOutlined, GitlabOutlined, GoogleOutlined, GooglePlusOutlined, PlusOutlined, SettingFilled,ExclamationCircleOutlined, ContactsOutlined } from '@ant-design/icons';
import ProCard,{CheckCard} from '@ant-design/pro-card';
import EditableProTable,{ProColumns} from '@ant-design/pro-table';
import { getAppLanguage, getAppLevel, createApp, updateApp,
    GetGitBranches,SearchDockerfile,BindCluster,BindNameSpace,ImportApp } from './apps_service';
import { queryRepoConnections } from '@/pages/resources/serviceConnection/service';
import { GetAppGitBranches } from '../info/deployment.service';

export type ImportAppFormProps = {
    projectId : number;
    onFinish: Function;
    visbleAble: [boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    form: any;
};

const ImportAppForm: React.FC<ImportAppFormProps> = (props) => {
    const [repoOptions, repoOptionsHandler] = useState<any>([{label:'公开',value:0}])
    const [repoBranches, repoBranchesHandler] = useState<{label:string,value:string}[]>()

    const [appName, appNamehandler] = useState<string>("")
    const [deployDockerfileDataSource, deployDockerfileDataSourceHandler] = useState<[]>()
    const [ selectedMenuIds,setSelectedMenuIds ] = useState<number[]>([])

    const [namespace, namespcaeHandler] = useState<any>();
    const [loading, setLoading] = useState(false)
    const key = 'loading'


    function bindRepo(repoType: string,selectedRecord:any) {
        let res = queryRepoConnections(repoType)
        res.then(x => {    
            console.log(x)
            repoOptionsHandler(x)
            props.form.setFieldsValue({ sources:x.value })
            if (selectedRecord){
                props.form.setFieldsValue({ sources:selectedRecord.sources }) 
            }           
        })
    }
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>()
    const columns: ProColumns[] = [
        {
            title: '部署名称',
            dataIndex: 'deployName',
        },
        {
            title: 'Dockerfile路径',
            dataIndex: 'dockerfile',
        }
    ]

    return (<div>
        <DrawerForm<ApplicationModel>
            form={props.form}
            title="从代码库中检索Dockerfile并生成部署以及流水线"
            visible={props.visbleAble[0]}
            onVisibleChange={ (vis) =>{
                if(vis){
                    const record = props.form.getFieldsValue()
                    bindRepo(record.sourceType,record)
                }
                props.visbleAble[1](vis)
            } }
            onFinish={async (formData) => {
                setLoading(true)
                message.open({ key, type: 'loading', content: '正在导入应用,请稍等 .......', duration: 2,style: {  marginTop: '30vh' } })
 
                formData.projectId = props.projectId
                formData.deployList =  deployDockerfileDataSource?.filter((item:any)=>{return selectedMenuIds.includes(item.id)})
                console.log(formData)
                if(formData.deployList.length > 0){
                //submit
                    let res = await ImportApp(formData)
                    if (res && res.success) {
                        setTimeout(() => {
                            message.open({ key, type: 'success', content: '应用导入成功!', duration: 2,style: {  marginTop: '30vh' } })
                        }, 1000);
                        return true
                    } else {
                        message.error("应用导入失败")
                        return false
                    }
                } else {
                    message.error("请选择部署的Dockefile")
                }

                setTimeout(() => {
                    setLoading(false)
                }, 500)

                if (props.onFinish) {
                    props.onFinish();
                }

            }} >
        <Spin spinning={loading} tip="正在导入应用,请稍等 ......." size="large">
        <ProForm.Item name="name" label="应用名称" rules={[{ required: true, message: '请输入应用名' }]} >
            <Input placeholder="请输入应用名称(仅限英文)" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z]/g, ''); appNamehandler(e.currentTarget.value) }}  />
        </ProForm.Item>
        <ProForm.Item name="sourceType" label="选择代码源类型" rules={[{ required: true, message: '请选择代码源类型' }]} >
            {/* <Radio.Group onChange={(x) => { bindRepo(x.target.value,null) }}>
                <Radio value="github"><GithubOutlined style={{ fontSize: '25px' }} />Github</Radio>
                <Radio value="gitee"><GooglePlusOutlined style={{ fontSize: '25px' }} />Gitee</Radio>
                <Radio value="gitlab"><GitlabOutlined style={{ fontSize: '25px' }} />Gitlab</Radio>
            </Radio.Group> */}
            <CheckCard.Group size='small'  defaultValue="" 
                onChange={(value) => {
                    bindRepo(value,null)
                }} >
                <CheckCard title="Gitlab" avatar={ <Avatar src={<GitlabOutlined style={{ fontSize: '35px' }}/> }  size='large'/> } value="gitlab" style={{ background:'#000f' }} />
                <CheckCard title="Github" avatar={ <Avatar src={<GithubOutlined style={{ fontSize: '35px' }}/> }  size='large'/> } value="github"   style={{ background:'#000f' }}/>
                <CheckCard title="Gitee" avatar={ <Avatar src={<GooglePlusOutlined style={{ fontSize: '35px' }}/> }  size='large'/> } value="gitee" style={{ background:'#000f' }}/>
            </CheckCard.Group>
        </ProForm.Item>
        <ProForm.Item name="sources" label="代码源" initialValue={0} rules={[{ required: true, message: '请选择代码源' }]}>
            <Select options={repoOptions} ></Select>
        </ProForm.Item>
        <ProFormText name="git" label="git地址" rules={[{ required: true, message: '请输入git地址' }]} 
            fieldProps={{ onBlur:async()=>{
                props.form.validateFields(['git','sourceType','sources'])
                const record = props.form.getFieldsValue()
                if (record.sources && record.git && record.sourceType){
                    const res = await GetGitBranches(record.sources,record.git,record.sourceType)
                    if (res.success){
                        const data = res.data.branches.map((item:string)=>{return {label:item,value:item}})
                        repoBranchesHandler(data)
                        if (data.length > 0 ){
                            props.form.setFieldsValue({ ref:data[0].value })
                        }
                    }
                } else {
                    message.error("请先选择代码类型和代码源,失去焦点后会自动拉取分支")
                }
            }}}>
        </ProFormText>
     
            <ProForm.Item name="ref" label="代码分支"  rules={[{ required: true, message: '请选择代码分支' }]}>
                <ProFormSelect options={repoBranches} allowClear width='md' ></ProFormSelect>
            </ProForm.Item>
            {/* <Button type='primary' onClick={async()=>{
                //importAppForm.validateFields(['git','sourceType','sources'])
              
                
            }}>拉取分支</Button> */}
       
        <ProForm.Item name='level' label="应用等级" initialValue={5} hidden >
            <ProFormSelect initialValue={5} hidden ></ProFormSelect>
        </ProForm.Item>
        <ProForm.Item name='language' label="开发语言" initialValue={5} hidden  >
            <ProFormSelect initialValue={5} hidden width='md'></ProFormSelect>
        </ProForm.Item>
      

        <ProCard title="部署目标(必填)" bordered headerBordered   >
            <Space>
            <ProForm.Item label="集群"  name='clusterId'  rules={[{ required: true, message: '请选择集群' }]} >
                <ProFormSelect allowClear request={BindCluster} width='md'
                    fieldProps={{ onChange:(cid)=>{       
                        BindNameSpace(cid).then((ns)=>{
                            namespcaeHandler(ns)
                        })
                    } }}></ProFormSelect>
            </ProForm.Item>
            <ProForm.Item label="命名空间" name='namespaceId' rules={[{ required: true, message: '请选择命名空间' }]} >
                <ProFormSelect allowClear options={namespace} width='md'></ProFormSelect>
            </ProForm.Item>
            </Space>
            <ProForm.Item >
            <Space>
                <Button type='primary' icon={<SearchOutlined/>} onClick={async()=>{
                        const validate = props.form.validateFields(['name','git','sourceType','sources']).then((x)=>{console.log(x)})
                        console.log(validate)
                        const record = props.form.getFieldsValue()
                        console.log(record)
                        if(record.name && record.sources && record.sourceType && record.git && record.ref) {
                            const res = await SearchDockerfile(record.sources,record.sourceType,record.git,record.ref)
                            const list = res.data.map((item ,idx )=> ({ id:idx, deployName:appName+'-',dockerfile: item }) )
                            setEditableRowKeys( list.map((item) => item.id))
                            deployDockerfileDataSourceHandler(list)
                        } else {
                            message.error('请填写完整信息')
                        }
                    }}>检索 Dockerfile</Button>
                <Button type='primary' icon={<ClearOutlined/>} onClick={async()=>{
                        deployDockerfileDataSourceHandler([])
                }}>清空</Button>
            </Space>  
            </ProForm.Item>
            <Divider/>
            <ProForm.Item >
                <span style={{color:'red'}}>重要提示: 构建目录为git根目录,请编写Dockerfile时考虑此种情况！</span>
            <EditableProTable search={false} toolBarRender={false}  pagination={false}
                columns={columns}  rowKey="id"  dataSource={deployDockerfileDataSource}  onChange={deployDockerfileDataSourceHandler} 
                editable={{
                    type: 'multiple',
                    editableKeys,
                    actionRender: (row, config, defaultDoms) => {
                      return [defaultDoms.delete];
                    },
                    onValuesChange: (record, recordList) => {
                        deployDockerfileDataSourceHandler(recordList);
                    },
                  }}
                  rowSelection={{
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    checkStrictly: true,
                    selectedRowKeys: selectedMenuIds,
                    onChange: async (keys,selectedRows) => {
                        var d:number[] = []
                        keys.forEach((k)=>{
                            d.push(Number(k))
                        })
                        setSelectedMenuIds(d)                        
                    }
                }}
                >

            </EditableProTable>
          </ProForm.Item>
        </ProCard>
        </Spin>
    </DrawerForm>
    </div>)
}

export default ImportAppForm