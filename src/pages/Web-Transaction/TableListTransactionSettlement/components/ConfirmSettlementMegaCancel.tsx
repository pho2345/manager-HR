import DetailCPass from '@/pages/components/DetailCPass';
import {   customAPIAdd} from '@/services/ant-design-pro/api';
import {     ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { 
  FormattedMessage, 
 // useParams 
} from '@umijs/max';
import { Button, Space, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

// import DetailCPass from '../components/DetailCPass';
// import DetailUser from '../components/DetailUser';


const handleCreate = async (fields: any, api: string) => {
  const hide = message.loading('Đang xử lý...');
  
  try {
    const createTransaction = await customAPIAdd(
      {
        ...fields
      }, api);
    hide();
    if (createTransaction) {
       message.success(createTransaction.message);
       return true;
    }
    
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message);
    return false;
  }
};






export type userSettlement = {
 id: number,
 username: string,
 phone: string,
 fullname: string,
 email: string,
 passport: string,
 avaiLimitCPassSettlement: number,
 avaiCPassSettlement: number
}

const ConfirmRegisteringSettlement : React.FC<any> = (props) => {
  console.log('props', props);
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  

  
  //const params = useParams<any>();
  //const [userSettlement, setUserSettlement] = useState<userSettlement>();
  
  //const [searchText, setSearchText] = useState('');
  //const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    //setSearchedColumn(dataIndex);
    //console.log('selectedKeys',selectedKeys[0] );
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
   // setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm thẻ tai`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value:any, record: any) =>{
      if(record[dataIndex]){
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return null;
    }
      ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        //setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{
      
    // }
      
  });




  useEffect(() => {
    const fetchDataFair = async () => {
    }
    fetchDataFair();
  }, []);


  const columnCPass: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <a
            onClick={() => {
              setCurrentRowCPass(entity?.id);
              setShowDetailCPass(true);
            }}
          >
            {`${entity.code}|${entity.id}`}
          </a>

        );
      },

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
      key: 'fair',
      dataIndex: 'fair',
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              //setCurrentRowFair(entity.fairId);
              //setShowDetailFair(true);
            }}
          >
            {entity?.fair}

           </a>
          
        );
      },
     
    },
   
    {
      title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Snow</>} />,
      dataIndex: 'ageAndSlot',
      valueType: 'textarea',
      key: 'ageAndSlot',
      renderText: (_, text: any) =>  {
        return `S${text?.slotNow}`;
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br/>Pnow<br/>(kg)</>} />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      
      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`,
     
    }, 

    {
      title: <FormattedMessage id='pages.searchTable.column.refundVs' defaultMessage={<>Hoàn trả Vs(VNĐ)</>} />,
      dataIndex: 'refundVs',
      valueType: 'textarea',
      key: 'refundVs',
      renderText: (_, text: any) => {
        if(text?.refundVs > text?.slotNow){
          return text?.vs;
        }
        else {
          return `N/A`;
        }
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage={<>MegaΔP(kg)<br/>ProduceAle</>} />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => `${text?.megaDeltaWeight}/${text?.produceAle}`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={<>MegaP (kg)</>} />,
      dataIndex: 'megaP',
      valueType: 'textarea',
      key: 'megaP',
      renderText: (_, text: any) => text?.megaP
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
      dataIndex: 'megaE',
      valueType: 'textarea',
      key: 'megaE',
      renderText: (_, text: any) => text?.megaE
    },
  ];

  return (
    <>
    <ModalForm 
        open={props.openModal}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onCloseModal();
          },
        }}
        onFinish={ async() => {
          const cPass = props?.cPass.map((e: any) => e.id);
         
          const success = await handleCreate({
            "cPass": cPass,
            "userId": props.userId,
            "method": "vnd"
          }, 'transactions/settlement/create');
       
          if(success){
            props.onCloseModal();
          }
          return true;
        }}
        submitTimeout={2000}
        width='90vh'
        submitter={{
          searchConfig: {
            resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            submitText: <FormattedMessage id='buttonSubmit' defaultMessage='Xác nhận' />,
          },
        }}
    >
    <ProTable
        headerTitle={(<>
         {/* Đăng ký Thanh quyết toán cho Mega {userSettlement?.fullname ? userSettlement?.fullname : userSettlement?.username} - {userSettlement?.id}  các cPass sau: */}
        </>)}
        pagination={false}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowSelection={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }

        
        // request={async () => {
        //   const data = await customAPIGetOne(8, 'c-passes/get/cpass-of-mega', {});
        //   setUserSettlement(data?.user);
        //   //console.log('usersss', data);
         
        //   return {
        //     data: data?.cPass,
        //     success: true,
        //     total: 0
        //   }
        // }}
        columns={columnCPass}
        dataSource={props.cPass}

        toolbar={{
          settings:[{
            key: 'reload',
            tooltip: 'Tải lại',
            icon: <ReloadOutlined />,
            onClick:() => {
              if (actionRef.current){
                actionRef.current.reload();
              }
            }
          }]
        }}

        
        
        
      />
      {currentRowCPass && (
        <DetailCPass
          openModal={showDetailCPass}
          idCPass={currentRowCPass}
          closeModal={() => {
            setCurrentRowCPass(undefined);
            setShowDetailCPass(false);
          }}
        />
      )}
</ModalForm>
    </>
  );
};

export default ConfirmRegisteringSettlement;


