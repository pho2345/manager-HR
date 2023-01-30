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
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
//import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const getProvince = await customAPIGetOne(fields.province, 'provinces');
  const getDistrict = await customAPIGetOne(fields.district, 'districts');
  let values = {
    ...fields,
    pathName: `${fields.name}, ${getDistrict?.data?.attributes?.name}, ${getProvince?.data?.attributes?.name}`,
    pathFullName:  `${fields.fullName}, ${getDistrict?.data?.attributes?.fullname}, ${getProvince?.data?.attributes?.fullname}`,
  }
  console.log('wards', values);
  const hide = message.loading('Waiting...');
  try {
    await customAPIAdd({ ...values }, 'wards');
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleUpdate = async (fields: any, id: any) => {
  

 const getProvince = await customAPIGetOne(fields.province, 'provinces');
  const getDistrict = await customAPIGetOne(fields.district, 'districts');
  let values = {
    ...fields,
    pathName: `${fields.name}, ${getDistrict?.data?.attributes?.name}, ${getProvince?.data?.attributes?.name}`,
    pathFullName:  `${fields.fullName}, ${getDistrict?.data?.attributes?.fullname}, ${getProvince?.data?.attributes?.fullname}`,
  }
  
  const hide = message.loading('Configuring');
  try {
    await customAPIUpdate({
      ...values
    }, 'wards', id.current);
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};


const handleRemove = async (selectedRows: any) => {
  console.log(selectedRows);
  const hide = message.loading('Waiting...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'wards')
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


const getProvinces = async () => {
  let provinces = await customAPIGet({}, 'provinces');
  let data = provinces.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.fullname,
      pathName: e?.attributes?.name
    }
  })
  return data;
}

const getDistricts = async (value?: any) => {
  let provinces = await customAPIGet({ 'populate[0]': 'province', 'filters[province][id][$eq]': value }, 'districts');
  let data = provinces.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.fullname,
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
  const refIdWard = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [codeWard, setCodeWard] = useState<any>();
  const [nameWard, setNameWard] = useState<any>();
  const [fullName, setFullName] = useState<any>();
  const [province, setProvince] = useState<any>();
  const [provinceNew, setProvinceNew] = useState<any>();
  const [district, setDistrict] = useState<any>();
  const [selectDis, setSelectDis] = useState<any>();





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
      renderText: (_, text: any) => text?.attributes?.fullName
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pathName' defaultMessage='Path Name' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'pathName',
      renderText: (_, text: any) => text?.attributes?.pathName
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pathFullName' defaultMessage='Path fullname' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'pathFullName',
      renderText: (_, text: any) => text?.attributes?.pathFullName
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
            refIdWard.current = entity.id;
            setCodeWard(entity?.attributes?.code);
            setNameWard(entity?.attributes?.name);
            setFullName(entity?.attributes?.fullName);
            setSelectDis(entity?.attributes?.district?.data?.id);
            setProvince(entity?.attributes?.district?.data?.attributes?.province?.data?.id);


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
  const updateWard = async (values : any, id: any) => {
    const success = await handleUpdate(values as any, id);
    if (success) {
      handleUpdateModalOpen(false);
      form.resetFields();
      setProvince('');
      setSelectDis('');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  useEffect(() => {

    const getPro = async () => {
      if(province){
        let data =await getDistricts(province);
        setDistrict(data);
      }
      
    }
    getPro();

  }, [provinceNew])

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
              setProvince('');
              setSelectDis('');
            }}
          >
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='New' />
          </Button>,
        ]}
        request={() => customAPIGet({'populate': 'district.province'}, 'wards')}
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
        label="Mã"
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
        label="Tên"
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
          name='fullName'
          placeholder='Full Name'
        />

        <ProFormSelect
          name="province"
          label="Tỉnh thành"
          request={getProvinces}
          placeholder="Please select a country"
          rules={[{ required: true, message: 'Please select your country!' }]}
          // fieldProps={{
          //   onChange: (value) => {
          //     setProvinceNew(value);
          //     setSelectDis('');
          //   }
          // }}
        />

        <ProFormSelect
          name="district"
          label="Quận huyện"
          //request={() =>getDistricts(province)}
          options={district}
          placeholder="Please select a country"
          rules={[{ required: true, message: 'Please select your country!' }]}
          // fieldProps={{
          //   value: selectDis,
          //   onChange: (value) => {
          //    setSelectDis(value);
          //   },
          //   optionItemRender(item) {
          //     return item.label + ' - ' + item.value;
          //   },
            
          // }}
        />
      </ModalForm>


      <ModalForm
      form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.updateCategory',
          defaultMessage: 'New rule',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        
        onFinish={async () => {
          
          let values = {
            code: codeWard,
            name: nameWard,
            fullName: fullName,
            province: province,
            district: selectDis
          }

          await updateWard(values, refIdWard)
          
        }
      }
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
            value: codeWard,
            onChange: (e) => {
              setCodeWard(e.target.value);
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
            value: nameWard,
            onChange: (e) => {
              setNameWard(e.target.value);
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

      <ProFormSelect
          name="province"
          label="Select"
          request={getProvinces}
          placeholder="Chọn Tỉnh/Thành phố"
         // rules={[{ required: true, message: 'Please select your country!' }]}
          fieldProps={{
            value: province,
            onChange: (value) => {
              console.log(value);
              setProvince(value);
              setSelectDis('');
            }
          }}
        />

        <ProFormSelect
          name="district"
          label="Select"
          //request={() =>getDistricts(province)}
          options={district}
          placeholder="Chọn Quận/huyện"
         // rules={[{ required: true, message: 'Please select your country!' }]}
          fieldProps={{
            value: selectDis,
            onChange: (value) => {
             setSelectDis(value);
            },
            optionItemRender(item) {
              return item.label + ' - ' + item.value;
            },
            
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
          <ProDescriptions
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
