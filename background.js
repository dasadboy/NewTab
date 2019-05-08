chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    newsFeeds: [],
    proxy: "",
    fav_ids: [],
    newsPosition: {
      top: null,
      left: null
    }
  },
  () => {
    console.log(
      "Proxy set to '',\nnewsFeeds set to [],\nfav_ids set to []\n"
      )
  });
});