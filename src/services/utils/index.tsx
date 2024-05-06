import { Button, Col, Input, Modal, Row, Space, message } from "antd";
import { Fragment } from "react";
import { deletes, get, patch, post } from "../ant-design-pro/api";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { request } from "@umijs/max";
import { FormInstance } from "antd/lib";
import { LightFilter, ProFormDatePicker, ProFormSelect } from "@ant-design/pro-components";
import { RANGE_SEARCH, XAC_NHAN } from "./constant";


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


export const getOption = async (url: string, getValue: any, getLabel: any): Promise<GEN.Option[]> => {
  try {
    const { data }: any = await get(url);
    if (data) {
      const getDataOption =  data?.data
      .filter((e: any) => e[getValue] && e[getLabel])
      .map(({ [getLabel]: label, [getValue]: value }) => ({ label, value }));

      return getDataOption
    }
    return [];
  } catch (error) {
    return [];
  }
}




export const handleAdd = async (fields: any, collection: string, date: boolean = false) => {
  const hide = message.loading('Đang thêm...');
  try {

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
    hide();
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
    if (update) {
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
    if (update) {
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

  if (fetchData) {
    const data = fetchData?.results?.map((e: any) => {
      return {
        value: e.province_name,
        label: e.province_name
      }
    })

    return data;
  }

}

export const formatter = (value: any) => {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
};

export const parser = (value: any) => {
  if (value) {
    return value.replace(/\$\s?|(,*)/g, '');
  }
  return undefined;
};


export const getOptionCBVC = async () => {
  const data = await get(`${SERVER_URL_CONFIG}/nhan-vien/ho-so?page=0&size=10000`);
  if (data) {
    const dataOptions = data.data.data.map((item: any) => {
      return {
        label: `${item.hoVaTen} - ${item.soCCCD}`,
        value: item.id
      }
    })
    return dataOptions;
  }
}

export const disableDateStartAndDateEnd = (fieldDate: string, form: FormInstance, fieldCurrent: "start" | 'end', current: any) => {
  if (fieldCurrent === 'start') {
    const getDate = form.getFieldValue(fieldDate);
    if (getDate) {
      return current && current >= moment(getDate).startOf('day');
    }
    return false
  }
  else {
    const getDate = form.getFieldValue(fieldDate);
    if (getDate) {
      return current && current <= moment(getDate).startOf('day');
    }
    return false
  }
}

export const handleTime = (time?: string) => {
  if (!time) return null;
  return moment(new Date(`${time}Z`)).toISOString()
}

export const displayTime = (time?: string) => {
  if (!time) return '';
  return moment(new Date(`${time}Z`)).format(FORMAT_DATE)
}



const handleSearchRange = (selectedKeys: any, confirm: any) => {
  confirm();
};

const clearResetRange = (clearFilters: any, confirm: any, setSearchRangeFrom: any, setSearchRangeTo: any, setOptionRangeSearch: any) => {
  clearFilters();
  setSearchRangeFrom(null);
  setSearchRangeTo(null);
  setOptionRangeSearch(null);
  confirm({
    closeDropdown: false,
  });
};

export const getColumnSearchRange = (dataIndex: string,
  showRangeTo: boolean, setShowRangeTo: Function, optionRangeSearch: GEN.RANGE_SEARCH, setOptionRangeSearch: Function, searchRangeFrom: any, setSearchRangeFrom: Function, searchRangeTo: any, setSearchRangeTo: Function) =>
({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
    //close
  }: any) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {
        showRangeTo && (<>
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  onChange: (e: any) => {
                    if (e) {
                      setSearchRangeFrom(moment(e['$d']).toISOString());
                    }
                  },
                  value: searchRangeFrom,
                  disabledDate: current => {
                    if (searchRangeTo) {
                      return current && current >= moment(searchRangeTo).startOf('day');
                    }
                    return false
                  }
                }}
                placeholder={'Thời gian từ'}
              />
            </Col>
          </Row>
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  value: searchRangeTo,
                  onChange: (e: any) => {
                    if (e) {
                      setSearchRangeTo(moment(e['$d']).toISOString());
                    }
                  },
                  disabledDate: current => {
                    if (searchRangeFrom) {
                      return current && current <= moment(searchRangeFrom).startOf('day');
                    }
                    return false
                  }
                }}
                rules={[
                  { required: true, message: 'Thời gian đến không được để trống' },
                ]}
                placeholder={'Thời gian đến'}

              />
            </Col>
          </Row>
        </>
        )
      }
      <Row gutter={24} className="m-0">
        <Col span={24} className="gutter-row p-0" >
          <ProFormSelect

            options={RANGE_SEARCH}
            fieldProps={{
              onChange: (value: any) => {
                if (value === 'range') {
                  setShowRangeTo(true);
                }
                else {
                  setShowRangeTo(false);
                }
                setOptionRangeSearch(value);
              },
              value: optionRangeSearch
            }}
          />
        </Col>
      </Row>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            if (optionRangeSearch !== 'range') {
              setSelectedKeys([JSON.stringify([optionRangeSearch])])
            }
            else {
              setSelectedKeys([JSON.stringify([optionRangeSearch, searchRangeFrom, searchRangeTo])])
            }
            handleSearchRange(selectedKeys, confirm);

          }}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Tìm kiếm
        </Button>
        <Button
          onClick={() => clearFilters && clearResetRange(clearFilters, confirm, setSearchRangeFrom, setSearchRangeTo, setOptionRangeSearch)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Làm mới
        </Button>

      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined
      style={{
        color: filtered ? '#1890ff' : undefined,
      }}
    />
  ),
  onFilter: (value: any, record: any) => {
    if (typeof value === 'string') {
      const convertValue = JSON.parse(value);
      const optionValue = convertValue[0];
      if (optionValue === 'range') {
        if (convertValue[1] && convertValue[2]) {
          if (moment(record[dataIndex]).isAfter(convertValue[1]) && moment(record[dataIndex]).isBefore(convertValue[2])) {
            return record
          }
        }
      }
      else {
        const timeStart = moment().startOf(optionValue).toISOString();
        const timeEnd = moment().endOf(optionValue).toISOString();
        if (moment(record[dataIndex]).isAfter(timeStart) && moment(record[dataIndex]).isBefore(timeEnd)) {
          return record;
        }
      }
    }
    return null;
  }
  ,
});


const handleSearch = (selectedKeys: any, confirm: any) => {
  confirm();

};
const handleReset = (clearFilters: any, confirm: any) => {
  clearFilters();
  confirm({
    closeDropdown: false,
  });
};

export const getColumnSearchProps = (dataIndex: any) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input
        placeholder={`Tìm kiếm`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm)}
        style={{
          marginBottom: 8,
          display: 'block',
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Tìm
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters, confirm)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Làm mới
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined
      style={{
        color: filtered ? '#1890ff' : undefined,
      }}
      onClick={() => {
      }}
    />
  ),
  onFilter: (value: any, record: any) => {
    if (record[dataIndex]) {
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    }
    return null;
  }
  ,
  onFilterDropdownOpenChange: (visible: any) => {
    if (visible) {
    }
  },
});


export const searchPheDuyetProps = (searchPheDuyet: any, setSearchPheDuyet: Function, actionRef: any) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
    //close
  }: any) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Row gutter={24} className="m-0">
        <Col span={24} className="gutter-row p-0" >
          <ProFormSelect
            options={XAC_NHAN}
            fieldProps={{
              onChange: (value: any) => {
                setSearchPheDuyet(value)
              },
              value: searchPheDuyet
            }}
            showSearch
            placeholder={'Chọn trạng thái'}
          />
        </Col>
      </Row>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            confirm()
            actionRef.current?.reload();

          }}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Tìm kiếm
        </Button>
        <Button
          onClick={() => {
            setSearchPheDuyet(null);
            actionRef.current?.reload();
          }}
          size="small"
          style={{
            width: 90,
          }}
        >
          Làm mới
        </Button>

      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined
      style={{
        color: searchPheDuyet ? '#1890ff' : undefined,
      }}
    />
  ),
})

export const filterCreateAndUpdateAt = (sort: 'createAt' | 'updateAt', setSort: Function, actionRef: any) => ({
  filter: (
    <LightFilter>
      <ProFormSelect name="startdate" label="Sắp xếp" allowClear={false} options={[
        {
          label: 'Ngày tạo',
          value: 'createAt'
        },
        {
          label: 'Ngày cập nhật',
          value: 'updateAt'
        }
      ]}
        fieldProps={{
          value: sort
        }}
        onChange={(e) => {
          setSort(e);
          actionRef?.current?.reload();
        }}
      />
    </LightFilter>
  )
})