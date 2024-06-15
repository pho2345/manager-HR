import PageAllownce from '@/reuse/allowance';
const PageAllownceEmployee: React.FC = () => {
    return (
        <PageAllownce type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/phu-cap-khac`}/>
    );
};

export default PageAllownceEmployee;
