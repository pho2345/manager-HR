import Discipline from '@/reuse/discipline';
const DisciplineEmployee: React.FC = () => {
    return (
        <Discipline type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/ky-luat`}/>
    );
};

export default DisciplineEmployee;
