import { Button } from "antd";
import { Fragment } from "react";

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

