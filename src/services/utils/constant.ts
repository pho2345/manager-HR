export const XEP_LOAI_CHUYEN_MON = [
    {label: 'Hoàn thành xuất sắc nhiệm vụ',value: 'LOAI_A'},
    {label: 'Hoàn thành tốt nhiệm vụ',value: 'LOAI_B'},
    {label: 'Hoàn thành nhiệm vụ',value: 'LOAI_C'},
    {label: 'Không hoàn thành nhiệm vụ',value: 'LOAI_D'},
]

export const XEP_LOAI_THI_DUA = [
    {label: 'Xuất sắc',value: 'XUAT_SAC'},
    {label: 'Tốt',value: 'TOT'},
    {label: 'Khá',value: 'KHA'},
    {label: 'Trung bình',value: 'TRUNG_BINH'},
]

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

