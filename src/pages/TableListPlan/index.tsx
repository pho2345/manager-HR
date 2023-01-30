import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';



const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'plans');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại!');
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  console.log(fields);
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'plans', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất!');
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  console.log(selectedRows);
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'plans')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại!!');
    return false;
  }
};

const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const refIdCateogry = useRef<any>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [codePlan, setCodePlan] = useState<any>();
  const [namePlan, setNamePlan] = useState<any>();
  const [profit, setProfit] = useState<any>();
  const intl = useIntl();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Rule name'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
          <a
            onClick={() => {
              setCurrentRow(entity?.attributes?.code);
              setShowDetail(true);
            }}
          >
            {entity?.attributes?.code}

          </a>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Name' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.profit' defaultMessage='Profit' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'profit',
      renderText: (_, text: any) => {
        return `${text?.attributes?.profit}%`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Option' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Button
          type='primary'
          key='primary'
          onClick={() => {
            handleUpdateModalOpen(true);
            refIdCateogry.current = entity.id;
            setCodePlan(entity?.attributes?.code);
            setNamePlan(entity?.attributes?.name);
            setProfit(entity?.attributes?.profit);


          }}
        >
          <FormattedMessage id='pages.searchTable.update' defaultMessage='New' />
        </Button>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      renderText: (_, text: any) => {

        return moment(text?.attributes?.createdAt).format('YYYY-MM-DD HH:mm:ss')
      }

    },

  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey='id'
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='New' />
          </Button>,
        ]}
        request={() => customAPIGet({}, 'plans')}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {

            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id='pages.searchTable.item' defaultMessage='项' />
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Batch deletion'
            />
          </Button>
          <Button type='primary'>
            <FormattedMessage
              id='pages.searchTable.batchApproval'
              defaultMessage='Batch approval'
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.new',
          defaultMessage: 'New rule',
        })}
        width='400px'
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as any);
          if (success) {
            handleModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.Code'
                  defaultMessage='Rule name is required'
                />
              ),
            },
          ]}
          width='md'
          name='code'
          placeholder='Mã'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.Name'
                  defaultMessage='Rule name is required'
                />
              ),
            },
          ]}
          width='md'
          name='name'
          placeholder='Tên'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.profit'
                  defaultMessage='Profit is required'
                />
              ),
            },
          ]}
          width='md'
          name='profit'
          placeholder='Lợi nhuận (%)'
        />


      </ModalForm>


      <ModalForm
      form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.update',
          defaultMessage: '',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          // let values = {
          //   code: codePlan,
          //   name: namePlan,

          // }
          const success = await handleUpdate(value as any, refIdCateogry);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.Code'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: codePlan,
            onChange: (e) => {
              setCodePlan(e.target.value);
            }
          }}
          width='md'
          name='code'
          placeholder='Mã'
        />

        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.Name'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: namePlan,
            onChange: (e) => {
              setNamePlan(e.target.value);
            }
          }}
          width='md'
          name='name'
          placeholder='Tên'
        />

        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.profit'
          //         defaultMessage='Profit is required'
          //       />
          //     ),
          //   },
          // ]}

          fieldProps={{
            value: profit,
            onChange: (e) => {
              setProfit(e.target.value);
            }
          }}
          width='md'
          name='profit'
          placeholder='Lợi nhuận (%)'
        />    
      </ModalForm>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
