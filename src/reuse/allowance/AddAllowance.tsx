import { disableDateStartAndDateEnd, formatter, getOption, getOptionCBVC, handleAdd, parser } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";

export default function AddRelateFamily({ open, handleOpen, actionRef, id, name, soCMND, type, collection }: GEN.AllowanceAddNewProps) {
    const [form] = Form.useForm<any>();

    async function add(value: any) {
        const data = {
            ...value,
            batDau: moment(value.batDau).toISOString(),
            ketThuc: moment(value.ketThuc).toISOString(),
        }

        if (actionRef.current) {
            const create = await handleAdd(data, `${collection}${type !== 'EMPLOYEE' ? `/${id ?? value?.id}` : ''}`);
            if (create) {
                handleOpen(false);
                actionRef.current?.reload();
            }
        }

    }


    return (
        <ModalForm
            form={form}
            title={<>Tạo phụ cấp khác {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
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
                    <ProFormText name="hinhThucThuong" key="hinhThucThuong" label="Hình thức hưởng" placeholder={"Hình thức hưởng"} />
                </Col>
                <Col span={12} >
                    <ProFormSelect name="loaiPhuCapId" key="loaiPhuCapId" label="Loại phụ cấp" request={() => getOption(`${SERVER_URL_CONFIG}/loai-phu-cap?page=0&size=100`, 'id', 'name')} />
                </Col>
            </Row>


            <Row gutter={24} >
                <Col span={12} >
                    <ProFormDigit name="giaTri" key="giaTri" label="Giá trị" placeholder={"Giá trị"} fieldProps={{
                        min: 0,
                        formatter,
                        parser,

                    }} />
                </Col>
                <Col span={12} >
                    <ProFormDigit name="heSoPhuCap" key="heSoPhuCap" label="Hệ số phụ cấp" placeholder={"Hệ số phụ cấp"} fieldProps={{
                        min: 0,
                        formatter,
                        parser,
                    }} />
                </Col>
            </Row>

            <Row gutter={24} >
                <Col span={12} >
                    <ProFormDatePicker
                        name="batDau"
                        label={"Ngày bắt đầu"}
                        placeholder={"Ngày bắt đầu"}
                        rules={[
                            { required: true, message: "Ngày bắt đầu" }
                        ]}
                        fieldProps={{
                            style: {
                                width: "100%"
                            },
                            disabledDate: current => disableDateStartAndDateEnd('ketThuc', form, 'start', current)
                        }}
                    />
                </Col>
                <Col span={12} >
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
                            disabledDate: current => disableDateStartAndDateEnd('batDau', form, 'end', current)
                        }}
                    />
                </Col>
            </Row>

            <Row gutter={24} >
                <Col span={12} >
                    <ProFormDigit name="phanTramHuongPhuCap" key="phanTramHuongPhuCap" label="Phần trăm hưởng (%)" placeholder={"Phần trăm hưởng (%)"} fieldProps={{
                        min: 0,
                        max: 100
                    }} />

                </Col>

                {(!id && type === 'ADMIN') && (
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