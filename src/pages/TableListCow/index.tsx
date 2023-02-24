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
  ProFormDigit,
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

import { FormattedMessage, Link, useIntl, useParams } from '@umijs/max';
import { Avatar, Button, Drawer, Form, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Field from '@ant-design/pro-field';


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();
    const cow = await customAPIAdd({ ...fields }, 'cows');
    console.log(cow);
    if(fields?.upload){
      console.log('vào');
      const uploadImages = fields?.upload.map((e: any) => {
        let formdata = new FormData();
        formdata.append('files', e?.originFileObj);
        formdata.append('ref', 'api::cow.cow');
        formdata.append('refId', cow?.id);
        formdata.append('field', 'photos');
        return customAPIUpload({
          data: formdata
        })
      });
      await Promise.all(uploadImages);
    }
    
    message.success('Thêm thành công');
    return true;
  } catch (error : any) {
    //hide();
    console.log(error);
   // message.error('poi')
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {

  const hide = message.loading('Đang cập nhật...');
  try {

    const uploadImages = fields?.upload.map((e: any) => {
      if (e.originFileObj) {
        let formdata = new FormData();
        formdata.append('files', e?.originFileObj);
        formdata.append('ref', 'api::cow.cow');
        formdata.append('refId', id.current);
        formdata.append('field', 'photos');
        return customAPIUpload({
          data: formdata
        })
      }
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
  const params = useParams();
  const refIdPicture = useRef<any>();
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
          <Link to={`/cows/` + entity.id}>
            {entity?.code}
          </Link>
        );

      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Tên' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.name,
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
      renderText: (_, text: any) => text?.firstWeight,
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
            {text?.photos?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.url
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
      renderText: (_, text: any) => {
        if (text?.sex === 'male') {
          return 'Đực';
        }
        return 'Cái';
      },
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.category' defaultMessage='Giống loài' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.category?.name,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => text?.age,
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).format('YYYY-MM-DD HH:mm:ss');
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
              const cow = await customAPIGetOne(entity.id, 'cows/find', {  });
              const photos = cow.photos;
              if (photos) {
                const photoCow = photos.map((e: any) => {
                  return { uid: e.id, status: 'done', url: SERVERURL + e.url }
                })

                form.setFieldsValue({
                  ...cow,
                  category: cow.category?.id,
                  farm: cow.farm?.id,
                  upload: photoCow

                })
              }
              else {
                form.setFieldsValue({
                  ...cow.data,
                  category: cow.category?.id,
                  farm: cow.farm?.id,
                  //upload: photoCow

                })
              }
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
        return moment(text?.createdAt).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  return (
    !params.id ? (

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
              { },
              'cows/find',
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
            {/* <ProFormText width='md' name='code' label='Mã' placeholder='Mã' /> */}

            <ProFormText width='md' name='name' label='Tên' placeholder='Tên' />
          
            <ProFormDigit
              min={1}
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
              refIdPicture.current = null;
              
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {
          const success = await handleUpdate(values as any, refIdCow as any);


            if (success) {
              if(typeof refIdPicture.current !== 'undefined' && refIdPicture?.current?.length !== 0){
                console.log('refIdPicture',refIdPicture.current);
                 if(refIdPicture.current !== null){
                  const  deletePicture = refIdPicture?.current.map((e: any) => {
                    return customAPIDelete(e as any, 'upload/files');
                  })
                  await Promise.all(deletePicture);
                 }
               
              }
             
              handleUpdateModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
                refIdPicture.current = null;
              }
            }
           
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
                if (!file.lastModified) { 
                  if(refIdPicture.current){
                    refIdPicture.current = [...refIdPicture.current, file.uid];
                  }
                  else {
                    refIdPicture.current = [file.uid];
                  }
                }
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
      </PageContainer>) :
      (
        <ProDescriptions
          style={{
            fontSize: 50
          }}
          title="Chi tiết bò"
          column={2}
          layout='horizontal'
          size='middle'
          request={async () => {
            let cowDetail = await customAPIGetOne(params?.id, 'cows', { 'populate[0]': 'photos', 'populate[1]': 'farm', 'populate[2]': 'category', });
            

            const photo = cowDetail?.data.attributes.photos?.data?.map((e: any) => {
              return e.attributes.url;
            })
            let data = {
              code: cowDetail?.data.attributes.code,
              name: cowDetail?.data.attributes.name,
              age: cowDetail?.data.attributes.age,
              birthdate: cowDetail?.data.attributes.birthdate,
              firstWeight: cowDetail?.data.attributes.firstWeight,
              sex: cowDetail?.data.attributes.sex,
              farm: cowDetail?.data.attributes.farm?.data.attributes.name,
              photo: photo

            }

            return Promise.resolve({
              success: true,
              data: data
            });
          }}
          columns={[
            {
              title: () => {
                return <div style={{ color: 'red', fontSize: '20px' }}> Mã</div>
              },
              
              key: 'code',
              dataIndex: 'code',
              render: (_, record)=> {
                return <div style={{ color: 'red', fontSize: '20px' }}> {record.code}</div>
              }
            },
            {
              title: 'Tên',
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: 'Tuổi',
              key: 'age',
              dataIndex: 'age',
            },
            {
              title: 'Ngày sinh',
              key: 'birthdate',
              dataIndex: 'birthdate',
              valueType: 'date',
            },
            {
              title: 'Cân nặng sơ sinh',
              key: 'firstWeight',
              dataIndex: 'firstWeight',
            },
            {
              title: 'Giới tính',
              key: 'sex',
              dataIndex: 'sex',
            },
            {
              title: 'Trang trại',
              key: 'farm',
              dataIndex: 'farm',

            },
            {
              title: 'Ảnh',
              key: 'photo',
              render: (_, entity) => {
                console.log(entity);
                const photo = entity.photo.map((e: any) => {
                  return (
                    <><Field
                      text={SERVERURL + e}
                      valueType="image"

                    />
                    </>
                  )
                })
                return photo;
              }
            }



          ]}
        >


        </ProDescriptions>
      )
  );
};

export default TableList;
