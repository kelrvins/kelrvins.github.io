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
  let data = [5, 12, 51],
    source = document.getElementById("source"),
    inLef = document.getElementById("insert-left"),
    inRig = document.getElementById("insert-right"),
    outLef = document.getElementById("out-left"),
    li = sorts.getElementsByTagName("li"),
    outRig = document.getElementById("out-right"),
    notice = document.getElementById("notice"),
    searchText = document.getElementById("searchText"),
    seBtn = document.getElementById("seBtn"),
    showBtn = document.getElementById("showBtn");

  function render() {
    removeAllChild(sorts); //移除所有子节点
    for (let i = 0; i < data.length; i++) {
      const cont = document.createElement('li');
      cont.innerHTML = data[i];
      console.log(cont);
      sorts.appendChild(cont);
    }
  }

  //搜索
  function searchItem() {
    render();
    console.log("###search###");
    let seVa = searchText.value.trim().toLowerCase();
    for (let i = 0; i < li.length; i++) {
      if (li[i].textContent.toLowerCase().indexOf(seVa) !== -1) {
        //边框染色
        li[i].className = "showli";
        //文字染色
        li[i].innerHTML = li[i].textContent.replace(new RegExp(seVa, 'gm'), "<span>" + seVa + "</span>")
      }
    }
  }

  //移除所有子节点
  function removeAllChild(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  //插入内容
  var insertContent = function (path) {
    if (source.value.trim() != "") {
      let sVa = source.value.trim().split(/-|,|，|、| |\n|\t/);
      if (path == "left") {
        for (let i = sVa.length - 1; i >= 0; i--) {
          if (sVa[i] == "") continue;
          data.unshift(sVa[i]);
        }
      } else {
        for (let i = 0; i < sVa.length; i++) {
          if (sVa[i] == "") continue;
          data.push(sVa[i]);
        }
      }
      source.value = "";
      source.focus();
      render();
    } else {
      notice.innerHTML = "空的.";
    }
  }

  function init() {
    render();
    //重置提示信息
    source.addEventListener("mouseover", function () {
      notice.innerHTML = "";
      source.focus();
    }, false);
    //添加按钮事件
    inLef.addEventListener("click", function () {
      insertContent("left");
    }, false);
    inRig.addEventListener("click", function () {
      insertContent("right");
    }, false);
    outLef.addEventListener("click", function () {
      if (data.length > 0) {
        data.shift();
        render();
      } else {
        notice.innerHTML = "空了。";
      }
    }, false);
    outRig.addEventListener("click", function () {
      if (data.length > 0) {
        data.pop();
        render();
      } else {
        notice.innerHTML = "空了。";
      }
    }, false);
    seBtn.addEventListener("click", function () {
      searchItem();
    }, false);
    showBtn.addEventListener("click", function () {
      render();
    }, false);
  }
  init();
}