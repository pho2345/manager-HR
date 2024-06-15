import Salary from '@/reuse/salary';
const SalaryAdmin: React.FC = () => {
    return (
        <Salary type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/luong-ban-than`}/>
    );
};

export default SalaryAdmin;
