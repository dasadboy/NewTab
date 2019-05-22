class ColorInput {
  constructor(id, picker, color) {
    this.demoRoot = document.querySelector("#demoNewsTheme").contentWindow
      .document.documentElement;
    this.id = id;
    this.elem = document.querySelector(`#${id}`);
    this.elem.value = color;
    this.elem.defaultColor = color;
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
    if (/^(#[0-9|a-f]{6}|#[0-9|a-f]{8})$/i.test(val)) {
      this.elem.style.backgroundColor = "";
      this.demoRoot.style.setProperty(`--${this.id}`, val);
    } else {
      this.elem.style.backgroundColor = "#ffdddd";
      this.demoRoot.style.setProperty(`--${this.id}`, this.elem.defaultColor)
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
    this.previewElem = document.querySelector("#previewColor");
  }

  setTarget(targ) {
    this.currentTarget = targ;
    this.pointer.className = "hide";
    this.previewElem.style.backgroundColor = targ.elem.value;
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
    grd.addColorStop(0.49, "#ffffff00");
    grd.addColorStop(0.51, "#00000000");
    grd.addColorStop(1, "#000000");
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, 642, 322);
  }

  bindListeners() {
    const canvHeight = this.canv.height,
          canvWidth = this.canv.width,
          section = this.canv.parentElement.parentElement;
    let pointerPos = {
      x: this.pointer.offsetTop,
      y: this.pointer.offsetLeft
    }

    let canvPos = {
      x: 0,
      y: 0
    }

    const getCanvPos = () => {
      let current = this.canv, totalOffsetLeft = 0, totalOffsetTop = 0;
      while (current) {
        totalOffsetLeft += current.offsetLeft;
        totalOffsetTop += current.offsetTop;
        current = current.parentElement;
      }
      canvPos.x = totalOffsetLeft;
      canvPos.y = totalOffsetTop;
      return 1;
    }

    const initPicking = e => {
      getCanvPos();
      this.pointer.className = "show";
      pointerPos.x = e.pageX - canvPos.x;
      pointerPos.y = e.pageY - canvPos.y + section.scrollTop;
      this.pointer.style.left = pointerPos.x + "px";
      this.pointer.style.top = pointerPos.y + "px";
      window.addEventListener("mousemove", drag);
      window.addEventListener("mouseup", end);
      document.querySelector("body").style.userSelect = "none";
      
      let color = this.getColor(pointerPos.x, pointerPos.y);
      if (this.currentTarget) this.currentTarget.updateValue(color);
      this.previewElem.style.backgroundColor = color;
    }

    const drag = e => {
      let x = e.pageX - canvPos.x,
          y = e.pageY - canvPos.y + section.scrollTop,
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
      this.previewElem.style.backgroundColor = color;
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