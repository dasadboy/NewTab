chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({newsFeeds: [], proxy: "", fav_ids: []},
  () => {
    console.log(
      "Proxy set to '',\nnewsFeeds set to [],\nfav_ids set to []\n"
      )
  });
});