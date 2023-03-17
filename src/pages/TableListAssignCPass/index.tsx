import {  customAPIGetOne,  customAPIUpdateMany } from '@/services/ant-design-pro/api';
import {  ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import "./styles.css";
import DetailCPass from '../components/DetailCPass';
import DetailUser from '../components/DetailUser';


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



const TableListAssignCPass = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<any>([]);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const [fair, setFair] = useState<any>();
  const confirm = (entity: any, message: string, api: string, id: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        
        await handleUpdateMany({
          ...entity
        }, api, id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        props.onReload();
        props.onCloseModal();
      }
    });
  };


  useEffect(() => {
    const fetchDataFair = async () => {
      const getFairData = await getFair(props.fairId);
      setFair(getFairData);
    }
    fetchDataFair();
  }, [props.currentFair]);

  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      render: (_, entity: any) => {
        return (
          <>
          <a
            onClick={() => {
              setCurrentRowUser(entity?.id);
              setShowDetailUser(true);
            }}>
            {entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}
          </a><br /> {entity?.phone}{`${entity?.email ? `|${entity?.email}` : null}`}
            <br /> CCCD/HC: {entity?.passport}
          </>
        );
      },

    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='cPass' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      render: (_, text) => {
        const cPass = text?.c_pass?.map((e: any) => {
          return (<> <a
            onClick={() => {
              setCurrentRowCPass(e?.id);
              setShowDetailCPass(true);
            }}>
            {e?.code}
          </a></>)
        });
        return (<>{cPass}</>);
      }
    },
    
  ];




  return (
    <>

      <ModalForm
        //title='Cập nhật Phiên mở bán'
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
          Đợt mở bán: {fair?.code}
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
          const data = await customAPIGetOne(props.fairId, 'users/list-and-cpass', {});
          console.log('usersss', data);

          return {
            data: data,
            success: true,
            total: data?.length
          }
        }}
        toolBarRender={() => [
          <>
          { selectedRowsState.length === 1 && (<Button
            type='primary'
            key='primary'
            onClick={() => {
             console.log(selectedRowsState)
            
             confirm(
              {
                data: {
                  cPassId: [props.currentCPass],
                  userId: selectedRowsState[0]?.id
               }
              }, 'Bạn có muốn gán cPass cho Mega đã chọn không?', 'c-passes/update/assign', null);
            }}
          >
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.add' defaultMessage='Thêm' />
          </Button>)}
          </>
        ]}
        columns={columns}
        dataSource={fair?.c_passes}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            if(selectedRows.length > 1){
              message.error('Chỉ được chọn 1 Mega!');
              setSelectedRows(selectedRows);
              return;
            }
            setSelectedRows(selectedRows);
          },
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
      
      {currentRowUser && (
        <DetailUser
          onDetail={showDetailUser}
          currentRowUser={currentRowUser}
          onCloseDetail={() => {
            setCurrentRowUser(undefined);
            setShowDetailUser(false);
          }}
        />
      )
      }

    </>
  );
};

export default TableListAssignCPass;


