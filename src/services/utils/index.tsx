import { Button, Modal, message } from "antd";
import { Fragment } from "react";
import { deletes, get, patch, post } from "../ant-design-pro/api";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { request } from "@umijs/max";


const handleRemove2 = async (arrayId: any, collection: string) => {
  const deletePromises = arrayId.map((e: any) => {
    return deletes(`${collection}/${e}`); // Trả về promise từ mỗi lệnh xóa
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
        const de = await handleRemove2(entity, collection);
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


export const getOption = async (url: string, getValue: string, getLabel: string): Promise<GEN.Option[]> => {
  try {
    const { data }: any = await get(url);
    if (data) {
      return data
        .filter((e: any) => e[getValue] && e[getLabel])
        .map(({ [getLabel]: label, [getValue]: value }) => ({ label, value }));
    }
    return [];
  } catch (error) {
    return [];
  }
}




export const handleAdd = async (fields: any, collection: string, date: boolean = false) => {

  try {
    const hide = message.loading('Đang thêm...');
    const data = date ? {
      ...fields,
      batDau: moment(fields.batDau).toISOString(),
      ketThuc: moment(fields.ketThuc).toISOString()
    } : fields;
    const add = await post(`${collection}`, { key: 'value' } as Record<string, unknown>, {
      ...data,
    });
    if (add) {
      message.success('Thêm thành công');
      hide();
      return true
    }

    return true;
  } catch (error: any) {
    message.error("Thêm thất bại");
    return false;
  }
};

export const handleAdd2 = async (fields: any, collection: string, date: boolean = false) => {
  const hide = message.loading('Đang thêm...');

  try {
    const data = date ? {
      ...fields,
      batDau: moment(fields.batDau).toISOString(),
      ketThuc: moment(fields.ketThuc).toISOString()
    } : fields;
    const add = await post(`${collection}`, {} as Record<string, any>, {
      ...data,
    });
    if (add) {
      hide();

      message.success('Thêm thành công');
      return true
    }

    return true;
  } catch (error: any) {
    hide();

    message.error("Thêm thất bại");
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

   const update = await patch(`${collection}/${id}`, {
      ...data
    })
    if(update) {
      hide();
      message.success('Cập nhật thành công');
      return true;
    }
   
  } catch (error: any) {
    hide();
    message.error("Cập nhật thất bại");
    return false;
  }
};


export const handleUpdate2 = async (fields: any, id: any, collection: string, date: boolean = false) => {
  const hide = message.loading('Đang cập nhật...');
  try {

    const data = date ? {
      ...fields,
      batDau: moment(fields.batDau).toISOString(),
      ketThuc: moment(fields.ketThuc).toISOString()
    } : fields

   const update = await patch(`${collection}/${id}`, {
      ...data
    })
    if(update) {
      hide();
      message.success('Cập nhật thành công');
      return true;
    }
   
  } catch (error: any) {
    hide();
    message.error("Cập nhật thất bại");
    return false;
  }
};

export async function getProvine() {
  const fetchData = await request<any>('https://vapi.vnappmob.com/api/province/', {
    method: 'GET',
  });

  if(fetchData) {
    console.log(fetchData);
    const data = fetchData?.results?.map((e: any) => {
      return {
        value: e.province_id,
        label: e.province_name
      }
    })

    return data;
  }

}

