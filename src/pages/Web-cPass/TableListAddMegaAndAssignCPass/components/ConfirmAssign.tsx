import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/components/DetailUser';
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { Button, Space, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import configText from '@/locales/configText';
import moment from 'moment';
import { customAPIUpdateMany } from '@/services/ant-design-pro/api';
const configDefaultText = configText;

const handleUpdateMany = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  console.log(fields);
  try {
    const updateTransaction = await customAPIUpdateMany(
      fields,
      api,
      id);
    hide();
    if (updateTransaction) {
      message.success(updateTransaction.message || 'Chỉ định thành công');
    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message || 'Lỗi');
    return false;
  }
};



const ConfirmRegisteringSettlement: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
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
    onFilter: (value: any, record: any) => {
      if (record[dataIndex]) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
      }
    },
  });


  const columnCPass: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: configDefaultText['page.addMegaAndAssign.column.cPass'],
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
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
      title: configDefaultText['page.addMegaAndAssign.column.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      ...getColumnSearchProps('farmName'),
      renderText: (_, text) => text.farmName ? text.farmName : null


    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: configDefaultText['page.addMegaAndAssign.column.firstWeight'],
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.age'],
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        if (age === 0) {
          return `0`;
        }
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return confiAge;
      }
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.bodyCondition'],
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        return (<span style={{ color: text?.colorBodyCondition }}>{text?.textBodyCondition}</span>);
      },
      filters: true,
      onFilter: true,
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.pZero'],
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      },
      // ...getColumnSearchRange()
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.vs'],
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.vZero'],
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.megaS'],
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => text?.megaS.toLocaleString()
    },
  ];

  return (
    <>
      <ModalForm
        open={props.openModal}
        autoFocusFirstInput
        width={window.innerWidth * 0.9}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onCloseModal();
          },
        }}
        onFinish={async () => {
          const cPassId = props.cPass.map((e: any) => {
            return e.id
          });

          const assign = await handleUpdateMany({
            data: {
              cPassId: cPassId,
              userId: props.mega?.id,
            },
            fairId: props.fairId
          }, 'c-passes/update/assign', null);

          if(assign){
            props.onCloseModal();
          }
          return true;
        }}
        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['submit'],
          },
        }}
        submitTimeout={2000}
      >
        <ProTable
          headerTitle={`Chỉ định cho Mega: ${props.mega.fullname ? props.mega.fullname : props.mega.username} - ${props.mega.id}`}
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

          toolbar={{
            settings: []
          }}



          columns={columnCPass}
          dataSource={props.cPass}

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

        {currentRowFair && (
          <DetailFair
            openModal={showDetailFair}
            fairId={currentRowFair}
            closeModal={() => {
              setCurrentRowFair(undefined);
              setShowDetailFair(false);
            }}
          />)
        }

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
      </ModalForm>
    </>
  );
};

export default ConfirmRegisteringSettlement;


