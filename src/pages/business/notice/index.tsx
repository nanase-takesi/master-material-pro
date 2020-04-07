import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import NoticeForm from './components/NoticeForm';
import { TableListItem, State } from './data.d';
import { querySystemNotice, updateSystemNotice, addSystemNotice, deleteSystemNotice, unDeleteSystemNotice } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addSystemNotice({ ...fields }).then(response => {
      const { code } = response;
      if (code === 200) {
        message.success('添加成功');
      } else {
        message.error('添加失败请重试！');
      }
    });
    hide();
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (id?: number, fields?: TableListItem) => {
  const hide = message.loading('正在配置');
  try {
    await updateSystemNotice(id, fields).then(response => {
      const { code } = response;
      if (code === 200) {
        message.success('配置成功');
      } else {
        message.error('配置失败请重试！');
      }
    });
    hide();
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const handleDelete = async (id: number) => {
  const hide = message.loading('正在删除');
  await deleteSystemNotice(id).then(response => {
    const { code } = response;
    if (code === 200) {
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  })
  hide();
}

const handleCancelDelete = async (id: number) => {
  const hide = message.loading('正在取消');
  await unDeleteSystemNotice(id).then(response => {
    const { code } = response;
    if (code === 200) {
      message.success('取消删除成功');
    } else {
      message.error('取消删除失败');
    }
  })
  hide();
}

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [currentFormValues, setCurrentFormValues] = useState<TableListItem | undefined>(undefined);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '公告内容（简介）',
      dataIndex: 'name',
      align: 'center',
      rules: [
        {
          required: true,
          message: '公告内容（简介）为必填项',
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
            }}>恢复</Button>}
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
            </>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )}
        request={(params) => querySystemNotice(params)}
        columns={columns}
        rowSelection={{}}
      />
      <NoticeForm
        title="添加系统公告"
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

      <NoticeForm
        title="更新系统公告"
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
