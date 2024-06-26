import { get, post2 } from "@/services/ant-design-pro/api";
import { getOption, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Updateiscipline({ open, handleOpen, actionRef, id }: GEN.DisciplineAddNewProps) {
  const [form] = Form.useForm<any>();
  const collection = `${SERVER_URL_CONFIG}/ky-luat/${id}`;
  const [description, setDescription] = useState<any>();

  useEffect(() => {
    const getDes = async () => {
      const data = await get(collection);
      setDescription(data.data);
      if (data.data) {
        form.setFieldsValue({
          // coQuanQuyetDinhId: data.data?.coQuanQuyetDinhId,
          hinhThuc: "acbd",
          // hanhViViPhamChinh: data.data?.hanhViViPhamChinh,
          // batDau: moment(data.data?.batDau),
          // ketThuc: moment(data.data?.ketThuc),
          // hoSoId: data.data?.hoSoId,
        });
      }
    }
    getDes();

  }, []);


  async function add(value: any) {
    const data = {
      ...value,
      batDau: moment(value.batDau).toISOString(),
      ketThuc: moment(value.ketThuc).toISOString(),
    }
    if (actionRef.current) {
      actionRef.current?.reload();
    }
    handleOpen(false);
    return await handleAdd(data, collection);
  }

  return (
    <ModalForm
      form={form}
      title={"Cập nhật kỷ luật"}
      open={open}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          handleOpen(false)
        },
      }}
      onFinish={async (value) => {

        // const success = await add(value);

      }}

      submitter={{
        searchConfig: {
          resetText: "Đóng",
          submitText: "Thêm",
        },
      }}
    >

      <Row gutter={24} >
        <Col span={8} >
          <ProFormSelect name="coQuanQuyetDinhId" key="coQuanQuyetDinh" label="Cơ quan quyết định" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
        </Col>
        <Col span={8} >
          <ProFormText name="hinhThuc" key="hinhThuc" label="Hình thức kỷ luật" placeholder={"Hình thức"} />
        </Col>
        <Col span={8} >
          <ProFormText name="hanhViViPhamChinh" key="hanhViViPhamChinh" label="Hành vi vi phạm" placeholder={"Hành vi"} />
        </Col>
      </Row>

      <Row gutter={24} >
        <Col span={8} >
          <ProFormDatePicker
            name="batDau"
            label={"Ngày quyết định"}
            placeholder={"Ngày quyết định"}
            rules={[
              { required: true, message: "Ngày quyết định" }
            ]}
            fieldProps={{
              style: {
                width: "100%"
              },
              // disabledDate: disabledDate
            }}
          />
        </Col>
        <Col span={8} >
          <ProFormDatePicker
            name="ketThuc"
            label={"Ngày kết thúc"}
            placeholder={"Ngày kết thúc"}
            rules={[
              { required: true, message: "Ngày kết thúc" }
            ]}
            fieldProps={{
              style: {
                width: "100%"
              },
              // disabledDate: disabledDate
            }}
          />
        </Col>

      </Row>

      <Row gutter={24} >
        <Col span={12} >
          <ProFormSelect
            label={"CBVC"}
            // width='md'
            name='hoSoId'
            placeholder={`CBVC`}
            rules={[
              {
                required: true,

              },
            ]}
            showSearch
            request={async () => {
              const data = await get(`${SERVER_URL_CONFIG}/nhan-vien/ho-so?page=0&size=10000`);
              const dataOptions = data.data.map((item: any) => {
                return {
                  label: `${item.hoVaTen} - ${item.soCCCD}`,
                  value: item.id
                }
              })
              return dataOptions;
            }}


          />
        </Col>
      </Row>

    </ModalForm>
  )
}