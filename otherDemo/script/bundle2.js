let steps, //步骤json
    currentStep = 1, //当前步骤序号
    currentStepName = 1, //当前步骤名字
    completeStep = 0, //已完成步骤
    totalStep = 0, //总步骤
    jump = false, //初始化
    clickEle, //被点击的表格行
    clickInput, //点击的选择文件按钮
    clickRowId //被点击行元素的fileid

//加载步骤数据
const loadStepsData = () => {
    let result = $.ajax({
        url: "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/list",
        async: false
    });
    steps = JSON.parse(result.responseText)
    for (let key in steps) {
        totalStep++
    }
    renderSteps()
}
//绘制步骤
const renderSteps = () => {
    $("#groupList").empty()
    let oFrag = document.createDocumentFragment()
    let bGline = document.createElement("div"),
        dPro = document.createElement("div"),
        dProBar = document.createElement("div")
    bGline.className = "gl-bgline"
    dPro.className = "progress"
    bGline.append(dPro)
    dProBar.className = "progress-bar progress-bar-success progress-bar-striped"
    dProBar.id = "progressBar"
    dProBar.style.width = "0"
    dPro.append(dProBar)
    oFrag.append(bGline)

    for (let i in steps) {
        let iDiv = document.createElement("label"),
            iIcon = document.createElement("span"),
            iP = document.createElement("p"),
            iI = document.createElement("i")
        iDiv.className = "one-group"
        iDiv.id = "step" + steps[i].stepID
        steps[i].stepStatus == true ? (completeStep = i) : ""
        iIcon.className = steps[i].stepStatus == true ? "glyphicon glyphicon-ok-sign step-success" : "glyphicon glyphicon-ok-sign"
        iDiv.append(iIcon)
        iP.innerHTML = steps[i].stepName
        iDiv.append(iP)
        iI.className = "glyphicon glyphicon-triangle-top text-hidden"
        iDiv.append(iI)
        oFrag.append(iDiv)
    }

    $("#groupList").append(oFrag)

    drawBgLine()
    //自然进入此页自动跳转到最近一个未完成项目，
    //如果是点击步骤进入则进入相应步骤
    if (!jump) {
        completeStep == totalStep ? currentStep = parseInt(completeStep) : currentStep = parseInt(completeStep) + 1
    }
    $(".one-group")[currentStep - 1].lastChild.classList.remove("text-hidden")
    //当前步骤名字
    currentStepName = steps[currentStep].stepName
    //注意事项
    steps[currentStep].stepNotice.trim() == "" ? $(".notice-content").css('display', 'none') : ($(".notice-content").css("display", ""), $("#noticeText").html(steps[currentStep].stepNotice))
    //补充意见
    steps[currentStep].stepView.trim() == "" ? $(".add-comments").css("display", "none") : ($(".add-comments").css("display", ""), $("#addCommentsText").html(steps[currentStep].stepView))
    //检查是否可以添加数据
    steps[currentStep].stepCanAddFile == true ? $("#addItemWrap").css("display", "") : $("#addItemWrap").css("display", "none")
    //填充表格
    fillTable()
}
//绘制进度条
function drawBgLine() {
    switch (completeStep) {
        case 0:
            $("#progressBar").width(100 / totalStep / 2 + "%")
            break
        case totalStep:
            $("#progressBar").width("100%")
            break
        default:
            $("#progressBar").width(100 / totalStep / 2 + 100 / totalStep * completeStep + "%")
            break
    }
}

//监听步骤点击事件
$("#groupList").click(function (e) {
    if (e.target && e.target.nodeName == "LABEL") {
        currentId = e.target.id
        jump = true
    }
    if (e.target && e.target.parentNode.nodeName == "LABEL") {
        currentId = e.target.parentNode.id
        jump = true
    }
    if (jump) {
        for (let i in steps) {
            if ("step" + steps[i].stepID == currentId && i <= (parseInt(completeStep) + 1)) {
                currentStep = parseInt(i)
                renderSteps()
                break
            }
        }
    }
})


//表格填充
function fillTable() {
    let urlT = "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/tableData" + currentStep % 2;
    // console.log(urlT);
    $('#table').bootstrapTable({
        url: urlT,
        dataType: "json",
        methods: 'get',
        editable: true, //开启编辑模式
        cache: false,
        striped: true,
        pagination: true,
        singleSelect: false,
        search: true,
        showRefresh: true,
        sidePagination: "client",
        silent: true,
        formatLoadingMessage: function () {
            return "请稍等，正在加载中...";
        },
        columns: [{
            field: 'fileId',
            title: '文件id',
            visible: false
        }, {
            field: 'fileDescription',
            title: '文件描述',
            align: 'center',
            // editable: {
            //     type: 'text',
            //     title: '文件描述',
            //     validate: function (value) {
            //         let dvalue = $.trim(value);
            //         if (!dvalue) {
            //             return '必须填入，不能放空！';
            //         }

            //     }
            // },
            formatter: function (value, row, index) {
                if (!value) {
                    value = '点击输入文件描述'
                    return value;
                } else {
                    return value;
                }
            }
        }, {
            field: 'fileName',
            align: 'center',
            title: '文件名'
        }, {
            field: 'fileStatus',
            align: 'center',
            title: '文件状态',
            formatter: function (value, row, index) {
                if (!value) {
                    var strHtml = '待上传';
                    return strHtml;
                } else {
                    return value;
                }
            }
        }, {
            field: 'fileFeedback',
            align: 'center',
            title: '管理员反馈'
        }, {
            field: 'opera',
            align: 'center',
            title: '操作',
            formatter: actionFormatter
        }],
        // onEditableSave: function (field, row, oldValue, $el) {
        //     console.log(field)
        // },
        onClickRow: function (row, $element) {
            clickEle = $element;
            clickRowId = row.fileId;
            clickRowDes = row.fileDescription;
        }
    })
}

//表格内事件————添加三个按钮
function actionFormatter(value, row, index) {
    if (row.fileStatus == "审核中") {
        return "审核中"
        // return ' <label class="btn btn-primary btn-xs " id="choseFIle' + index + '" for="modifyFile' + index + '">选择文件</label><input type="file" class="choseFilew" name="modifyFile' + '-' + index + '" id="modifyFile' + index + '" style="display:none;"><button class="btn btn-success btn-xs upload-btn" id="uploadBtn' + index + '" >上传</button>';
    } else {
        return ' <label class="btn btn-primary btn-xs " id="choseFIle' + index + '" for="modifyFile' + index + '">选择文件</label><input type="file" class="choseFilew" name="modifyFile' + '-' + index + '" id="modifyFile' + index + '" style="display:none;"><button class="btn btn-success btn-xs upload-btn" id="uploadBtn' + index + '" >上传</button><button class="btn-deletew btn btn-danger btn-xs" id="deleteBtn' + index + '" >删除</button>';
    }
}


//监听表格点击

//监听表格点击
$("#table").on('click', function (e) {
    if (e.target && e.target.nodeName == "LABEL") {
        clickInput = e.target.nextSibling.id;
    }
    if (e.target && e.target.nodeName == "BUTTON") {
        if (e.target.innerText == "删除") {
            $('#table').bootstrapTable(
                'remove', {
                    field: 'fileId',
                    values: [clickRowId]
                }
            )
            console.log("delete", currentStepName, clickRowId)
            $.ajax({
                type: "get",
                url: "",
                data: {
                    fileDeal: 'delete',
                    stepName: currentStepName,
                    fileDescription: clickRowId
                },
                cache: false,
                success: function (data) {
                    console.log("删除成功");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("删除失败");
                }
            });
        }
        if (e.target.innerText == "上传") {
            let curClickIndex = e.target.parentNode.parentNode.dataset.index
            console.log("上传", currentStepName, $("#modifyFile" + curClickIndex).val(), clickRowDes);
            if ($("#modifyFile" + curClickIndex).val().trim() ) {
                $.ajax({
                    type: "POST",
                    url: "",
                    data: {
                        filePath: $("#modifyFile" + curClickIndex).val(),
                        stepName: currentStepName,
                        fileDes: clickRowDes
                    },
                    cache: false,
                    success: function (data) {
                        console.log("上传成功");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("上传失败");
                    }
                });
            } else {
                    alert("未选择文件");
            }
        }
    }
})

//上传文件框有变化时更新表格
$("#table").on('change', function (e) {
    if (e.target && e.target.nodeName == "INPUT" && e.target.className.indexOf("choseFilew") >= 0) {
        clickEle[0].children[1].innerHTML = $("#" + clickInput).val().substring($("#" + clickInput).val().toString().lastIndexOf("\\") + 1, $("#" + clickInput).val().length);
    }
})
//上一步
$("#stepPre").click(function () {
    jump = true
    if (currentStep == 1) {
        console.log("end ,maybe Previous stage")
    } else {
        currentStep--
        renderSteps()
    }
})
//下一步
$("#stepNext").click(function () {
    jump = true
    if (totalStep == currentStep) {
        console.log("end ,maybe next stage")
    } else if (currentStep < parseInt(completeStep) + 1) {
        currentStep++
        renderSteps()
    }
})

//添加按钮
$("#addItem").on('click', function () {
    var inputContent = $("#addItemContent").val().trim()
    if (inputContent != "") {
        var mydate = new Date();
        var t = mydate.toLocaleString() + mydate.getMilliseconds()
        $('#table').bootstrapTable('insertRow', {
            index: 0,
            row: {
                fileId: t.replace(/:/g, '').replace(/\s/g, "").replace(/-/g, ""),
                fileDescription: inputContent,
                fileName: '',
                fileStatus: '',
                fileFeedback: '',
                opera: ''
            }
        });
        $("#addItemContent").val("")
    } else {
        alert("请输入文件描述")
        $("#addItemContent").focus()
    }
})

window.onload = function () {
    loadStepsData()
}