import {  customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
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



const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang tải...');
  try {
    await customAPIAdd({ ...fields }, 'banks');
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
  const hide = message.loading('Đang chỉnh sửa');
  try {
    await customAPIUpdate({
      ...fields
    },'banks', id.current);
    hide();

    message.success('Sửa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id,'banks')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại, Vui lòng thử lại!!');
    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
 
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const refIdBank = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [codeBank, setCodeBank] = useState<any>();
  const [nameBank, setNameBank] = useState<any>();
  const [shortNameBank, setShortNameBank] = useState<any>();

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
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              console.log(entity)
              setShowDetail(true);
            }}
          >
            {entity?.attributes?.code}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Tên' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.shortName'
          defaultMessage='Tên viết tắt'
        />
      ),
      key: 'shortName',
      dataIndex: 'shortName',
      renderText: (_, val: any) => val?.attributes?.shortName
    }
    ,
    
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity : any) => {
        return (<Button
          type='primary'
          key='primary'
          onClick={() => {
            handleUpdateModalOpen(true);
            refIdBank.current = entity.id;
            setCodeBank(entity?.attributes?.code);
            setNameBank(entity?.attributes?.name);
            setShortNameBank(entity?.attributes?.shortName);


          }}
        >
          <FormattedMessage id='pages.searchTable.update' defaultMessage='Mới' />
        </Button>)
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
        request={() => customAPIGet({}, 'banks')}
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
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Đã chọn' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id='pages.searchTable.item' defaultMessage='hàng' />
              &nbsp;&nbsp;
              <span>
               
               
              </span>
            </div>
          }
        >
          <Button 
          
          style={{
           // backgroundColor: 'red'
          }}
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Xóa'
            />
          </Button>
          
        </FooterToolbar>
      )}
      <ModalForm
        form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newBank',
          defaultMessage: 'Tạo mới ngân hàng',
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
                  defaultMessage='Yêu cầu nhập code!'
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
                  defaultMessage='Yêu cầu nhập tên'
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
                  id='pages.searchTable.shortName'
                  defaultMessage=''
                />
              ),
            },
          ]}
          width='md'
          name='shortName'
          placeholder='Tên viết tắt'
        />

      </ModalForm>
  

<ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.updateBank',
          defaultMessage: '',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async () => {
          let values = {
            code: codeBank,
            name: nameBank,
            shortName: shortNameBank
          }
          const success = await handleUpdate(values as any, refIdBank);
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
            value : codeBank,
            onChange : (e) => {
              setCodeBank(e.target.value);
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
            value : nameBank,
            onChange : (e) => {
              setNameBank(e.target.value);
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
          //         id='pages.searchTable.shortName'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value : shortNameBank,
            onChange : (e) => {
              setShortNameBank(e.target.value);
            }
          }}
          width='md'
          name='shortName'
          placeholder='Tên viết tắt'
        />

      </ModalForm>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          //setCurrentRow(undefined);
          console.log(currentRow);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.attributes.name && (
          <ProDescriptions
            column={3}
            title={currentRow?.attributes?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.Bank>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
