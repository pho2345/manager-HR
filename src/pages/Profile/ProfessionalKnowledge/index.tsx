import ProfessionalKnowledge from '@/reuse/pro-knowledge';
const PageProfessionalKnowledgeEmployee: React.FC = () => {
    return (
        <ProfessionalKnowledge type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/nghiep-vu-chuyen-nganh`}/>
    );
};

export default PageProfessionalKnowledgeEmployee;
