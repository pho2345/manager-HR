import { get, post2 } from "@/services/ant-design-pro/api";
import { getOption, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";
import { useState } from "react";

export default function AddGOB({ open, handleOpen, actionRef, id, name, soCMND }: GEN.GOBAddNewProps) {
    const [idEmploy, setIdEmploy] = useState<string | undefined>(id);
    const [form] = Form.useForm<any>();
    const collection = `${SERVER_URL_CONFIG}/qua-trinh-cong-tac/${id ?? idEmploy}`;

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
            title={<>Tạo quá trình công tác {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
            open={open}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    handleOpen(false)
                },
            }}
            onFinish={async (value) => {
                const success = await add(value);
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
                    <ProFormSelect name="loaiPhuCapId" key="donViCongTac" label="Đơn vị công tác" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                </Col>
                <Col span={12} >
                    <ProFormText name="chucDanh" key="chucDanh" label="Chức danh" placeholder={"Chức danh"} />
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
                            // disabledDate: disabledDate
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
                            // disabledDate: disabledDate
                        }}
                    />
                </Col>

            </Row>

            <Row gutter={24} >
                {!id && (
                    <Col span={12} >
                        <ProFormSelect
                            label={"CBVC"}
                            // width='md'
                            name=''
                            placeholder={`CBVC`}
                            rules={[
                                {
                                    required: true,

                                },
                            ]}
                            onChange={(value: string) => {
                                setIdEmploy(value);
                            }}

                            fieldProps={{
                                value: idEmploy,

                            }}
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
                )}
            </Row>
        </ModalForm >
    )
}