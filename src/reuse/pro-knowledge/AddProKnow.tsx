import { get, post2 } from "@/services/ant-design-pro/api";
import { getOption, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";
import { useState } from "react";

export default function AddProKnow({ open, handleOpen, actionRef, id, name, soCMND }: GEN.CerTechAddNewProps) {
    const [idEmploy, setIdEmploy] = useState<string | undefined>(id);
    const [form] = Form.useForm<any>();
    const collection = `${SERVER_URL_CONFIG}/nghiep-vu-chuyen-nganh/${id ?? idEmploy}`;

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
            title={<>Tạo nghệp vụ chuyên ngành {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
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
                    <ProFormText name="chungChiDuocCap" key="chungChiDuocCap" label="Chứng chỉ" placeholder={'Chứng chỉ'} />
                </Col>

                <Col span={12} >
                    <ProFormSelect name="tenCoSoDaoTao" key="tenCoSoDaoTao" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                </Col>
            </Row>
            <Row gutter={24} >
                <Col span={12} >
                    <ProFormDatePicker
                        name="batDau"
                        label={"Ngày cấp"}
                        placeholder={"Ngày cấp"}
                        rules={[
                            { required: true, message: "Ngày cấp" }
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
                        label={"Ngày hết hạn"}
                        placeholder={"Ngày hết hạn"}
                        rules={[
                            { required: true, message: "Ngày hết hạn" }
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
        </ModalForm>
    )
}