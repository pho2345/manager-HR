import Salary from '@/reuse/salary';
const SalaryEmployee: React.FC = () => {
    return (
        <Salary type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/luong-ban-than`}/>
    );
};

export default SalaryEmployee;
