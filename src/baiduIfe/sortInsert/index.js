import {
  w
} from '../../wtools';
import template from './template.html';
import './style.scss'
export function create() {
  w.$$(".container")[0].innerHTML = template;
  init1()
}

function init1() {
  let data = [50, 20, 75, 45, 74, 78, 65, 68, 45, 63, 23, 14];

  let source = document.getElementById("source");
  let inLef = document.getElementById("insert-left");
  let inRig = document.getElementById("insert-right");
  let outLef = document.getElementById("out-left");
  let outRig = document.getElementById("out-right");
  let sorts = document.getElementById("sorts");
  let randomNum = document.getElementById("randomNum");
  let notice1 = document.getElementById("resorts");

  function render() {
    console.log("render");
    removeAllChild(sorts);
    for (let i = 0; i < data.length; i++) {
      const cont = document.createElement('li');
      cont.innerHTML = data[i];
      cont.style.height = data[i] / 10 + "rem";
      sorts.appendChild(cont);
    }
  }

  function resorts() {
    //console.log("s");
    var time = null,
      i = 0,
      j = 1;
    time = setInterval(function () {
      if (i < data.length) {
        if (j < data.length) {
          if (data[i] > data[j]) {
            var temp = data[i];
            data[i] = data[j];
            data[j] = temp;
            render();
          }
          j++;
        } else {
          i++;
          j = i + 1;
        }
      } else {
        clearInterval(time);
        return;
      }
    }, 3);
  }


  function removeAllChild(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  function init() {
    render();
    source.addEventListener("mouseover", function () {
      notice.innerHTML = "";
      source.focus();
    }, false);
    inLef.addEventListener("click", function () {
      if (parseInt(source.value.trim()) >= 10 && parseInt(source.value.trim()) <= 100) {
        data.unshift(source.value);
        if (data.length >= 40) {
          notice.innerHTML = "最多40个";
          inLef.disabled = true;
          inRig.disabled = true;
        }
      } else {
        notice.innerHTML = "请正确输入10——100内数字";
      }
      source.value = "";
      source.focus();
      render();

    }, false);
    inRig.addEventListener("click", function () {
      if (parseInt(source.value.trim()) >= 10 && parseInt(source.value.trim()) <= 100) {
        data.push(source.value);
        if (data.length >= 40) {
          notice.innerHTML = "最多40个";
          inLef.disabled = true;
          inRig.disabled = true;
        }
      } else {
        notice.innerHTML = "请正确输入10——100内数字";
      }
      source.value = "";
      source.focus();
      render();
    }, false);
    outLef.addEventListener("click", function () {
      if (data.length > 0) {
        notice.innerHTML = data.shift();
        if (data.length < 40 && inLef.disabled) {
          inLef.disabled = false;
          inRig.disabled = false;
        }
        render();
      }
    }, false);
    outRig.addEventListener("click", function () {
      if (data.length > 0) {
        notice.innerHTML = data.pop();
        if (data.length < 40 && inLef.disabled) {
          inLef.disabled = false;
          inRig.disabled = false;
        }
        render();
      }
    }, false);
    randomNum.addEventListener("click", function () {
      data = [];
      for (let i = 0; i < 40; i++) {
        data[i] = parseInt(Math.random() * 90 + 10);
      }
      notice.innerHTML = "";
      render();
    }, false);
    notice1.addEventListener("click", function () {
      if (data.length > 1) {
        resorts();
      }
      let fieldset = document.getElementsByName("fieldset");
      fieldset.disabled = true;
      notice.innerHTML = "";
    }, false);

  }
  init();
}