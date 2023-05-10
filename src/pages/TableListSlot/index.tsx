import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import {  ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps,  ProFormDigit } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
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
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};


// const handleRemove = async (selectedRows: any) => {
//   console.log(selectedRows);
//   const hide = message.loading('Đang xóa...');
//   if (!selectedRows) return true;
//   try {
//     const deleteRowss = selectedRows.map((e: any) => {
//       return customAPIDelete(e.id, 'c_passes')
//     })

//     await Promise.all(deleteRowss);
//     hide();
//     message.success('Xóa thành công');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Xóa thất bại');
//     return false;
//   }
// };





const TableList: React.FC = () => {

  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdSlot  = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();

  const intl = useIntl();

  const columns: ProColumns<any>[] = [

    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    // {
    //   // title: (
    //   //   <FormattedMessage
    //   //     id='pages.searchTable.column.code'
    //   //     defaultMessage='Mã'
    //   //   />
    //   // ),
    //   title: configDefaultText['page.code'],
    //   key: 'code',
    //   dataIndex: 'atrributes',
    //   render: (_, entity: any) => {
    //     ;
    //     return (
    //       <a
    //         onClick={() => {
    //           setCurrentRow(entity?.attributes?.code);
    //           setShowDetail(true);
    //         }}
    //       >
    //         {entity?.attributes?.code}

    //       </a>
    //     );
    //   },
    // },
    {
      title: configDefaultText['page.slot.columns.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text: any) => text?.farmName,
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
   
    // {
    //   title: <FormattedMessage id='pages.searchTable.column.activeSlot' defaultMessage='Trạng thái' />,
    //   dataIndex: 'activeSlot',
    //   valueType: 'textarea',
    //   key: 'activeSlot',
    //   renderText: (_, text: any) => {
    //     if (text?.attributes.activeSlot) {
    //       return 'true'
    //     }
    //     return 'false'
    //   }
    // },

    {
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      align: 'center',
      key: 'option',
      render: (_, entity: any) => {
        //let dateEnd = moment(entity?.attributes.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD');
        //let currentDate = moment().add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD');
        //if (dateEnd === currentDate) {

          return (<SettingOutlined
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdSlot.current = entity.id;
              // setCodeProvince(entity?.attributes?.code);
              // setNameProvince(entity?.attributes?.name);
              // setFullName(entity?.attributes?.fullname);
              // setFsmCode(entity?.attributes?.fsmCode);
            }}
          />)
        //return null
      }
    },

    // {
    //   title: configDefaultText['createdAt'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'create',
    //   renderText: (_, text: any) => {
    //     return moment(text?.attributes?.createdAt).format('YYYY-MM-DD HH:mm:ss')
    //   },
    // },

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
       

        request={() => customAPIGet({}, 'c-passes/get/c-pass-slot')}
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




