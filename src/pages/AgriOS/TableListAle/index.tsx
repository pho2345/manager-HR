import {
  PageContainer
} from '@ant-design/pro-components';

import ManagerAleCurrent from './components/ManagerAleCurrent';

const TableList: React.FC = () => {


  return (
    <PageContainer
      tabList={[
        {
          tab: 'Quản lí Ale hiện tại',
          key: '3',
          children: (<>
                <ManagerAleCurrent />
          </>)
        },
        

      ]}
    >
      

    </PageContainer>
  );
};

export default TableList;
