let steps, //步骤json
    currentStep = 1, //当前步骤序号
    currentStepName = 1, //当前步骤名字
    currentFileDes, //当前文件描述
    completeStep = 0, //已完成步骤
    totalStep = 0, //总步骤
    clickEle, //被点击的表格行
    clickInput, //点击的选择文件按钮
    clickRowId, //被点击行元素的fileid
    clickRowDes //被点击行元素的描述


//加载步骤数据
function loadStepsData() {
    $.ajax({
        url: "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/list",
        async: false,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            steps = data;
            for (let key in steps) {
                totalStep++;
            }
            renderSteps();
        },
        error: function () {
            alert('error');
        }
    });
}
//绘制步骤
function renderSteps() {
    $("#groupList").empty();
    let oFrag = document.createDocumentFragment();
    let bGline = document.createElement("div");
    let dPro = document.createElement("div");
    let dProBar = document.createElement("div");
    bGline.className = "gl-bgline";
    dPro.className = "progress";
    bGline.append(dPro);
    dProBar.className = "progress-bar progress-bar-success progress-bar-striped";
    dProBar.id = "progressBar";
    dProBar.style.width = "0";
    dPro.append(dProBar);
    oFrag.append(bGline);

    for (let i in steps) {
        let iDiv = document.createElement("a");
        let iIcon = document.createElement("span");
        let iP = document.createElement("p");
        let iI = document.createElement("i");
        iDiv.className = "one-group";
        iDiv.href = steps[i].stepLink;
        iDiv.id = "step" + steps[i].stepID;
        steps[i].stepStatus == true ? (completeStep = i) : "";
        iIcon.className = steps[i].stepStatus == true ? "glyphicon glyphicon-ok-sign step-success" : "glyphicon glyphicon-ok-sign";
        iDiv.append(iIcon);
        iP.innerHTML = steps[i].stepName;
        iDiv.append(iP);
        iI.className = "glyphicon glyphicon-triangle-top text-hidden";
        iDiv.append(iI);
        oFrag.append(iDiv);
    }
    // console.log(oFrag)
    $("#groupList").append(oFrag);
    // console.log($("#groupList"))

    drawBgLine();
    //自然进入此页自动跳转到最近一个未完成项目，
    //如果是点击步骤进入则进入相应步骤
    // if (!jump) {
    completeStep == totalStep ? currentStep = parseInt(completeStep, 10) : currentStep = parseInt(completeStep, 10) + 1;
    // }
    $(".one-group")[currentStep - 1].lastChild.classList.remove("text-hidden");
    //当前步骤名字
    currentStepName = steps[currentStep].stepName;
    //大标题
    steps[currentStep].tableBtitle.trim() == "" ? $(".title-content").css('display', 'none') : ($(".title-content").css("display", ""), $("#bTitleText").html(steps[currentStep].tableBtitle));
    //小标题
    steps[currentStep].tableStitle.trim() == "" ? $(".title-text").css('display', 'none') : ($(".title-text").css("display", ""), $("#sTitleText").html(steps[currentStep].tableStitle));
    //检查是否可以添加数据
    steps[currentStep].stepCanAddFile == true ? ($("#addItemWrap").css("display", ""), currentFileDes = steps[currentStep].fileDes) : $("#addItemWrap").css("display", "none");
    //填充表格
    fillTable();
}

//绘制进度条
function drawBgLine() {
    switch (completeStep) {
        case 0:
            $("#progressBar").width(100 / totalStep / 2 + "%");
            break;
        case totalStep:
            $("#progressBar").width("100%");
            break;
        default:
            $("#progressBar").width(100 / totalStep / 2 + 100 / totalStep * completeStep + "%");
            break;
    }
}

//表格填充
function fillTable() {
    console.log("fillTable")
    let urlT = "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/tableData1";
    $('#table').bootstrapTable({
        url: urlT,
        dataType: "json",
        methods: 'get',
        editable: true, //开启编辑模式
        cache: false,
        striped: true,
        pagination: true,
        singleSelect: false,
        search: false,
        showRefresh: true,
        sidePagination: "client",
        silent: true,
        formatLoadingMessage: function () {
            return "请稍等，正在加载中...";
        },
        columns: [{
            "align": 'center',
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            "field": 'fileId',
            "title": '文件id',
            "visible": false
        }, {
            "field": 'fileDescription',
            "title": '文件描述',
            "align": 'center',
            formatter: function (value, row, index) {
                if (!value) {
                    value = '点击输入文件描述'
                    return value;
                } else {
                    return value;
                }
            }
        }, {
            "field": 'fileName',
            "align": 'center',
            "title": '文件名'
        }, {
            "field": 'uploadTime',
            "align": 'center',
            "title": '上传时间'
        }, {
            "field": 'fileOK',
            "title": '是否完成',
            "visible": false
        }, {
            "field": 'fileStatus',
            "align": 'center',
            "title": '文件状态',
            formatter: function (value, row, index) {
                if (!value) {
                    var strHtml = '待上传';
                    return strHtml;
                } else {
                    return value;
                }
            }
        }, {
            "field": 'fileFeedback',
            "align": 'center',
            "title": '管理员反馈'
        }, {
            "field": 'opera',
            "align": 'center',
            "title": '操作',
            formatter: actionFormatter
        }],
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
    } else if (row.fileStatus == "已通过") {
        return "审核通过"
        // return ' <label class="btn btn-primary btn-xs " id="choseFIle' + index + '" for="modifyFile' + index + '">选择文件</label><input type="file" class="choseFilew" name="modifyFile' + '-' + index + '" id="modifyFile' + index + '" style="display:none;"><button class="btn btn-success btn-xs upload-btn" id="uploadBtn' + index + '" >上传</button>';
    } else {
        return ' <label class="btn btn-success btn-xs chose-file" id="choseFIle' + index + '" for="modifyFile' + index + '">上传</label><input type="file" class="choseFilew" name="modifyFile' + '-' + index + '" id="modifyFile' + index + '" style="display:none;"><button class="btn-deletew btn btn-danger btn-xs" id="deleteBtn' + index + '" >删除</button>';
    }
}

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
    }
})
//上传文件框有变化时更新表格
$("#table").on('change', function (e) {
    if (e.target && e.target.nodeName == "INPUT" && e.target.className.indexOf("choseFilew") >= 0) {
        clickEle[0].children[2].innerHTML = $("#" + clickInput).val().substring($("#" + clickInput).val().toString().lastIndexOf("\\") + 1, $("#" + clickInput).val().length);
        var curClickIndex = e.target.parentNode.parentNode.dataset.index
        var mydate = new Date();
        var t = mydate.toLocaleString().toString();
        clickEle[0].children[3].innerHTML = t
        uploadFile($("#modifyFile" + curClickIndex).val(), t, clickRowDes)
    }
})


/**
 * 上传文件
 * @param {any} filespath 
 * @param {any} updateTime 
 * @param {any} upfilrDes 
 */
var uploadFile = function (filespath, updateTime, upfileDes) {
    console.log("上传", currentStepName, updateTime, filespath, upfileDes);
    $.ajax({
        url: "",
        type: "POST",
        data: {
            filePath: filespath,
            stepName: currentStepName,
            fileDes: upfileDes,
            fileUploadTime: updateTime
        },
        cache: false,
        success: function (data) {
            console.log("上传成功");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("上传失败");
            fillTable();
        }
    });
}
//上一步
$("#stepPre").on('click', function () {

})
//下一步
$("#stepNext").on('click', function () {

})

//添加按钮
$("#addFileInput").on('change', function () {
    var mydate = new Date();
    var te = mydate.toLocaleString()
    var fid = te.replace(/:/g, '').replace(/\s/g, "").replace(/-/g, "");
    var addfilei = $("#addFileInput").val()
    var addFileName = addfilei.substring(addfilei.toString().lastIndexOf("\\") + 1, addfilei.length);
    $('#table').bootstrapTable('append', {
        fileId: fid,
        fileDescription: currentFileDes,
        fileName: addFileName,
        uploadTime: te,
        fileStatus: "",
        fileFeedback: "",
        opera: ""
    });
    uploadFile(addfilei, te.toString(), currentFileDes)
})

var filter = false;
//过滤
$("#showAllItem").on('click', function () {
    if (!filter) {
        $("#showAllItem").html("显示全部");
        filter = true;
        $('#table').bootstrapTable('filterBy', {
            fileOK: false
        });
    } else {
        $("#showAllItem").html("只显示未通过的");
        filter = false;
        $('#table').bootstrapTable('filterBy', {});
    }
})

$(function () {
    loadStepsData();
    $('#navHidden').on('click', function () {
        $('#navBox').hide();
    })
})