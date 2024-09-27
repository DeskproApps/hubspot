const addBlankTargetToLinks = (htmlString?: string): string => {
  if (!htmlString) {
    return "-";
  }

  if (typeof DOMParser === 'undefined') {
    return htmlString;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const links = doc.getElementsByTagName('a');

  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
  }

  return doc.documentElement.outerHTML;
};

export { addBlankTargetToLinks };
