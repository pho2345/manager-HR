import { XEP_LOAI_CHUYEN_MON, XEP_LOAI_THI_DUA } from '@/services/utils/constant';
import {
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormList,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, Col, Row } from 'antd';

const Demo = () => {
    return (
        <ProForm>
            <ProFormList
                name={['default', 'users']}
                label="Abcd"
                initialValue={[
                    {
                        name: '1111',
                    },
                ]}
                itemContainerRender={(doms) => {
                    return <ProForm.Group>{doms}</ProForm.Group>;
                }}
                creatorButtonProps={{
                    position: 'top',
                    creatorButtonText: 'ab',
                }}

                alwaysShowItemLabel
                copyIconProps={{
                    tooltipText: '复制此项到末尾',
                }}
                deleteIconProps={{
                    tooltipText: '不需要这行了',
                }}

            >
                <ProFormList
                    name="attributes"
                    creatorButtonProps={{
                        creatorButtonText: 'Thêm một khen thưởng',
                    }}
                    min={1}
                    copyIconProps={false}
                    itemRender={({ listDom, action }, { index }) => (
                        <ProCard
                            bordered
                            style={{ marginBlockEnd: 8 }}
                            title={`Khen thưởng${index + 1}`}
                            extra={action}
                            bodyStyle={{ paddingBlockEnd: 0 }}
                        >
                            {listDom}
                        </ProCard>
                    )}

                >

                    <Row gutter={24} >
                        <Col span={8} >
                            <ProFormSelect name="hinhThucKhenThuong" key="hinhThucKhenThuong" label="Hình thức khen thưởng" />

                        </Col>

                        <Col span={8} >
                            <ProFormSelect name="xepLoaiChuyenMon" key="xepLoaiChuyenMon" label="Xếp loại chuyên môn" options={XEP_LOAI_CHUYEN_MON} />

                        </Col>

                        <Col span={8} >
                            <ProFormSelect name="xepLoaiThiDua" key="xepLoaiThiDua" label="Xếp loại thi đua" options={XEP_LOAI_THI_DUA} />

                        </Col>
                    </Row>

                    <Row gutter={24} >
                        <Col span={16} >
                            <ProFormSelect name="xepLoaiThiDua" key="xepLoaiThiDua" label="Xếp loại thi đua" options={XEP_LOAI_THI_DUA} />
                        </Col>

                    </Row>

                </ProFormList>
            </ProFormList>
        </ProForm>
    );
};

export default Demo;