import { useEffect, RefObject } from 'react';

function useIframeMessageHandler(
  filings: { last: { url: string }; previous?: { url: string } } | null,
  lastFilingIframeRef: RefObject<HTMLIFrameElement>,
  previousFilingIframeRef: RefObject<HTMLIFrameElement>,
) {
  useEffect(() => {
    if (!filings) return;

    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === process.env.REACT_APP_API_URL &&
        event.data?.type === 'iframeScroll'
      ) {
        const targetIframe =
          event.data.url === filings.last.url
            ? previousFilingIframeRef.current
            : lastFilingIframeRef.current;

        targetIframe?.contentWindow?.postMessage(
          { type: 'setScroll', x: event.data.x, y: event.data.y },
          process.env.REACT_APP_API_URL!,
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [filings, lastFilingIframeRef, previousFilingIframeRef]);
}

export default useIframeMessageHandler;
