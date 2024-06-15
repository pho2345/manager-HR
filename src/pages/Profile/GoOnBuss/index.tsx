import PageGOB from '@/reuse/go-on-business'
const PageGOBEmployee: React.FC = () => {
    return (
        <PageGOB type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/qua-trinh-cong-tac`}/>
    );
};

export default PageGOBEmployee;
