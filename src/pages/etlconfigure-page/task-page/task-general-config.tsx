import { useEffect, useRef, useImperativeHandle } from 'react'
import { Form, Input } from "antd";
import { ScheduletTaskInputDto } from "@/domain/scheduletask-domain/scheduletask-entities/scheduleTaskentitie"
interface IProp {
    taskbasicData: ScheduletTaskInputDto;
    /**
     * 将子组件的值返回给父组件
     */
    onGetFormFiled?(value: any): void;
    /**
     * 需要带回去的
     */
    onRef: any;
}
/**
 * form表单布局设置
 */
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
};

const TaskGeneralConfig = (props: IProp) => {
    useEffect(() => {
        taskbasicFormData.setFieldsValue(props.taskbasicData);
    }, []);
    const [taskbasicFormData] = Form.useForm();
    const taskbasicRef = useRef(null);
    useImperativeHandle(props.onRef, () => {
        return {
            getSonformValues: callParent
        }
    });
    const callParent = () => {
        props.onGetFormFiled && props.onGetFormFiled(taskbasicFormData.getFieldsValue())
    }
    return (
        <div ref={taskbasicRef}>
            <Form form={taskbasicFormData} {...formItemLayout}
                name="nest-messages">
                <Form.Item
                    name="taskName"
                    label="任务名称"
                    rules={[{ required: true }]} >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="taskNumber"
                    label="任务编号">
                    <Input />
                </Form.Item>
                <Form.Item
                    name="describe"
                    label="任务描述">
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
export default TaskGeneralConfig
