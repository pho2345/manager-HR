import Army from '@/reuse/army';
const ArmyEmployee: React.FC = () => {
    return (
        <Army type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/kien-thuc-an-ninh-quoc-phong`}/>
    );
};

export default ArmyEmployee;
