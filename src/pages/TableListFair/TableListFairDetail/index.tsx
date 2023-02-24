import { customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { CopyTwoTone, DollarOutlined, EditTwoTone, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, } from '@ant-design/pro-components';
import {
  FooterToolbar,

  PageContainer,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl, useParams } from '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import "./styles.css";


const handleAdd = async (fields: any) => {

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();

  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'fairs');
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
  console.log(fields);
  if (fields?.c_passes[0]?.value) {
    const configCPass = fields?.c_passes.map((e: any) => {
      return e.value;
    });
    fields.c_passes = configCPass;
  }

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();


  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'fairs', id.current);
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
      return customAPIDelete(e.id, 'fairs')
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

// const getCPassNotFair = async () => {
//   const cPass = await customAPIGet({}, 'c-passes/get/cpassnotfair');
//   let data = cPass.data.map((e: any) => {
//     return {
//       value: e?.id,
//       label: e?.cow?.name,
//     };
//   });
//   return data;
// };

// const getPlans = async () => {
//   const plans = await customAPIGet({ 'fields[0]': 'name', 'fields[1]': 'profit' }, 'plans');

//   let data = plans.data.map((e: any) => {
//     return {
//       value: e?.id,
//       label: e?.attributes?.name + '-' + e?.attributes?.profit + '%',
//     };
//   });
//   return data;
// };



const TableListFairDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const refIdFair = useRef<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const params = useParams();

  useEffect(() => {
    const getData = async () => {

    };
    getData();
  }, []);
  console.log(params.id);

  const confirm = (entity: any) => {
    Modal.confirm({

      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có muốn xóa?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleRemove(entity);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Thẻ tai|cPass' />,
      render: (_, entity: any) => {
        return (
          <Text>{`${entity.code}|${entity.id}`}</Text>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => {
        return `${text.farmName}`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss' />,
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        return '';
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      renderText: (_, text: any) => {
        return '';
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='Vs(VNĐ)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
    },


    {
      title: <FormattedMessage id='pages.searchTable.column.plans' defaultMessage='PAHT Mega/PL' />,
      dataIndex: 'plans',
      valueType: 'dateRange',
      key: 'plans',
      render: (_, entity: any) => {
        return (
          <>
            {entity.plans.map((e: any) => (
              <>
                <div> {e.name}-{e.profit}</div>
              </>
            ))}

          </>
        )
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.cPassPublished' defaultMessage='cPass phát hành/Đã bán' />,
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.cPassPublished} / ${text?.quantitySellCpass}`
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Trạng thái' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'status',
      renderText: (_, text: any) => text?.status
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.unitPriceMeat' defaultMessage='Đơn giá thịt' />,
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      renderText: (_, text: any) => `${text?.unitPriceMeat}VNĐ`
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.nameFarm' defaultMessage='Tên trang trại' />,
      dataIndex: 'nameFarm',
      valueType: 'textarea',
      key: 'nameFarm',
      renderText: (_, text: any) => text?.nameFarm
    },

    {
      title: <FormattedMessage id='pages.searchTable.payment' defaultMessage='Thanh toán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'payment',
      render: (_, entity: any) => {
        if (entity?.status === 'noOpen') {
          return (<DollarOutlined
            style={{
              fontSize: 20
            }}
            onClick={() => {

            }} />)
        }
        return null;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Thao tác' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        if (entity?.status === 'noOpen') {
          return (
            <>
              <EditTwoTone
                style={{
                  fontSize: 20
                }}

                onClick={async () => {
                  // handleUpdateModalOpen(true);
                  refIdFair.current = entity.id;
                  const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                  fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  const c_passes = fair?.c_passes.map((e: any) => {
                    return {
                      label: e?.cow?.name,
                      value: e?.id
                    }
                  })
                  const plans = fair.plans.map((e: any) => {
                    return e?.id
                    //label: e?.name + '-' + e?.profit,


                  })
                  form.setFieldsValue({
                    ...fair,
                    c_passes,
                    plans
                  })
                }}
              />

              <CopyTwoTone
                style={{
                  fontSize: 20,
                  paddingLeft: 5
                }}

                onClick={async () => {
                  // handleCopyModalOpen(true);
                  const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                  fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');

                  delete fair.c_passes;
                  // const c_passes = fair?.c_passes.map((e: any) => {
                  //   return {
                  //     label: e?.cow?.name,
                  //     value: e?.id
                  //   }
                  // })
                  const plans = fair.plans.map((e: any) => {
                    return e?.id
                    //label: e?.name + '-' + e?.profit,


                  })
                  form.setFieldsValue({
                    ...fair,
                    // c_passes,
                    plans
                  })
                }
                }
              />


            </>
          )
        }

        return null;


      }
    },
  ];

  return (
    <>
        <>fasdf</>
    </>
  );
};

export default TableListFairDetail;
