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
  let btWrap = document.getElementById("btWrap"),
    delNode = document.getElementById("delNode"),
    insInput = document.getElementById("insInput"),
    insNode = document.getElementById("insNode"),
    post = document.getElementById("post"),
    pre = document.getElementById("pre"),
    seInput = document.getElementById("seInput"),
    seBtn = document.getElementById("seBtn"),
    inputs = document.getElementsByTagName("input"),
    node = document.getElementsByTagName("div"),
    spans = document.getElementsByTagName("span"),
    data = [],
    whoClick,
    arr = [];

  //设置输入和按钮不可用
  function setDisabledT() {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = "disabled";
    }
  }

  //设置输入和按钮可用
  function setDisabledF() {
    post.removeAttribute('disabled');
    pre.removeAttribute('disabled');
    seInput.removeAttribute('disabled');
    seBtn.removeAttribute('disabled');
  }

  //重置颜色和数组
  function resets() {
    for (let i = 0; i < node.length; i++) {
      node[i].style.backgroundColor = '#fff'
    }
    data = [];
    arr = [];
  }

  //染色
  function coloring() {
    setDisabledT();
    let i = 1;
    data[0].style.backgroundColor = '#f00'
    var time = setInterval(function () {
      if (i < data.length) {
        data[i - 1].style.backgroundColor = '#fff'
        data[i].style.backgroundColor = '#f00'
        i++
      } else {
        data[i - 1].style.backgroundColor = '#fff'
        setDisabledF();
        clearInterval(time)
      }
    }, 200)
  }

  //搜索染色
  function Scoloring(a) {
    setDisabledT();
    for (let i = 0; i < data.length; i++) {
      data[i].style.backgroundColor = '#fff'
    }
    let i = 1;
    data[0].style.backgroundColor = '#f00'
    var time = setInterval(function () {
      if (i < a + 1) {
        data[i - 1].style.backgroundColor = '#fff'
        data[i].style.backgroundColor = '#f00'
        i++
      } else {
        setDisabledF();
        clearInterval(time)
      }
    }, 200)
  }

  //前序
  function PreOrder(x) {
    var i;
    if (x != null) {
      data.push(x);
      var length = x.children.length;
      if (length > 0) {
        for (i = 0; i < length; i++) {
          if (x.children[i].nodeType == 1) {
            PreOrder(x.children[i]);
          }
        }
      }
    }
  }

  //中序
  function inOrder(x) {
    if (!(x == null)) {
      inOrder(x.firstElementChild)
      data.push(x)
      inOrder(x.lastElementChild)
    }
  }

  //后序
  function postOrder(x) {
    var i;
    if (x != null) {
      //list.push(node);
      var length = x.children.length;
      if (length == 0) {
        data.push(x);
      }
      if (length > 0) {
        for (i = 0; i < length; i++) {
          if (x.children[i].nodeType == 1) {
            postOrder(x.children[i]);

          }
        }
        data.push(x);
      }
    }
  }

  //将节点内容存入数组
  function arrOrder(x) {
    var i;
    if (!(x == null)) {
      console.log(x.firstChild.data.trim());
      arr.push(x.firstChild.data.trim());
      var length = x.children.length;
      if (length > 0) {
        for (i = 0; i < length; i++) {
          if (x.children[i].nodeType == 1) {
            arrOrder(x.children[i]);
          }
        }
      }
    }
  }

  //搜索字符串
  function searchArr(et) {
    let flag = -1
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == et) {
        flag = i
        continue
      }
    }
    return flag
  }

  //初始化
  function init() {
    delNode.disabled = "disabled";
    insInput.disabled = "disabled";
    insNode.disabled = "disabled";
    pre.addEventListener("click", function () {
      resets();
      PreOrder(btWrap);
      coloring();
    });
    // inp.addEventListener("click", function () {
    //     resets();
    //     inOrder(btWrap);
    //     coloring();
    // });
    post.addEventListener("click", function () {
      resets();
      postOrder(btWrap);
      coloring();
    });
    seBtn.addEventListener("click", function () {
      resets();
      PreOrder(btWrap);
      arrOrder(btWrap);
      if (w.$("#seInput").value.trim() !== "") {
        let a = searchArr(w.$("#seInput").value.trim());
        if (a != -1) {
          Scoloring(a);
        } else {
          coloring();
          w.$("#seInput").value = "无";
        }
      } else {
        w.$("#seInput").placeholder = "请先输入";
      }
    });
    btWrap.addEventListener('click', function (e) {
      whoClick = e.target;
      console.log(whoClick);
      delNode.removeAttribute('disabled');
      insInput.removeAttribute('disabled');
      insNode.removeAttribute('disabled');
    });
    delNode.addEventListener('click', function () {
      whoClick.parentNode.removeChild(whoClick);
      delNode.disabled = "disabled";
      insInput.disabled = "disabled";
      insNode.disabled = "disabled";
    });
    insNode.addEventListener('click', function () {
      let insI = insInput.value.trim();
      arrOrder(btWrap);
      if (insInput.value.trim() !== "") {
        let inText = w.$("#insInput").value.trim();
        let a = searchArr(inText)
        if (a == -1) {
          //插入节点
          var content1 = document.createElement('div')
          content1.innerHTML = inText
          whoClick.appendChild(content1)
          insInput.value = "";
          insInput.focus();
        } else {
          insInput.placeholder = "重复内容！！";
          insInput.value = "";
          insInput.focus();
        }
      } else {
        insInput.placeholder = "请先输入";
        insInput.focus();
      }
    });
  }
  init();
}