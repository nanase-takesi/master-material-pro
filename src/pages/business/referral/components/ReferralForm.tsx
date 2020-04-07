import React, { useState } from 'react';
import { Form, Input, Modal, InputNumber, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import * as Constants from '@/constants';
import { TableListItem } from '../data';

import '../index.less';

const { REACT_BASE_API_URL, REACT_UPLOAD_URL } = process.env;
const FormItem = Form.Item;
const { TextArea } = Input;

interface RotationFormProps {
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

const RotationForm: React.FC<RotationFormProps> = (props) => {

    const [loading, setLoading] = useState<boolean>(false);

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

    const renderUploadButton = (<div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
    </div>);

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
                    label="推荐内容的名称"
                    rules={[{ required: true, message: '请填写推荐内容的名称！', min: 1 }]}
                >
                    <Input placeholder="请输入" />
                </FormItem>
                <FormItem
                    name="imageUrl"
                    label="上传封面图"
                    rules={[{ required: true, message: '请上传封面图！', min: 1 }]}
                >
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={`${REACT_BASE_API_URL}/mac/minio/${Constants.BUCKET_NAME}/upload`}
                        beforeUpload={(file) => {
                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                            if (!isJpgOrPng) {
                                message.error('只能上传JPG/PNG文件');
                            }
                            const isLt2M = file.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                                message.error('图片必须小于 2MB!');
                            }
                            return isJpgOrPng && isLt2M;
                        }}
                        onChange={info => {
                            const { status, response } = info.file;
                            if (status === 'uploading') {
                                setLoading(true);
                                return;
                            }

                            if (status === 'done') {
                                if (response.code === 200) {
                                    message.success('上传成功')
                                    const data = response.data;
                                    // values?.imageUrl = `${Constants.BUCKET_NAME}/${data}`
                                    form.setFieldsValue({ 'imageUrl': `${Constants.BUCKET_NAME}/${data}` });
                                }
                                setLoading(false);
                            }
                        }}
                    >
                        {form.getFieldValue('imageUrl') ? <img src={`${REACT_UPLOAD_URL}/${form.getFieldValue('imageUrl')}`} alt="avatar" style={{ width: '100%' }} /> : renderUploadButton}
                    </Upload>
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

export default RotationForm;