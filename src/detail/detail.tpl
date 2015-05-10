<!-- target: task -->
<h1>
    <!-- if: ${isedit} -->
    <input placeholder="请输入任务名称" value="${title}" id="form-title">
    <span class="form-error" id="form-title-error"></span>
    <!-- else -->
    ${title}
    <!-- /if-->
    <!-- if: !${isedit} -->
    <a class="btn" data-role="delete">删除<i class="iconfont icon-chahao"></i></a>
    <!-- /if-->
    <!-- if: !${isedit} && !${finished} -->
    <a class="btn" data-role="edit">编辑<i class="iconfont icon-bianji"></i></a>
    <a class="btn" data-role="finish">完成<i class="iconfont icon-wancheng"></i></a>
    <!-- /if-->
</h1>
<h2 class="b-shadow">
    <!-- if: ${isedit} -->
    <input placeholder="请输入任务日期" value="${date}" id="form-date">
    <span class="form-error" id="form-date-error"></span>
    <!-- else -->
    任务日期：${date}
    <!-- /if-->
</h2>
<!-- if: ${isedit} -->
<textarea placeholder="请输入任务详情" id="form-content">${content}</textarea>
<br/>
<span class="form-error" id="form-content-error"></span>
<!-- else -->
<section>
    <!-- for: ${list} as ${item} -->
    <p>${item}</p>
    <!-- /for -->
</section>
<!-- /if-->
<!-- if: ${isedit} -->
<div>
    <input class="button" type="button" value="确定" data-role="confirm">
    <!-- if: ${id} -->
    <input class="button" type="button" value="取消" data-role="cancel">
    <!-- /if-->
</div>
<!-- /if-->
