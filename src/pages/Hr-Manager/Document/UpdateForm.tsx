import { getCustome, patch } from "@/services/ant-design-pro/api";
import { getOption, getProvine } from "@/services/utils";
import { StepsForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormSwitch, ProFormInstance, ProFormDigit } from "@ant-design/pro-components";
import { FormattedMessage } from "@umijs/max";
import { Col, Modal, Row, message } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import configText from '@/locales/configText';
const configDefaultText = configText;

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const disabledDate = (current: any) => {
    return current && current > moment();
};


export default function UpdateForm({ visible, setVisible, handleSession, id, actionRef }: any) {
    const formRef = useRef<ProFormInstance>();
    const [officer, setOfficer] = useState<GEN.Option[]>([]);
    const [civilServant, setCivilServant] = useState<GEN.Option[]>([]);
    const [checkOfficer, setCheckOfficer] = useState<boolean>(true);
    const onShowModalUpdate = async () => {
        setVisible(true);
        onUpdateModel()
    }


    const onUpdateModel = async () => {
        if (formRef.current) {
            //   const profile = await getCustome('/ca-nhan/so-yeu-ly-lich');
            //   formRef.current.setFieldsValue({
            //     ...profile.data
            //   });
        }
    }

    const updateProfile = async (data: GEN.ThongTinCanBo) => {
        const up = await patch(`${SERVER_URL_ACCOUNT}/nhan-vien/ho-so/${id}`, data);
        if (up) {
            message.success("Cập nhật thành công");
            setVisible(false);
            if (actionRef.current) {
                actionRef.current?.reloadAndRest?.();
            }
        }
    }


    useEffect(() => {
        const getValues = async () => {
            try {
                const getofficer = await getOption(`${SERVER_URL_CONFIG}/ngach-vien-chuc?page=0&size=100`, 'ma', 'name');
                const getcivilServant = await getOption(`${SERVER_URL_CONFIG}/ngach-cong-chuc?page=0&size=100`, 'ma', 'name');

                setOfficer(getofficer);
                setCivilServant(getcivilServant)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getValues();
    }, []);


    return (
        <StepsForm<{
            name: string;
        }>
            formRef={formRef}
            onCurrentChange={(value: number) => {
                onUpdateModel()
            }}
            onFinish={async (value) => {
                await waitTime(1000);
                }}
            formProps={{
                validateMessages: {
                    required: "Lỗi",
                },
            }}

            stepsFormRender={(dom, submitter) => {
                return (
                    <Modal
                        title="Cập nhật viên chức"
                        width={800}
                        onCancel={() => setVisible(false)}
                        open={visible}
                        footer={submitter}
                        destroyOnClose={true}
                        style={{
                            width: '70vh'
                        }}
                    >
                        {dom}
                    </Modal>
                );
            }}
        >
            <StepsForm.StepForm<{
                name: string;
            }>

                name="base"
                title="Thông tin chung"
                stepProps={{
                }}


                onFinish={async (value: object) => {
                    handleSession(value);
                    return true
                }}
            >
                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormText
                            name="hoVaTen"
                            label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}
                            placeholder={configDefaultText["page.listCow.column.name"]}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.name" defaultMessage="Họ tên" /> },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            name="gioiTinh"
                            showSearch

                            label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}
                            placeholder={"Giới tính"}
                            options={[
                                {
                                    label: 'Nam',
                                    value: 'NAM'
                                }
                            ]}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" /> }
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormSelect
                            className="w-full"
                            name="danToc"
                            label={<FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" />}
                            placeholder={"Dân tộc"}
                            showSearch
                            request={() => getOption(`${SERVER_URL_CONFIG}/dan-toc`, 'id', 'name')}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" /> }
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="sinhNgay"
                            label={configDefaultText["page.listCow.column.birthdate"]}
                            placeholder={configDefaultText["page.listCow.column.birthdate"]}
                            rules={[
                                { required: true, message: configDefaultText["page.listCow.required.birthdate"] },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormSelect
                            className="w-full"
                            name="tonGiao"
                            label={"Tôn giáo"}
                            placeholder={"Tôn giáo"}
                            showSearch
                            request={() => getOption(`${SERVER_URL_CONFIG}/ton-giao`, 'id', 'name')}
                            rules={[
                                { required: true, message: "Tôn giáo" }
                            ]}
                        />
                    </Col>


                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormText
                            className="w-full"
                            name="soDienThoai"
                            label={<FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" />}
                            placeholder={"Số điện thoại"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" /> },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="soBHXH"
                            label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}
                            placeholder={"Mã BHXH"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" /> },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormText
                            className="w-full"
                            name="soBHYT"
                            label={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />}
                            placeholder={"Số BHYT"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" /> },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="noiOHienNay"
                            label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}
                            placeholder={"Nơi ở hiện nay"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" /> },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormSelect
                            className="w-full"
                            name="noiSinh"
                            label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}
                            placeholder={"Nơi sinh"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" /> },
                            ]}
                            request={() => getProvine()}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="queQuan"
                            label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}
                            placeholder={"Quê quán"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" /> },
                            ]}
                            request={() => getProvine()}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="healthInsurance"
                            label={"Tình trạng sức khỏe"}
                            placeholder={"Tình trạng sức khỏe"}
                            rules={[
                                { required: true, message: "Tình trạng sức khỏe" }
                            ]}
                            options={[
                                {
                                    label: "TỐT",
                                    value: 'TOT'
                                }
                            ]}
                        />
                    </Col>

                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="soCCCD"
                            label={<FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" />}
                            placeholder={"CMND/CCCD"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" /> }
                            ]}
                        />
                    </Col>
                    <Col span={12} className="gutter-row p-0">
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="ngayCapCCCD"
                            label={<FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" />}
                            placeholder={"Ngày cấp CCCD/CMND"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" /> },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="cacTenGoiKhac"
                            label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}
                            placeholder={"Tên gọi khác"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="chieuCao"
                            label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}
                            placeholder={"Chiều cao"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" /> }
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="canNang"
                            label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}
                            placeholder={"Cân nặng"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="nhomMau"
                            label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}
                            placeholder={"Nhóm máu"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" /> }
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/nhom-mau?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>
                </Row>

            </StepsForm.StepForm>

            <StepsForm.StepForm<{
                name: string;
            }>
                name="base1"
                title="Biên chế, chức vụ, Ngạch, Bậc"
                stepProps={{
                }}

                onFinish={async (value: object) => {
                    handleSession(value);
                    return true
                }}

            >

                <ProFormSwitch
                    checkedChildren="Công chức"
                    unCheckedChildren="Viên chức"
                    label="Loại"

                    fieldProps={{
                        onChange: (e) => {
                            setCheckOfficer(e)
                        },
                        checked: checkOfficer,

                    }}
                />


                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormSelect
                            name="ngachNgheNghiep"
                            label={<FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" />}
                            placeholder={"Ngạch nghề nghiệp"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" /> },
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                            }}
                            showSearch
                            options={!checkOfficer ? officer : civilServant}

                        // request={() => checkOfficer ? getOption(`${SERVER_URL_CONFIG}/ngach-vien-chuc?page=0&size=100`, 'ma', 'name') : getOption(`${SERVER_URL_CONFIG}/ngach-cong-chuc`, 'ma', 'name')}

                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0 w-full">
                        <ProFormDatePicker
                            name="ngayBoNhiemNgach"
                            label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}
                            placeholder={"Ngày bổ nhiệm ngạch"}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" /> }
                            ]}

                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormDatePicker
                            name="ngayHuongLuongNgach"
                            label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}
                            placeholder={"Ngày hưởng lương ngạch nghề nghiệp"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" /> }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="ngayHuongPCTNVKNgachNgheNghiep"
                            label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}
                            placeholder={"Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" /> },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormText
                            className="w-full"
                            name="ngheNghiepTruocKhiTuyenDung"
                            label={<FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" />}
                            placeholder={"Nghề nghiệp trước khi tuyển dụng"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" /> },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="coQuanToChucDonViTuyenDung"
                            label={<FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" />}
                            placeholder={"Cơ quan, đơn vị tuyển dụng"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" /> },
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')}
                        />

                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="chucVuHienTai"
                            label={"Chức vụ hiện tại"}
                            placeholder={"Chức vụ hiện tại"}
                            rules={[
                                { required: true, message: "Chức vụ hiện tại" },
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDigit
                            className="w-full"
                            name="tienLuong"
                            label={"Tiền lương"}
                            placeholder={"Tiền lương"}
                            rules={[
                                { required: true, message: "Tiền lương" },
                            ]}
                        />
                    </Col>
                </Row>


                <Row gutter={24} className="m-0">

                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDigit
                            className="w-full"
                            name="phuCapChucVu"
                            label={"Phụ cấp chức vụ"}
                            placeholder={"Phụ cấp chức vụ"}
                            rules={[
                                { required: true, message: "Phụ cấp chức vụ" },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDigit
                            className="w-full"
                            name="phuCapKiemNhiem"
                            label={"Phụ cấp kiêm nhiệm"}
                            placeholder={"Phụ cấp kiêm nhiệm"}
                            rules={[
                                { required: true, message: "Phụ cấp kiêm nhiệm" },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">

                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDigit
                            className="w-full"
                            name="phuCapKhac"
                            label={"Phụ cấp khác"}
                            placeholder={"Phụ cấp khác"}
                            rules={[
                                { required: true, message: "Phụ cấp khác" },
                            ]}
                        />
                    </Col>


                </Row>


                <Row gutter={24} className="m-0">

                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="viTriViecLam"
                            label={"Vị trí việc làm"}
                            placeholder={"Vị trí việc làm"}
                            rules={[
                                { required: true, message: "Vị trí việc làm" },
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDatePicker
                            className="w-full"
                            name="ngayHuongLuongTheoViTriViecLam"
                            label={"Ngày hưởng lương"}
                            placeholder={"Ngày hưởng lương"}
                            rules={[
                                { required: true, message: "Ngày hưởng lương" },
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                        />
                    </Col>
                </Row>
                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDatePicker
                            className="w-full"
                            name="ngayVaoCoQuanHienDangCongTac"
                            label={<FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" />}
                            placeholder={"Ngày vào cơ quan công tác"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" /> },
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormDatePicker
                            className="w-full"
                            name="ngayBoNhiem"
                            label={<FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" />}
                            placeholder={"Ngày bổ nhiệm"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" /> },
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDatePicker
                            className="w-full"
                            name="ngayBoNhiemLai"
                            label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}
                            placeholder={"Ngày bổ nhiệm lại"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" /> },
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="chucVuKiemNhiem"
                            label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}
                            placeholder={"Chức vụ kiêm nhiệm"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" /> },
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="duocQuyHoacChucDanh"
                            label={<FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" />}
                            placeholder={"Được quy hoạch chức danh"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" /> }
                            ]}
                        />
                    </Col>
                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            name="chucVuDangHienTai"
                            label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}
                            placeholder={"Chức vụ Đảng hiện tại"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" /> },
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormSelect
                            className="w-full"
                            name="chucVuDangKiemNhiem"
                            label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}
                            placeholder={"Chức vụ Đảng kiêm nhiệm"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" /> }
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}

                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="congViecChinhDuocGiao"
                            label={<FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" />}
                            placeholder={"Công việc chính"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" /> }
                            ]}
                        // options={jobPosition}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="soTruongCongTac"
                            label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}
                            placeholder={"Sở trường công tác"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" /> }
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0">
                        <ProFormText
                            className="w-full"
                            name="congViecLamLauNhat"
                            label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}
                            placeholder={"Công việc lâu nhất"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" /> }
                            ]}
                        />
                    </Col>
                </Row>

            </StepsForm.StepForm>

            <StepsForm.StepForm
                name="base2"
                title={"Trình độ, đào tạo"}
                onFinish={async (value) => {
                    await waitTime(2000);
                    let sesstion = JSON.parse(sessionStorage.getItem(ID_SAVE_INFO) as any);
                    const dateAll = {
                        ...sesstion,
                        ...value
                    }
                    const data: GEN.ThongTinCanBo = {
                        hoVaTen: dateAll.hoVaTen,
                        gioiTinh: dateAll.gioiTinh,
                        cacTenGoiKhac: dateAll.cacTenGoiKhac,
                        sinhNgay: moment(dateAll.sinhNgay).toISOString(),
                        noiSinh: dateAll.noiSinh,
                        queQuan: dateAll.queQuan,
                        danToc: dateAll.danToc,
                        tonGiao: dateAll.tonGiao,
                        soCCCD: dateAll.soCCCD,
                        ngayCapCCCD: moment(dateAll.ngayCapCCCD).toISOString(),
                        soDienThoai: dateAll.soDienThoai,
                        soBHYT: dateAll.soBHYT,
                        soBHXH: dateAll.soBHXH,
                        noiOHienNay: dateAll.noiOHienNay,
                        thanhPhanGiaDinh: dateAll.thanhPhanGiaDinh,
                        thongTinTuyenDung: {
                            ngheNghiepTruocKhiTuyenDung: dateAll.ngheNghiepTruocKhiTuyenDung,
                            ngayDuocTuyenDungLanDau: moment(dateAll.ngayDuocTuyenDungLanDau).toISOString(),
                            ngayVaoCoQuanHienDangCongTac: moment(dateAll.ngayVaoCoQuanHienDangCongTac).toISOString(),
                            ngayVaoDangCongSanVietNam: moment(dateAll.ngayVaoDangCongSanVietNam).toISOString(),
                            ngayChinhThuc: moment(dateAll.ngayChinhThuc).toISOString(),
                            ngayThamGiaToChucChinhTriXaHoiDauTien: moment(dateAll.ngayThamGiaToChucChinhTriXaHoiDauTien).toISOString(),
                            congViecChinhDuocGiao: dateAll.congViecChinhDuocGiao,
                            soTruongCongTac: dateAll.soTruongCongTac,
                            congViecLamLauNhat: dateAll.congViecLamLauNhat,
                        },
                        quanSu: {
                            ngayNhapNgu: moment(dateAll.ngayNhapNgu).toISOString(),
                            ngayXuatNgu: moment(dateAll.ngayXuatNgu).toISOString(),
                            capBacLoaiQuanHamQuanDoi: dateAll.capBacLoaiQuanHamQuanDoi,
                        },
                        doiTuongChinhSach: dateAll.doiTuongChinhSach,

                        hocVan: {
                            trinhDoGiaoDucPhoThong: dateAll.trinhDoGiaoDucPhoThong,
                            trinhDoChuyenMon: dateAll.trinhDoChuyenMon,
                            hocHam: dateAll.hocHam,
                            danhHieuNhaNuocPhongTang: dateAll.danhHieuNhaNuocPhongTang,
                        },
                        chucVu: {
                            chucVuHienTaiId: dateAll.chucVuHienTai,
                            ngayBoNhiem: moment(dateAll.ngayBoNhiem).toISOString(),
                            ngayBoNhiemLai: moment(dateAll.ngayBoNhiemLai).toISOString(),
                            duocQuyHoacChucDanh: dateAll.duocQuyHoacChucDanh,
                            phuCapChucVu: dateAll?.phuCapChucVu || 0,
                            coQuanToChucDonViTuyenDungId: dateAll.coQuanToChucDonViTuyenDung,
                        },

                        chucVuKiemNhiem: {
                            chucVuKiemNhiemId: dateAll.chucVuDangKiemNhiem,
                            ngayBoNhiem: moment(dateAll.ngayBoNhiem).toISOString(),
                            phuCapKiemNhiem: parseInt(dateAll.phuCapKiemNhiem) || 0,
                            phuCapKhac: parseInt(dateAll.phuCapKhac) || 0,
                        },
                        chucVuDangHienTai: dateAll.chucVuDangHienTai,
                        chucVuDangKiemNhiem: dateAll.chucVuDangKiemNhiem,
                        tienLuong: dateAll.tienLuong,
                        ngach: {
                            ngachId: dateAll.ngachNgheNghiep,
                            ngayBoNhiemNgach: moment(dateAll.ngayBoNhiemNgach).toISOString(),
                            ngayHuongLuongNgach: moment(dateAll.ngayHuongLuongNgach).toISOString(),
                            phanTramHuongLuongNgach: parseFloat(dateAll.phanTramHuongLuongNgach) || 0,
                            phuCapThamNienVuotKhungNgach: parseFloat(dateAll.phuCapThamNienVuotKhungNgach) || 0,
                            ngayHuongPCTNVKNgach: moment(dateAll.ngayHuongPCTNVKNgach).toISOString(),
                        },
                        phuCapChucVu: dateAll.phuCapChucVu,
                        phuCapKiemNhiem: dateAll.phuCapKiemNhiem,
                        phuCapKhac: dateAll.phuCapKhac,
                        viecLam: {
                            viTriViecLamId: dateAll.viTriViecLam,
                            ngayHuongLuongViTriViecLam: moment(dateAll.ngayHuongLuongViTriViecLam).toISOString(),
                            phamTramHuongLuong: parseFloat(dateAll.phamTramHuongLuong) || 0,
                            phuCapThamNienVuotKhung: parseFloat(dateAll.phuCapThamNienVuotKhung) || 0,
                            ngayHuongPCTNVK: moment(dateAll.ngayHuongPCTNVK).toISOString(),
                        },
                        sucKhoe: {
                            tinhTrangSucKhoe: dateAll.tinhTrangSucKhoe || "TOT",
                            chieuCao: dateAll.chieuCao,
                            canNang: dateAll.canNang,
                            nhomMau: dateAll.nhomMau,
                        },
                        "pheDuyet": "CHO_PHE_DUYET"
                    }

                    updateProfile(data)
                }}
                className="w-full"
            >

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="ngayVaoDangCongSanVietNam"
                            label={<FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" />}
                            placeholder={"Ngày vào Đảng"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" /> },
                            ]}
                        />
                    </Col>
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="ngayNhapNgu"
                            label={<FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" />}
                            placeholder={"Ngày nhập ngũ"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" /> },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="ngayXuatNgu"
                            label={<FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" />}
                            placeholder={"Ngày xuất ngũ"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" /> },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormDatePicker
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: disabledDate
                            }}
                            name="ngayThamGiaToChucChinhTriXaHoiDauTien"
                            label={<FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" />}
                            placeholder={"Ngày tham gia tổ chức chính trị - xã hội đầu tiên"}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" /> },
                            ]}
                        />
                    </Col>

                </Row>

                <Row gutter={24} className="m-0">

                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="doiTuongChinhSach"
                            label={<FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" />}
                            placeholder={"Đối tượng chính sách"}
                            showSearch
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" /> }
                                // { required: true, message: "Dân tộc" }
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/doi-tuong-chinh-sach`, 'id', 'name')}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="trinhDoGiaoDucPhoThong"
                            label={<FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" />}
                            placeholder={"Trình độ giáo dục phổ thông"}
                            showSearch
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" /> }
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/trinh-do-giao-duc-pho-thong`, 'id', 'name')}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="trinhDoChuyenMon"
                            label={<FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" />}
                            placeholder={"Trình độ chuyên môn"}
                            showSearch
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" /> }
                            ]}

                            request={() => getOption(`${SERVER_URL_CONFIG}/trinh-do-chuyen-mon?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="danhHieuNhaNuocPhongTang"
                            label={<FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" />}
                            placeholder={"Danh hiệu nhà nước"}
                            showSearch
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" /> }
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/danh-hieu-nha-nuoc-phong`, 'id', 'name')}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="hocHam"
                            label={<FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" />}
                            placeholder={"Học hàm"}
                            request={() => getOption(`${SERVER_URL_CONFIG}/hoc-ham`, 'id', 'name')}
                            showSearch
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" /> }
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="capBacLoaiQuanHamQuanDoi"
                            label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}
                            placeholder={"Cấp bậc quân hàm"}
                            showSearch
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" /> }
                            ]}
                            request={() => getOption(`${SERVER_URL_CONFIG}/cap-bac-loai-quan-ham-quan-doi`, 'id', 'name')}

                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0 w-full" >
                        <ProFormSelect
                            className="w-full"
                            name="thanhPhanGiaDinh"
                            label={<FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" />}
                            placeholder={"Thành phần gia đình"}
                            showSearch
                            request={() => getOption(`${SERVER_URL_CONFIG}/thanh-phan-gia-dinh`, 'id', 'name')}
                            rules={[
                                { required: true, message: <FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" /> }
                            ]}
                        />
                    </Col>


                </Row>
            </StepsForm.StepForm>

        </StepsForm>
    )
}