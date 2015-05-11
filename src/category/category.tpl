<!-- target: category -->
<h3 class="<!-- if: !${currentFirst}-->active<!--/if-->">所有任务(<span id="category-count">${count}</span>)</h3>
<h4>全部分类</h4>
<!-- for: ${categories} as ${group}-->
<dl data-id="${group.id}" class="<!-- if: ${currentFirst} === ${group.id}-->active<!--/if-->">
    <dt data-id="${group.id}" class="<!-- if: ${currentFirst} === ${group.id}  && !${currentSecond} -->active<!--/if-->">
        <i class="iconfont icon-iconfontwenjianjiadakai"></i>
        <span>${group.title}(<span>${group.count}</span>)</span>
        <!-- if: !${group.readonly} -->
        <a class="btn">删除<i class="iconfont icon-chahao"></i></a>
        <!--/if-->
    </dt>
    <!-- for: ${group.children} as ${item} -->
    <dd data-id="${item.id}" class="<!-- if: ${currentSecond} === ${item.id} -->active<!--/if-->" draggable="true">
        <i class="iconfont icon-11"></i>
        <span>${item.title}(<span>${item.count}</span>)</span>
        <!-- if: !${item.readonly} -->
        <a class="btn" href=javascript:void(0)>删除<i class="iconfont icon-chahao"></i></a>
        <!--/if-->
    </dd>
    <!-- /for -->
</dl>
<!-- /for -->
