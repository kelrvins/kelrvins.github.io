import {
  w
} from '../../wtools';
import template from './template.html';
import './style.scss'
export function create() {
  w.$$(".container")[0].innerHTML = template;
  init();
}


function init() {

  let bigBox = document.getElementById('bigBox'),
    moveBlock = document.getElementById('moveBlock'),
    moveType = document.getElementById('moveType'),
    moveOrder = document.getElementById('moveOrder'),
    path = 0, //方向
    de = 0, //角度模
    dege = 0, //角度
    post = 0,
    leN = 0,
    toN = 0;


  //渲染   上0 右1 下2 左3
  let moveE = function (pos, path) {
    post = pos;
    console.log("位置: " + pos + " | 方向: " + path);
    moveBlock.style.transform = 'rotate(' + dege + 'deg)';
    leN = parseInt(pos / 10) * 50;
    toN = parseInt(pos % 10) * 50;
    console.log("left:" + leN);
    console.log("top:" + toN);
    moveBlock.style.left = parseInt(pos / 10) * 50 + 'px';
    moveBlock.style.top = parseInt(pos % 10) * 50 + 'px';
  }

  //画格子
  let render = function () {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let lis = document.createElement('li');
        lis.id = i + "" + j;
        bigBox.appendChild(lis);
      }
    }
  }
  //向上移动
  let ggTop = function () {
    let p = parseInt(post) - 1;
    if (toN >= 50) {
      moveE(p, 0);
    } else {
      p++;
      console.log("0p:" + p);
    }
  }
  //向右移动
  let ggRig = function () {
    let p = parseInt(post) + 10;
    if (p < 10) {
      p = 0 + "" + p;
    }
    if (p <= 99) {
      moveE(p, 1);
    } else {
      p -= 10;
      console.log("1p:" + p);
    }
  }
  //向下移动
  let ggBot = function () {
    let p = parseInt(post) + 1;
    if (p % 10 != 0) {
      moveE(p, 2);
    } else {
      p -= 1;
      console.log("2p:" + p);
    }
  }
  //向左移动
  let ggLef = function () {
    let p = parseInt(post) - 10;
    if (p < 10) {
      p = 0 + "" + p;
    }
    if (p >= 0) {
      moveE(p, 3);
    } else {
      p += 10;
      console.log("3p:" + p);
    }
  }
  //GO
  let GOmove = function () {
    if (de == 90 || de == -270) {
      path = 1;
    } else if (de == -90 || de == 270) {
      path = 3;
    } else if (de == 0 || de == -0) {
      path = 0;
    } else if (de == 180 || de == -180) {
      path = 2;
    }
    switch (path) {
      case 0:
        ggTop();
        break;
      case 1:
        ggRig();
        break;
      case 2:
        ggBot();
        break;
      case 3:
        ggLef();
        break;
    }
  }
  //左转
  let tunLef = function () {
    moveBlock.style.transform = 'rotate(' + (dege -= 90) + 'deg)';
    de = dege % 360;
    console.log("%" + de);
  }
  //右转
  let tunRig = function () {
    moveBlock.style.transform = 'rotate(' + (dege += 90) + 'deg)';
    de = dege % 360;
    console.log("%" + de);
  }
  //后转
  let tunBac = function () {
    moveBlock.style.transform = 'rotate(' + (dege += 180) + 'deg)';
    de = dege % 360;
    console.log("%" + de);
  }
  //上移
  let wgoTop = function () {
    dege = 0;
    de = dege % 360;
    moveBlock.style.transform = 'rotate(' + dege + 'deg)';
    ggTop();
  }
  //下移
  let wgoBot = function () {
    dege = 180;
    de = dege % 360;
    moveBlock.style.transform = 'rotate(' + dege + 'deg)';
    ggBot();
  }
  //左移
  let wgoLef = function () {
    dege = 270;
    de = dege % 360;
    moveBlock.style.transform = 'rotate(' + dege + 'deg)';
    ggLef();
  }
  //右移
  let wgoRig = function () {
    dege = 90;
    de = dege % 360;
    moveBlock.style.transform = 'rotate(' + dege + 'deg)';
    ggRig();
  }
  //画格子
  let letGo = function (moveT) {
    if (moveT == "GO") {
      GOmove()
    } else if (moveT == "TUN LEF") {
      tunLef()
    } else if (moveT == "TUN RIG") {
      tunRig()
    } else if (moveT == "TUN BAC") {
      tunBac()
    }
    //
    else if (moveT == "TRA LEF") {
      ggLef();
      console.log("TRA LEF");
    } else if (moveT == "TRA TOP") {
      ggTop();
      console.log("TRA TOP");
    } else if (moveT == "TRA RIG") {
      ggRig();
      console.log("TRA RIG");
    } else if (moveT == "TRA BOT") {
      ggBot();
      console.log("TRA BOT");
    } else if (moveT == "MOV LEF") {
      wgoLef()
    } else if (moveT == "MOV TOP") {
      wgoTop()
    } else if (moveT == "MOV RIG") {
      wgoRig()
    } else if (moveT == "MOV BOT") {
      wgoBot()
    } else {
      console.log("else");
      moveType.innerHTML = "";
      moveType.placeholder = "请正确输入";
    }
  }
  document.onkeydown = function (event) {
    var e = event || window.event;
    switch (e.keyCode) {
      case 96:
        //0
        GOmove();
        break;
      case 38:
        //上
        GOmove();
        break;
      case 37:
        //左转
        tunLef();
        break;
      case 39:
        //右转
        tunRig();
        break;
      case 40:
        //回头
        tunBac();
        break;
      case 100:
        wgoLef();
        break;
      case 104:
        wgoTop();
        break;
      case 102:
        wgoRig();
        break;
      case 98:
        wgoBot();
        break;
      case 65:
        ggLef();
        break;
      case 87:
        ggTop();
        break;
      case 68:
        ggRig();
        break;
      case 83:
        ggBot();
        break;
      default:
        console.log(e.keyCode);
        break;
    }
  }
  setTimeout(function () {
    render();
    //初始化位置为 5 5,方向为上
    moveE("55", 0);
    //移动格子
    moveOrder.addEventListener("click", function () {
      let moveT = moveType.value.trim();
      letGo(moveT);
    }, false)
  }, 10);
}