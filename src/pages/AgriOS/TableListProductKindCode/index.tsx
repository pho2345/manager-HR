import {
  PageContainer
} from '@ant-design/pro-components';
import ProduceKindCode from './components/ProduceKindCode';


const TableList: React.FC = () => {

  return (
    <PageContainer
      tabList={[
        {
          tab: 'Quản lí Ale hiện tại',
          key: '3',
          children: (<>
                <ProduceKindCode />
          </>)
        },
        

      ]}
    >
    </PageContainer>
  );
};

export default TableList;
