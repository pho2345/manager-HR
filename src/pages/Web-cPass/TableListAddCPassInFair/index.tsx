import { customAPIGet, customAPIGetOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { Button, message, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import "./styles.css";
import DetailCPass from '@/pages/components/DetailCPass';
import  configText from '@/locales/configText';
const configDefaultText = configText;

const handleUpdateMany = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const updateTransaction = await customAPIUpdateMany(
      fields,
      api,
      id);
    hide();
    if (updateTransaction) {
      message.success('Cập nhật thành công');
    }
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};



const getFair = async (id: number) => {
  const fetchCPass = await customAPIGetOne(id, 'fairs/find-field', { 'field[0]': 'code' });
  return fetchCPass;
}



const TableListAddCPassInFair = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);



  const [fair, setFair] = useState<any>();
  //const params = useParams();
  const confirm = (entity: any, message: string, api: string, id: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có muốn ${message}?`,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdateMany({
          ...entity
        }, api, id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };


  useEffect(() => {
    const fetchDataFair = async () => {
      const getFairData = await getFair(props.currentFair);
      setFair(getFairData);

    }
    fetchDataFair();
  }, [props.currentFair]);

  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      //title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      title: configDefaultText['page.addCPassInFair.column.code'],
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <a
            onClick={() => {
              setCurrentRow(entity.id);
              setShowDetail(true);
            }}
          >
            {`${entity.code}|${entity.id}`}
          </a>

        );
      },

    },
    {
     // title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
     title: configDefaultText['page.addCPassInFair.column.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => text.farmName ? text.farmName : null
    },
    {
      //title: <FormattedMessage id='pages.searchTable.column.groupCow' defaultMessage='Nhóm bò' />,
      title: configDefaultText['page.addCPassInFair.column.groupCow'],
      dataIndex: 'groupCow',
      valueType: 'textarea',
      key: 'groupCow',
      renderText: (_, text) => text.groupCowDescription ? text.groupCowDescription : null
    },
    {
     // title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      title: configDefaultText['page.addCPassInFair.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }
    },

    {
      //title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss(Kg)' />,
      title: configDefaultText['page.addCPassInFair.column.firstWeight'],
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },
    {
     // title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
    title: configDefaultText['page.addCPassInFair.column.age'],
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = `${text.age / 4 >= 1 ? `${text.age / 4}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}`;
        return age;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      title: configDefaultText['page.addCPassInFair.column.bodyCondition'],
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
        return 'abc';
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
      // title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Pnow(Kg)' />,
    title: configDefaultText['page.addCPassInFair.column.nowWeight'],
    dataIndex: 'nowWeight',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => text?.nowWeight
    },


  ];




  return (
    <>

      <ModalForm
        title={ configDefaultText['page.addCPassInFair.titleModal']}
        open={props.openModal}

        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onCloseModal();
          },
        }}
        submitTimeout={2000}
        submitter={false}
      >

        <ProTable
          headerTitle={(<>
          {configDefaultText.fair}  : {fair?.code}
          </>)}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={
            (entity) => {
              return entity.classColor
            }
          }

          request={async () => {
            const data = await customAPIGet({}, 'c-passes/get/addfair');
            return {
              data: data?.data,
              success: true,
              total: data?.data.length
            }
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
          toolBarRender={() => [
            <>
              {selectedRowsState.length !== 0 && (<Button
                type='primary'
                key='primary'
                onClick={() => {
                  const c_passes = selectedRowsState?.map((e: any) => {
                    return e?.id;
                  })
                  confirm({
                    c_passes
                  }, configDefaultText['page.addCPassInFair.titleModal'], 'fairs/update/add-c-passes', props.currentFair);
                }}
              >
                <PlusOutlined /> {configDefaultText['buttonAdd']}
              </Button>)}
            </>
          ]}
          columns={columns}
          dataSource={fair?.c_passes}
          rowSelection={{
            onChange: (_, selectedRows: any) => {

              setSelectedRows(selectedRows);
            },
          }}

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
        />
        {currentRow && (
          <DetailCPass
            openModal={showDetail}
            idCPass={currentRow}
            closeModal={() => {
              setCurrentRow(undefined);
              setShowDetail(false);
            }}
          />
        )
        }
      </ModalForm>



    </>
  );
};

export default TableListAddCPassInFair;


