import { get, post2 } from "@/services/ant-design-pro/api";
import { disableDateStartAndDateEnd, getOption, getOptionCBVC, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";

export default function AddRelateFamily({ open, handleOpen, actionRef, id, name, soCMND }: GEN.CerTechAddNewProps) {
    const [form] = Form.useForm<any>();
    const collection = `${SERVER_URL_CONFIG}/quan-he-gia-dinh`;

    async function add(value: any) {
        const data = {
            ...value,
            batDau: moment(value.batDau).toISOString(),
            ketThuc: moment(value.ketThuc).toISOString(),
        }

        if (actionRef.current) {
            const create = await handleAdd(data, `${collection}/${id ?? value?.id}`);
            if (create) {
                handleOpen(false);
                actionRef.current?.reload();

            }
        }

    }


    return (
        <ModalForm
            form={form}
            title={<>Tạo quan hệ gia đình {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
            open={open}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    handleOpen(false)
                },
            }}
            onFinish={async (value) => {
                await add(value);
            }}


            submitter={{
                searchConfig: {
                    resetText: "Đóng",
                    submitText: "Thêm",
                },
            }}
        >


            <Row gutter={24} >
                <Col span={12} >
                    <ProFormText name="hoVaTen" key="hoVaTen" label="Họ tên" placeholder={"Họ tên"} />
                </Col>
                <Col span={12} >
                    <ProFormSelect name="moiQuanHeId" key="moiQuanHeId" label="Mối quan hệ" request={() => getOption(`${SERVER_URL_CONFIG}/moi-quan-he?page=0&size=100`, 'id', 'name')} />
                </Col>
            </Row>

            <Row gutter={24} >
                <Col span={12} >
                    <ProFormDigit name="namSinh" key="namSinh" label="Năm sinh" placeholder={"Năm sinh"} fieldProps={{
                        min: 1900
                    }} />
                </Col>
                <Col span={12} >
                    <ProFormText name="thongTinThanNhan" key="thongTinThanNhan" label="Thông tin thân nhân" />
                </Col>
            </Row>

            <Row gutter={24} >
                {!id && (
                    <Col span={12} >
                        <ProFormSelect
                            label={"CBVC"}
                            // width='md'
                            name='id'
                            placeholder={`CBVC`}
                            rules={[
                                {
                                    required: true,

                                },
                            ]}
                            showSearch
                            request={getOptionCBVC}
                        />
                    </Col>
                )}
            </Row>
        </ModalForm >
    )
}