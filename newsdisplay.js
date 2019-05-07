class Article {
  constructor(item, source) {
    this.sourceName = source;
    this.title = item.querySelector("title").textContent;
    this.description = item.querySelector("description").textContent;
    this.link = item.querySelector("link").textContent;
  }

  static injectArticle(article) {
    const titleContainer = document.querySelector("#title a"),
          descriptionContainer = document.querySelector("#description"),
          sourceContainer = document.querySelector("#dragThis");
    titleContainer.innerHTML = article.title;
    titleContainer.href = article.link;
    descriptionContainer.innerHTML = article.description;
    sourceContainer.innerHTML = article.sourceName;
  }
}

let allArticles = [];

const getArticles = () => {
  return new Promise(resolve => {
    chrome.storage.local.get(["newsFeeds", "proxy"], async value => {
      let newsFeeds = value.newsFeeds;
          proxy = value.proxy,
          loadPromises = [];
      
      for (let [name, src] of newsFeeds) {
        loadPromises.push(loadRSSFeed(name, src, proxy));
      }
      for (let x of loadPromises) {
        await x
      }
      console.log(allArticles)
      resolve([newsFeeds, proxy]);
    });
  });
}

const loadRSSFeed = (sourceName, feedSrc, proxy,) => {
  return new Promise(resolve => {
    fetch(proxy + feedSrc).then(res => {
      res.text().then(xmlTxt => {
        let parser = new DOMParser(),
            doc = parser.parseFromString(xmlTxt, "text/xml"),
            items = doc.querySelectorAll("item"),
            len = Math.min(items.length, 10),
            articles = [];
        
        for (let i = 0; i < len; i++) {
          let article = new Article(items[i], sourceName);
          articles.push(article);
          allArticles.push(article);
        }
        resolve(articles);
      });
    }).catch(err => console.error(
      "Error occured with:\n"
      + "source: '" + feedSrc + "'\n"
      + "proxy: '" + proxy + "'\n"
      + err)
    )
  });
}

const setUpNewsDisplay = async () => {
  await getArticles();
  console.log("ha");
  if (allArticles.length > 0) {
    const newsContainer = document.querySelector("#news");

    const chooseArticle = () => {
      i = Math.floor(Math.random()*allArticles.length);
      return allArticles[i];
    }
    
    const setNewArticle = () => {
      Article.injectArticle(chooseArticle());
    }
    
    setNewArticle();
    let changeArticleTimer = setInterval(setNewArticle, 20000);

    const pause = () => {
      clearInterval(changeArticleTimer);
    }

    const resume = () => {
      changeArticleTimer = setInterval(setNewArticle, 20000);
    }

    newsContainer.addEventListener("mouseover", pause);

    newsContainer.addEventListener("mouseout", resume);
  } else {
    console.log("There are no articles to display."
    + " Add sources in options.");
    document.querySelector("#dragThis").innerHTML = "Set feed sources in"
    + " options to view them here."
  }
}