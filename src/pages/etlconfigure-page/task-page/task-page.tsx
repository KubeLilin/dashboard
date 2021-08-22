import { Button, Table, Cascader, PaginationProps, Popover, Row, message, Tag } from "antd";
import React, { useEffect, useMemo, useState, useRef } from "react";
import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice";
import { IServerReturn } from "@/shard/ajax/response";
import { IocTypes } from "@/shard/inversionofcontrol/ioc-config-types";
import TaskOperation from "./task-operation"
import { TaskTypeEnumList } from "@/domain/scheduletask-domain/scheduletask-entities/tasktypeConstans"
import useHookProvider from "@/shard/dependencyInjection/ioc-hook-provider";
import IScheduleTaskService from "@/domain/scheduletask-domain/scheduletask-services/ischeduletask-service";
import { initPaginationConfig } from "@/shard/ajax/request";
import { OperationTypeEnum } from "@/shard/operation/operationType";
import { ArrowDownOutlined } from '@ant-design/icons';
const TaskPage = () => {

    const [tableData, setTableData] = useState([]);
    /**
     * 父组件获取子组件所有内容
     */
    const taskOperationRef = useRef<any>();
    const [loading, setloading] = useState<boolean>(true);
    const _scheduletasktaskervice: IScheduleTaskService = useHookProvider(IocTypes.ScheduleTaskService);
    const _dbconnectionservice: IDbConnectionService = useHookProvider(IocTypes.DbConnectionService);
    const [pagination, setPagination] = useState<PaginationProps>(
        initPaginationConfig
    );
    const [cascader, setCascader] = useState({ visible: false });
    const [cascadervalue, setCascaderValue] = useState([]);
    useEffect(() => {
        getTable();
    }, [pagination]);
    /**
    * Table 列名
    */
    const columns = [
        {
            title: "任务名称",
            dataIndex: "taskName",
            key: "taskName",
        },
        {
            title: "任务编号",
            dataIndex: "taskNumber",
            key: "taskNumber",
        },
        {
            title: "任务类型",
            dataIndex: "taskType",
            key: "taskType",
            render: (text: any, record: any) => {
                return <div>
                    <Tag color="cyan"><ArrowDownOutlined />FtpJson读取</Tag>
                </div>
            }
        },
        {
            title: "操作",
            dataIndex: "id",
            key: "id",
            render: (text: any, record: any) => {
                return <div>
                    <Button type="primary" onClick={() => { editRow(record.id) }}>编辑</Button>
                    <Button type="primary" danger onClick={() => { deleteRow(record.id) }}>删除</Button>
                </div>
            }
        }
    ];
    /**
     * 获取table表格数据
     */
    const getTable = async () => {
        _scheduletasktaskervice.getPage().then(res => {
            if (res.success) {
                setPagination((Pagination) => {
                    Pagination.total = res.total;
                    return Pagination;
                });
                setTableData(res.data)
                setloading(false);
            }
        })
    }
    /**
     * 级联选择事件
     */
    const cascaderonChange = (value: any, selectedOptions: any) => {
        setCascader({ visible: false });
        taskOperationRef.current && taskOperationRef.current.changeVal(OperationTypeEnum.add, null, value[value.length - 1]);
    }
    /**
     * 气泡弹窗事件
     */
    const handleVisibleChange = (value: any) => {
        setCascader({ visible: value });
    }
    const content = (
        <div>
            <Cascader value={cascadervalue} options={TaskTypeEnumList} onChange={cascaderonChange} placeholder="请选择任务类型" />,
        </div>
    );
    /**
     * 修改任务
     * @param _id 
     */
    const editRow = (_id: any) => {
        taskOperationRef.current && taskOperationRef.current.changeVal(OperationTypeEnum.edit, _id);
    }
    /**
     * 删除任务
     * @param _id 
     */
    const deleteRow = (_id: string) => {
        _scheduletasktaskervice.delete(_id).then((res: IServerReturn<any>) => {
            if (res.success) {
                message.success(res.message, 3)
                getTable()
            }
        })
    }
    /**
     * 渲染子组件
     */
    const renderOperation = useMemo(() => {
        return (<TaskOperation operationRef={taskOperationRef} onCallbackEvent={getTable}></TaskOperation>)
    }, [])
    return (
        <div>
            <Row>
                <Popover placement="bottomLeft" visible={cascader.visible} title="任务类型" content={content} onVisibleChange={handleVisibleChange} trigger="click">
                    <Button type="primary">添加</Button>
                </Popover>
                <Button type="primary" onClick={() => { getTable() }}>查询</Button>
            </Row>
            <Table bordered columns={columns} dataSource={tableData} loading={loading} pagination={pagination} />
            {renderOperation}
        </div>
    );
};
export default TaskPage;
