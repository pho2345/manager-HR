import { Tag } from "antd";

export const XEP_LOAI_CHUYEN_MON = [
    { label: 'Hoàn thành xuất sắc nhiệm vụ', value: 'LOAI_A' },
    { label: 'Hoàn thành tốt nhiệm vụ', value: 'LOAI_B' },
    { label: 'Hoàn thành nhiệm vụ', value: 'LOAI_C' },
    { label: 'Không hoàn thành nhiệm vụ', value: 'LOAI_D' },
]

export const SEX = [
    { label: 'Nam', value: 'NAM' },
    { label: 'Nữ', value: 'NU' },
]

export const mapXepLoaiChuyenMon = (value: string) => {
    let map;
    XEP_LOAI_CHUYEN_MON.forEach(item => {
        if (item.value === value) {
            map = item.label;
            return;
        }
    })
    return map
}

export const TINH_TRANG_SUC_KHOE = [
    { label: 'Yếu', value: 'YEU' },
    { label: 'Trung bình', value: 'TRUNG_BINH' },
    { label: 'Khỏe', value: 'KHOE' },
    { label: 'Tốt', value: 'TOT' },
];

export const mapTinhTrangSucKhoe = (value?: string) => {
    if (value === 'YEU') return <Tag color="red">Yếu</Tag>;
    if (value === 'TRUNG_BINH') return <Tag color="orange">Trung bình</Tag>;
    if (value === 'KHOE') return <Tag color="blue">Khỏe</Tag>;
    if (value === 'TOT') return <Tag color="green">Tốt</Tag>;
}

export const mapRole = (value?: string) => {
    if (value === 'EMPLOYEE') return <Tag color="blue">CBVC</Tag>;
    if (value === 'ADMIN') return <Tag color="green">Admin</Tag>;
}

export const XEP_LOAI_THI_DUA = [
    { label: 'Xuất sắc', value: 'XUAT_SAC' },
    { label: 'Tốt', value: 'TOT' },
    { label: 'Khá', value: 'KHA' },
    { label: 'Trung bình', value: 'TRUNG_BINH' },
]

export const XAC_NHAN = [
    { label: 'Chờ phê duyệt', value: 'CHO_PHE_DUYET' },
    { label: 'Đã phê duyệt', value: 'DA_PHE_DUYET' },
    { label: 'Từ chối', value: 'TU_CHOI' },
]

export const mapXacNhan = (value: GEN.XACNHAN) => {
    if (!value) return "";
    if (value === 'CHO_PHE_DUYET') return <Tag color="blue">Chờ phê duyệt</Tag>;
    if (value === 'DA_PHE_DUYET') return <Tag color="green">Đã phê duyệt</Tag>;
    if (value === 'TU_CHOI') return <Tag color="red">Từ chối</Tag>


}

export const mapXepLoaiThiDua = (value: string) => {
    if (value === 'XUAT_SAC') return <Tag color="green">Xuất sắc</Tag>;
    if (value === 'TOT') return <Tag color="blue">Tốt</Tag>;
    if (value === 'KHA') return <Tag color="orange">Khá</Tag>;
    if (value === 'TRUNG_BINH') return <Tag color="red">Trung bình</Tag>
}

export const TRANG_THAI = [
    { label: 'CHỜ XÁC NHẬN', value: 'CHO_XAC_NHAN' },
    { label: 'ĐÃ XÁC NHÂN', value: 'XAC_NHAN' },
    { label: 'TỪ CHỐI', value: 'TU_CHOI' },
    { label: 'QUÁ HẠN', value: 'QUA_HAN' },
]

export const mapTrangThai = (value: string) => {
    let map;
    TRANG_THAI.forEach(item => {
        if (item.value === 'CHO_XAC_NHAN') {
            map = item.label;
            return;
        }
    })
    return map
}

export const RANGE_SEARCH = [
    {
        value: 'days',
        label: 'Trong ngày'
    },
    {
        value: 'weeks',
        label: 'Trong tuần'
    },
    {
        value: 'months',
        label: 'Trong tháng'
    },
    {
        value: 'years',
        label: 'Trong năm'
    },
    {
        value: 'range',
        label: 'Khoảng'
    }
]

export const createPaginationProps = (total: number, pageSize: number, setPage: Function, setPageSize: Function, actionRef: any) => {

    return {
        locale: {
            next_page: "Trang sau",
            prev_page: "Trang trước",
        },
        showTotal: (total: number, range: number[]) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
        },
        pageSize: pageSize,
        total: total,
        onChange: (page: number, pageSize: number) => {
            console.log('page', page);
            setPage(page - 1);
            actionRef.current?.reload();
        },
        onShowSizeChange: (current: number, size: number) => {
            // setPage(0);
            setPageSize(size);
            actionRef.current?.reload();
        },
        showSizeChanger: true,
    }
};

