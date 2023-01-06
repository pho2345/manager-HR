import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdate,
  customAPIDelete,
  customAPIUpload,
  customAPIGetOne,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
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


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    const cow = await customAPIAdd({ ...fields }, 'cows');

    const uploadImages = fields?.upload.map((e: any) => {
      let formdata = new FormData();
      formdata.append('files', e?.originFileObj);
      formdata.append('ref', 'api::cow.cow');
      formdata.append('refId', cow?.data?.id);
      formdata.append('field', 'photos');
      return customAPIUpload({
        data: formdata
      })
    });
    await Promise.all(uploadImages);
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
  console.log(id);
 
  const hide = message.loading('Đang cập nhật...');
  try {

    
    
    const uploadImages = fields?.upload.map((e: any) => {
      if(e.originFileObj){
      let formdata = new FormData();
      formdata.append('files', e?.originFileObj);
      formdata.append('ref', 'api::cow.cow');
      formdata.append('refId', id.current);
      formdata.append('field', 'photos');
      return customAPIUpload({
        data: formdata
      })}
      return null;
    });
    await Promise.all(uploadImages);
    await customAPIUpdate(
      {
        ...fields,
      },
      'cows',
      id.current,
    );
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
      return customAPIDelete(e.id, 'cows');
    });

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

const getCategory = async () => {
  const categories = await customAPIGet({}, 'categories');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    };
  });
  return data;
};

const getFarm = async () => {
  const categories = await customAPIGet({}, 'farms');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    };
  });
  return data;
};
const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCow = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();

  useEffect(() => {
    const getValues = async () => {
      let getCate = await getCategory();
      let getFarms = await getFarm();
      setCategory(getCate);
      setFarm(getFarms);
    };
    getValues();
  }, []);

  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
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
      renderText: (_, text: any) => text?.attributes?.name,
    },
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.firstWeight'
          defaultMessage='Cân nặng sơ sinh'
        />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.attributes?.firstWeight,
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
            maxPopoverTrigger='click'
            size='large'
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
          >
            {text?.attributes?.photos?.data?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.attributes?.url
                  }
                />
              );
            })}
          </Avatar.Group>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.sex' defaultMessage='Giới tính' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'sex',
      renderText: (_, text: any) => text?.attributes?.sex,
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.category' defaultMessage='Giống loài' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.attributes?.category?.data?.attributes?.name,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => text?.attributes?.age,
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.birthdate).format('YYYY-MM-DD HH:mm:ss');
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (
          <Button
            type='primary'
            key='primary'
            onClick={async () => {
              handleUpdateModalOpen(true);
              refIdCow.current = entity.id;
              const cow = await customAPIGetOne(entity.id, 'cows', { 'populate[0]': 'category', 'populate[1]': 'farm', 'populate[2]': 'photos' });
              const photos = cow.data?.attributes?.photos?.data;
              console.log(photos);
              const photoCow = photos.map((e: any) => {
                return { uid: e.id, name: e.attributes.name, status: 'done', url: SERVERURL + e.attributes.url }
              })
              //console.log(photoCow);
              form.setFieldsValue({
                ...cow.data?.attributes,
                category: cow.data?.attributes?.category?.data?.id,
                farm: cow.data?.attributes?.farm?.data?.id,
                upload: photoCow

              })
            }}
          >
            <FormattedMessage id='pages.searchTable.update' defaultMessage='New' />
          </Button>
        );
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Ngày tạo' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('YYYY-MM-DD HH:mm:ss');
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
        request={() =>
          customAPIGet(
            { 'populate[0]': 'category', 'populate[1]': 'farm', 'populate[2]': 'photos' },
            'cows',
          )
        }
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
        title='Tạo mới'
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
          <ProFormText width='md' name='code' label='Mã' placeholder='Mã' />

          <ProFormText width='md' name='name' label='Tên' placeholder='Tên' />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width='md'
            name='firstWeight'
            label='Cân nặng P0'
            placeholder='Cân nặng P0'
          />

        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect options={category} placeholder='Chọn giống bò' required width='md' name='category' label='Giống bò' />
          <ProFormSelect width='md' options={farm} required placeholder='Chọn trang trại' name='farm' label='Trang trại' />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name='birthdate' placeholder='Chọn ngày sinh' required label='Ngày sinh' />
          <ProFormText width='xs' name='age' label='Tuổi' placeholder='Tuổi' />
          <ProFormSelect
            width='xs'
            name='sex'

            label='Giới tính'
            options={[
              {
                label: 'Đực',
                value: 'male',
              },
              {
                label: 'Cái',
                value: 'female',
              },
            ]}
            placeholder='Chọn giới tính'
            rules={[{ required: true, message: 'Chọn giới tính!' }]}
          />
          <ProFormSelect
            width='xl'
            name='status'
            label='Trạng thái'
            options={[
              {
                label: 'Mới',
                value: 'new',
              },
              {
                label: 'Sẳn sàng',
                value: 'ready',
              },
              {
                label: 'Đã thêm vào CPass',
                value: 'cpassAdded',
              },

              {
                label: 'Đã thêm vào phiên',
                value: 'fairAdded',
              },
              {
                label: 'Đã ở trong phiên mở bán',
                value: 'fairOpen',
              },
              {
                label: 'Trong đặt hàng của phiên',
                value: 'fairOrder',
              },
              {
                label: 'Đã thanh toán',
                value: 'paid',
              },
              {
                label: 'Sẵn sàng nuôi',
                value: 'readyFeed',
              },
              {
                label: 'Chờ nuôi',
                value: 'waitingFeed',
              },
            ]}
            placeholder='Trạng thái'
            rules={[{ required: true, message: 'Trạng thái!' }]}
          />
        </ProForm.Group>

        <ProFormUploadButton
          title='Up load'
          name='upload'
          label='Upload'
          max={2}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
          }}

        //ction={() => customAPIUpload({})}
        />

        <ProFormTextArea width='xl' label='Mô tả chi tiết' placeholder='Nhập chi tiết' name='description' />
      </ModalForm>

      <ModalForm
        title='Cập nhật'
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
          const success = await handleUpdate(values as any, refIdCow as any);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          message.success('Success');
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormText width='md' name='code' label='Mã' required placeholder='Mã' />

          <ProFormText width='md' name='name' label='Tên' required placeholder='Tên' />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width='md'
            name='firstWeight'
            label='Cân nặng P0'
            placeholder='Cân nặng P0'
            disabled
          />

        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect options={category} width='md' name='category' placeholder='Chọn giống bò' label='Giống bò' required />
          <ProFormSelect width='md' options={farm} name='farm' label='Trang trại' placeholder='Chọn trang trại' required />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name='birthdate' label='Ngày sinh' />
          <ProFormText width='xs' name='age' label='Tuổi' placeholder='Tuổi' />
          <ProFormSelect
            required
            width='xs'
            name='sex'
            label='Giới tính'
            options={[
              {
                label: 'Đực',
                value: 'male',
              },
              {
                label: 'Cái',
                value: 'female',
              },
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
                label: 'Mới',
                value: 'new',
              },
              {
                label: 'Sẳn sàng',
                value: 'ready',
              },
              {
                label: 'Đã thêm vào CPass',
                value: 'cpassAdded',
              },

              {
                label: 'Đã thêm vào phiên',
                value: 'fairAdded',
              },
              {
                label: 'Đã ở trong phiên mở bán',
                value: 'fairOpen',
              },
              {
                label: 'Trong đặt hàng của phiên',
                value: 'fairOrder',
              },
              {
                label: 'Đã thanh toán',
                value: 'paid',
              },
              {
                label: 'Sẵn sàng nuôi',
                value: 'readyFeed',
              },
              {
                label: 'Chờ nuôi',
                value: 'waitingFeed',
              },
            ]}
            placeholder='Trạng thái'
            rules={[{ required: true, message: 'Trạng thái!' }]}
          />
        </ProForm.Group>

        <ProFormUploadButton
          name='upload'
          label='Upload'
          title='Upload'

          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            onRemove(file) {
              customAPIDelete(file.uid as any, 'upload/files')
            }
          }}



        //action={() => customAPIUpload({})}
        />
        <ProFormTextArea width='xl' label='Mô tả chi tiết' name='description' />
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
