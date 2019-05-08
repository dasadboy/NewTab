let favouriteBookmarks

const getBookmarks = () => {
  return new Promise(resolve => {
    chrome.storage.local.get("fav_ids", value => {
      chrome.bookmarks.get(value.fav_ids, bookmarks => {
        favouriteBookmarks = bookmarks;
        resolve(bookmarks);
      });
    });
  });
}

const buildBookmark = bookmarkIndex => {
  const bookmark = favouriteBookmarks[bookmarkIndex],
        bookmarkElem = document.createElement("a"),
        icon = document.createElement("img"),
        name = document.createElement("name");

  bookmarkElem.href = bookmark.url;
  bookmarkElem.className = "bookmark";

  icon.src = `chrome://favicon/${bookmark.url}`;

  name.textContent = bookmark.title;
  name.className = "name";

  bookmarkElem.appendChild(icon);
  bookmarkElem.appendChild(name);

  return bookmarkElem;
}

const setUpBookmarks = async () => {
  const bookmarksContainer = document.querySelector("#bookmarks");

  await getBookmarks()

  for (let i = 0; i < favouriteBookmarks.length; i++) {
    bookmarksContainer.appendChild(buildBookmark(i));
  }
}