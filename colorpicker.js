class ColorInput {
  constructor(id, picker, color) {
    this.demoDoc = document.querySelector("#demoNewsTheme").contentWindow
      .document;
    this.id = id;
    this.elem = document.querySelector(`#${id}`);
    this.elem.value = color;
    this.picker = picker;
    this.elem.addEventListener("click", () => this.makeFocus());
    this.elem.addEventListener("change", () => this.preview());
  }

  makeFocus() {
    this.picker.setTarget(this)
  }

  updateValue(val) {
    this.elem.value = val;
  }

  preview() {
    const val = this.elem.value;
    if (val.length === 7 || val.length === 9) {
      this.elem.style.backgroundColor = "";
    } else {
      this.elem.style.backgroundColor = "#ffdddd";
    }
    for (let dom of this.demoDoc
      .querySelectorAll(`[data-bg-source='${this.id}']`)) {
      dom.style.backgroundColor = val;
    }
    for (let dom of this.demoDoc
      .querySelectorAll(`[data-text-source='${this.id}']`)) {
      dom.style.color = val;
    }
    for (let dom of this.demoDoc
      .querySelectorAll(`[data-border-source='${this.id}']`)) {
      dom.style.borderColor = val;
    }
  }

  getColor() {
    return this.elem.value;
  }
}

class ColorPicker {
  constructor() {
    this.canv = document.querySelector("#colorPicker canvas");
    this.pointer = document.querySelector("#pointer");
    this.ctx = this.canv.getContext("2d");
    this.currentTarget = undefined;
  }

  setTarget(targ) {
    this.currentTarget = targ;
    this.pointer.className = "hide"
  }

  getColor(x, y) {
    const data = [...this.ctx.getImageData(x, y, 1, 1).data].map(item => {
            let hex = item.toString(16);
            if (hex.length === 1) hex = "0" + hex;
            return hex;
          }),
          color = `#${data[0]}${data[1]}${data[2]}`;
    return color;
  }

  draw() {
    const colors = ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff",
          "#ff00ff", "#ff0000"];
    
    this.pointer.className = "hide"

    let grd = this.ctx.createLinearGradient(0, 0, 642, 0);
    grd.addColorStop(0, "#ff0000");
    for (let i = 0; i < 7; i++) grd.addColorStop(100/642*i + 1/642, colors[i]);
    grd.addColorStop(1, "#ff0000");
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, 642, 322);
    
    grd = this.ctx.createLinearGradient(0, 0, 0, 322);
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(1/322, "#ffffff");
    grd.addColorStop(0.49, "rgb(255, 255, 255, 0)");
    grd.addColorStop(0.51, "rgb(0, 0, 0, 0)");
    grd.addColorStop(1, "#000000");
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, 642, 322);
  }

  bindListeners() {
    const canvHeight = this.canv.offsetHeight,
          canvWidth = this.canv.offsetWidth;
    let pointerPos = {
      x: this.pointer.offsetTop,
      y: this.pointer.offsetLeft
    }

    let canvPosLeft = (() => {
      let current = this.canv, totalOffset = 0;
      while (current) {
        totalOffset += current.offsetLeft
        current = current.parentElement;
      }
      return totalOffset;
    })();

    let canvPosTop = (() => {
      let current = this.canv, totalOffset = 0;
      while (current) {
        totalOffset += current.offsetTop;
        current = current.parentElement;
      }
      return totalOffset;
    })();

    const initPicking = e => {
      this.pointer.className = "show";
      pointerPos.x = e.pageX - canvPosLeft;
      pointerPos.y = e.pageY - canvPosTop;
      this.pointer.style.left = pointerPos.x + "px";
      this.pointer.style.top = pointerPos.y + "px";
      window.addEventListener("mousemove", drag);
      window.addEventListener("mouseup", end);
      document.querySelector("body").style.userSelect = "none";
      if (this.currentTarget) this.currentTarget.updateValue(c);
    }

    const drag = e => {
      let x = e.pageX - canvPosLeft,
          y = e.pageY - canvPosTop,
          color;
      if (x > canvWidth - 1) {
        x = canvWidth;
      } else if (x < 0) {
        x = 0
      }
      if (y > canvHeight - 1) {
        y = canvHeight;
      } else if (y < 0) {
        y = 0;
      }
      pointerPos.x = x;
      pointerPos.y = y;
      this.pointer.style.left = pointerPos.x + "px";
      this.pointer.style.top = pointerPos.y + "px";

      color = this.getColor(pointerPos.x, pointerPos.y);
      if (this.currentTarget) {
        this.currentTarget.updateValue(color);
      }
    }

    const end = e => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", end);
      document.querySelector("body").style.userSelect = "auto";
      if (this.currentTarget) this.currentTarget.preview();
    }

    this.canv.addEventListener("mousedown", initPicking)
  }
}