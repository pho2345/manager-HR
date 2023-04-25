import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdate,
  customAPIDelete,
  customAPIGetOne,

} from '@/services/ant-design-pro/api';
import { CloseCircleOutlined, ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SafetyOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, Link,  } from '@umijs/max';
import { Button, Col, Form, message, Modal, Row, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { SketchPicker, AlphaPicker, BlockPicker, CirclePicker, SliderPicker, TwitterPicker, GithubPicker } from 'react-color';

import { MdOutlineEdit } from 'react-icons/md';
// import viVNIntl from 'antd/lib/locale/vi_VN';  

import configText from '@/locales/configText';
const configDefaultText = configText;

const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();
    const groupCow = await customAPIAdd({ ...fields }, 'group-cows/add');
    if (groupCow) {
      message.success('Thêm thành công');
      return true;
    }
  } catch (error: any) {
    console.log(error);
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleUpdate = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate(
      {
        ...fields,
      },
      api,
      // 'group-cows/update',
      id,
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
      return customAPIDelete(e.id, 'group-cows');
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

const confirm = (entity: any, message: string, actionRef: any) => {
  console.log(entity);
  Modal.confirm({
    title: 'Confirm',
    icon: <ExclamationCircleOutlined />,
    content: `Bạn có muốn ${message}?`,
    okText: 'Có',
    cancelText: 'Không',
    onOk: async () => {
      // await handleUpdateMany({
      //   cPass: [entity.id]
      // }, api, id);
      await handleRemove(entity);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  });
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [openColor, setOpenColor] = useState<boolean>(false);

  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCow = useRef<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [farm, setFarm] = useState<any>();

  const refIdPicture = useRef<any>();
  useEffect(() => {
    const getValues = async () => {
      let getFarms = await getFarm();
      setFarm(getFarms);
    };
    getValues();
  }, []);

  const [color, setColor] = useState("#ffffff");

  const handleColorChange = (newColor: any) => {
    console.log(newColor);
    setColor(newColor.hex);
  };

  //const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      //title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      title: configDefaultText['page.listGroupCow.column.code'],
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
      // title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      title: configDefaultText['page.listGroupCow.column.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text: any) => text?.farm?.name,
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Tên' />,
      title: configDefaultText['page.listGroupCow.column.farm'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.name,
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.active' defaultMessage='Hoạt động' />,
      title: configDefaultText['page.listGroupCow.column.active'],
      dataIndex: 'active',
      valueType: 'textarea',
      key: 'active',
      render: (_, text: any) => {
        return (<><ProFormSwitch disabled fieldProps={{ checked: text?.active }}></ProFormSwitch></>)
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.description' defaultMessage='Mô tả' />,
      title: configDefaultText['page.listGroupCow.column.description'],
      dataIndex: 'description',
      valueType: 'textarea',
      key: 'description',
      renderText: (_, text: any) => text?.description,
    },



    {
      // title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (
          <>
            <Tooltip title={configDefaultText['buttonUpdate']}><MdOutlineEdit
              style={{
                fontSize: 25
              }}
              onClick={async () => {
                handleUpdateModalOpen(true);
                refIdCow.current = entity.id;
                const cow = await customAPIGetOne(entity.id, 'group-cows/find-admin', {});
                form.setFieldsValue({
                  ...cow
                });

              }
              }
            /></Tooltip>



            {
              entity.active ? (<Tooltip title={configDefaultText['page.listGroupCow.inActive']}>< CloseCircleOutlined
                style={{
                  fontSize: 25,
                  paddingLeft: 10
                }}
                onClick={async () => {
                  await handleUpdate({
                    active: !entity.active
                  }, 'group-cows/update', entity.id);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }}

              /></Tooltip>) :
                (<Tooltip title={configDefaultText['page.listGroupCow.active']}><  SafetyOutlined
                  style={{
                    fontSize: 25,
                    paddingLeft: 10
                  }}
                  onClick={async () => {
                    await handleUpdate({
                      active: !entity.active
                    }, 'group-cows/update', entity.id);
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }}

                /></Tooltip>
                )}

          </>
        );
      },
    },


  ];

  return (


    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}

        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> {configDefaultText['buttonAdd']}
          </Button>,
        ]}
        request={() =>
          customAPIGet(
            {},
            'group-cows/find-admin',
          )
        }
        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
            icon: <ReloadOutlined />,
            onClick: () => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }]
        }}

        columns={columns}

        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
        }}

        pagination={{
          locale: {
            //  next_page: 'Trang sau',
            //  prev_page: 'Trang trước',
            next_page: configDefaultText['nextPage'],
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

            </div>
          }
        >
          <Button
            onClick={async () => {
              await confirm(selectedRowsState as any, 'xóa', actionRef);
              setSelectedRows([]);

              await actionRef.current?.reloadAndRest?.();
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
        title={configDefaultText['page.listGroupCow.newGroup']}
        open={createModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        width={`40vh`}
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
        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect className='w-full' options={farm} name='farm'
              label={configDefaultText['page.listGroupCow.column.farm']}
              placeholder={configDefaultText['page.listGroupCow.column.farm']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.farm']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.farm'
                  //     defaultMessage='Trang trại'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText className='w-full' name='name'
              label={configDefaultText['page.listGroupCow.column.name']}
              placeholder={configDefaultText['page.listGroupCow.column.name']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>


        <ProFormSwitch name='active'
          label={configDefaultText['page.listGroupCow.active']}
          fieldProps={{ defaultChecked: true, }} />
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormTextArea className='w-full' name='description'
              label={configDefaultText['page.listGroupCow.column.description']}
              placeholder={configDefaultText['page.listGroupCow.column.description']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.description']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.description'
                  //     defaultMessage='Mô tả chi tiết'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>


       
      

      </ModalForm>

      <ModalForm
        title={configDefaultText['page.listGroupCow.updateGroup']}
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
        width={`40vh`}
        submitTimeout={2000}
        onFinish={async (values) => {
          const success = await handleUpdate(values as any, 'group-cows/update', refIdCow?.current as any);


          if (success) {
            if (typeof refIdPicture.current !== 'undefined' && refIdPicture?.current?.length !== 0) {
              console.log('refIdPicture', refIdPicture.current);
              if (refIdPicture.current !== null) {
                const deletePicture = refIdPicture?.current.map((e: any) => {
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

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect className='w-full' options={farm} name='farm'
              label={configDefaultText['page.listGroupCow.column.farm']}
              placeholder={configDefaultText['page.listGroupCow.column.farm']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.farm']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.farm'
                  //     defaultMessage='Trang trại'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText className='w-full' name='name'
              label={configDefaultText['page.listGroupCow.column.name']}
              placeholder={configDefaultText['page.listGroupCow.column.name']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>

        <ProFormSwitch name='active' label='Kích hoạt' fieldProps={{ defaultChecked: true, }} />
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
          <ProFormTextArea className='w-full' name='description'
              label={configDefaultText['page.listGroupCow.column.description']}
              placeholder={configDefaultText['page.listGroupCow.column.description']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.description']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.description'
                  //     defaultMessage='Mô tả chi tiết'
                  //   />
                  // ),
                },
              ]} />

          </Col>
        </Row>
      </ModalForm>

    </PageContainer>
  )
};

export default TableList;
