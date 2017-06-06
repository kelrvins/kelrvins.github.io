import {
  w
} from '../../wtools';
import template from './template.html';
import './style.scss'

export function create() {
    w.$$(".container")[0].innerHTML = template;
    init();
}

//显示右击菜单
function ShowRight(event) {
    var mouseX = event.clientX,
        mouseY = event.clientY,
        rigClickWidth = w.$('#rightContent').offsetWidth,
        rigClickHeight = w.$('#rightContent').offsetHeight,
        viewWidth = document.documentElement.clientWidth,
        viewHeight = document.documentElement.clientHeight

    // console.log(mouseX, mouseY)
    // && mouseY < (viewHeight - rigClickHeight)

    w.$('#rightContent').style.display = "block"
    if (mouseX < (viewWidth - rigClickWidth)) {
        if (mouseY > (viewHeight - rigClickHeight)) {
            w.$('#rightContent').style.top = mouseY - rigClickHeight + "px"
            w.$('#rightContent').style.left = mouseX - rigClickWidth + "px"
        } else {
            w.$('#rightContent').style.top = mouseY + "px"
            w.$('#rightContent').style.left = mouseX + "px"
        }
    } else if (mouseX > (viewWidth - rigClickWidth)) {
        if (mouseY > (viewHeight - rigClickHeight)) {
            w.$('#rightContent').style.top = mouseY + "px"
            w.$('#rightContent').style.left = mouseX + "px"
        } else {
            w.$('#rightContent').style.top = mouseY + "px"
            w.$('#rightContent').style.left = mouseX - rigClickWidth + "px"
        }
    }
}
const init=function () {

    setTimeout(function () {
        w.addEvent(w.$('#rightClick'), "contextmenu", function () {
            //阻止原有右击菜单
            document.oncontextmenu = function (e) {
                e.preventDefault()
            }
            //显示右击菜单
            ShowRight(event)
        })
        w.addEvent(w.$('#rightClick'), "click", function () {
            if (w.$('#rightContent')) {
                w.$('#rightContent').style.display = "none"
            }
        })
        document.body.addEventListener("click", function (e) {
            if (w.$('#rightContent')) {
                w.$('#rightContent').style.display = 'none';
            }
            document.oncontextmenu = function (e) {}
        })
        w.addEvent(w.$('#rightContent'), "click", function () {
            var lis = document.getElementsByTagName("Li");
            var target = event.target || event.srcElement;
            if (!!target && target.nodeName.toUpperCase() === 'LI') {
                alert(target.innerHTML);
            }
        })
    }, 0)
}