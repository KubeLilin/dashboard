import React from 'react';
import { Modal,Form , Select } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';


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
  values: Partial<TableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  return (
        <Modal
            destroyOnClose
            title="用户信息编辑"
            visible={props.updateModalVisible}
            onOk={()=>{
              form.submit()

              //
            }}
            onCancel={() => {
              props.onCancel();
            }} >
              <Form form={form} initialValues={props.values} layout="vertical" 
              
                onFinish={ (value:TableListItem) => {
                  props.onSubmit(value)
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

                  <ProFormSelect name="status" width="md" label="状态" 
                    options={[
                      {label:'禁用',value: 0 },
                      {label:'启用',value: 1 }
                    ]}
                  />
              </Form>

        </Modal>
      
  );
};

export default UpdateForm;
