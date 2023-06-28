import { customAPIGet, customAPIUpdate, customAPIGetFile, customAPIUpdateFile } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProFormDigit, ProFormRadio, ProFormUploadButton } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';

import { Button, Drawer, Form, message } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import configText from '@/locales/configText';
const configDefaultText = configText;


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang sửa...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'slots/currentweight', id.current);
    hide();

    message.success('Sửa thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message || 'Lỗi');
    return false;
  }
};


const handleUpdateFile = async (fields: any) => {
  const hide = message.loading('Đang sửa...');
  try {
    await customAPIUpdateFile({
     ...fields
    }, 'slots/input-weight');
    hide();
    message.success('Sửa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};







const TableList: React.FC = () => {

  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [openModalTemplate, setOpenModalTemplate] = useState<boolean>(false);
  const [openModalDowTemplate, setOpenModalDowTemplate] = useState<boolean>(false);
  const [farm, setFarm] = useState<any>([]);


  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdSlot = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();


  const columns: ProColumns<any>[] = [

    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
   
    {
      title: configDefaultText['page.slot.columns.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text: any) => text?.farmName,
      filters: farm
    },

    {
      title: configDefaultText['page.slot.columns.code'],
      dataIndex: 'codeCow',
      valueType: 'textarea',
      key: 'codeCow',
      renderText: (_, text: any) => text?.codeCow

    },
    {
      title: configDefaultText['page.slot.columns.codeCPass'],
      dataIndex: 'codeCPass',
      valueType: 'textarea',
      key: 'codeCPass',
      renderText: (_, text: any) => text?.codeCPass
    },

    {
      title: configDefaultText['page.slot.columns.timeStart'],
      dataIndex: 'timeStart',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text: any) => moment(text?.timeStart).format('DD/MM/YYYY')
    },

    {
      title: configDefaultText['page.slot.columns.timeEnd'],
      dataIndex: 'timeEnd',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => moment(text?.timeEnd).format('DD/MM/YYYY')
    },

    {
      title: configDefaultText['page.slot.columns.preWeight'],
      dataIndex: 'preWeight',
      valueType: 'textarea',
      key: 'preWeight',
      renderText: (_, text: any) => text?.preWeight
    },

    {
      title: configDefaultText['page.slot.columns.currentWeight'],
      dataIndex: 'currentWeight',
      valueType: 'textarea',
      key: 'currentWeight',
      renderText: (_, text: any) => text?.currentWeight
    },


    {
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      align: 'center',
      key: 'option',
      render: (_, entity: any) => {
        return (<SettingOutlined
          onClick={() => {
            handleUpdateModalOpen(true);
            refIdSlot.current = entity.id;
          }}
        />)
        //return null
      }
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}
        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}


        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={async () => {
              setOpenModalTemplate(true)
             
            }}
          >
            <PlusOutlined /> {configDefaultText['uploadTemplate']}
          </Button>,

          <Button
            type='primary'
            key='dowloadTemplate'
            onClick={async () => {
              // await  customAPIGetFile({}, 'slots/dowload');
              setOpenModalDowTemplate(true);
            }}
          >
            <PlusOutlined /> {configDefaultText['dowloadTemplate']}
          </Button>,
        ]}

        request={ async() => {
          const data = await customAPIGet({}, 'c-passes/get/c-pass-slot');
          setFarm(data?.data?.farm);
          return {
            data: data?.data?.slot,
            success: true,
            total: data?.data?.slot?.length
          }
        }}
        columns={columns}

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
          }]
        }}
      />

      <ModalForm
        title="Cập nhật Slot"
        open={updateModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false)
          },
        }}
        width={`35vh`}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          console.log(values);
          const success = await handleUpdate(values as any, refIdSlot);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();

            if (actionRef.current) {
              actionRef.current.reload();

            }
          }
          //message.success('Success');
          return true;
        }}
      >


        <ProFormDigit

          width="md"
          name="currentWeight"
          label="Nhập cân nặng hiện tại"
          placeholder="Cân nặng hiện tại"
        />
      </ModalForm>

      <ModalForm
        title="Upload File"
        open={openModalTemplate}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpenModalTemplate(false)
          },
        }}
        width={`35vh`}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
         const updateFile =  await handleUpdateFile(values);

         if(updateFile){
          setOpenModalTemplate(false);
          if(actionRef.current){
            actionRef.current.reload();
          }
         }
          
          // const success = await handleUpdateFile(values as any, refIdSlot);
          // if (success) {
          //   handleUpdateModalOpen(false);
          //   form.resetFields();

          //   if (actionRef.current) {
          //     actionRef.current.reload();

          //   }
          // }
          // //message.success('Success');
          // return true;
        }}
      >

        <ProFormUploadButton
          name='upload'
          title={configDefaultText['page.slot.upload']}
          label={configDefaultText['page.slot.click']}
          max={5}
          fieldProps={{
            accept: '.xlsx',
            maxCount: 1,
            beforeUpload: (fileList, fileSize) => {
              if (fileSize.length > 1) {
                message.error(configDefaultText['page.slot.limitUpload']);
                return false;
              }
              return true;
            }
          }}

          rules={[
            //{ required: true, message: <FormattedMessage id='page.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
            { required: true, message: configDefaultText['page.slot.required.upload'] },

          ]}

        />

        <ProFormRadio.Group
          name="template"
          label={configDefaultText['page.slot.typeTemplate']}
          options={[
            {
              label:  configDefaultText['page.slot.cPass'] ,
              value: 'cPass',
            },
            {
              label: configDefaultText['page.slot.code'],
              value: 'code',
            },
          ]}

          rules={[
            //{ required: true, message: <FormattedMessage id='page.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
            { required: true, message: configDefaultText['page.slot.required.template'] },

          ]}
        />
      </ModalForm>

      <ModalForm
        title={configDefaultText['page.slot.dowload.template']}
        open={openModalDowTemplate}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpenModalDowTemplate(false)
          },
        }}
        width={`35vh`}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          console.log(values);
          if (values.template === 'cPass') {
            await  customAPIGetFile( 'cPass', 'slots/dowload-template');
          }
          else {
            await  customAPIGetFile( 'code', 'slots/dowload-template-code');
          }
        }}
      >

        <ProFormRadio.Group
          name="template"
          label={configDefaultText['page.slot.typeTemplate']}
          options={[
            {
              label: configDefaultText['page.slot.cPass'],
              value: 'cPass',
            },
            {
              label: configDefaultText['page.slot.code'],
              value: 'code',
            },

          ]}

          rules={[
            //{ required: true, message: <FormattedMessage id='page.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
            { required: true, message: configDefaultText['page.slot.required.template'] },

          ]}
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




