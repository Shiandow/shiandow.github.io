---
title: Klad
layout: default
permalink: /klad/
---

{% for draft in site.klad %}
<h2>
<a href="{{draft.url}}">{{ draft.title }}</a>
<aside class="subtitle left">{{ TBD }}</aside>
</h2>
{{draft.excerpt}}

{% endfor %}