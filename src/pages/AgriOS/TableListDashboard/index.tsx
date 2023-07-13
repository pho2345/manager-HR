// import { customAPIGet } from '@/services/ant-design-pro/api';
import {
  PageContainer
} from '@ant-design/pro-components';
// import React, { useState } from 'react';

// import configText from '@/locales/configText';
import StatisticsCPass from './components/StatisticsCPass';
import StatisticsFarm from './components/StatisticsFarm';
import StatisticsAle from './components/StatisticsAle';
import StatisticsUser from './components/StatisticsUser';
import StatisticsAleger from './components/StatisticsAleger';
// import { useEffect } from 'react';

const TableList: React.FC = () => {


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

        {
          tab: 'Thống kê Ale',
          key: '5',
          children: (<>
                <StatisticsAle />
          </>)
        },

        {
          tab: 'Thống kê Aleger đăng kí',
          key: '6',
          children: (<>
                <StatisticsUser />
          </>)
        },

        {
          tab: 'Thống kê Aleger',
          key: '7',
          children: (<>
                <StatisticsAleger />
          </>)
        },

      ]}
    >
      

    </PageContainer>
  );
};

export default TableList;
