import { get, post2 } from "@/services/ant-design-pro/api";
import { disableDateStartAndDateEnd, formatter, getOption, getOptionCBVC, handleAdd, parser } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";

export default function AddWorkModelOld({ open, handleOpen, actionRef, id, name, soCMND }: GEN.CerTechAddNewProps) {
    const [form] = Form.useForm<any>();
    const collection = `${SERVER_URL_CONFIG}/lam-viec-cho-che-do-cu`;

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
            title={<>Tạo làm việc cho chế độ cũ {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
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
                    <ProFormText name="chucDanhDonViDiaDiem" key="chucDanhDonViDiaDiem" label="Chức danh đơn vị địa điểm" placeholder={"Chức danh đơn vị địa điểm"} />
                </Col>
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
           
        </ModalForm >
    )
}