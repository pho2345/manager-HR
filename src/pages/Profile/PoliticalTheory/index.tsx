import PoliticalTheory from '@/reuse/pro-knowledge';
const PoliticalTheoryEmployee: React.FC = () => {
    return (
        <PoliticalTheory type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/ly-luan-chinh-tri`}/>
    );
};

export default PoliticalTheoryEmployee;
