import { Button } from "antd";
import { Fragment } from "react";
import { get } from "../ant-design-pro/api";

export function renderTableAlert(selectedRowKeys: any) {
  return (
    <Fragment>
      Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
    </Fragment>
  );
}


export function renderTableAlertOption(selectedRows: any) {
  return (
    <>
      <Fragment>
        <Button onClick={async () => {
          confirm(selectedRows);
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


