import { get, post2 } from "@/services/ant-design-pro/api";
import { disableDateStartAndDateEnd, getOption, getOptionCBVC, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";
import { useState } from "react";

export default function AddCerTech({ open, handleOpen, actionRef, id, name, soCMND }: GEN.CerTechAddNewProps) {
    const [idEmploy, setIdEmploy] = useState<string | undefined>(id);
    const [form] = Form.useForm<any>();
    const collection = `${SERVER_URL_CONFIG}/tin-hoc/${id ?? idEmploy}`;

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
            title={<>Tạo chứng chỉ tin học {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCMND}</Tag>}</>}
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
                    <ProFormDigit name="diemSo" key="diemSo" label="Điểm số" placeholder={`Điểm số`} />
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
                           disabledDate:  current => disableDateStartAndDateEnd('ketThuc', form, 'start', current)
                        //    current => {
                        //         const endDate = form.getFieldValue('ketThuc');
                        //         if(endDate) {
                        //             return current && current >= moment(endDate).startOf('day');
                        //         }
                        //         return false

                        //    } // Disable dates after the end date
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
                            request={getOptionCBVC}
                        />
                    </Col>
                )}

                <Col span={12} >
                    <ProFormSelect name="tenCoSoDaoTaoId" key="tenCoSoDaoTaoId" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                </Col>
            </Row>
        </ModalForm>
    )
}