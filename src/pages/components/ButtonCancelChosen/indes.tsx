import { customAPIDelete } from '@/services/ant-design-pro/api';
import { Button, Modal, message } from 'antd';

const handleRemove = async (selectedRows: any, collection: string) => {
      const hide = message.loading('Đang xóa...');
      if (!selectedRows) return true;
      try {
        const deleteRowss = selectedRows.map((e: any) => {
          return customAPIDelete(e.id, collection)
        })
    
        await Promise.all(deleteRowss);
        hide();
        message.success('Xóa thành công');
        return true;
      } catch (error: any) {  
        hide();
        message.error(error?.response?.data.error.message);
        return false;
      }
    };

const confirm = (entity: any, collection: string) => {
      Modal.confirm({
  
        title: 'Confirm',
      //   icon: <ExclamationCircleOutlined />,
        content: 'Bạn có muốn xóa?',
        okText: 'Có',
        cancelText: 'Không',
        onOk: async () => {
      //    const removeFair =  
         await handleRemove(entity, collection);
        }
      });
    };
function renderTableAlertOption(selectedRows: any, onCleanSelected: any, collection: string) {
    return (
          <Button onClick={() => confirm(selectedRows, collection)}>Xóa</Button>
    );
  }

  export default renderTableAlertOption;