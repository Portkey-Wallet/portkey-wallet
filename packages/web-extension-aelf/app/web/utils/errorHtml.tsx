export const errorToReload = (
  <>
    Something&apos;s gone wrong. Try reloading the page or&nbsp;
    {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
    <span style={{ color: '#5d42ff', cursor: 'pointer' }} onClick={() => chrome.runtime.reload()}>
      reloading the portkey
    </span>
    .
  </>
);
