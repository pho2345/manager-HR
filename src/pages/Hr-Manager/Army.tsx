import Army from '@/reuse/army';
const ArmyAdmin: React.FC = () => {
    return (
        <Army type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/kien-thuc-an-ninh-quoc-phong`}/>
    );
};

export default ArmyAdmin;
