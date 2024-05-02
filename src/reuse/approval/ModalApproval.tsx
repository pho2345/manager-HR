import { XAC_NHAN } from "@/services/utils/constant";
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import { request } from "@umijs/max";
import { Col, Row, message } from "antd";

export async function patch(subSolder: string, body: object, params  : object = {}) {
    const fetchData = await request<any>(subSolder, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      data: body,
      params: params
    });
    return fetchData
  }

export default function ModalApproval({openApproval, setOpenApproval, actionRef, selectedRow, subDirectory, fieldApproval }: GEN.ModalApproval ) {

    const handleApproval = async (value: any) => {
       try {
        const update = await patch(`${SERVER_URL_ACCOUNT}${subDirectory}`, selectedRow, {
            [fieldApproval]: value.trangThai
          });
          if (update) {
            message.success("Phê duyệt thành công");
            setOpenApproval(false);
            if (actionRef.current) {
              actionRef.current?.reload?.();
            }
          }
       } catch (error) {
            message.error("Phê duyệt thất bại");
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