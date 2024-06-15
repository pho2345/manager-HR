import Discipline from '@/reuse/discipline';
const DisciplineAdmin: React.FC = () => {
    return (
        <Discipline type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/ky-luat`}/>
    );
};

export default DisciplineAdmin;
