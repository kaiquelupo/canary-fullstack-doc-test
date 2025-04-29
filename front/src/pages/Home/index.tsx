import styled from 'styled-components';
import { useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import DocumentsViewer from '../../components/DocumentsViewer';

const StyledSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin: 20px;
`;

const TopBar = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  padding: 5px;
  justify-content: center;
`;

const SelectLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
`;

function Home() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  const {
    data: companies,
    loading: companiesLoading,
    error: companiesError,
  } = useFetchData<{ id: string; name: string }[]>(
    `${process.env.REACT_APP_API_URL}/api/companies`,
  );

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedCompanyId(selectedValue);
  };

  return (
    <div>
      {companiesLoading && <p>Loading companies...</p>}
      {companiesError && <p>Error: {companiesError}</p>}
      {companies && (
        <TopBar>
          <SelectLabel>Company: </SelectLabel>
          <StyledSelect onChange={handleSelectChange}>
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </StyledSelect>
        </TopBar>
      )}
      {selectedCompanyId && (
        <DocumentsViewer selectedCompanyId={selectedCompanyId} />
      )}
    </div>
  );
}

export default Home;
