---
title: Posts
layout: default
---

{% for post in site.posts %}
<h2>
<a href="{{post.url}}">{{ post.title }}</a>
<div class="subtitle">{{ post.date | date: "%Y-%m-%d" }}</div>
</h2>
{{post.excerpt}}

{% endfor %}