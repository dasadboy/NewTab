(() => {
  for (b of document.querySelectorAll(".feedBtn")) {
    b.addEventListener("click", () => {
      const on = document.querySelector(".feed.on");
      document.querySelector(".feed.off").className = "feed on";
      if (on) on.className = "feed off";
    });
  }
})();