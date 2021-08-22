import "./task-operation.less"
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/theme/erlang-dark.css';
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/selection/active-line"; //光标行背景高亮，配置里面也需要styleActiveLine设置为true
import "codemirror/keymap/sublime"; //sublime编辑器效果
import "codemirror/addon/display/autorefresh";
import "codemirror/addon/hint/anyword-hint.js";

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Row, Select, Steps, message } from "antd";
import React, { useEffect, useImperativeHandle, useState, useRef } from "react";
import { ftpConfigDto, ReadJsonConfig, JsonReadConfigInputDto } from "@/domain/scheduletask-domain/scheduletask-entities/input-entities/json-input"
import CodeMirror from 'react-codemirror';
import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice";
import { IOperationConfig } from "../../../shard/operation/operationConfig"
import { IServerReturn } from "@/shard/ajax/response";
import { IocTypes } from "@/shard/inversionofcontrol/ioc-config-types";
import JsonForm from "./input-form/json-form"
import TaskGeneralConfig from "./task-general-config"
import { ScheduletTaskInputDto } from "@/domain/scheduletask-domain/scheduletask-entities/scheduleTaskentitie"
import { TaskTypeEnum } from "@/domain/scheduletask-domain/scheduletask-entities/tasktype-enum"
import useHookProvider from "@/shard/dependencyInjection/ioc-hook-provider";
import IScheduleTaskService from "@/domain/scheduletask-domain/scheduletask-services/ischeduletask-service";
import { Guid } from "guid-typescript";
import { OperationTypeEnum } from "@/shard/operation/operationType";
interface IProp {
    // Config: IOperationConfig;
    // taskType: TaskTypeEnum;
    /**
     */
    operationRef?: any;
    /**
     * 操作成功回调事件
     */
    onCallbackEvent?: any;
}
const codeMirrorOptions = {
    lineNumbers: true,                     //显示行号  
    mode: { name: "text/x-csharp" },          //定义mode  
    extraKeys: { "Ctrl": "autocomplete" },   //自动提示配置  
    indentUnit: 4, // 智能缩进单位为4个空格长度
    theme: "erlang-dark",                  //选中的theme  
    gutters: [
        "CodeMirror-linenumbers",
        "CodeMirror-foldgutter",
        "CodeMirror-lint-markers"
    ],               //选中的theme  
}
const { Step } = Steps;
const TaskOperation = (props: IProp) => {
    const [operationState, setOperationState] = useState<IOperationConfig>({ visible: false })
    /**
     * 
     */
    const _dbconnectionservice: IDbConnectionService = useHookProvider(IocTypes.DbConnectionService);
    const _scheduletaskservice: IScheduleTaskService = useHookProvider(IocTypes.ScheduleTaskService);
    /**
     * 任务基础配置
     */
    const [taskbasicState, settaskbasicState] = useState<ScheduletTaskInputDto>(new ScheduletTaskInputDto())
    /**
     * Json文件读取配置
     */
    const [ReadJsonConfigState, setReadJsonConfigState] = useState<ReadJsonConfig>(new ReadJsonConfig());
    const [taskTypeState, settaskTypeState] = useState<TaskTypeEnum>(TaskTypeEnum.ftpjson)
    /**
     * 操作类型
     */
    const [operationType, setOperationType] = useState<OperationTypeEnum>(OperationTypeEnum.view);
    const [itemId, setitemId] = useState<string>();
    /**
     * 步骤条
     */
    const [current, setCurrent] = React.useState(0);
    /**
     * 步骤条数组
     */
    const steps = [
        {
            title: '基础信息',
        },
        {
            title: '数据来源设置',
        }
    ];
    /**
     * 读取Json文件的Ref
     */
    const jsoninputRef = useRef<any>();
    /**
     * 任务基础配置Ref
     */
    const taskbasicinputRef = React.createRef<any>();
    /**
     * 父组件调用子组件事件处理
     */
    useImperativeHandle(props.operationRef, () => ({
        changeVal: (_operationType: OperationTypeEnum, _id?: string, _taskType?: TaskTypeEnum) => {
            _taskType && settaskTypeState(_taskType);
            switch (_operationType) {
                case OperationTypeEnum.add:
                    setOperationType(_operationType);
                    settaskbasicState(new ScheduletTaskInputDto());
                    setReadJsonConfigState(new ReadJsonConfig());
                    editOperationState(true, "添加")
                    break;
                case OperationTypeEnum.edit:
                    setitemId(_id);
                    setOperationType(_operationType);
                    _id && getLoadTask(_id);
                    break;
                case OperationTypeEnum.view:
                    setOperationType(_operationType);
                    editOperationState(true, "查看")
                    break;
            }
        }
    }));
    /**
     * 点击下一步
     */
    const next = () => {
        taskbasicinputRef.current.getSonformValues();
        setCurrent(current + 1);
    };
    useEffect(() => {
    }, [ReadJsonConfigState, taskbasicState]);
    /**
     * 点击上一步
     */
    const prev = () => {
        setCurrent(current - 1);
    };
    const onSave = () => {
        jsoninputRef.current.getSonformValues()
    }
    const getConfigValue = (configjson: string) => {
        const { taskName, taskNumber, describe } = taskbasicState;
        const param = {
            id: Guid.EMPTY.toString(),
            taskName: taskName,
            taskNumber: taskNumber,
            taskType: taskTypeState,
            describe: describe,
            taskConfig: configjson
        }
        /**
         * 新增保存
         */
        if (operationType === OperationTypeEnum.add) {
            _scheduletaskservice.create(param).then(res => {
                if (res.success) {
                    setOperationState({ visible: false })
                    message.success(res.message, 3)
                    props.onCallbackEvent && props.onCallbackEvent();
                }
            })
        }
        /**
         * 修改保存
         */
        if (operationType === OperationTypeEnum.edit && itemId) {
            _scheduletaskservice.update(itemId, param).then(res => {
                if (res.success) {
                    setOperationState({ visible: false })
                    message.success(res.message, 3)
                    props.onCallbackEvent && props.onCallbackEvent();
                }
            })
        }
    }
    /**
     * 
     * @param value 获取Json文件的配置
     */
    const gettaskbasicFormFiledValue = (taskbasic: any) => {
        settaskbasicState(taskbasic)
    }
    /**
     * 任务编辑是获取一个任务
     */
    const getLoadTask = (_id: string) => {
        _scheduletaskservice.getLoad(_id).then((res: IServerReturn<any>) => {
            if (res.success) {
                settaskbasicState(res.data);
                setReadJsonConfigState(JSON.parse(res.data.taskConfig));
                editOperationState(true, "修改")
            }
        })
    }
    /**
     * 修改弹框属性
     * @param _visible 
     * @param _title 
     */
    const editOperationState = (_visible: boolean, _title?: string) => {
        setCurrent(0);
        setOperationState({ visible: _visible, title: _title });
    }
    /**
     * 关闭弹框
     */
    const onCancel = () => {
        editOperationState(false)
    };
    return (
        <div>
            <Modal getContainer={false} width={1000} title={operationState.title} closable={false} visible={operationState.visible}
                footer={[
                    <div key="foot" className="steps-action">
                        <Button key="cancel" style={{ margin: '0 8px' }} onClick={() => onCancel()}>取消</Button>
                        {current > 0 && (
                            <Button key="previous" icon={<ArrowUpOutlined />} style={{ margin: '0 8px' }} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button key="next" type="primary" icon={<ArrowDownOutlined />} onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button key="finesh" type="primary" onClick={() => onSave()}>保存</Button>
                        )}
                    </div>
                ]}>
                <Row className="task-step">
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                </Row>
                {
                    current < steps.length - 1 ?
                        <TaskGeneralConfig taskbasicData={taskbasicState} onGetFormFiled={gettaskbasicFormFiledValue} onRef={taskbasicinputRef}></TaskGeneralConfig>
                        : null

                }
                {
                    taskTypeState === TaskTypeEnum.ftpjson && current === steps.length - 1 ?
                        <JsonForm ReadJsonConfigData={ReadJsonConfigState} onGetFormFiled={getConfigValue} onRef={jsoninputRef}></JsonForm>
                        : null
                }
            </Modal>
        </div >
    );
};
export default TaskOperation;
