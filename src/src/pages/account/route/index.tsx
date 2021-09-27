import { PageContainer } from '@ant-design/pro-layout';
import { ProColumns , ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Button, Form ,notification ,Drawer ,InputNumber } from 'antd';
import { ModalForm, ProFormText , proform } from '@ant-design/pro-form';
import ReactJson from 'react-json-view'

import { queryMenuList } from './service'
import { MenuListItem, TableListPagination } from './data'

const Route: React.FC = () => {
    const actionRef = useRef<ActionType>();
    // 树形展开
    const [ defaultExpanded , setDefaultExpanded ] = useState<string[]>([])
    var newExpandedKeys:string[] = []
    const expandKeysRender = (treeData : MenuListItem[]) => {
        treeData.map(item=>{
            if (item.routes) {
                if (item.id) {
                    newExpandedKeys.push(String(item.id))
                }
                expandKeysRender(item.routes)
            }
        })
        return newExpandedKeys
    }
    // 导出JSON 
    const [exportMenuJsonVisible, setExportMenuJsonVisible] = useState(false);
    const [exportMenuJsonObj, setExportMenuJsonObj] = useState<Object>({});
    //
        /** 新建窗口的弹窗 */
    const [ routeModalTitle, setRouteModalTitle ] = useState<string>("新建");
    const [ createModalVisible, handleModalVisible ] = useState<boolean>(false);
    const [ routeModalForm ] = Form.useForm();

    const menusColumns: ProColumns<MenuListItem>[] = [
        {
            width: 8,
            align: 'center',
            title: '',
            hideInSearch:true
        },
        {
            width: 35,
            title: 'ID',
            dataIndex: 'id',
        },
        {
            width: 220,
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '路径',
            dataIndex: 'path',
        },
        {
            width: 150,
            title: '图标',
            dataIndex: 'icon',
        },
        {
            width: 90,
            title: '排序',
            dataIndex: 'sort',
        },
        {
            title: '操作',
            width: 180,
            key: 'option',
            valueType: 'option',
            fixed: 'right',
            render: (_,entity) => [
                <a key="link" onClick={()=>{
                    const from:MenuListItem = {
                        id:undefined,
                        menuName:'',
                        path: entity.path,
                        parentText: entity.path,
                        icon:'',
                        sort: 0, 
                        isRoot: 0,
                        parentId: entity.id
                    }
                    routeModalForm.setFieldsValue(from)
                    handleModalVisible(true)

                }}>新建子菜单</a> , 
                <a key="link" onClick={()=>{

                }}>编辑</a> , 

                <a key="link" color="red" onClick={ async ()=>{
                    var ok = confirm("确定删除菜单吗?")
                    if (ok && entity) {
                        var res = { success: true , message:''}
                        if (res && res.success){
                            notification.success({
                                message: res.message , 
                                description: '请求成功'
                              })
                            actionRef.current?.reload()
                        }
                    }
                }} >删除</a>
            ],
        }
    ]


    return (
        <PageContainer>
           <ProTable<MenuListItem, TableListPagination> 
                    headerTitle="菜单管理"
                    actionRef={actionRef}
                    bordered={true}
                    indentSize={10}
                    expandedRowKeys={defaultExpanded}
                    defaultExpandAllRows={true}
                    rowKey={ item=> String(item.id) }
                    search={false}
                    childrenColumnName="routes"
                    columns={menusColumns}
                    onExpand={(status,record)=>{
                        console.log(record)
                        if(!status) {
                            const index = defaultExpanded.indexOf(''+ record.id,0)
                            if(index > -1) {
                                defaultExpanded.splice(index ,1)
                            }
                        } else {
                            defaultExpanded.push('' + record.id)
                        }
                        setDefaultExpanded(defaultExpanded)
                    }}
                    request={ async (params,sort) => { 
                        var treeData = await queryMenuList(params,sort)
                        const keys = expandKeysRender(treeData.data)
                        setDefaultExpanded(keys)
                        return treeData
                    }}
                    toolBarRender={() => [
                        <Button type="primary" key="primary" onClick={() => {
                            setRouteModalTitle("新建")
                            const from:MenuListItem = {
                                id:undefined,
                                menuName:'',
                                path:'',
                                icon:'',
                                sort: 0, 
                                isRoot: 1,
                                parentId: 0,
                                parentText: '',
                            }
                            routeModalForm.setFieldsValue(from)
                            handleModalVisible(true)

                        }}
                        > <PlusOutlined /> 新建 </Button>,
                        <Button  onClick={ async() => {
                            var treeData = await queryMenuList({ tenantId:0, pageIndex:0, pageSize:0, current:0},{})
                            //console.log( JSON.stringify(treeData.data))
                            setExportMenuJsonVisible(true)
                            setExportMenuJsonObj(treeData.data)
                        }} > 导出 </Button>,
                   ]}
                />
                <Drawer title="导出路由JSON" placement="right" width="800" destroyOnClose
                        onClose={ ()=> setExportMenuJsonVisible(false) } visible={exportMenuJsonVisible}>
                    <ReactJson src={exportMenuJsonObj} />
                </Drawer>

                <ModalForm<MenuListItem>
                    title={routeModalTitle}
                    form={routeModalForm}
                    autoComplete="off"
                    width={450}
                    visible={createModalVisible}
                    onVisibleChange={handleModalVisible}
                    onFinish={ async (fromData) =>{
                        console.log(fromData)
                    }}
                    onValuesChange={(changedValues, allValues)=>{
                        if(changedValues.menuCode) {
                            var pPath =""
                            if(allValues.parentId && allValues.parentId > 0){
                                pPath = allValues.parentText?allValues.parentText:''
                            }
                            allValues.path = pPath + '/' + changedValues.menuCode
                            routeModalForm.setFieldsValue(allValues)
                        }
                        
                    }}
                    >
                    <ProFormText width="md" name="id" label="ID"  readonly={true} hidden={true} />
                    <ProFormText width="md" name="isRoot"         readonly={true} hidden={true} />
                    <ProFormText width="md" name="parentId"       readonly={true} hidden={true} />
                    <ProFormText width="md" name="parentText"     readonly={true} hidden={true} />

                    <ProFormText width="md" name="menuName" label="路由名称" tooltip="英文名" placeholder="请输入路由名称" 
                                rules={[ {  required: true, message: '路由名称为必填项',  }, { max:20 , message:'超过最大输入长度 > 10'}  ]}  />

                    <ProFormText  width="md" name="menuCode" label="路由Code" tooltip="英文名" placeholder="请输入路由名称" 
                              rules={[ {  required: true, message: '路由Code为必填项',  }, { max:20 , message:'超过最大输入长度 > 10'}  ]}  />

                    <ProFormText  width="md" name="path" label="路径" tooltip="英文名" placeholder="请输入路径" 
                                rules={[ {  required: true, message: '路由路径为必填项',  }, { max:20 , message:'超过最大输入长度 > 10'}  ]}  />


                    <ProFormText  width="md" name="icon" label="图标" tooltip="英文名" placeholder="请输入图标名称" 
                                rules={[ { max:20 , message:'超过最大输入长度 > 10'}  ]}  />

                    <ProFormText  width="md" name="sort" label="排序" tooltip="英文名" placeholder="请输入排序值" 
                                />

                </ModalForm>
        </PageContainer>
    )

}

export default Route;