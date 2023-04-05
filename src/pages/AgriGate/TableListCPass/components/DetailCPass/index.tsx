
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { ProColumns, ProDescriptions } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {  Drawer, Typography, Image  } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
const {Text} = Typography;

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
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='cPass' />,
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <>
            {`${entity.code}|${entity.id}`}</>
         

        );
      },
      
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Số thẻ tai gốc:' />,
      dataIndex: 'code',
      valueType: 'textarea',
      key: 'code',
      renderText: (_, text: any) => text?.code
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => text.farm ? text.farm : null
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Nhóm bò' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) =>{
        return `${text?.group} - ${text?.descriptionGroup}`
      }
    },
    
    {
      title: <FormattedMessage id='pages.searchTable.column.hintName' defaultMessage='Giống' />,
      dataIndex: 'hintName',
      valueType: 'textarea',
      key: 'hintName',
      renderText: (_, text: any) => {
        return text?.category
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.hintName' defaultMessage='Giới tính' />,
      dataIndex: 'hintName',
      valueType: 'textarea',
      key: 'hintName',
      renderText: (_, text: any) => {
        return  text?.sex === 'male' ? `Đực` : 'Cái'                  
      }
    },
   
 
  
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss(Kg)' />,
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },

   

    {
      title: <FormattedMessage id='pages.searchTable.column.dateInStable' defaultMessage='Ngày nhập chuồng' />,
      dataIndex: 'dateInStable',
      valueType: 'textarea',
      key: 'dateInStable',
      renderText: (_, text: any) => {
        return text?.dateInStable
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.weightInStable' defaultMessage='Cân nặng lúc nhập chuồng' />,
      dataIndex: 'weightInStable',
      valueType: 'textarea',
      key: 'weightInStable',
      renderText: (_, text: any) => {
        return text?.weightInStable
      }
    },
    
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return confiAge;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Cân nặng hiện tại(Kg)' />,
      dataIndex: 'nowWeight',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => {
        return text?.nowWeight
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
      title: <FormattedMessage id='pages.searchTable.column.wge' defaultMessage='Hiệu quả tăng trọng' />,
      dataIndex: 'wge',
      valueType: 'textarea',
      key: 'wge',
      render: (_, text: any) => {
        return (<Text className={`${text?.wge}`}>{`${100 + text?.wgePercent}% - ${text?.wge}`}</Text>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng trung bình' />,
      dataIndex: 'awgAvg',
      valueType: 'textarea',
      key: 'awgAvg',
      render: (_, text: any) => {
        <Text className={`${text?.awg}`}>{`${text?.awg} kg/Tuần-${text?.awgAvg}`}</Text>
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='Chart' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
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
            column={1}
            title='Thông tin cPass'
            request={async () => {
              const getCPass = await customAPIGetOne(props.cPassId, 'c-passes/get/c-pass-agrigate');
              setImage(getCPass?.photos);
              return {
                data: getCPass,
                success: true,
              
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
