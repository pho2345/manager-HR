import Bonus from '@/reuse/bonus';
const BonusAdmin: React.FC = () => {
    return (
        <Bonus type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/khen-thuong`}/>
    );
};

export default BonusAdmin;
