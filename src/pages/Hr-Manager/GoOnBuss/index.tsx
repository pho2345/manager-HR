import PageGOB from '@/reuse/go-on-business'
const PageGOBAdmin: React.FC = () => {
    return (
        <PageGOB type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/qua-trinh-cong-tac`}/>
    );
};

export default PageGOBAdmin;
