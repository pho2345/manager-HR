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

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  console.log(fields);
  const hide = message.loading('Waiting...');
  try {
    await customAPIAdd({ ...fields }, 'provinces');
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: any, id: any) => {
  console.log(fields);
  const hide = message.loading('Configuring');
  try {
    await customAPIUpdate({
    ...fields
    }, 'provinces', id.current);
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any) => {
  console.log(selectedRows);
  const hide = message.loading('Waiting...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'provinces')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdProvince= useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [codeProvince, setCodeProvince] = useState<any>();
  const [nameProvince, setNameProvince] = useState<any>();
  const [fullName, setFullName] = useState<any>();
  const [fsmCode, setFsmCode] = useState<any>();


  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Code'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
      tip: 'The code is the unique key',
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
      title: <FormattedMessage id='pages.searchTable.column.fullName' defaultMessage='Full Name' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'fullName',
      renderText: (_, text: any) => text?.attributes?.fullname
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Button
          type='primary'
          key='primary'
          onClick={() => {
            handleUpdateModalOpen(true);
            refIdProvince.current = entity.id;
            setCodeProvince(entity?.attributes?.code);
            setNameProvince(entity?.attributes?.name);
            setFullName(entity?.attributes?.fullname);
            setFsmCode(entity?.attributes?.fsmCode);

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
        request={() => customAPIGet({}, 'provinces')}
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
              <span>
                <FormattedMessage
                  id='pages.searchTable.totalServiceCalls'
                  defaultMessage='Total number of service calls'
                />{' '}

              </span>
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
          id: 'pages.searchTable.createForm.newProvince',
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
                  defaultMessage='Code is required'
                />
              ),
            },
          ]}
          width='md'
          name='code'
          placeholder='Code'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.Name'
                  defaultMessage='Name is required'
                />
              ),
            },
          ]}
          width='md'
          name='name'
          placeholder='Name'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.fullName'
                  defaultMessage='Fullname is required'
                />
              ),
            },
          ]}
          width='md'
          name='fullname'
          placeholder='Full Name'
        />

       


      </ModalForm>


      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.updateCategory',
          defaultMessage: 'New rule',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async () => {
          let values = {
            code: codeProvince,
            name: nameProvince,
            fullname: fullName,
            fsmCode: fsmCode
          }
          const success = await handleUpdate(values as any, refIdProvince);
          if (success) {
            handleUpdateModalOpen(false);
            //form.resetFields();
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
            value: codeProvince,
            onChange: (e) => {
              setCodeProvince(e.target.value);
            }
          }}
          width='md'
          name='code'
          placeholder='Code'
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
            value: nameProvince,
            onChange: (e) => {
              setNameProvince(e.target.value);
            }
          }}
          width='md'
          name='name'
          placeholder='Name'
        />


        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.Owner'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: fullName,
            onChange: (e) => {
              setFullName(e.target.value);
            }
          }}
          width='md'
          name='fullname'
          placeholder='Fullname'
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
