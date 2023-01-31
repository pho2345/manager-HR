import { customAPIGet, customAPIAdd, customAPIDelete, customAPIUpdate } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message, Switch, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';


const { Title } = Typography;
const handleAdd = async (fields: any) => {


  const hide = message.loading('Đang chờ...');
  try {
    await customAPIAdd({ ...fields }, 'c-passes');
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
  const hide = message.loading('Đang sửa...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'slots/currentweight', id.current);
    hide();

    message.success('Sửa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};


// const handleRemove = async (selectedRows: any) => {
//   console.log(selectedRows);
//   const hide = message.loading('Đang xóa...');
//   if (!selectedRows) return true;
//   try {
//     const deleteRowss = selectedRows.map((e: any) => {
//       return customAPIDelete(e.id, 'c_passes')
//     })

//     await Promise.all(deleteRowss);
//     hide();
//     message.success('Xóa thành công');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Xóa thất bại');
//     return false;
//   }
// };





const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdSlot  = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();

  const refAutoTransfer = useRef<any>();

  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Mã'
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
      title: <FormattedMessage id='pages.searchTable.column.preWeight' defaultMessage='Cân nặng trước' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'preWeight',
      renderText: (_, text: any) => text?.attributes?.preWeight,
      sorter: (a, b) => a?.attributes?.preWeight - b?.attributes?.preWeight,
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Cân nặng hiện tại' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => text?.attributes?.currentWeight

    },
    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='Chênh lệch cân nặng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, text: any) => text?.attributes?.deltaWeight
    },



    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeight' defaultMessage='Tăng trọng Mega' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'megaDeltaWeight',
      renderText: (_, text: any) => text?.attributes?.megaDeltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.nanoDeltaWeight' defaultMessage='Tăng trọng Nano' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'nanoDeltaWeight',
      renderText: (_, text: any) => text?.attributes?.nanoDeltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.indexSlot' defaultMessage='Thứ tự Slot' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'indexSlot',
      renderText: (_, text: any) => text?.attributes?.indexSlot
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='cPass' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'c_pass',
      renderText: (_, text: any) => text?.attributes?.c_pass
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Lợi nhuận Ale' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => text?.attributes?.produceAle
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.plan' defaultMessage='PHAT' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      renderText: (_, text: any) => text?.attributes?.plan
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.timeStart' defaultMessage='Thời gian bắt đầu' />,
      dataIndex: 'timeStart',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text: any) => moment(text?.attributes.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss')

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.timeEnd' defaultMessage='Thời gian kết thúc' />,
      dataIndex: 'timeEnd',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => moment(text?.attributes.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss')
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.activeSlot' defaultMessage='Trạng thái' />,
      dataIndex: 'activeSlot',
      valueType: 'textarea',
      key: 'activeSlot',
      renderText: (_, text: any) => {
        if (text?.attributes.activeSlot) {
          return 'true'
        }
        return 'false'
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        let dateEnd = moment(entity?.attributes.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD');
        let currentDate = moment().add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD');
        if (!entity?.attributes.activeSlot && dateEnd === currentDate) {
          return (<Button
            type='primary'
            key='primary'
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdSlot .current = entity.id;
              // setCodeProvince(entity?.attributes?.code);
              // setNameProvince(entity?.attributes?.name);
              // setFullName(entity?.attributes?.fullname);
              // setFsmCode(entity?.attributes?.fsmCode);

            }}
          >
            <FormattedMessage id='pages.searchTable.update' defaultMessage='New' />
          </Button>)
        }
        return null
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('YYYY-MM-DD HH:mm:ss')
      },
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
        pagination={{
          pageSize: 5
        }}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='Mới' />
          </Button>,
        ]}

        request={() => customAPIGet({}, 'slots')}
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
              <FormattedMessage id='pages.searchTable.item' defaultMessage='Item' />
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
        title="Tạo mới"
        open={createModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false)
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          console.log(values);
          const success = await handleAdd(values as any);
          if (success) {
            handleModalOpen(false);
            form.resetFields();
           
            if (actionRef.current) {
              actionRef.current.reload();

            }
          }
          //message.success('Success');
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="code"
            label="Mã"
            placeholder="Mã"
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
          />

          <ProFormSelect
            width="md"
  
            name="cow"
            label="Bò"
          />


        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="xs" name="pZero" label="P0" placeholder="P0" />
          <ProFormText width="xs" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại" />
          <ProFormText width="md" name="price" label="Giá" placeholder="Giá" />
        </ProForm.Group>
        <Title level={5}>Tự động chuyển đổi Ale</Title>
        <Switch defaultChecked={refAutoTransfer.current} onChange={() => { refAutoTransfer.current = !refAutoTransfer.current }} />
      </ModalForm>


      <ModalForm
        title="Cập nhật Slot"
        open={updateModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false)
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          console.log(values);
         const success = await handleUpdate(values as any, refIdSlot);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();

            if (actionRef.current) {
              actionRef.current.reload();

            }
          }
          //message.success('Success');
          return true;
        }}
      >
      
    
          <ProFormDigit
           
            width="md"
            name="currentWeight"
            label="Nhập cân nặng hiện tại"
            placeholder="Cân nặng hiện tại"
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
