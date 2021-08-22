import { Button, Space, Switch, Form, Input, Select, Tabs } from "antd";
import { ReadJsonConfig, JsonReadConfigInputDto } from "@/domain/scheduletask-domain/scheduletask-entities/input-entities/json-input"
import { useEffect, useImperativeHandle, useRef } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FieldTypeEnumList } from "@/domain/scheduletask-domain/scheduletask-entities/tasktypeConstans"
const { TabPane } = Tabs;
const { Option } = Select;
/**
 * form表单布局设置
 */
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
};
interface IProp {
    /**
     * Json文件输入基础配置
     */
    ReadJsonConfigData: ReadJsonConfig;
    /**
     * 将子组件的值返回给父组件
     */
    onGetFormFiled?(value: any): void;
    onRef: any;
}
const JsonForm = (props: IProp) => {
    const [jsoninputFormData] = Form.useForm();
    const [jsonReadConfigFormData] = Form.useForm();
    const jsonRef = useRef(null);
    useImperativeHandle(props.onRef, () => {
        return {
            getSonformValues: callParent
        }
    });
    const callParent = () => {
        const readfrom = jsonReadConfigFormData.getFieldsValue();
        const jsonconfig = jsoninputFormData.getFieldsValue();
        let configstr= JSON.stringify({ ftpConfig: jsonconfig, jsonReadConfig: readfrom.readConfig });
        props.onGetFormFiled && props.onGetFormFiled(configstr);
    }
    useEffect(() => {
        jsoninputFormData.setFieldsValue(props.ReadJsonConfigData.ftpConfig);
        jsonReadConfigFormData.setFieldsValue({ readConfig: props.ReadJsonConfigData.jsonReadConfig });
    }, []);
    return (
        <div ref={jsonRef}>
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="基础配置" key="1">
                    <Form  {...formItemLayout} form={jsoninputFormData}
                        name="nest-messages">
                        <Form.Item
                            name="host"
                            label="主机地址："
                            rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="userName"
                            label="用户名："
                            rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="passWord"
                            label="密码："
                            rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="targetfilePath"
                            label="文件或路径："
                            rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            valuePropName="checked"
                            name="isIgnoreEmptyfile"
                            label="是否忽略空文件：">
                            <Switch />
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="读取配置" key="2">
                    <Form form={jsonReadConfigFormData}  {...formItemLayout} name="dynamic_form_nest_item"  autoComplete="off">
                        <Form.List name="readConfig">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'pathField']}
                                                fieldKey={[fieldKey, 'pathField']}
                                                rules={[{ required: true, message: 'Missing pathField name' }]}
                                            >
                                                <Input placeholder="文件的字段名称" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'flowField']}
                                                fieldKey={[fieldKey, 'flowField']}
                                                rules={[{ required: true, message: 'Missing flowField name' }]}
                                            >
                                                <Input placeholder="流字段名称" />
                                            </Form.Item>
                                            <Form.Item
                                                //  {...restField}
                                                name={[name, 'fieldType']}
                                                fieldKey={[fieldKey, 'fieldType']}
                                                rules={[{ required: true, message: 'Missing fieldType name' }]}
                                            >
                                                <Select style={{ width: 130 }}>
                                                    {
                                                        FieldTypeEnumList.map((item: any) => {
                                                            return <Option key={item.value} value={item.value}>{item.label}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加行</Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    )
}
export default JsonForm


