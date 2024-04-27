import { disableDateStartAndDateEnd, getOption, getOptionCBVC, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";
import { useState } from "react";

export default function AddPolicalTheory({ open, handleOpen, actionRef, id, name, soCMND }: GEN.CerTechAddNewProps) {
    const [form] = Form.useForm<any>();
    const collection = `${SERVER_URL_CONFIG}/ly-luan-chinh-tri`;

    async function add(value: any) {
        const data = {
            ...value,
            batDau: moment(value.batDau).toISOString(),
            ketThuc: moment(value.ketThuc).toISOString(),
        }
        const create = await handleAdd(data, `${collection}/${id ?? value?.id}`);
        if (actionRef.current) {
            if (create) {
                handleOpen(false);
                actionRef.current?.reload();
            }
        }
    }

    return (
        <ModalForm
            form={form}
            title={<>Tạo lý luận chính trị {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
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
                    <ProFormText name="vanBangDuocCap" key="vanBangDuocCap" label="Văn bằng" placeholder={'Văn bằng'} />
                </Col>

                <Col span={12} >
                    <ProFormText name="hinhThucDaoTao" key="hinhThucDaoTao" label="Hình thức đào tạo" placeholder={'Hình thức đào tạo'} />
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
                            disabledDate: current => disableDateStartAndDateEnd('ketThuc', form, 'start', current)
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
                            disabledDate: current => disableDateStartAndDateEnd('batDau', form, 'end', current)
                        }}
                    />
                </Col>
            </Row>

            <Row gutter={24} >
                <Col span={12} >
                    <ProFormSelect name="tenCoSoDaoTaoId" key="tenCoSoDaoTao" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
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
        </ModalForm>
    )
}