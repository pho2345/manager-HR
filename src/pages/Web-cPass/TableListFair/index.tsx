import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { CopyTwoTone, DollarOutlined, EditTwoTone, ExclamationCircleOutlined, FileAddTwoTone, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProForm, ProFormDatePicker, ProFormDateTimePicker, ProFormSelect } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link } from '@umijs/max';
import { Button, Form, message, Modal, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import TableListAddCPassInFair from '../TableListAddCPassInFair';
//import DetailCPass from '../components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';


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

  if (fields?.c_passes[0]?.value) {
    const configCPass = fields?.c_passes.map((e: any) => {
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
  const plans = await customAPIGet({ 'fields[0]': 'name', 'fields[1]': 'profit' }, 'plans');

  let data = plans.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name + '-' + e?.attributes?.profit + '%',
    };
  });
  return data;
};



const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [copyModalOpen, handleCopyModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdFair = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [plan, setPlan] = useState<any>();

  const [currentFair, setCurrentFair] = useState<any>();
  const [showModalCPass, setShowModalCPass] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const getPlan = await getPlans();
      setPlan(getPlan);
    };
    getData();
  }, []);

  const confirm = (entity: any) => {
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


  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity.id);
              setShowDetail(true);
            }}
          >
            {entity?.code}

          </a>

        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.timeStart' defaultMessage='Ngày giờ mở bán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text) => {
        const weekday = 'T' + `${moment(text?.timeStart).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.timeEnd' defaultMessage='Ngày giờ đóng bán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => {
        const weekday = 'T' + `${moment(text?.timeEnd).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.dateStartFeed' defaultMessage='Ngày bắt đầu nuôi' />,
      dataIndex: 'dateStartFeed',
      valueType: 'textarea',
      key: 'dateStartFeed',
      renderText: (_, text: any) => {
        {
          const weekday = 'T' + `${moment(text?.dateStartFeed).weekday() + 1}`;
          return weekday + ' ' + moment(text?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
        }
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />,
      dataIndex: 'timeFeed',
      valueType: 'textarea',
      key: 'timeFeed',
      renderText: (_, text: any) => text?.timeFeed
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.plans' defaultMessage='PAHT Mega/PL' />,
      dataIndex: 'plans',
      valueType: 'dateRange',
      key: 'plans',
      render: (_, entity: any) => {
        return (
          <>
            {entity.plans.map((e: any) => (
              <>
                <div> {e.name}-{e.profit}</div>
              </>
            ))}

          </>
        )
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.cPassPublished' defaultMessage='cPass phát hành/Đã bán' />,
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.cPassPublished} / ${text?.quantitySellCpass}`
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Trạng thái' />,
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      renderText: (_, text: any) => text?.status,
      filters: true,
      onFilter: true,
      valueEnum: () => {
        return {
          'noOpen': {
            text: 'Chưa mở',
            value: 'noOpen'
          },
          'opening': {
            text: 'Đang mở',
            value: 'opening'
          },
          'closed': {
            text: 'Đã đóng',
            value: 'closed'
          },
        }

      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.unitPriceMeat' defaultMessage='Đơn giá thịt(VNĐ/kg)' />,
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      renderText: (_, text: any) => `${text?.unitPriceMeat}`
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.nameFarm' defaultMessage='Tên trang trại' />,
      dataIndex: 'nameFarm',
      valueType: 'textarea',
      key: 'nameFarm',
      renderText: (_, text: any) => text?.nameFarm
    },

    {
      title: <FormattedMessage id='pages.searchTable.payment' defaultMessage='Thanh toán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'payment',
      render: (_, entity: any) => {
        if (entity?.status === 'noOpen') {
          return (<DollarOutlined
            style={{
              fontSize: 20
            }}
            onClick={() => {

            }} />)
        }
        return null;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Thao tác' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        let configButton = [];
        configButton.push( /// button copy
          <>
            <Tooltip title='Sao chép'><CopyTwoTone
              style={{
                fontSize: 20,
                paddingLeft: 5
              }}

              onClick={async () => {
                handleCopyModalOpen(true);
                const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                delete fair.c_passes;
                const plans = fair.plans.map((e: any) => {
                  return e?.id
                })
                form.setFieldsValue({
                  ...fair,
                  plans
                })
              }
              }
            /></Tooltip>

            <Tooltip title='Thêm cPass'>
              <FileAddTwoTone
                style={{
                  fontSize: 20,
                  paddingLeft: 5
                }}
                onClick={() => {
                  setCurrentFair(entity?.id);
                  setShowModalCPass(true);
                }}

              ></FileAddTwoTone></Tooltip>

            <Tooltip title='Chỉ định'>
              <Link to={`/web-c-pass/fairs/add-mega-assign/` + entity.id}>
                <PlusOutlined
                  style={{
                    fontSize: 20,
                    paddingLeft: 5
                  }}
                  onClick={() => {
                  }}
                />
              </Link></Tooltip>
            <Tooltip title='Quản lí'>
              <Link to={`/web-c-pass/fairs/manager/` + entity.id}>
                <SettingOutlined
                  style={{
                    fontSize: 20,
                    paddingLeft: 5
                  }}
                />
              </Link> </Tooltip>
          </>
        )
        if (entity?.status === 'noOpen') {
          // button edit
          configButton.push(<>
            <Tooltip title='Sửa'><EditTwoTone
              style={{
                fontSize: 20,
                paddingLeft: 5
              }}
              onClick={async () => {
                handleUpdateModalOpen(true);
                refIdFair.current = entity.id;
                const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                const c_passes = fair?.c_passes.map((e: any) => {
                  return {
                    label: e?.cow?.name,
                    value: e?.id
                  }
                })
                const plans = fair.plans.map((e: any) => {
                  return e?.id
                })
                form.setFieldsValue({
                  ...fair,
                  c_passes,
                  plans
                })
              }}
            /></Tooltip>
          </>);
        }
        return configButton;
      }
    },
  ];




  return (
    <>
      <PageContainer>
        <ProTable
          search={false}
          actionRef={actionRef}
          rowClassName={record => {
            if (record.status !== 'opening') {
              return 'disable'
            }
            return '';
          }}
          rowKey='id'

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
          request={async () => {
            const data = await customAPIGet({}, 'fairs/fairadmin');
            return data
          }}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows: any) => {
              setSelectedRows(selectedRows);
            },
          }}

          toolbar={{
            settings: [{
              key: 'reload',
              tooltip: 'Tải lại',
              icon: <ReloadOutlined />,
              onClick: () => {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            },
              // {
              //   key: 'density',
              //   tooltip: 'Tải lại',
              //   icon: <ReloadOutlined />,
              //   onClick:() => {
              //     if (actionRef.current){
              //       actionRef.current.reload();
              //     }
              //   }
              // },

            ],
            // menu: {
            //   type: 'dropdown',
            //   activeKey: '1',
            //   items: [
            //     {
            //       key: '1',
            //       label: 1
            //     },
            //     {
            //       key: '2',
            //       label: 2
            //     }
            //   ]
            // },
            //  title: <Button>UUddU</Button>,
            //  filter: <Button>UUU</Button>
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

          </FooterToolbar>
        )}


        <ModalForm
          title={<FormattedMessage id='pages.listFair.createModal' defaultMessage='Tạo mới Phiên mở bán' />}
          open={createModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleModalOpen(false);
            },
          }}
          width={`76vh`}
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
            return true;
          }}

          submitter={{
            searchConfig: {
              resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
              submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
            },
          }}
        >
          <ProForm.Group>

            <ProFormDateTimePicker width='md' name="timeStart"
              label={<FormattedMessage id='pages.listFair.timeStart' defaultMessage='Thời gian mở' />}
              rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.timeStart' defaultMessage='Vui lòng chọn thời gian mở' /> },
              ]}
            />

            <ProFormDatePicker width='md' name="dateStartFeed"
              label={<FormattedMessage id='pages.listFair.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />}
              rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.dateStartFeed' defaultMessage='Vui lòng chọn thời gian bắt đầu nuôi' /> },
              ]}
            />

            <ProFormText width='md' name='timeFeed' placeholder='Thời gian nuôi'
              label={<FormattedMessage id='pages.listFair.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />}
              rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
              ]}
            />

            <ProFormText width='md' name='unitPriceMeat' placeholder='Đơn giá thịt' 
              label={<FormattedMessage id='pages.listFair.unitPriceMeat' defaultMessage='Đơn giá thịt(VND/Kg)' />}
              rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.unitPriceMeat' defaultMessage='Vui lòng nhập đơn giá thịt' /> },
              ]}
            />

            <ProFormText width='md' name='nameFarm' placeholder='Tên trang trại' 
               label= {<FormattedMessage id='pages.listFair.nameFarm' defaultMessage='Tên trang trại' />}
               rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.nameFarm' defaultMessage='Vui lòng nhập trang trại' /> },
              ]}
            />
            <ProFormSelect
              name="c_passes"
              label="Chọn cPass"
              request={getCPassNotFair}
              fieldProps={{
                mode: 'multiple',
              }}
              width='md'
              placeholder="Chọn cPass"
            />

            <ProFormSelect
              name="plans"
              label="Chọn PAHT"
              options={plan}
              fieldProps={{
                mode: 'multiple',
              }}
              width='md'
              placeholder="Chọn cPass"
            rules={[
              { required: true, message: <FormattedMessage id='pages.listFair.required.plans' defaultMessage='Vui lòng chọn PAHT' />  },
            ]}
            />
          </ProForm.Group>

        </ModalForm>


            
        <ModalForm
          title={<FormattedMessage id='pages.listFair.updateModal' defaultMessage='Cập nhật Phiên mở bán' />}
          open={updateModalOpen}
          form={form}
          width={`76vh`}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleUpdateModalOpen(false);
            },
          }}
          submitTimeout={2000}
          submitter={{
            searchConfig: {
              resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
              submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
            },
          }}
          
          onFinish={async (values) => {

            const success = await handleUpdate(values as any, refIdFair as any);
            if (success) {
              handleUpdateModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }

            return true;
          }}
          
        >
          <ProForm.Group>
            <ProFormText width='md' name='code' placeholder='Mã' disabled 
              label={<FormattedMessage id='pages.listFair.code' defaultMessage='Mã phiên mở bán' />}
            />
          
          <ProFormDateTimePicker width='md' name="timeStart"
              label={<FormattedMessage id='pages.listFair.timeStart' defaultMessage='Thời gian mở' />}
              rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.timeStart' defaultMessage='Vui lòng chọn thời gian mở' /> },
              ]}
            />

            <ProFormDateTimePicker name="timeEnd" width='md'
                label={<FormattedMessage id='pages.listFair.timeEnd' defaultMessage='Thời gian đóng' />}
            />

            <ProFormDatePicker width='md' name="dateStartFeed"
              label={<FormattedMessage id='pages.listFair.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />}
              rules={[
                { required: true, message: <FormattedMessage id='pages.listFair.required.dateStartFeed' defaultMessage='Vui lòng chọn thời gian bắt đầu nuôi' /> },
              ]}
            />

            <ProFormSelect
              width='md'
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
              rules={[{ required: true, message: <FormattedMessage id='pages.ListFair.timeStart' defaultMessage='Thời gian mở' /> }]}
            />
          
            <ProFormDateTimePicker width='md' name="dateStartFeed" label="Thời gian bắt đầu nuôi" />
            <ProFormDateTimePicker width='md' name="dateEndFeed" label="Thời gian kết thúc nuôi" />
            <ProFormText width='md' name='timeFeed' label='Thời gian nuôi(Tuần)' placeholder='Thời gian nuôi' />
            <ProFormText width='md' name='unitPriceMeat' label='Đơn giá thịt(VND/Kg)' placeholder='Đơn giá thịt' />
            <ProFormText width='md' name='nameFarm' label='Tên trang trại' placeholder='Tên trang trại' />

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
              options={plan}
              //request={getPlans}
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

        <ModalForm
          title='Sao chép Phiên mở bán'
          open={copyModalOpen}
          form={form}
          width={`76vh`}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleCopyModalOpen(false);
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {


            const success = await handleAdd(values);
            if (success) {
              handleCopyModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            // message.success('Success');
            return true;
          }}

          submitter={{
            searchConfig: {
              resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
              submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
            },
          }}
        >
        
          <ProForm.Group>
            <ProFormDateTimePicker width='md' name="timeStart" label="Thời gian mở" />
            <ProFormDateTimePicker width='md' name="timeEnd" label="Thời gian đóng" />
            <ProFormSelect
              width='md'
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

            <ProFormDateTimePicker width='md' name="dateStartFeed" label="Thời gian bắt đầu nuôi" />
            <ProFormDateTimePicker width='md' name="dateEndFeed" label="Thời gian kết thúc nuôi" />
            <ProFormText width='md' name='timeFeed' label='Thời gian nuôi(Tuần)' placeholder='Thời gian nuôi' />
            <ProFormText width='md' name='unitPriceMeat' label='Đơn giá thịt(VND/Kg)' placeholder='Đơn giá thịt' />
            <ProFormText width='md' name='nameFarm' label='Tên trang trại' placeholder='Tên trang trại' />

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
              options={plan}

              // valueEnum={}
              //request={getPlans}
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


        {/* <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.code && (
          <ProDescriptions
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columnsDetail}
          />
        )}
      </Drawer> */}

        {
          currentFair && (<>
            <TableListAddCPassInFair
              openModal={showModalCPass}
              currentFair={currentFair}
              onCloseModal={() => {
                setCurrentFair(undefined);
                setShowModalCPass(false);
              }}
            />
          </>)
        }



      </PageContainer>
      {currentRow && (
        <DetailFair
          openModal={showDetail}
          fairId={currentRow}
          closeModal={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
        />
      )
      }
    </>
  );
};

export default TableList;
