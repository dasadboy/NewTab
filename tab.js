const displayDateAndTime = () => {
  const timeContainer = document.querySelector("#time"),
        dateContainer = document.querySelector("#date"),
        months = ["January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"];
  let timeInterval = setInterval(() => {
    const dateObj = new Date(),
          date = `${dateObj.getDate()}  ${months[dateObj.getMonth()]}  ${
            dateObj.getFullYear()}`,
          time = `${formatNumber(dateObj.getHours())}:${
            formatNumber(dateObj.getMinutes())}`;

          dateContainer.textContent = date;
          timeContainer.textContent = time;
  }, 250);
}

const formatNumber = num => {
  (num < 10) && (num = "0" + num);
  return num;
}

const setBackground = () => {
  let background = backgrounds[Math.floor(Math.random()*backgrounds.length)];
  while (background === undefined) {
    background = backgrounds[Math.floor(Math.random()*backgrounds.length)];
  }
  document.querySelector("body").style.backgroundImage = 
  `url(backgrounds/${background})`;
}

const setUpDrag = async () => {
  const newsDisplay = document.querySelector("#news");
  let posTop, posLeft,
      initialX, initialY;
  await chrome.storage.local.get(["newsPosition"], value => {
    posTop = value.newsPosition.top;
    posLeft = value.newsPosition.left;

    if (!posTop) {
      newsDisplay.style.top = "70%";
      newsDisplay.style.left = "30%";
      posTop = newsDisplay.offsetTop;
      posLeft = newsDisplay.offsetLeft;
    } else {
      newsDisplay.style.top = `${posTop}px`;
      newsDisplay.style.left = `${posLeft}px`;
    }
  });

  const startDrag = event => {
    initialX = event.pageX;
    initialY = event.pageY;
    newsDisplay.style.transition = "none";
    
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", endDrag);
  }

  const drag = event => {
    posTop = posTop + event.pageY - initialY;
    posLeft = posLeft + event.pageX - initialX;
    initialY = event.pageY;
    initialX = event.pageX;
    newsDisplay.style.top = posTop + "px";
    newsDisplay.style.left = posLeft + "px";
  }

  const endDrag = event => {
    newsDisplay.style.transition = "";
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("mousemove", drag);
    chrome.storage.local.set({
      newsPosition: {
        top: posTop,
        left: posLeft
      }
    });
  }

  document.querySelector("#dragThis").addEventListener("mousedown", startDrag);
}

const setUpResize = () => {
  const newsDisplay = document.querySelector("#news"),
        resizeBar = document.querySelector("#resizeNews");
  let initialX,
      displayWidth = newsDisplay.offsetWidth;

  const startResize = event => {
    initialX = event.pageX;

    newsDisplay.style.transition = "none";

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", endResize);
  }

  const resize = event => {
    displayWidth = displayWidth + event.pageX - initialX
    initialX = event.pageX;
    newsDisplay.style.width = displayWidth + "px";
  }

  const endResize = event => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", endResize);
  }

  resizeBar.addEventListener("mousedown", startResize);
}

const opsOnLoad = () => {
  displayDateAndTime();
  setBackground();
  setUpNewsDisplay();
  setUpDrag();
  setUpResize();
  setUpBookmarks();
}


window.addEventListener("load", opsOnLoad);
