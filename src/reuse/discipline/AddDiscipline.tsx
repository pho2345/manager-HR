import { disableDateStartAndDateEnd, getOption, getOptionCBVC, handleAdd } from "@/services/utils";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Tag } from "antd";
import moment from "moment";

export default function AddDiscipline({ open, handleOpen, actionRef, id, name, soCCCD, collection, type }: GEN.DisciplineAddNewProps) {
    const [form] = Form.useForm<any>();

    async function add(value: any) {
        const data = {
            ...value,
            batDau: moment(value.batDau).toISOString(),
            ketThuc: moment(value.ketThuc).toISOString(),
        }

        const create = await handleAdd(data, `${collection}${type !== 'EMPLOYEE' ? `/${id ?? value?.id}` : ''}`);
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
            title={<>Tạo Kỷ luật {id && <Tag color="green">CBVC: {name} - CMND/CCCD: {soCCCD}</Tag>}</>}
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

        </ModalForm>
    )
}