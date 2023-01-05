import { customAPIGet, customAPIAdd, customAPIDelete } from '@/services/ant-design-pro/api';
import {  PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProForm, ProFormSelect } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import {  Button, Drawer, Form, message, Switch, Typography  } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';


const { Title } = Typography;
const  handleAdd = async (fields: any) => {
  

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


// const handleUpdate = async (fields: any, id: any) => {
//   console.log(fields);
//   const hide = message.loading('Đang sửa...');
//   try {
//     await customAPIUpdate({
//       ...fields
//     }, 'c_passes', id.current);
//     hide();

//     message.success('Sửa thành công');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Sửa thất bại!');
//     return false;
//   }
// };


const handleRemove = async (selectedRows: any) => {
  console.log(selectedRows);
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'c_passes')
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
  const categories = await customAPIGet({'filters[c_pass][id][$null]': true}, 'cows');
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
  const refIdProvince = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();

  const [cow, setCow] = useState<any>();

  const refAutoTransfer = useRef<any>();

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
      tip: 'Mã là duy nhất',
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
      title: <FormattedMessage id='pages.searchTable.column.slot' defaultMessage='Đợt mở bán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'fair',
      renderText: (_, text: any) => text?.attributes?.fair?.data?.attributes?.code
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.users_permissions_user' defaultMessage='Người sở hữu(Mega)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'users_permissions_user',
      renderText: (_, text: any) => text?.attributes?.owner?.data?.attributes?.username
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.plan' defaultMessage='Phương án' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      renderText: (_, text: any) => {
        if(text.attributes.plan.data){
          return `${text?.attributes?.plan?.data?.attributes?.name} - ${text?.attributes?.plan?.data?.attributes?.profit}%`
        }
        
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bo' defaultMessage='Bò' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'cow',
      renderText: (_, text: any) => text?.attributes?.cow?.data?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='Cân nặng ban đầu' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => text?.attributes?.pZero
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Cân nặng hiện tại' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => text?.attributes?.nowWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='Tăng trọng cân nặng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, text: any) => text?.attributes?.deltaWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'bodyCondition',
      renderText: (_, text: any) => text?.attributes?.bodyCondition
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='Hiệu quả tăng trọng(%)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => text?.attributes?.wgePercent
    },
    
    {
      title: <FormattedMessage id='pages.searchTable.column.wge' defaultMessage='Hiệu quả tăng trọng(WGE)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wge',
      renderText: (_, text: any) => text?.attributes?.wge
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng trung bình(kg)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.attributes?.awgAvg
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awg' defaultMessage='Tăng trọng TB(AWG)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awg',
      renderText: (_, text: any) => text?.attributes?.awg
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgs' defaultMessage='Tăng trọng tiêu chuẩn(WGS)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgs',
      renderText: (_, text: any) => text?.attributes?.wgs
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
      title: <FormattedMessage id='pages.searchTable.column.activeAleTransfer' defaultMessage='Tự động chuyển đổi' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'activeAleTransfer',
      render: (_, text: any) => (<Switch defaultChecked={text?.attributes.activeAleTransfer} />)
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
          onClick={() => {
            handleUpdateModalOpen(true);
            refIdProvince.current = entity.id;
            // setCodeProvince(entity?.attributes?.code);
            // setNameProvince(entity?.attributes?.name);
            // setFullName(entity?.attributes?.fullname);
            // setFsmCode(entity?.attributes?.fsmCode);

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
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='Mới' />
          </Button>,
        ]}
        request={() => customAPIGet({ 'populate[0]': 'cow.category', 'populate[1]': 'fair', 'populate[2]': 'plan', 'populate[3]': 'owner' }, 'c-passes')}
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
            options={cow}
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
        <Switch defaultChecked={refAutoTransfer.current} onChange={() => {refAutoTransfer.current = !refAutoTransfer.current}} />
      </ModalForm>


      <ModalForm
        title="Tạo mới"
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
          />

          
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="xs" name="pZero" label="P0" placeholder="P0" />
          <ProFormText width="xs" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại" />
          <ProFormText width="md" name="price" label="Giá" placeholder="Giá" />
        </ProForm.Group>
        <Title level={5}>Tự động chuyển đổi Ale</Title>
        <Switch defaultChecked={refAutoTransfer.current} onChange={() => {refAutoTransfer.current = !refAutoTransfer.current}} />
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
