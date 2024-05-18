---
title: Klad
layout: default
permalink: /klad/
---

{% for draft in site.klad %}
<h2>
<a href="{{draft.url}}">{{ draft.title }}</a>
<div class="right subtitle">{{ draft.progress | default: "TBD" }}</div>
</h2>
{{draft.excerpt}}

{% endfor %}