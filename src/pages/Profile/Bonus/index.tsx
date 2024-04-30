import Bonus from '@/reuse/bonus';
const BonusEmployee: React.FC = () => {
    return (
        <Bonus type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/khen-thuong`}/>
    );
};

export default BonusEmployee;
