import React, { useState, useRef } from 'react';
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { TenatDeliverablesItem } from "./project_data";
import { createProject, queryProject } from './project_service';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ProFormInstance, ProFormItem, ProFormText } from '@ant-design/pro-form';
import ServiceConnectionSelector from '@/components/selector/serviceConnnectionSelector/ServiceConnectionSelector';
import e from 'express';



const DeliverablesProject: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [drawerVisit, setDrawerVisit] = useState(false);
    const [appName, appNamehandler] = useState<string>("");
    const formRef = useRef<ProFormInstance>();

    const columns: ProColumns<TenatDeliverablesItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true
        },
    ]



    return (
        <PageContainer>
            <ProTable<TenatDeliverablesItem>
                columns={columns}
                request={queryProject}
                actionRef={actionRef}
                toolBarRender={
                    () => [
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setDrawerVisit(true)
                            }}
                            type="primary"
                        >
                            新建
                        </Button>
                    ]
                }
            ></ProTable>
            <DrawerForm
                title="新建表单"
                visible={drawerVisit}
                onVisibleChange={setDrawerVisit}
                onFinish={async (x) => {
                    let res= await createProject(x)
                    if(res.success){
                        setDrawerVisit(false)
                        formRef.current?.setFieldsValue({})
                        return res.success
                    }else{
                        setDrawerVisit(false)
                        formRef.current?.setFieldsValue({})
                        return res.success
                    }
                }
                }

                formRef={formRef}
            >
                <ProForm.Item name="projectName" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]} >
                    <Input placeholder="仅限小写字母、数字、- 标识为项目的唯一身份标签，后期不可修改"
                        onInput={(e) => {
                            let value = e.currentTarget.value;
                            if (!/^[a-z]/.test(value)) {
                                e.currentTarget.value = ''
                                return
                            }
                            value = value.replace(/[^a-z0-9-]/g, '');
                            e.currentTarget.value = value;
                            // e.currentTarget.value = e.currentTarget.value.replace(/[^a-z]/g, '');
                            appNamehandler(e.currentTarget.value)
                        }} />
                </ProForm.Item>
                <ServiceConnectionSelector serviceType={2}></ServiceConnectionSelector>
            </DrawerForm>
        </PageContainer>)

}

export default DeliverablesProject