import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProFormSelect } from '@ant-design/pro-components';
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


const handleAdd = async (fields: any) => {
  const getProvince = await customAPIGetOne(fields.province, 'provinces');
  let setFields = {
    ...fields,
    pathName: `${fields.name}, ${getProvince?.data?.attributes?.name}`,
    pathFullName: `${fields.fullname}, ${getProvince?.data?.attributes?.fullname}`
  }
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...setFields }, 'districts');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại');    
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  console.log(fields);
  const getProvince = await customAPIGetOne(fields.province, 'provinces');
 
  let setFields = {
    ...fields,
    pathName: `${fields.name}, ${getProvince?.data?.attributes?.name}`,
    pathFullName: `${fields.fullname}, ${getProvince?.data?.attributes?.fullname}`
  }
  const hide = message.loading('Cập nhật...');
  try {
    await customAPIUpdate({
      ...setFields
    }, 'districts', id.current);
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
      return customAPIDelete(e.id, 'districts')
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


const getProvinces = async () => {
    let provinces = await customAPIGet({}, 'provinces');
   let data = provinces.data.map((e : any) => {
    return {
      value : e?.id,
      label : e?.attributes?.fullname,
      pathName: e?.attributes?.name
    }
   })
   return data;
}
const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdDistrict = useRef<any>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [codeDistrict, setCodeDistrict] = useState<any>();
  const [nameDistrict, setNameDistrict] = useState<any>();
  const [fullName, setFullName] = useState<any>();  
  const [province, setProvince] = useState<any>();
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
      title: <FormattedMessage id='pages.searchTable.column.pathName' defaultMessage='Path Name' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'pathName',
      renderText: (_, text: any) => text?.attributes?.pathName
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.pathFullName' defaultMessage='Path Full Name' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'pathFullName',
      renderText: (_, text: any) => text?.attributes?.pathFullName
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.province' defaultMessage='Province' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'province',
      renderText: (_, text: any) => {
        return text?.attributes?.province?.data?.attributes?.fullname;
      }
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
            refIdDistrict.current = entity.id;
            setCodeDistrict(entity?.attributes?.code);
            setNameDistrict(entity?.attributes?.name);
            setFullName(entity?.attributes?.fullname);
            setProvince(entity?.attributes?.province?.data?.id);
           

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
              getProvinces();
            }}
          >
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='New' />
          </Button>,
        ]}
        request={() => customAPIGet({ 'populate': 'province' }, 'districts')}
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
                  defaultMessage='Yêu cầu nhập mã'
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
                  id='pages.searchTable.fullName'
                  defaultMessage='Yêu cầu nhập tên đầy đủ'
                />
              ),
            },
          ]}
          width='md'
          name='fullname'
          placeholder='Tên đầy đủ'
        />

        <ProFormSelect
          name="province"
          label="Quận huyện"
          request={getProvinces}
          placeholder="Chọn quận huyện"
          rules={[{ required: true, message: 'Chọn quận huyện!' }]}
          fieldProps={{
            onChange : (value) => {
              console.log(value)
            }
          }}  
        />


      </ModalForm>

      <ModalForm
        form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.updateDis',
          defaultMessage: 'New rule',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async () => {
          let values = {
            code: codeDistrict,
            name: nameDistrict,
            fullname: fullName,
            province: province

          }
          const success = await handleUpdate(values as any, refIdDistrict);
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
          //         defaultMessage='Code is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: codeDistrict,
            onChange: (e) => {
              setCodeDistrict(e.target.value)
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
          //         defaultMessage='Name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: nameDistrict,
            onChange: (e) => {
              setNameDistrict(e.target.value)
            }
          }}
          width='md'
          name='name'
          label='Tên'
          placeholder='Tên'
        />

        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.fullName'
          //         defaultMessage='Fullname is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: fullName,
            onChange: (e) => {
              setFullName(e.target.value)
            }
          }}
          width='md'
          name='fullname'
          label='Tên đầy đủ'
          placeholder='Tên đầy đủ'
        />

        <ProFormSelect
          name="province"
          label="Tỉnh thành"
          request={getProvinces}
          placeholder="Chọn tỉnh thành"
          rules={[{ required: true, message: 'Chọn tỉnh thành!' }]}
          fieldProps={{
            value: province,
            onChange : (value) => {
              setProvince(value);
            }
          }}  
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
