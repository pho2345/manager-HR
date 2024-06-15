import { get, post2 } from "@/services/ant-design-pro/api";
import { disableDateStartAndDateEnd, getOption, getOptionCBVC, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";
import { useState } from "react";

export default function AddWorkingAbroad({ open, handleOpen, actionRef, id, name, soCMND, type, collection }: GEN.WorkingAbroadAddNewProps) {
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
            title={<>Tạo làm việc ở nước ngoài {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
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

                <Col span={8} >
                    <ProFormText name="toChucDiaChiCongViec" key="toChucDiaChiCongViec" label="Tổ chức địa chỉ công việc" placeholder={'Tổ chức địa chỉ công việc'} />
                </Col>

                <Col span={8} >
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
                            disabledDate: current => disableDateStartAndDateEnd('batDau', form, 'end', current)
                        }}
                    />
                </Col>

            </Row>
            <Row gutter={24} >
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