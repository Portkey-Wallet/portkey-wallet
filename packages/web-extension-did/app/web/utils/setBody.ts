type PageType = 'Prompt' | 'Popup';
export const setPageType = (pageType: PageType) => {
  document.body.setAttribute('data-pageType', pageType);
};

export const getPageType = () => {
  return document.body.getAttribute('data-pageType');
};
