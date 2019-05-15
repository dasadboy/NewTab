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
      backgroundColor: "#000000",
      menu: "#101010",
      menuBorder: "#ffffff",
      feedBtnColor: "#4e008d",
      buttonTextColor: "#ffffff",
      feedName: "#ffffff",
      article: "#00a0a0",
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