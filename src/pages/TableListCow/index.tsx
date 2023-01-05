import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIUpload } from '@/services/ant-design-pro/api';
import {  PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProForm, ProFormDatePicker, ProFormSelect, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Avatar, Button, Drawer, Form, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  // console.log(fields);
  // let formdata = new FormData();
  // formdata.append('files',fields.upload[0]);
  
  // const fetch = await customAPIUpdate( {
  //   data: formdata
  // })
  // console.log(fetch);

  const hide = message.loading('Waiting...');
  try {
    await customAPIAdd({ ...fields }, 'cows');
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
    }, 'cows', id.current);
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
      return customAPIDelete(e.id, 'cows')
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


const getCategory = async () => {
  const categories = await customAPIGet({}, 'categories');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    }
  })
  return data;
}

const getFarm = async () => {
  const categories = await customAPIGet({}, 'farms');
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
  const [codeProvince, setCodeProvince] = useState<any>();
  const [nameProvince, setNameProvince] = useState<any>();
  const [fullName, setFullName] = useState<any>();
  const [fsmCode, setFsmCode] = useState<any>();
  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();

  useEffect(() => {
    const getValues = async () => {
      let getCate = await getCategory();
      let getFarms = await getFarm();
      setCategory(getCate);
      setFarm(getFarms);

    }
    getValues();
  }, [])

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
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Tên' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Cân nặng sơ sinh' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.attributes?.firstWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.photos' defaultMessage='Hình ảnh' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'photos',
      render: (_, text: any) => {
       
  
        return (
          <Avatar.Group
            maxCount={2}
            maxPopoverTrigger="click"
            size="large"
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
          >
           {text?.attributes?.photos?.data?.map((e: any, index: any) => {
           
               return(<Avatar key={index} src={`https://1337-innoria-aleger-n6eaffn9h78.ws-us80.gitpod.io/`+e?.attributes?.url} />)
            
           })}
            
          </Avatar.Group>
        )
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.sex' defaultMessage='Giới tính' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'sex',
      renderText: (_, text: any) => text?.attributes?.sex
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.category' defaultMessage='Giống loài' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.attributes?.category?.data?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => text?.attributes?.age
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.birthdate).format('YYYY-MM-DD HH:mm:ss')
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
        request={() => customAPIGet({ 'populate[0]': 'category', 'populate[1]': 'farm', 'populate[2]': 'photos' }, 'cows')}
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
        title="New"
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
          />

          <ProFormText width="md" name="name" label="Tên" placeholder="Tên" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="firstWeight" label="Cân nặng ban đầu" placeholder="Cân nặng ban đầu" />
          <ProFormText width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            options={category}
            width="md"
            name="category"
            label="Giống bò"
          />
          <ProFormSelect
            width="md"
            options={farm}
            name="farm"
            label="Farm"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="birthdate" label="Ngày sinh" />
          <ProFormText width="xs" name="age" label="Tuổi" placeholder="Tuổi" />
          <ProFormSelect
            width='xs'
            name='sex'
            label='Giới tính'
            options={[
              {
                label: 'Male', value: 'male',
              },
              {
                label: 'Female', value: 'female'
              }
            ]}
            placeholder='Please select a country'
            rules={[{ required: true, message: 'Please select your country!' }]}
          />
          <ProFormSelect
            width='xl'
            name='status'
            label='Trạng thái'
            options={[
              {
                label: 'Mới', value: 'new',
              },
              {
                label: 'Sẳn sàng', value: 'ready',
              },
              {
                label: 'Đã thêm vào CPass', value: 'cpassAdded',
              },
              
              {
                label: 'Đã thêm vào phiên', value: 'fairAdded',
              },
              {
                label: 'Đã ở trong phiên mở bán', value: 'fairOpen',
              },
              {
                label: 'Trong đặt hàng của phiên', value: 'fairOrder',
              },
              {
                label: 'Đã thanh toán', value: 'paid',
              },
              {
                label: 'Sẵn sàng nuôi', value: 'readyFeed',
              },
              {
                label: 'Chờ nuôi', value: 'waitingFeed',
              },
              
            ]}
            placeholder='Please select a country'
            rules={[{ required: true, message: 'Please select your country!' }]}
          />
        </ProForm.Group>

        <ProFormUploadButton
          name="upload"
          label="Upload"
          max={2}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            
          }}
          action={ () => customAPIUpload({})}
        
        />
        <input type='file' name='image'/>
        <ProFormTextArea width="xl" label="Mô tả chi tiết" name="description" />
      </ModalForm>


      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.updateCategory',
          defaultMessage: 'New rule',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          
          const success = await handleUpdate(value as any, refIdProvince);
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

        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.accountNumber'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: fsmCode,
            onChange: (e) => {
              setFsmCode(e.target.value);
            }
          }}
          width='md'
          name='fsmCode'
          placeholder='FSM Code'
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
