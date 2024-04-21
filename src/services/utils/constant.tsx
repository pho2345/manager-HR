import { Tag } from "antd";

export const XEP_LOAI_CHUYEN_MON = [
    {label: 'Hoàn thành xuất sắc nhiệm vụ',value: 'LOAI_A'},
    {label: 'Hoàn thành tốt nhiệm vụ',value: 'LOAI_B'},
    {label: 'Hoàn thành nhiệm vụ',value: 'LOAI_C'},
    {label: 'Không hoàn thành nhiệm vụ',value: 'LOAI_D'},
]

export const mapXepLoaiChuyenMon = (value: string) => {
    let map;
    XEP_LOAI_CHUYEN_MON.forEach(item => {
        if(item.value === value) {
            map = item.label;
            return;
        }
    })
    return map
}

export const TINH_TRANG_SUC_KHOE = [
    {label: 'Yếu',value: 'YEU'},
    {label: 'Trung bình',value: 'TRUNG_BINH'},
    {label: 'Khỏe',value: 'KHOE'},
    {label: 'Tốt',value: 'TOT'},
]


export const XEP_LOAI_THI_DUA = [
    {label: 'Xuất sắc',value: 'XUAT_SAC'},
    {label: 'Tốt',value: 'TOT'},
    {label: 'Khá',value: 'KHA'},
    {label: 'Trung bình',value: 'TRUNG_BINH'},
]

export const XAC_NHAN = [
    {label: 'Chờ phê duyệt', value: 'CHO_PHE_DUYET'},
    {label: 'Đã phê duyệt', value: 'DA_PHE_DUYET'},
    {label: 'Từ chối', value: 'TU_CHOI'},
]

export const mapXacNhan = (value: string) => {
   
    if(value === 'CHO_PHE_DUYET') return <Tag color="blue">Chờ phê duyệt</Tag>;
    if(value === 'DA_PHE_DUYET') return <Tag color="green">Đã phê duyệt</Tag>;
    if(value === 'TU_CHOI') return <Tag color="red">Từ chối</Tag>
  
}   

export const mapXepLoaiThiDua = (value: string) => {
    let map;
    XEP_LOAI_THI_DUA.forEach(item => {
        if(item.value === value) {
            map = item.label;
            return;
        }
    })
    return map
}

export const TRANG_THAI = [
    {label: 'CHỜ XÁC NHẬN',value: 'CHO_XAC_NHAN'},
    {label: 'ĐÃ XÁC NHÂN',value: 'XAC_NHAN'},
    {label: 'TỪ CHỐI',value: 'TU_CHOI'},
    {label: 'QUÁ HẠN',value: 'QUA_HAN'},
]

export const mapTrangThai = (value: string) => {
    let map;
    TRANG_THAI.forEach(item => {
        if(item.value === 'CHO_XAC_NHAN') {
            map = item.label;
            return;
        }
    })
    return map
}

