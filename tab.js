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

const opsOnLoad = () => {
  displayDateAndTime();
  setBackground();
  setUpNewsDisplay();
}


window.addEventListener("load", opsOnLoad);
