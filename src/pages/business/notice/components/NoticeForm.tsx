import React from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';

import { TableListItem } from '../data';

const FormItem = Form.Item;
const { TextArea } = Input;

interface NoticeFormProps {
    onCancel: () => void;
    onSubmit: (values: TableListItem) => void;
    modalVisible: boolean;
    title: string;
    values?: TableListItem;
}

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

const NoticeForm: React.FC<NoticeFormProps> = (props) => {

    const [form] = Form.useForm();

    const {
        modalVisible,
        title,
        values,
        onCancel: handleModalVisible,
        onSubmit: handleSubmit,
    } = props;

    const handleOk = async () => {
        const fieldsValue = await form.validateFields();
        //@ts-ignore
        handleSubmit({ ...fieldsValue });
    }

    return (
        <Modal
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={title}
            visible={modalVisible}
            cancelText="取消"
            onCancel={() => handleModalVisible()}
            okText="提交"
            onOk={() => handleOk()}
        >
            <Form
                {...formLayout}
                form={form}
                initialValues={{ ...values }}
            >
                <FormItem
                    name="name"
                    label="公告内容（简介）"
                    rules={[{ required: true, message: '请填写公告内容（简介）！', min: 1 }]}
                >
                    <Input placeholder="请输入" />
                </FormItem>
                <FormItem
                    name="url"
                    label="跳转链接"
                    rules={[{ required: true, message: '请填写跳转链接！', min: 1 }]}
                >
                    <Input placeholder="请输入" />
                </FormItem>
                <FormItem
                    name="sort"
                    label="排序值（越大越靠前）"
                    rules={[{ required: true, message: '请输入排序值！' }]}
                >
                    <InputNumber defaultValue={0} min={0} placeholder="请输入" style={{ width: '100%' }} />
                </FormItem>
                <FormItem
                    name="remark"
                    label="备注"
                >
                    <TextArea rows={4} placeholder="请输入" />
                </FormItem>
            </Form>
        </Modal>
    )
}

export default NoticeForm;