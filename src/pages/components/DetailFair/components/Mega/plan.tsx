
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import React, { useEffect, useRef, useState } from 'react';
import configText from '@/locales/configText';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { ReloadOutlined } from '@ant-design/icons';

const configDefaultText = configText;




const TableList = (props: any) => {

    const actionRef = useRef<ActionType>();
    const [fair, setFair] = useState<any>();
 

    useEffect(() => {
        const getFair =  async () => {
            const fair =  await customAPIGetOne(props.id, 'fairs/fairadmin', {});
            setFair(fair);
        }

        getFair();
    }, [])

    const columnCPass: ProColumns<any>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
        },

        {
            // title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Tuổi/Snow</>} />,
            title: configDefaultText['page.detailFair.mega.plan.name'],
            dataIndex: 'ageAndSlot',
            valueType: 'textarea',
            key: 'ageAndSlot',
            renderText: (_, record: any) => {
                return record.text;
            },
        },


        {
            // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
            title: (<>{configDefaultText['page.detailFair.mega.plan.profit']} </>),
            dataIndex: 'profit',
            valueType: 'textarea',
            key: 'profit',
            renderText: (_, record: any) => record?.profit
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
        submitTimeout={2000}
        submitter={false}
        width='100vh'
      >
      
        <ProTable
          headerTitle={<>
          PAHT: {fair?.code}
          </>}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={
            (entity) => {
              return entity.classColor
            }
          }

          request={async () => {
            //console.log('usersss', data);
            const getPlan = await customAPIGetOne(props.id, 'fairs/plan', {});
            return {
              data: getPlan,
              success: true,
              total: 0
            }
          }}
         

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
          columns={columnCPass}
        //   rowSelection={{
        //     onChange: (_, selectedRows: any) => {
        //     //   setSelectedRowsCPass(selectedRows);
        //     },
        //   }}

         

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
        </ModalForm>
        </>
    );
};

export default TableList;
