import { getOption, handleAdd } from "@/services/utils";
import { XEP_LOAI_CHUYEN_MON, XEP_LOAI_THI_DUA } from "@/services/utils/constant";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";

export default function AddBonus({ createModalOpen, handleModalOpen, actionRef, id }: GEN.AddBonus) {
    const collection = `${SERVER_URL_CONFIG}/khen-thuong/${id}`;
    const [form] = Form.useForm<any>();
    async function add(value: any) {
        return await handleAdd(value, collection);
    }
    return (
        <ModalForm
            form={form}
            title={"Tạo mới khen thưởng"}
          
            open={createModalOpen}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    handleModalOpen(false)
                },
            }}
            onFinish={async (value) => {
                const success = await add(value)
                if (success) {
                    handleModalOpen(false);
                    form.resetFields();
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                }
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
                    <ProFormSelect
                        label={"Xếp loại chuyên môn"}
                        // width='md'
                        name='xepLoaiChuyenMon'
                        placeholder={`Xếp loại chuyên môn`}
                        options={XEP_LOAI_CHUYEN_MON}
                        rules={[
                            {
                                required: true,
                                message: "Xếp loại chuyên môn"
                            },
                        ]} />
                </Col>

                <Col span={12} >
                    <ProFormSelect
                        label={"Xếp loại thi đua"}
                        // width='md'
                        name='xepLoaiThiDua'
                        placeholder={`Xếp loại thi đua`}
                        options={XEP_LOAI_THI_DUA}
                        rules={[
                            {
                                required: true,
                                message: "Xếp loại thi đua"
                            },
                        ]} />
                </Col>
            </Row>

            <Row gutter={24} >
                <Col span={12} >
                    <ProFormSelect
                        label={"Hình thức khen thưởng"}
                        // width='md'
                        name='hinhThucKhenThuongId'
                        placeholder={`Hình thức khen thưởng`}
                        request={() => getOption(`${SERVER_URL_CONFIG}/hinh-thuc-khen-thuong`, 'id', 'name')}
                        rules={[
                            {
                                required: true,
                                message: "Hình thức khen thưởng"
                            },
                        ]} />
                </Col>

                <Col span={12} >
                    <ProFormText
                        label={"Lý do"}
                        // width='md'
                        name='lyDo'
                        placeholder={`Lý do`}
                        rules={[
                            {
                                required: true,
                                message: "Lý do"
                            },
                        ]} />
                </Col>
            </Row>

            <Row gutter={24} >
                <Col span={12} >
                <ProFormText
                        label={"Năm"}
                        // width='md'
                        name='nam'
                        placeholder={`Năm`}
                        rules={[
                            {
                                required: true,
                                message: "Năm"
                            },
                        ]} />
                </Col>
            </Row>
        </ModalForm>
    )
}