import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import ReferralForm from './components/ReferralForm';
import { TableListItem, State } from './data.d';
import { queryReferralList, updateReferral, addReferral, deleteReferral, cancelDeleteReferral } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addReferral({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (id?: number, fields?: TableListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateReferral(id, fields);
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

const handleDelete = async (id: number) => {
  await deleteReferral(id).then(response => {
    const { code } = response;
    if (code === 200) {
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  });
}

const handleCancelDelete = async (id: number) => {
  await cancelDeleteReferral(id).then(response => {
    const { code } = response;
    if (code === 200) {
      message.success('恢复成功');
    } else {
      message.error('恢复失败');
    }
  });
}

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [currentFormValues, setCurrentFormValues] = useState<TableListItem | undefined>(undefined);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '推荐内容的名称',
      dataIndex: 'name',
      align: 'center',
      rules: [
        {
          required: true,
          message: '推荐内容的名称为必填项',
        },
      ],
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
      width: '200px',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: number) => `${val}`,
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      hideInForm: true,
      valueEnum: {
        0: { text: '已作废', status: 'Error' },
        1: { text: '使用中', status: 'Success' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
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
            </Popconfirm></> : <Button type="link" onClick={async () => {
              await handleCancelDelete(record.id);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}>取消删除</Button>}
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
            <></>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={(params) => queryReferralList(params)}
        columns={columns}
        rowSelection={{}}
      />
      <ReferralForm
        title="新建推荐商品"
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

      <ReferralForm
        title="更新推荐商品"
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
