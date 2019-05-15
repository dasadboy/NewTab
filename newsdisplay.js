class Article {
  constructor(item, source) {
    this.sourceName = source;
    this.title = item.querySelector("title").textContent;
    this.link = (item.querySelector("origlink")
    || item.querySelector("link")).textContent;
    
    let description = item.querySelector("description").textContent;
    this.description = description.replace(/(<br>|<br\s*\/>)+\s*(<p)+/gi,
    "<p");
    
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

let allArticles = [], feeds, proxy;

const getFeeds = () => {
  return new Promise(resolve => {
    chrome.storage.local.get(["newsFeeds", "proxy"], async value => {
      
      feeds = value.newsFeeds;
      proxy = value.proxy;
          
      resolve([value.newsFeeds, value.proxy]);
    });
  });
}

const loadRSSFeed = (sourceName, feedSrc, proxy) => {
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
    }).catch(err => {
        console.error(
        "Error occured with:\n"
        + "source: '" + feedSrc + "'\n"
        + "proxy: '" + proxy + "'\n"
        + err)
        document.querySelector("#dragThis").textContent = "Error occurred when"
        + " fetching news feeds."
    })
  });
}

const setUpNewsDisplay = async () => {
  let loadingFeeds;
  await getFeeds();
  loadingFeeds = [...feeds].map(feed => loadRSSFeed(feed[0], feed[1], proxy));
  for (p of loadingFeeds) await p;
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
    + " Add RSS feeds in options.");
    document.querySelector("#dragThis").innerHTML = "Set RSS feeds in"
    + " options to view news articles here."
  }
}