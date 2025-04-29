import { useRef } from 'react';
import styled from 'styled-components';
import useFetchData from '../../hooks/useFetchData';
import useIframeMessageHandler from '../../hooks/useIframeMessageHandler';

const DocumentsWrapper = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 10px;
  height: calc(100vh - 50px);
  background-color: #f5f5f5;
  border: 1px solid #ccc;
`;

const IframeViewer = styled.iframe`
  width: 100%;
  height: calc(100% - 40px);
  border: 0;
  border-radius: 4px;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const DocumentViewerColumn = styled.div`
  flex: 1;
`;

const DocumentViewerTopBar = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
`;

const Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid #fff;
    border-top: 5px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const DocumentLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #fff;
`;

function DocumentsViewer({ selectedCompanyId }: { selectedCompanyId: string }) {
  const lastFilingIframeRef = useRef<HTMLIFrameElement>(null);
  const previousFilingIframeRef = useRef<HTMLIFrameElement>(null);

  const {
    data: filings,
    loading: filingsLoading,
    error: filingsError,
  } = useFetchData<{ last: any; previous: any } | null>(
    `${process.env.REACT_APP_API_URL}/api/companies/${selectedCompanyId}/lastDocuments`,
  );

  useIframeMessageHandler(
    filings,
    lastFilingIframeRef,
    previousFilingIframeRef,
  );

  return (
    <>
      {filingsLoading && <Loading />}
      {filingsError && <p>Error: {filingsError}</p>}
      {!filingsLoading && filings && (
        <DocumentsWrapper>
          {filings.previous && (
            <DocumentViewerColumn>
              <DocumentViewerTopBar>
                <DocumentLabel>
                  Previous Filing: {filings.previous.type} (
                  {new Date(filings.previous.date).toLocaleDateString()})
                </DocumentLabel>
              </DocumentViewerTopBar>
              <IframeViewer
                ref={previousFilingIframeRef}
                title="Previous Filing"
                src={`${process.env.REACT_APP_API_URL}/api/companies/document?url=${filings.previous.url}`}
              />
            </DocumentViewerColumn>
          )}
          <DocumentViewerColumn>
            <DocumentViewerTopBar>
              <DocumentLabel>
                Last Filing: {filings.last.type} (
                {new Date(filings.last.date).toLocaleDateString()})
              </DocumentLabel>
            </DocumentViewerTopBar>
            <IframeViewer
              ref={lastFilingIframeRef}
              title="Last Filing"
              src={`${process.env.REACT_APP_API_URL}/api/companies/document?url=${filings.last.url}`}
            />
          </DocumentViewerColumn>
        </DocumentsWrapper>
      )}
    </>
  );
}

export default DocumentsViewer;
