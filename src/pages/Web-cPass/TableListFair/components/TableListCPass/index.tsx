import { customAPIGet, customAPIAdd, customAPIDelete, customAPIUpdate } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link, useIntl } from '@umijs/max';
import { Avatar, Button,  Form, message, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
// import DetailUser from '../components/DetailUser';
const { Text } = Typography;

const handleAdd = async (fields: any) => {
  console.log(fields);

  const hide = message.loading('Đang chờ...');
  try {
    await customAPIAdd({ ...fields }, 'c-passes/create');
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

  if (fields.cow.value) {
    fields.cow = fields.cow.value;
  }
  console.log(fields);
  const hide = message.loading('Đang sửa...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'c-passes', id.current);
    hide();

    message.success('Sửa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};


const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'c-passes')
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
  const categories = await customAPIGet({ 'filters[c_pass][id][$null]': true }, 'cows');
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
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCpass = useRef<any>();
  // const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [cow, setCow] = useState<any>();

  // const [currentRowUser, setCurrentRowUser] = useState<any>();
  // const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
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
      title: <FormattedMessage id='pages.searchTable.column.fairand' defaultMessage={(<> Đợt mở bán<br />Ngày hết hạn hợp tác</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'fair',
      render: (_, text: any) => {
        return (<>
          {text?.fair?.code}
          <br /> {moment(text?.fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY')}


        </>)
      }
    },
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Mã'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
          <a
            onClick={() => {
              // setCurrentRow(entity?.code);
              // setShowDetail(true);
            }}
          >
            {entity?.code}

          </a>
          //   <Link to={`/cows/` + entity.id}>
          //   {entity?.code}
          // </Link>
        );
      },
      // filterDropdown: () => (
      //   <div style={{ padding: 8 }}>
      //     <Input style={{ width: 188, marginBlockEnd: 8, display: 'block' }} />
      //   </div>
      // ),
      // filterIcon: (filtered) => (
      //   <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      // ),
      // onFilter: (value, record) => {
      //   console.log(record);
      //   console.log(value);
      //   return true;
      // },

      // filterSearch: (input, record) => {
      //   console.log(input);
      //   return true
      // }, 


    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farmAndCategory' defaultMessage={(<>Trang trại <br />
        Giống bò-Giới tính</>)} />,
      width: 200,
      dataIndex: 'farmAndCategory',
      valueType: 'textarea',
      key: 'farmAndCategory',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.cow?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {text?.cow?.farm?.name}<br />
          {`${text?.cow?.category?.name}-${sex}`}
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.image' defaultMessage='Hình' />,
      dataIndex: 'image',
      valueType: 'textarea',
      key: 'image',
      render: (_, text: any) => {
        return (
          <Avatar.Group
            maxCount={2}
            maxPopoverTrigger='click'
            size='large'
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
          >
            {text?.cow?.photos?.map((e: any, index: any) => {
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
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = `${text?.cow?.age / 4 >= 1 ? `${text?.cow?.age / 4}Th` : ''} ${text?.cow?.age % 4 !== 0 ? (text?.cow?.age % 4) + 'T' : ''}`;
        return age;

      }
    },
    {
      title: 'P0(kg)/Pnow@Snow (kg)',
      dataIndex: 'P0andPnow',
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return `${text?.pZero}/${text?.nowWeight}@${text?.slotNow?.indexSlot}`
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        switch (text?.bodyCondition) {
          case 'good':
            return (<Text style={{ color: '#00CC00' }}>Tốt</Text>);
          case 'malnourished':
            return (<Text>Suy dinh dưỡng</Text>);
          case 'weak':
            return (<Text style={{ color: '#FF9900' }}>Yếu</Text>);
          case 'sick':
            return (<Text style={{ color: '#FF3333' }}>Bệnh</Text>);
          case 'dead':
            return (<Text style={{ color: '#FF0000' }}>Chết</Text>)
          default:
            break;
        }
        return '';
      },
      filters: true,
      onFilter: true,
      valueEnum: {
        good: {
          text: 'Tốt',
          value: 'good'
        },
        malnourished: {
          text: 'Suy dinh dưỡng',
          value: 'malnourished'
        },
        weak: {
          text: 'Yếu',
          value: 'weak'
        },
        sick: {
          text: 'Bệnh',
          value: 'sick'
        },
        dead: {
          text: 'Chết',
          value: 'dead'
        },
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='Hiệu quả tăng trọng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => `${text?.wgePercent}%`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng TB(kg/tuần)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.users_permissions_user' defaultMessage='Mega đang sở hữu' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'users_permissions_user',
      render: (_, text: any) => {
        if (text?.owner?.id) {
          return (<>
            <a
              onClick={() => {
                // setCurrentRowUser(text.owner.id);
                // setShowDetailUser(true);
              }}
            >
              {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner?.id}`}</a>
          </>)
        } else {
          return null;
        }

      }


    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={(<>MegaP (kg)| MegaE(VNĐ)<br />MegaCPR</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      render: (_, text: any) => {
        return (<>
          {`${text?.megaP ? text?.megaP : '-'} | ${text?.megaE}`} <br /> {`${text?.megaCPR}%`}
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.plansCPass' defaultMessage='PAHT' />,
      dataIndex: 'plan',
      valueType: 'textarea',
      key: 'plan',
      renderText: (_, text: any) => text?.plan ? `${text?.plan?.profit}` : null
    },


    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaPAndProduce' defaultMessage={(<>MegaDelta<br />ProduceAle<br />History</>)} />,
      dataIndex: 'megaDeltaProduce',
      valueType: 'textarea',
      key: 'megaDeltaProduce',
      render: (_, text: any) => {
        let id = text?.id;
        if (text?.checkHistory) {
          id = text?.cPassId;
        }

        return (<>
          {text?.megaDeltaWeight} <br />
          {text?.produceAle} <br />
          <Button>
            <Link to={`/cpasses/history-slot/` + id}>
              HISTORY
            </Link>
          </Button>
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.statusOwner' defaultMessage={(<>Tình trạng sở hữu</>)} />,
      dataIndex: 'statusOwner',
      valueType: 'textarea',
      key: 'statusOwner',
      render: (_, text: any) => {
        if (text?.statusTransaction === 'open') {
          return (<>
            Đang sở hữu
          </>)
        }
        if (text?.statusTransaction === 'doneSettlement') {
          return (<>
            Đã thanh quyết toán
          </>)
        }
        else {
          return null;
        }
      }
    },

    {
      title: (<>Trạng thái giao dịch</>),
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'statusTransaction',
      render: (_, text: any) => {
        if (text?.statusTransaction === 'registeringSettlement') {
          if (text?.reasonSettlement === 'finished') {
            return (<>
              Đăng kí quyết toán<br /> Hết hạn hợp tác
            </>)
          }
          if (text?.reasonSettlement === 'megaCanceled') {
            return (<>
              Đăng kí quyết toán<br /> Mega chấm dứt trước hạn
            </>)
          }
        }
        else {
          return null;
        }
      }
    },




    // {
    //   title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Description' />,
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'option',
    //   render: (_, entity: any) => {
    //     return (<Button
    //       type='primary'
    //       key='primary'
    //       onClick={async () => {
    //         handleUpdateModalOpen(true);
    //         refIdCpass.current = entity.id;
    //         const cPass = await customAPIGetOne(entity.id, 'c-passes/get/find-admin', { });
    //         //const cowNotCpass = await getCownotInCpass();
    //         console.log(cPass);
    //         // const cowForm = [
    //         //   ...cowNotCpass,
    //         //   {
    //         //     value: cPass?.data?.attributes?.cow?.data?.id,
    //         //     label: cPass?.data?.attributes?.cow?.data?.attributes?.name,
    //         //   }
    //         // ]

    //         form.setFieldsValue({
    //           cow: {
    //             value: cPass?.cow?.id,
    //             label: cPass?.cow?.name,
    //           },
    //           code: cPass?.code,
    //           pZero: cPass?.pZero,
    //           price: cPass?.price,
    //           nowWeight: cPass?.nowWeight,
    //           activeAleTransfer: cPass?.activeAleTransfer
    //         })
    //       }}
    //     >
    //       <FormattedMessage id='pages.searchTable.update' defaultMessage='New' />
    //     </Button>)
    //   }
    // },

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
        search={false}

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
        request={() => customAPIGet({}, 'c-passes/get/c-pass-mega')}
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
              const getCow = await getCownotInCpass();
              setCow(getCow);
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
          {/* <ProFormText
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
          /> */}

          <ProFormSelect
            width="md"
            options={cow}
            name="cow"
            label="Bò"
            placeholder="Chọn bò"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.chosenCow'
                    defaultMessage='Vui lòng chọn Bò!'
                  />
                ),
              },
            ]}
          />



          {/* <ProFormText width="md" name="pZero" label="P0" placeholder="P0"  rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  />
                ),
              },
            ]}/> */}

          <ProFormDigit min={1} max={1000} width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập cân nặng hiện tại'
                  />
                ),
              },
            ]}
          />

          <ProFormDigit min={1} max={1000} width="md" name="weightInStable" label="Cân nặng nhập chuồng" placeholder="Cân nặng nhập chuồng"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập nân nặng nhập chuồng'
                  />
                ),
              },
            ]}
          />

          <ProFormDatePicker name="dateInStable" label="Ngày nhập chuồng" />

          {/* <ProFormDigit min={1} max={1000} width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  />
                ),
              },
            ]} /> */}



          <ProFormDigit min={1} width="md" name="vs" label="Chi phí bảo trì và bảo hiểm" placeholder="Chi phí bảo trì và bảo hiểm" rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.Cpass.pZero'
                  defaultMessage='Nhập chi phí bảo trì và bảo hiểm'
                />
              ),
            },
          ]} />
          <ProFormDigit min={1} width="md" name="vZero" label="Giá trị con bò của Mega" placeholder="Giá trị con bò của Mega" required />
          <ProFormSwitch name="activeAleTransfer" label="Tự động chuyển đổi Ale" />
        </ProForm.Group>


      </ModalForm>


      <ModalForm
        title="Cập nhật"
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
          const success = await handleUpdate(values as any, refIdCpass);
          if (success) {
            handleUpdateModalOpen(false);
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
            placeholder="Chọn bò"
          />


        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="xs" name="pZero" label="P0" placeholder="P0" />
          <ProFormText width="xs" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại" />
          <ProFormText width="sm" name="price" label="Giá" placeholder="Giá" />
          <ProFormSwitch name="activeAleTransfer" label="Tự động chuyển đổi Ale" />
        </ProForm.Group>
      </ModalForm>


      {/* 
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
      </Drawer> */}

      {/* <DetailUser
        onDetail={showDetailUser}
        currentRowUser={currentRowUser}
        onCloseDetail={() => {
          setCurrentRowUser(undefined);
          setShowDetailUser(false);
        }}
      /> */}

    </PageContainer>

  );
};

export default TableList;
