import { ProFormSelect } from '@ant-design/pro-form';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Select } from 'antd';
import React, { useState, useRef } from 'react';
import { ServiceData } from './data';
import { BindNameSpace, queryServiceList } from './service';


const ServiceConfig: React.FC = () => {


    const[continueStr,continueStrHandler]=useState<string>();

    const columns:ProColumns<ServiceData>[]=[
    
        {
            title:'命名空间',
            dataIndex:'namespace',
            hideInForm: true,
            renderFormItem:()=>{
    
                return <ProFormSelect request={BindNameSpace}></ProFormSelect>
            }
        },
        {
            title: '名称',
            dataIndex: 'name',
            hideInForm: true,
            hideInSearch: true
        },
    
        {
            title:'labels',
            dataIndex:'labels',
            hideInSearch: true
        },{
            title:'selector',
            dataIndex:'selector',
            hideInSearch: true
        },
        {
            title:'创建时间',
            dataIndex:'createTime',
            hideInSearch: true
        },
        {
            title:'k8s分页字符串',
            dataIndex:'continueStr',
            hideInSearch:true,
            hideInTable:true,
            hideInForm: true,
        }
    ]
    



    return <ProTable<ServiceData>
        columns={columns}
        request={(x)=>{
            x.continueStr=continueStr;
            return queryServiceList(x)}  }
        onDataSourceChange={(x)=>{
            if(x.length>0){
                continueStrHandler(x[0].continueStr)
                console.log(continueStr)
            }
           }}
        >
    </ProTable>
}

export default ServiceConfig;