import PoliticalTheory from '@/reuse/pro-knowledge';
const PoliticalTheoryAdmin: React.FC = () => {
    return (
        <PoliticalTheory type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/ly-luan-chinh-tri`}/>
    );
};

export default PoliticalTheoryAdmin;
