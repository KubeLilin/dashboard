import React,{useEffect, useState} from 'react';
import { useModel,useRequest } from 'umi';
import { Modal,Form , Select, Drawer } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';
import { GetAllRoleList,GetQueryUserRole } from '../service'

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;

  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  userId?: number;
  values: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [selectRolesValue, setSelectRolesValue] = useState<number[]|undefined>(undefined);


  return (
        <DrawerForm width={600} key="form1"
            drawerProps={{ destroyOnClose:true , onClose: ()=>{props.onCancel()} }}
            title="用户信息编辑"
            visible={props.updateModalVisible}
            onFinish={ async (value)=> {
              value.roles = selectRolesValue
              props.onSubmit(value)
              return true
            }}
            request={async()=>{
              return props.values
            }}
            
        >
            <ProFormText  width="md" name="id" label="ID"  readonly={true} hidden={true} />

            <ProFormText  width="md" name="userName" label="用户名" tooltip="英文名" placeholder="请输入名称"  disabled
                rules={[ {  required: true, message: '用户名为必填项',  }, { max:10 , message:'超过最大输入长度 > 10'}  ]}  />

            <ProFormText.Password  width="md" name="password" label="密码" tooltip="密码" placeholder="请输入密码" 
                rules={[ {  required: true, message: '密码为必填项',  },{ max:13 , message:'超过最大输入长度 > 10'}  ]}  />

            <ProFormText width="md" name="account" label="姓名" placeholder="请输入姓名" 
                rules={[  { required: true, message: '姓名为必填项'}, { max:10 , message:'超过最大输入长度 > 10'}  ]}  />

            <ProFormText width="md" name="mobile" label="手机号" placeholder="请输入手机号"  
                rules={[ { required: true, message: '手机号为必填项', }, { pattern: /^1\d{10}$/, message: '不合法的手机号格式!',  }, ]} />

            <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱地址"  
                rules={[ { required: true, message: '邮箱地址为必填项', }, { max:20 , message:'超过最大输入长度 > 20'}  ]} />

            <ProFormSelect width="md"  mode="multiple" 
              fieldProps={ { 
                value:selectRolesValue,
                onChange:(val)=>{
                  console.log(val)
                  setSelectRolesValue(val)
                }
              }} 
              request={ async()=>{  
                  const allRole = await GetAllRoleList()
                  const userRoles = await GetQueryUserRole(props.userId)
                  setSelectRolesValue( userRoles.map(r => r.value))
                  return allRole
              }} 
              />

            <ProFormSelect name="status" width="md" label="状态" 
              options={[
                {label:'禁用',value: 0 },
                {label:'启用',value: 1 }
              ]}
            />

        </DrawerForm>
      
  );
};

export default UpdateForm;
