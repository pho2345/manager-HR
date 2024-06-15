import PageAllownce from '@/reuse/allowance';
const PageAllownceAdmin: React.FC = () => {
    return (
        <PageAllownce type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/phu-cap-khac`}/>
    );
};

export default PageAllownceAdmin;
