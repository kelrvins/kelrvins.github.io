import {
    w
} from './wtools';
//set数组，自动去重
const routers = new Set();

const list = [{
    "title": "页面DEMO",
    "tasks": [{
        "title": "移动端图片展示",
        "name": "baiduIfe/picShow",
        "completed": true,
        "isLink": true,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "Bootstrap table做的页面",
        "name": "baiduIfe/BootstrapTable",
        "completed": true,
        "isLink": true,
        "github": "https://github.com/kelrvins"
    }]
}, {
    "title": "百度IFE学院",
    "tasks": [{
        "title": "仿豆瓣音乐播放器",
        "name": "baiduIfe/musicPlay",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "鼠标悬浮模糊",
        "name": "baiduIfe/hoverEffect",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "自定义网页右键菜单",
        "name": "baiduIfe/rightContent",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "CSS实现折叠面板",
        "name": "baiduIfe/radioWrap",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "可移动的小方块",
        "name": "baiduIfe/moveBlock",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "遍历多叉树",
        "name": "baiduIfe/traversalTree",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "搜索-插入",
        "name": "baiduIfe/searchInsert",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }, {
        "title": "排序-插入",
        "name": "baiduIfe/sortInsert",
        "completed": true,
        "isLink": false,
        "github": "https://github.com/kelrvins"
    }]
}]

//初始化时检查hash是否为空，空时默认指向index，否则解析hash
window.onload = function () {
    routers.add("index");
    routers.add("resume");
    routers.add("404");
    listFill() //列表填充
    let isClickRedirect = false; //是否点击跳转。是则不触发hashchange事件
    if (location.hash == '') {
        redirectTo("index")
    } else {
        let _hash = location.hash.toString().substr(2);
        analysis(_hash);
    }

    // 路由切换
    window.addEventListener('hashchange', function () {
        // console.log("hashchange")
        if (!isClickRedirect) {
            let _hash = location.hash.toString().substr(2);
            analysis(_hash);
        } else {
            isClickRedirect = true;
        }
    })

    //跳转至简历
    w.addEvent(w.$("#myResume"), "click", function () {
        location.hash = '#/resume';
        require.ensure([], function () {
            require('./resume/index.js').create()
        });
    })

    //跳转至index
    w.addEvent(w.$("#infoName"), "click", function () {
        location.hash = '#/index';
        require.ensure([], function () {
            require('./index/index.js').create()
        });
    })

    //监听列表点击事件
    w.addEvent(w.$("#homeNav"), "click", function (e) {
        let _hash, isLi = false;
        if (e.target && e.target.nodeName == "LI" && e.target.dataset.name) {
            _hash = e.target;
            isLi = true;
        } else if (e.target && e.target.nodeName == "I" && e.target.parentNode.nodeName == "LI") {
            _hash = e.target.parentNode;
            isLi = true;
        } else if (e.target && e.target.nodeName == "SPAN" && e.target.parentNode.nodeName == "LI") {
            _hash = e.target.parentNode;
            isLi = true;
        }
        if (isLi) {
            isClickRedirect = true;
            document.title = _hash.dataset.title;
            redirectTo(_hash.dataset.name);
            isLi = false;
        }
    })
}

//列表填充
const listFill = function () {
    // console.log("listFill");
    w.removaAllChildNodes(w.$("#homeNav"));
    const cFrag = document.createDocumentFragment();
    const listWrapUl = document.createElement("ul");
    for (var key in list) {
        if (list.hasOwnProperty(key)) {
            const listCollageLi = document.createElement("li");
            listCollageLi.innerHTML = list[key].title;
            listWrapUl.appendChild(listCollageLi)
            const listTaskUl = document.createElement("ul");
            var element = list[key];
            for (var t in element.tasks) {
                var ele = element.tasks[t];
                const listTaskLi = document.createElement("li");
                const listTaskI = document.createElement("i");
                const listTaskSpan = ele.isLink ? document.createElement("a") : document.createElement("span");
                listTaskI.className = "iconfont icon-iconfontdian1 circle-dot";
                ele.completed ? listTaskI.classList.add("completed") : "";
                listTaskLi.dataset.name = ele.name;
                listTaskLi.dataset.title = ele.title;
                listTaskLi.appendChild(listTaskI);
                ele.isLink ? (listTaskSpan.href = ele.github,listTaskSpan.setAttribute('target', '_bank')) :"" ;
                listTaskSpan.innerHTML = ele.title
                listTaskLi.appendChild(listTaskSpan)
                listTaskUl.appendChild(listTaskLi)
                routers.add(ele.name);
            }
            listWrapUl.appendChild(listTaskUl)
        }
    }
    cFrag.appendChild(listWrapUl)
    console.log(routers)
    w.$("#homeNav").appendChild(cFrag)
}


//重定向页面
const redirectTo = function (rdpath) {
    console.log("redirect to: " + rdpath)
    location.hash = '#/' + rdpath;
    require.ensure([], function () {
        require('./' + rdpath + '/index.js').create()
    });
}

// 分析hash
const analysis = function (anahash) {
    console.log("analysis: " + anahash)
    let isExisted = false;
    for (var key of routers) {
        if (key == anahash) {
            isExisted = true;
            break;
        }
    }
    isExisted ? redirectTo(anahash) : redirectTo("404");
}