import { customAPIGet, customAPIAdd, customAPIDelete, customAPIUpdate, customAPIGetOne, } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

// function renderTableAlertOption(selectedRows: any, onCleanSelected: any) {
//   return (
//     <>
//       <Fragment>
//         <Button onClick={() => onCleanSelected()}>Bỏ chọn</Button>
//       </Fragment>
//     </>
//   );
// }

const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang chờ...');
  try {
    await customAPIAdd({ ...fields }, 'c-passes/create');
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

  if (fields.cow.value) {
    fields.cow = fields.cow.value;
  }
  console.log(fields);
  const hide = message.loading('Đang sửa...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'c-passes', id.current);
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
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'c-passes')
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




const getCownotInCpass = async () => {
  const categories = await customAPIGet({ 'filters[c_pass][id][$null]': true }, 'cows');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    }
  })
  return data;
}
const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCpass = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [cow, setCow] = useState<any>();
  useEffect(() => {
    const getValues = async () => {
      let getCow = await getCownotInCpass();
      setCow(getCow);

    }
    getValues();
  }, [])

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
              setCurrentRow(entity?.code);
              setShowDetail(true);
            }}
          >
            {entity?.code}

          </a>
        //   <Link to={`/cows/` + entity.id}>
        //   {entity?.code}
        // </Link>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'fair',
      renderText: (_, text: any) => text?.fair?.code
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.users_permissions_user' defaultMessage='Người sở hữu(Mega)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'users_permissions_user',
      renderText: (_, text: any) => text?.owner?.username
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.plan' defaultMessage='Phương án' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      renderText: (_, text: any) => {
        if (text?.plan) {
          return `${text?.plan?.name} - ${text?.plan?.profit}%`
        }
        return null;

      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bo' defaultMessage='Bò' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'cow',
      renderText: (_, text: any) => text?.cow?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='Cân nặng P0' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => text?.pZero
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Cân nặng hiện tại' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => text?.nowWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='Tăng trọng cân nặng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, text: any) => text?.deltaWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'bodyCondition',
      renderText: (_, text: any) => text?.bodyCondition
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='Hiệu quả tăng trọng(%)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => text?.wgePercent
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.wge' defaultMessage='Hiệu quả tăng trọng(WGE)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wge',
      renderText: (_, text: any) => text?.wge
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng trung bình(kg)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awg' defaultMessage='Tăng trọng TB(AWG)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awg',
      renderText: (_, text: any) => text?.awg
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgs' defaultMessage='Tăng trọng tiêu chuẩn(WGS)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgs',
      renderText: (_, text: any) => text?.wgs
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeight' defaultMessage='Tăng trọng Mega' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'megaDeltaWeight',
      renderText: (_, text: any) => text?.megaDeltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.nanoDeltaWeight' defaultMessage='Tăng trọng Nano' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'nanoDeltaWeight',
      renderText: (_, text: any) => text?.nanoDeltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.activeAleTransfer' defaultMessage='Tự động chuyển đổi' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'activeAleTransfer',
      render: (_, text: any) => (<Switch checked={text?.activeAleTransfer} disabled />)
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Lợi nhuận Ale' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => text?.attributes?.produceAle
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
          onClick={async () => {
            handleUpdateModalOpen(true);
            refIdCpass.current = entity.id;
            const cPass = await customAPIGetOne(entity.id, 'c-passes/get/find-admin', { });
            //const cowNotCpass = await getCownotInCpass();
            console.log(cPass);
            // const cowForm = [
            //   ...cowNotCpass,
            //   {
            //     value: cPass?.data?.attributes?.cow?.data?.id,
            //     label: cPass?.data?.attributes?.cow?.data?.attributes?.name,
            //   }
            // ]

            form.setFieldsValue({
              cow: {
                value: cPass?.cow?.id,
                label: cPass?.cow?.name,
              },
              code: cPass?.code,
              pZero: cPass?.pZero,
              price: cPass?.price,
              nowWeight: cPass?.nowWeight,
              activeAleTransfer: cPass?.activeAleTransfer
            })
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
        return moment(text?.createdAt).format('YYYY-MM-DD HH:mm:ss')
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
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='Mới' />
          </Button>,
        ]}
        request={() => customAPIGet({  }, 'c-passes/get/find-admin')}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
        }}

        pagination={{
          locale: {
           next_page: 'Trang sau',
           prev_page: 'Trang trước',
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
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
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              const getCow = await getCownotInCpass();
              setCow(getCow);
              actionRef.current?.reloadAndRest?.();
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
            const getCow = await getCownotInCpass();
            setCow(getCow);
            if (actionRef.current) {
              actionRef.current.reload();

            }
          }
          //message.success('Success');
          return true;
        }}
      >
        <ProForm.Group>
          {/* <ProFormText
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
          /> */}

          <ProFormSelect
            width="md"
            options={cow}
            name="cow"
            label="Bò"
            placeholder="Chọn bò"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.chosenCow'
                    defaultMessage='Vui lòng chọn Bò!'
                  />
                ),
              },
            ]}
          />


        
          {/* <ProFormText width="md" name="pZero" label="P0" placeholder="P0"  rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  />
                ),
              },
            ]}/> */}

          <ProFormDigit min={1} max={1000} width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập cân nặng hiện tại'
                  />
                ),
              },
            ]}
             />

    <ProFormDigit min={1} max={1000} width="md" name="weightInStable" label="Cân nặng nhập chuồng" placeholder="Cân nặng nhập chuồng"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập nân nặng nhập chuồng'
                  />
                ),
              },
            ]}
             /> 

         <ProFormDatePicker name="dateInStable" label="Ngày nhập chuồng" />

          {/* <ProFormDigit min={1} max={1000} width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  />
                ),
              },
            ]} /> */}



          <ProFormDigit  min={1} width="md" name="vs" label="Chi phí bảo trì và bảo hiểm" placeholder="Chi phí bảo trì và bảo hiểm" rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.Cpass.pZero'
                  defaultMessage='Nhập chi phí bảo trì và bảo hiểm'
                />
              ),
            },
          ]} />
          <ProFormDigit min={1} width="md" name="vZero" label="Giá trị con bò của Mega" placeholder="Giá trị con bò của Mega" required />
          <ProFormSwitch name="activeAleTransfer" label="Tự động chuyển đổi Ale" />
        </ProForm.Group>


      </ModalForm>


      <ModalForm
        title="Cập nhật"
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
          const success = await handleUpdate(values as any, refIdCpass);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            const getCow = await getCownotInCpass();
            setCow(getCow);
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
          />

          <ProFormSelect
            width="md"
            options={cow}
            name="cow"
            label="Bò"
            placeholder="Chọn bò"
          />


        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="xs" name="pZero" label="P0" placeholder="P0" />
          <ProFormText width="xs" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại" />
          <ProFormText width="sm" name="price" label="Giá" placeholder="Giá" />
          <ProFormSwitch name="activeAleTransfer" label="Tự động chuyển đổi Ale" />
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
