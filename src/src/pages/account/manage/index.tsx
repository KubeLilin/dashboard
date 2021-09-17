import { PlusOutlined } from '@ant-design/icons';
import { Button, message , Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { query, addUser, setUserStatus, updateUser } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useModel } from 'umi';

var tenantId:number = 0;

/**
 *  查询用户信息(分页)
*/
const queryUsers = async (
  params: {
    tenantId?: number;
    pageIndex?: number;
    current?: number;
    pageSize?: number;
  },
  sort: Record<string, any>,
  options?: { [key: string]: any },) => {
  //console.log(sort)
  params.tenantId = tenantId
  params.pageIndex = params.current
  //params.current = undefined

  var requestData = await query(params,options)
  
  let retData :{
    data:  TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  } = { 
    data: requestData.data.data,
    success : requestData.success,
    total : requestData.data.total
  }

  //return query(params,options)
  return new Promise<any>(resolve => {
    resolve(retData)
  })
}

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
    var resMsg = await addUser(fields );
    if (resMsg.success) {
      message.success(resMsg.message);
      return true;
    } else {
      message.error('添加失败请重试！');
    }
    hide();
    
    return false;
};
/**
 * 更新用户信息
 *
 * @param fields
 */
const handleUpdate = async ( item?: TableListItem) => {
  const hide = message.loading('正在更新');
  if (item != null) {
    item.tenantId = tenantId
  }
  try {
    await updateUser(item);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};


const Manage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  tenantId = Number(initialState?.currentUser?.group)

  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** 国际化配置 */

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex:'id',
      hideInForm: true,
      hideInSearch:true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      valueType: 'textarea',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '失效',
          status: 'Default',
        },
        1: {
          text: '生效',
          status: 'Success',
        },
      },
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch:true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={ async () => {
            var ok = confirm("确定要禁用用户吗?")
            if (ok) {
              setCurrentRow(record);
              var status = '1' 
              if(record.status == '1') {
                status = '0'
              } 
              let res = await setUserStatus({ params:{ id: record.id , status: status  } })
              
              if (res.success && actionRef.current) {
                message.success("操作成功")
                actionRef.current.reload();
              }
            }
          }}
        >
          { record.status == "1"? "禁用":"启用" }
        </a>,
        <a key="updateUser" 
          onClick={ async() => {
            setCurrentRow(record)
            handleUpdateModalVisible(true)
          }}
        >更新</a>
      
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="用户查询"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={queryUsers}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                {/* 服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万 */}
              </span>
            </div>
          }
        >
          <Button type="primary"
            onClick={async () => {
              //await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <ModalForm<TableListItem>
        title="新建用户"
        width={450}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          value.tenantId = tenantId
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
     
          <ProFormText  width="md" name="userName" label="用户名" tooltip="英文名" placeholder="请输入名称" 
              rules={[ {  required: true, message: '用户名为必填项',  }, { max:10 , message:'超过最大输入长度 > 10'}  ]}  />

          <ProFormText.Password  width="md" name="password" label="密码" tooltip="密码" placeholder="请输入密码" 
              rules={[ {  required: true, message: '密码为必填项',  },{ max:13 , message:'超过最大输入长度 > 10'}  ]}  />

          <ProFormText width="md" name="account" label="姓名" placeholder="请输入姓名" 
              rules={[  { required: true, message: '姓名为必填项'}, { max:10 , message:'超过最大输入长度 > 10'}  ]}  />

          <ProFormText width="md" name="mobile" label="手机号" placeholder="请输入手机号"  
              rules={[ { required: true, message: '手机号为必填项', }, { pattern: /^1\d{10}$/, message: '不合法的手机号格式!',  }, ]} />

          <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱地址"  
              rules={[ { required: true, message: '邮箱地址为必填项', }, { max:20 , message:'超过最大输入长度 > 20'}  ]} />
      </ModalForm>

      <UpdateForm
        onSubmit={async (value) => {
          console.log(value)
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.userName && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.userName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Manage;
