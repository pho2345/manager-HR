import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProForm, ProFormDatePicker, ProFormDateTimePicker, ProFormSelect } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';


const handleAdd = async (fields: any) => {

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();

  
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'fairs');
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
  if(fields?.c_passes[0]?.value){
   const  configCPass = fields?.c_passes.map((e: any) => {
    return e.value;
   });
   fields.c_passes = configCPass;
  }
  
  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();


  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'fairs', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};


const handleRemove = async (selectedRows: any) => {
  console.log(selectedRows);
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'fairs')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại');
    return false;
  }
};

const getCPassNotFair = async () => {
  const cPass = await customAPIGet({}, 'c-passes/get/cpassnotfair');
  let data = cPass.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.cow?.name,
    };
  });
 return data;
};




const getPlans = async () => {
  const plans = await customAPIGet({'fields[0]': 'name', 'fields[1]': 'profit'}, 'plans');

  let data = plans.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name + '-' + e?.attributes?.profit+'%',
    };
  });
return data;
};

const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdFair = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();


  const confirm = (entity : any) => {
    Modal.confirm({
    
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có muốn xóa?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleRemove(entity);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } 
    });
  };

  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity?.code);
              setShowDetail(true);
            }}
          >
            {entity?.code}

          </a>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.timeStart' defaultMessage='Thời gian mở' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text: any) => moment(text?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.timeEnd' defaultMessage='Thời gian đóng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => moment(text?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss')

    },
    {
      title: <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Trạng thái' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'status',
      renderText: (_, text: any) => text?.status
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />,
      dataIndex: 'dateStartFeed',
      valueType: 'textarea',
      key: 'dateStartFeed',
      renderText: (_, text: any) => moment(text?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss')

    },
    {
      title: <FormattedMessage id='pages.searchTable.column.dateEndFeed' defaultMessage='Thời gian kết thúc nuôi' />,
      dataIndex: 'dateEndFeed',
      valueType: 'textarea',
      key: 'dateEndFeed',
      renderText: (_, text: any) => moment(text?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.unitPriceMeat' defaultMessage='Đơn giá thịt' />,
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      //renderText: (_, text: any) => text?.status
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.nameFarm' defaultMessage='Tên trang trại' />,
      dataIndex: 'nameFarm',
      valueType: 'textarea',
      key: 'nameFarm',
      //renderText: (_, text: any) => text?.status
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.quantitySellCpass' defaultMessage='Số lượng CPass đã bán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'quantitySellCpass',
      renderText: (_, text: any) => text?.quantitySellCpass
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.quantityRemainCpass' defaultMessage='Số lượng CPass còn lại' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'quantityRemainCpass',
      renderText: (_, text: any) => text?.quantityRemainCpass
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.totalSell' defaultMessage='Tổng số tiền bán được' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'totalSell',
      renderText: (_, text: any) => {
        if (text.totalSell) {
          return `${text?.totalSell} VNĐ`
        }
        return null
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.totalRemain' defaultMessage='Tổng số tiền còn lại' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'totalRemain',
      renderText: (_, text: any) => {
        if (text.totalRemain) {
          return `${text?.totalRemain} VNĐ`
        }
        return null
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.totalRemain' defaultMessage='PAHT' />,
      dataIndex: 'plans',
      valueType: 'dateRange',
      key: 'plans',
      render: (_, entity: any) => {
        return (
          <>
            {entity.plans.map((e: any) => (
              <>
                <div> {e.code} - {e.profit}</div>
              </>
            ))}

          </>
        )
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        if(entity?.status === 'noOpen'){
          return (<Button
            type='primary'
            key='primary'
            onClick={ async () => {
              refIdFair.current = entity.id;
              handleUpdateModalOpen(true);
              const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', { });
              fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
              fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
              fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour')  .format('YYYY-MM-DD HH:mm:ss');
              fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
            

              const c_passes = fair?.c_passes.map((e: any) => {
                return {
                  label: e?.cow?.name,
                  value: e?.id
                }
              })
              const plans = fair.plans.map((e: any) => {
                return  e?.id
                  //label: e?.name + '-' + e?.profit,
                
                
              })
              form.setFieldsValue({
                ...fair,
                c_passes,
                plans
              })
              // form.setFieldValue('c_passes', cPass);
              // form.setFieldValue('c_passes', cPass);
              
  
            }}
          >
            <FormattedMessage id='pages.searchTable.update' defaultMessage='Cập nhật' />
          </Button>)
        }
       
          return null;
  
        
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
        request={() => customAPIGet({}, 'fairs/fairadmin')}
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
              //await handleRemove(selectedRowsState);
              await confirm(selectedRowsState);
              setSelectedRows([]);
              //actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Batch deletion'
            />
          </Button>
          {/* <Button type='primary'>
            <FormattedMessage
              id='pages.searchTable.batchApproval'
              defaultMessage='Batch approval'
            />
          </Button> */}
        </FooterToolbar>
      )}


      <ModalForm
        title='Tạo mới Phiên mở bán'
        open={createModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
      
          const success = await handleAdd(values as any);
          if (success) {
            handleModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
         // message.success('Success');
          return true;
        }}
      >
        <ProForm.Group>
          {/* <ProFormText width='md' name='code' label='Mã' placeholder='Mã' /> */}
        </ProForm.Group>
        <ProForm.Group>


          <ProFormDateTimePicker name="timeStart" label="Thời gian mở" />
          <ProFormDateTimePicker name="timeEnd" label="Thời gian đóng" />
          <ProFormSelect
            width='xs'
            name='status'
            label='Trạng thái'
            options={[
              {
                label: 'Chưa mở',
                value: 'noOpen',
              },
              {
                label: 'Đang mở',
                value: 'Opening',
              },
              {
                label: 'Đã đóng',
                value: 'closed',
              },
            ]}
            placeholder='Trạng thái'
           // rules={[{ required: true, message: 'Chọn Trạng thái!' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
        {/* <ProFormDateTimePicker name="dateStartFeed" label="Thời gian bắt đầu nuôi" /> */}
        <ProFormDatePicker name="dateStartFeed" label="Thời gian bắt đầu nuôi" />
        <ProFormText width='xs' name='timeFeed' label='Thời gian nuôi(Tuần)' placeholder='Thời gian nuôi' />
        <ProFormDatePicker name="dateEndFeed" label="Thời gian kết thúc nuôi" disabled/>
        {/* <ProFormDateTimePicker name="dateEndFeed" label="Thời gian kết thúc nuôi" />           */}
        
        <ProFormText width='xs' name='unitPriceMeat' label='Đơn giá thịt(VND/Kg)' placeholder='Đơn giá thịt' />
        <ProFormText width='xs' name='nameFarm' label='Tên trang trại' placeholder='Tên trang trại' />

        <ProFormSelect
            name="c_passes"
            label="Chọn cPass"
            // valueEnum={}
            request={getCPassNotFair}
            fieldProps={{
              mode: 'multiple',
            }}
            width='md'
            placeholder="Chọn cPass"
            // rules={[
            //   { required: true, message: 'Vui lòng chọn cPass!', type: 'array' },
            // ]}
          />


          

        <ProFormSelect
            name="plans"
            label="Chọn Plans"
            // valueEnum={}
            request={getPlans}
            fieldProps={{
              mode: 'multiple',
            }}
            width='md'
            placeholder="Chọn cPass"
            // rules={[
            //   { required: true, message: 'Vui lòng chọn cPass!', type: 'array' },
            // ]}
          />
        </ProForm.Group>

      </ModalForm>


      <ModalForm
        title='Cập nhật Phiên mở bán'
        open={updateModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          console.log(values);
      
          const success = await handleUpdate(values as any, refIdFair as any);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
         // message.success('Success');
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormText width='md' name='code' label='Mã' placeholder='Mã' />
        </ProForm.Group>
        <ProForm.Group>


          <ProFormDateTimePicker name="timeStart" label="Thời gian mở" />
          <ProFormDateTimePicker name="timeEnd" label="Thời gian đóng" />
          <ProFormSelect
            width='xs'
            name='status'
            label='Trạng thái'
            options={[
              {
                label: 'Chưa mở',
                value: 'noOpen',
              },
              {
                label: 'Đang mở',
                value: 'Opening',
              },
              {
                label: 'Đã đóng',
                value: 'closed',
              },
            ]}
            placeholder='Trạng thái'
            rules={[{ required: true, message: 'Chọn Trạng thái!' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
        <ProFormDateTimePicker name="dateStartFeed" label="Thời gian bắt đầu nuôi" />
        <ProFormDateTimePicker name="dateEndFeed" label="Thời gian kết thúc nuôi" />          
        <ProFormText width='xs' name='timeFeed' label='Thời gian nuôi(Tuần)' placeholder='Thời gian nuôi' />
        <ProFormText width='xs' name='unitPriceMeat' label='Đơn giá thịt(VND/Kg)' placeholder='Đơn giá thịt' />
        <ProFormText width='xs' name='nameFarm' label='Tên trang trại' placeholder='Tên trang trại' />

        <ProFormSelect
            name="c_passes"
            label="Chọn cPass"
            // valueEnum={}
            request={getCPassNotFair}
            fieldProps={{
              mode: 'multiple',
            }}
            width='md'
            placeholder="Chọn cPass"
           
          />


          

        <ProFormSelect
            name="plans"
            label="Chọn Plans"
            // valueEnum={}
            request={getPlans}
            fieldProps={{
              mode: 'multiple',
            }}
            width='md'
            placeholder="Chọn cPass"
            rules={[
              { required: true, message: 'Vui lòng chọn cPass!', type: 'array' },
            ]}
          />
        </ProForm.Group>

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
