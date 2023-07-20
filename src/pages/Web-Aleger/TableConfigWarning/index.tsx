import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSwitch } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, Col, Form, message, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'config-default-megas', id);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};



const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [rowCurrent, setRowCurrent] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<any>();


  const columns: ProColumns<API.RuleListItem>[] = [

    {
      // title: <FormattedMessage id='pages.configMega.limitPlaformReceivSettlement' defaultMessage='Số cPass Mega tối đa PL nhận thanh quyết toán trong 1 tuần' />,
      title: configDefaultText['page.configWarning.column.quantityWeekAlarm'],
      dataIndex: 'quantityWeekAlarm',
      valueType: 'textarea',
      key: 'quantityWeekAlarm',
      renderText: (_, text: any) => {
        return `${text?.attributes?.quantityWeekAlarm}`
      }
    },
    {
      // title: <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần' />,
      title: configDefaultText['page.configDefault.column.quantityWeekWarning'],
      dataIndex: 'quantityWeekWarning',
      valueType: 'textarea',
      key: 'quantityWeekWarning',
      renderText: (_, text: any) => {
        return `${text?.attributes?.quantityWeekWarning}`
      }
    },

    {
      title: <FormattedMessage id='pages.option' defaultMessage='Thao tác' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      align: 'center',
      key: 'option',
      render: (_, entity: any) => {
        return (<Tooltip
          title={<FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />}
        >
          <Button
            onClick={() => {
              handleUpdateModalOpen(true);
              setRowCurrent(entity?.id);
              form.setFieldsValue({
                ...entity.attributes
              })
            }}
            icon={
              <MdOutlineEdit
              />
            }
            style={{
              border: 'none'
            }}
          />
        </Tooltip>

        )
      }
    },

  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle=''
        actionRef={actionRef}
        rowKey='id'
        search={false}
        request={() => customAPIGet({}, 'config-default-megas')}
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
        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {

            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
      />

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
        onFinish={async (values: any) => {
          const update = await handleUpdate(values, rowCurrent);
          if (update) {
            handleUpdateModalOpen(false);
            actionRef.current?.reloadAndRest?.();
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
          <Col span={12} className="gutter-row p-0" >
            <ProFormText
              className='w-full'
              name='quantityWeekAlarm'
              label={configDefaultText['page.configWarning.column.quantityWeekAlarm']}
              placeholder={configDefaultText['page.configWarning.column.quantityWeekAlarm']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configWarning.column.quantityWeekAlarm'] },
              ]}
            />
          </Col>

          <Col span={12} className="gutter-row p-0">

            <ProFormText
              className='w-full'
              name='quantityWeekWarning'
              label={configDefaultText['page.configDefault.column.quantityWeekWarning']}
              placeholder={configDefaultText['page.configDefault.column.quantityWeekWarning']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configDefault.column.quantityWeekWarning'] },
              ]}
            />
          </Col>
        </Row>
      </ModalForm>

    </PageContainer>
  );
};

export default TableList;
