import { Button, Modal, message } from "antd";
import { Fragment } from "react";
import { deletes, get, patch, post } from "../ant-design-pro/api";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const handleRemove = async (arrayId: any, collection: string) => {
  const deletePromises = arrayId.map((e: any) => {
    return deletes(`${collection}/${e}/xoa`); // Trả về promise từ mỗi lệnh xóa
  });

  await Promise.all(deletePromises); // Chờ tất cả các promise xóa hoàn thành

  return true;
};

const confirm = (entity: any, actionRef: any, collection: string) => {
  Modal.confirm({
    title: 'Xác nhận',
    icon: <ExclamationCircleOutlined />,
    content: "Bạn có chắc?",
    okText: 'Có',
    cancelText: 'Không',
    onOk: async () => {
      try {
        const de = await handleRemove(entity, collection);
        if (de && actionRef.current) {
          await actionRef.current.reloadAndRest(); // Gọi reloadAndRest sau khi xóa hoàn thành
        }
      } catch (error) {
        // Xử lý lỗi nếu cần thiết
        console.error('Lỗi xảy ra khi xóa:', error);
      }
    }
  });
};

export function renderTableAlert(selectedRowKeys: any) {
  return (
    <Fragment>
      Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
    </Fragment>
  );
}


export function renderTableAlertOption(selectedRows: any, selectedRowKeys: any, actionRef: any, collection: string) {
  return (
    <>
      <Fragment>
        <Button onClick={async () => {
          confirm(selectedRowKeys, actionRef, collection);
        }}>Xóa</Button>
      </Fragment>
    </>
  );
}


export const getOption = async (collection: string, getValue: string, getLabel: string): Promise<GEN.Option[]> => {
  try {
    const { data } = await get(collection);
    if (data) {
      return data
        .filter(e => e[getValue] && e[getLabel])
        .map(({ [getLabel]: label, [getValue]: value }) => ({ label, value }));
    }
    return [];
  } catch (error) {
    return [];
  }
}


export const handleAdd = async (fields: any, collection: string, date: boolean = false) => {
  const hide = message.loading('Đang thêm...');
  const data = date ? {
    ...fields,
    batDau: moment(fields.batDau).toISOString(),
    ketThuc: moment(fields.ketThuc).toISOString()
  } : fields;
  await post(`${collection}/them`, {}, {
    ...data,
  });
  try {
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


export const handleUpdate = async (fields: any, id: any, collection: string, date: boolean = false) => {
  const hide = message.loading('Đang cập nhật...');
  try {

    const data = date ? {
      ...fields,
      batDau: moment(fields.batDau).toISOString(),
      ketThuc: moment(fields.ketThuc).toISOString()
    } : fields
    
      await patch(`${collection}/${id}/sua`, {
          ...data
      })
      hide();
      message.success('Cập nhật thành công');
      return true;
  } catch (error: any) {
      hide();
      message.error(error?.response?.data?.error?.message);
      return false;
  }
};

