// import { customAPIGet } from '@/services/ant-design-pro/api';
import {
  PageContainer
} from '@ant-design/pro-components';
// import React, { useState } from 'react';

// import configText from '@/locales/configText';
import StatisticsCPass from './components/StatisticsCPass';
import StatisticsFarm from './components/StatisticsFarm';
// import { useEffect } from 'react';

const TableList: React.FC = () => {


  //   useEffect(() => {
  //     const getValues = async () => {
  //         let getData = await customAPIGet({}, 'c-passes/statistic/c-pass');
  //         setDataStatisticCPass(getData);
  //     };
  //     getValues();
  // }, []);

  // const menuMonth = (<>
  //   <Menu>
  //     <Menu.Item key='2'
  //       onClick={async () => {
  //         setType('months');
  //       }}
  //     >
  //       Tất cả
  //     </Menu.Item>

  //     <Menu.Item key='3'
  //       onClick={async () => {
  //         setType('currentMonth');
  //       }}
  //     >
  //       Tháng này
  //     </Menu.Item>


  //     <Menu.Item key='4'
  //       onClick={async () => {
  //         setType('premMonth');
  //       }}
  //     >
  //       Tháng trước
  //     </Menu.Item>

  //   </Menu>
  // </>)

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1"
  //       onClick={async () => {
  //         setType('week');
  //       }
  //       }
  //     >Tuần</Menu.Item>

  //     <Menu.Item key="2"
  //       onClick={async () => {
  //         setType('week');
  //       }
  //       }
  //     ><Dropdown overlay={menuMonth} trigger={['hover']} placement='bottomRight'>
  //         <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
  //           Tháng
  //         </a>
  //       </Dropdown></Menu.Item>

  //   </Menu>
  // );

  return (
    <PageContainer
      tabList={[
        {
          tab: 'Thống kê cPass',
          key: '3',
          children: (<>
                <StatisticsCPass />
          </>)
        },

        {
          tab: 'Thống kê Trang trại',
          key: '4',
          children: (<>
                <StatisticsFarm />
          </>)
        },


      ]}
    >
      

    </PageContainer>
  );
};

export default TableList;
