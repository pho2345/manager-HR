import { put } from "@/services/ant-design-pro/api";
import { XAC_NHAN } from "@/services/utils/constant";
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import { Col, Row, message } from "antd";

export default function ModalApproval({openApproval, setOpenApproval, actionRef, selectedRow, subDirectory }: GEN.ModalApproval ) {

    const handleApproval = async (value: any) => {
        const update = await put(`${SERVER_URL_ACCOUNT}${subDirectory}`, selectedRow, {
          pheDuyet: value.trangThai
        });
        if (update) {
          message.success("Phê duyệt thành công");
          setOpenApproval(false);
          if (actionRef.current) {
            actionRef.current?.reload?.();
          }
        }
      }

      
    return (
        <ModalForm
            title={'Phê duyệt'}
            width={window.innerWidth * 0.3}
            open={openApproval}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    setOpenApproval(false);
                },
            }}
            onFinish={async (value) => {
                await handleApproval(value as API.RuleListItem);
            }}

            submitter={{
                searchConfig: {
                    resetText: "Đóng",
                    submitText: "Phê duyệt",
                },
            }}
        >
            <Row gutter={24} >
                <Col span={24} >
                    <ProFormSelect
                        label={"Trạng thái"}
                        // width='md'
                        name='trangThai'
                        placeholder={`Trạng thái`}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái"
                            },
                        ]}
                        options={XAC_NHAN}
                    />
                </Col>
            </Row>
        </ModalForm>
    )
}