import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Popconfirm, Avatar } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SorterResult } from 'antd/es/table/interface';

import RotationForm from './components/RotationForm';
import { TableListItem, State } from './data.d';
import { queryRotationList, addRotation, updateRotation, deleteRotation, bratchDeleteRotation } from './service';

const valueEnum = {
  0: { text: '已作废', status: 'Error' },
  1: { text: '使用中', status: 'Success' },
};

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRotation({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleUpdate = async (id?: number, fields?: TableListItem) => {
  const hide = message.loading('正在提交');
  await updateRotation(id, fields).then(response => {
    const { code } = response;
    if (code === 200) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  })
  hide();
  return true;
}

/**
 * 删除轮播图
 * @param id id
 */
const handleDelete = async (id: number) => {
  await deleteRotation(id).then(response => {
    const { code } = response
    if (code === 200) {
      message.success('删除成功')
    } else {
      message.error('删除失败')
    }
  });
}

/**
 *  批量删除轮播图
 * @param selectedRows selectedRows
 */
const handleBatchDelete = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await bratchDeleteRotation({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [currentFormValues, setCurrentFormValues] = useState<TableListItem | undefined>(undefined);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '轮播内容/名称',
      dataIndex: 'name',
      align: 'center',
      rules: [
        {
          required: true,
          message: '轮播内容/名称为必填项',
        },
      ],
    },
    {
      title: '轮播图片',
      dataIndex: 'imageUrl',
      align: 'center',
      width: '80px',
      hideInSearch: true,
      renderText: (val: string) => <Avatar shape="square" src={`${process.env.REACT_UPLOAD_URL}/${val}`} style={{ cursor: 'pointer' }} />,
    },
    {
      title: '跳转链接',
      dataIndex: 'url',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '排序值（越大越靠前）',
      dataIndex: 'sort',
      align: 'center',
      sorter: true,
      hideInSearch: true,
      renderText: (val: number) => `${val}`,
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInForm: true,
      align: 'center',
      valueEnum: valueEnum,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('state');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentFormValues(record);
            }}
          >
            编辑
          </a>
          {State.INVALID !== record.state ? <>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗?"
              cancelText="否"
              okText="是"
              okType="danger"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={async () => {
                await handleDelete(record.id);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              <Button type="link" danger>作废</Button>
            </Popconfirm></> : null}
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <>
              <Popconfirm
                title="确定要删除所选中的数据吗?"
                cancelText="取消"
                okText="确定"
                okType="danger"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={async () => {
                  await handleBatchDelete(selectedRows);
                  action.reload();
                }}
              >
                <Button type="danger">批量删除</Button>
              </Popconfirm>
              <Divider type="vertical" />
            </>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={(params) => queryRotationList(params)}
        columns={columns}
        rowSelection={{}}
      />
      <RotationForm
        title="新建轮播图"
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      <RotationForm
        title="更新轮播图"
        modalVisible={updateModalVisible}
        values={currentFormValues}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentFormValues(undefined);
        }}
        onSubmit={async (value) => {
          const success = await handleUpdate(currentFormValues?.id, value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentFormValues(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
