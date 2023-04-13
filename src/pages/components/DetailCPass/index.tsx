
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { ProColumns, ProDescriptions } from '@ant-design/pro-components';
import {  Drawer, Typography, Image, Checkbox  } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
const {Text} = Typography;
import  configText from '@/locales/configText';
const configDefaultText = configText;

const ListImage = (image: any) => {
  return image?.length !== 0 ? (<>
    {image?.map((e: any, index: number) => (<Image
      key={index}
      width={100}
      src={SERVERURL + e.url}
    />
    ))}
  </>) : null
}

const TableList = (props: any) => {
  const [image, setImage] = useState<any>();

  


  const columnsDetailCPass: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      title: configDefaultText['page.DetailCPass.column.code'],
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <>
            {`${entity.code}|${entity.id}`}</>
         

        );
      },
      
    },
    {
    //   title: <FormattedMessage id='pages.searchTable.column.fairCode' defaultMessage='Đợt mở bán' />,
      title: configDefaultText['page.DetailCPass.column.fair'],
      dataIndex: 'fairCode',
      valueType: 'textarea',
      key: 'fairCode',
      renderText: (_, text: any) => text?.fairCode
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.hintName' defaultMessage='Tên gợi nhớ' />,
      title: configDefaultText['page.DetailCPass.column.hintName'],
      dataIndex: 'hintName',
      valueType: 'textarea',
      key: 'hintName',
      renderText: (_, text: any) => {
        return text?.hintName
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.cowName' defaultMessage='Tên' />,
      title: configDefaultText['page.DetailCPass.column.cowName'],
      dataIndex: 'cowName',
      valueType: 'textarea',
      key: 'cowName',
      renderText: (_, text: any) => {
        return text?.cowName
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      title: configDefaultText['page.DetailCPass.column.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => text.farmName ? text.farmName : null
    },
    {
      //title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      title: configDefaultText['page.DetailCPass.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
     // title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss' />,
      title: configDefaultText['page.DetailCPass.column.firstWeight'],
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      title: configDefaultText['page.DetailCPass.column.age'],
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = `${text.cowAge / 4 >= 1 ? `${text.cowAge / 4}Th` : ''} ${text.cowAge % 4 !== 0 ? (text.cowAge % 4) + 'T' : ''}`;
        return age;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      title: configDefaultText['page.DetailCPass.column.bodyCondition'],
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
        return null;
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
      // title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />,
      title: configDefaultText['page.DetailCPass.column.pZero'],
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs(VNĐ)' />,
      title: configDefaultText['page.DetailCPass.column.vs'],
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />,
      title: configDefaultText['page.DetailCPass.column.vZero'],
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS' />,
      title: configDefaultText['page.DetailCPass.column.megaS'],
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      renderText: (_, text: any) => text?.megaS
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      title: configDefaultText['page.DetailCPass.column.mega'],
      dataIndex: 'mega',
      valueType: 'textarea',
      key: 'mega',
      render: (_, text: any) => {

        if (text.check === 'owner') {
          return (<Checkbox checked disabled >
            {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner.id}`}
          </Checkbox>)
        }
        if (text.check === 'order') {
          return (<Checkbox disabled >
            {`${text?.megaOrder.fullname ? text?.megaOrder.fullname : text?.megaOrder.username} - ${text?.megaOrder.id}`}
          </Checkbox>)
        }
        return null;
      }
    },



    {
      // title: <FormattedMessage id='pages.searchTable.column.wge' defaultMessage='Hiệu quả tăng trọng' />,
      title: configDefaultText['page.DetailCPass.column.wge'],
      dataIndex: 'wge',
      valueType: 'textarea',
      key: 'wge',
      render: (_, text: any) => {
        return (<Text className={`${text?.wge}`}>{`${text?.wge}-${text?.wgePercent}`}</Text>)
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng trung bình' />,
      title: configDefaultText['page.DetailCPass.column.awgAvg'],
      dataIndex: 'awgAvg',
      valueType: 'textarea',
      key: 'awgAvg',
      render: (_, text: any) => {
        <Text className={`${text?.awg}`}>{`${text?.awg}-${text?.awgAvg}`}</Text>
      }
    },

    {
      //title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='Cân nặng chênh lệch(Kg)' />,
      title: configDefaultText['page.DetailCPass.column.deltaWeight'],
      dataIndex: 'deltaWeight',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, text: any) => {
        return text?.deltaWeight
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Cân nặng hiện tại(Kg)' />,
      title: configDefaultText['page.DetailCPass.column.nowWeight'],
      dataIndex: 'nowWeight',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => {
        return text?.nowWeight
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeight' defaultMessage='Cân nặng Mega được hưởng(Kg)' />,
      title: configDefaultText['page.DetailCPass.column.megaDeltaWeight'],
      dataIndex: 'megaDeltaWeight',
      valueType: 'textarea',
      key: 'megaDeltaWeight',
      renderText: (_, text: any) => {
        return text?.megaDeltaWeight
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='produceAle tích lũy' />,
      title: configDefaultText['page.DetailCPass.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.produceAle
      }
    },

    

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaCPR' defaultMessage='Tỷ suất lợi nhuận tích lũy Mega' />,
      title: configDefaultText['page.DetailCPass.column.megaCPR'],
      dataIndex: 'megaCPR',
      valueType: 'textarea',
      key: 'megaCPR',
      renderText: (_, text: any) => {
        return text?.megaCPR
      }
    },
    

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeightTransfer' defaultMessage='Số megaDeltaWeight đã chuyễn sang produceAle' />,
      title: configDefaultText['page.DetailCPass.column.megaDeltaWeightTransfer'],
      dataIndex: 'megaDeltaWeightTransfer',
      valueType: 'textarea',
      key: 'megaDeltaWeightTransfer',
      renderText: (_, text: any) => {
        return text?.megaDeltaWeightTransfer
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.weightInStable' defaultMessage='Cân nặng lúc nhập chuồng' />,
      title: configDefaultText['page.DetailCPass.column.weightInStable'],
      dataIndex: 'weightInStable',
      valueType: 'textarea',
      key: 'weightInStable',
      renderText: (_, text: any) => {
        return text?.weightInStable
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.dateInStable' defaultMessage='Ngày nhập chuồng' />,
      title: configDefaultText['page.DetailCPass.column.dateInStable'],
      dataIndex: 'dateInStable',
      valueType: 'textarea',
      key: 'dateInStable',
      renderText: (_, text: any) => {
        return text?.dateInStable
      }
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage='megaE(Vnđ)' />,
      title: configDefaultText['page.DetailCPass.column.megaE'],
      dataIndex: 'megaE',
      valueType: 'textarea',
      key: 'dateInmegaEStable',
      renderText: (_, text: any) => {
        return text?.megaE
      }
    },





    {
      //title: <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng giao dịch' />,
      title: configDefaultText['page.DetailCPass.column.statusTransaction'],
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'statusTransaction',
      renderText: (_, text: any) => text?.statusTransaction
    },

    {
      //title: <FormattedMessage id='pages.searchTable.column.reasonSettlement' defaultMessage='Lý do quyết toán' />,
      title: configDefaultText['page.DetailCPass.column.reasonSettlement'],
      dataIndex: 'reasonSettlement',
      valueType: 'textarea',
      key: 'reasonSettlement',
      renderText: (_, text: any) => text?.reasonSettlement
    },




  ];


  return (
    <>
    <Drawer
        width={600}
        open={props.openModal}
        onClose={() => {
          props.closeModal();
        }}
        closable={false}
      >
          <><ProDescriptions

            column={2}
            title='Thông tin cPass'
            request={async () => {
              const getCPass = await customAPIGetOne(props.idCPass, 'c-passes/detailadmin');
              console.log(getCPass);

              //setImage(photoCow);
              setImage(getCPass?.photos)
              return {
                data: getCPass,
                success: true
              }
            }}
            params={{
              id: props.idCPass,
            }}
            columns={columnsDetailCPass}
          ></ProDescriptions>
            <Text>Hình ảnh:</Text><p></p>
            {ListImage(image)}
          </>
       
      </Drawer>
    </>
  );
};

export default TableList;
