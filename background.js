chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    newsFeeds: [],
    proxy: "",
    fav_ids: [],
    newsPosition: {
      top: null,
      left: null
    },
    newsPageColors: {
      menu: "#101010",
      menuText: "#ffffff",
      menuBorder: "#ffffff",
      article: "#a0a0a0",
      articleTitle: "#ffffff",
      articleDate: "#0000ff",
      articleDesc: "#ffffff"
    }
  },
  () => {
    console.log(
      "Proxy set to '',\nnewsFeeds set to [],\nfav_ids set to []\n"
      )
  });
});