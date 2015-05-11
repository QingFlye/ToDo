<!-- target: list -->
<!-- var: date = null -->
<!-- for: ${list} as ${item} -->
<!-- if: ${date} !== ${item.date} -->
<dt>${item.date}</dt>
<!-- var: date = ${item.date} -->
<!-- /if-->
<!-- if: ${item.id} === ${current} -->
<dd draggable="true" data-id="${item.id}" class="active">${item.title}</dd>
<!-- else -->
<dd draggable="true" data-id="${item.id}">${item.title}</dd>
<!-- /if-->
<!-- /for -->
