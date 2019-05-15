class Article {
  constructor(item, source) {
    this.srcName = source[0];
    this.srcURL = source[1];
    this.title = item.querySelector("title").textContent;
    this.description = item.querySelector("description").textContent;
    this.url = (item.querySelector("origlink")
    || item.querySelector("guid")
    || item.querySelector("link")).textContent;
    this.date = item.querySelector("pubDate").textContent;
    this.categories = Article.parseCategories(item
      .querySelectorAll("categories"));
    this.element = undefined
  }

  static parseCategories(categoryElems) {
    const contents = [...categoryElems].map(elem => elem.textContent);
    let categories = {};
    if (contents.length > 1) {
      [...contents].forEach(c => categories[c] = 1);
    } else if (contents.length === 1) {
      contents[0].split(/\s*[;,/\\\n\[\]]+\s*/)
      .filter(item => item.match(/^\s*$/)).forEach(c => categories[c] = 1);
    } else {
      categories = null;
    }
    return categories;
  }

  static buildElement(article) {
    const articleElem = document.createElement("div"),
          titleElem = document.createElement("a"),
          dateElem = document.createElement("div"),
          descElem = document.createElement("div");
    
    articleElem.className = "article";
    titleElem.className = "title";
    dateElem.className = "date";
    descElem.className = "desc";
    
    titleElem.innerHTML = article.title;
    descElem.innerHTML = article.description;
    dateElem.innerHTML = article.date;

    titleElem.href = article.url;

    articleElem.style.backgroundColor = colors.article;
    titleElem.style.color = colors.articleTitle;
    dateElem.style.color = colors.articleDate;
    descElem.style.color = colors.articleDesc;

    articleElem.appendChild(titleElem);
    articleElem.appendChild(dateElem);
    articleElem.appendChild(descElem);

    this.element = articleElem;
    return articleElem;
  }

  static disableCategory(article) {
    
  } 

  static enableCategory(article) {
    article.element.className = "article enabled";
  }
}

let newsFeeds, proxy, colors,
    allArticles = {};

// News 
const getNewsFeeds = () => {
  return new Promise(resolve => {
    chrome.storage.local.get(["newsFeeds", "proxy"], val => {
      newsFeeds = val.newsFeeds;
      proxy = val.proxy;
      resolve(val.proxy, val.newsFeeds);
    });
  });
}

const fetchAndParse = feed => {
  return new Promise(resolve => {
    fetch(proxy + feed[1]).catch(err => console.error(
      `Failed to reach ${feed[1]} with proxy ${proxy}\n` + err
      )
    ).then(resp => {
      document.querySelector("#newsFeeds").className = "start";
      return resp.text();
    }).then(xmlTxt => {
      const domParser = new DOMParser(),
            parsedFeed = domParser.parseFromString(xmlTxt, "text/xml");
      createArticles(parsedFeed, feed);
      resolve(parsedFeed, feed);
    });
  });
}

const createArticles = (parsedFeed, feed) => {
  const articles = parsedFeed.querySelectorAll("item");

  allArticles[feed[0]] = [...articles].map(ar => new Article(ar, feed));
}

const createFeed = src => {
  const container = document.createElement("div"),
        feedName = document.createElement("div"),
        button = document.createElement("button");
  feedName.className = "feedName";
  feedName.style.backgroundColor = colors.article;
  feedName.style.color = colors.feedName;
  feedName.textContent = src;
  container.appendChild(feedName);
  allArticles[src].forEach(ar => container.append(Article.buildElement(ar)));
  container.className = "feed off";

  const openFeed = () => {
    const active = document.querySelector(".feed.on");
    if (active) {active.className = "feed off"}
    container.className = "feed on";
    document.querySelector("#feeds .clock").style.color = colors.clock2
  }

  button.className = "feedBtn";
  button.textContent = src;
  button.style.backgroundColor = colors.feedBtnColor;
  button.style.color = colors.buttonTextColor;
  button.addEventListener("click", openFeed);
  document.querySelector("#newsFeeds").appendChild(button);
  
  return container;
}

const loadArticles = async () => {
  const container = document.querySelector("#feeds");
  await getNewsFeeds();
  await Promise.all([...newsFeeds].map(item => fetchAndParse(item)));
  for (let src of Object.keys(allArticles)) {
    container.appendChild(createFeed(src));
  }
  document.querySelector("#newsFeeds").className = ""
}

// Clocks
const loadTime = () => {
  const [clock1, clock2] = document.querySelectorAll(".clock");
  
  const changeTime = () => {
    const dateOb = new Date(),
          time = `${fixNumber(dateOb.getHours())}:`
            + `${fixNumber(dateOb.getMinutes())}:`
            + `${fixNumber(dateOb.getSeconds())}`
    clock1.innerHTML = time;
    clock2.innerHTML = time;
  }

  const fixNumber = num => {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }

  changeTime()
  let timeIter = setInterval(changeTime, 500);
}

// Theme
const getColors = () => {
  return new Promise(resolve => {
    chrome.storage.local.get("newsPageColors", val => {
      const menu = document.querySelector("#newsFeeds"),
            [clock1, clock2] = document.querySelectorAll(".clock");
      colors = val.newsPageColors;

      document.querySelector("body").style.backgroundColor = colors.background;
      menu.style.backgroundColor = colors.menu;
      menu.style.borderColor = colors.menuBorder;
      menu.style.color = colors.feedBtnColor;
      clock1.style.color = colors.clock1;
      clock2.style.color = colors.clock2Init;
      resolve(colors);
    });
  });
}

const opsOnLoad = async () => {
  loadTime();
  getColors();
  loadArticles();
}

(() => {
  window.addEventListener("load", opsOnLoad);
})();