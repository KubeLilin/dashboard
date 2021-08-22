import { Button, Form, Input, InputNumber, Modal, message } from "antd"
import React, { useEffect } from 'react'

import { DBConnResourceInputDto } from "@/domain/dbconnection-domain/dbconnection-entitie/dbconnResourceentities"
import IDbConnectionService from "@/domain/dbconnection-domain/dbconnection-service/idbconnectionservice";
import { IOperationConfig } from "../../../shard/operation/operationConfig"
import { IocTypes } from "@/shard/inversionofcontrol/ioc-config-types";
import useHookProvider from "@/shard/dependencyInjection/ioc-hook-provider";

/**
 * form表单布局设置
 */
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
};
const validateMessages = {
    required: "${label} is required!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};
interface IProp {
    Config: IOperationConfig
}
const initformData = new DBConnResourceInputDto();
const DbconnectionOperation = (props: IProp) => {
    const _dbconnectionservice: IDbConnectionService = useHookProvider(IocTypes.DbConnectionService);
    const [formData] = Form.useForm();
    useEffect(() => {
        formData.setFieldsValue(initformData)
    }, [formData])
    const onFinish = (values: any) => {
        console.log(values);
    };
    const onCancel = () => {
        if (props.Config.onClose) {
            formData.resetFields();
            formData.setFieldsValue(initformData);
            props.Config.onClose();
        }
    };
    const onOk = () => {
        let param = formData.getFieldsValue();
        console.log(param)
        _dbconnectionservice.create(param).then(x => {
            if (x.success && props.Config.onClose) {
                message.success(x.message, 3)
                props.Config.onClose();
                formData.resetFields()
            }
        })
    }
    return (
        <div>
            <Modal width={1000} title={props.Config.title} visible={props.Config.visible} onCancel={onCancel} onOk={onOk} 
             footer={[
                <Button key="back" onClick={onCancel}>
                  取消
                </Button>,
                <Button key="submit" type="primary"  onClick={onOk}>
                  保存
                </Button>
              ]}
              >
                <Form form={formData}
                    {...formItemLayout}
                    name="nest-messages"
                    onFinish={onFinish}
                    validateMessages={validateMessages}>
                    <Form.Item
                        name="connectionName"
                        label="连接名称">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="host"
                        label="主机">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="port"
                        label="端口">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        name="userName"
                        label="用户名">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="passWord"
                        label="密码">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dbType"
                        label="数据库类型">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="maxConnSize"
                        label="最大连接数">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        name="memo"
                        label="描述">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default DbconnectionOperation
