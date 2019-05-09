class Article {
  constructor(item, source) {

  }
}

let newsFeeds, proxy;

const getNewsFeeds = () => {
  return new Promise(() => {
    chrome.storage.local.get(["newsFeeds", "proxy"])
    .then(val => {
      newsFeeds = val.newsFeeds;
      proxy = val.proxy
    });
  });
}

const fetchAndParse = (feed) => {
  return new Promise(() => {
    fetch(proxy + feed).then(resp => {
      return resp.text()
    }).then(
      
    )
  });
}