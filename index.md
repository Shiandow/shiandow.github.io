---
title: Posts
layout: default
---

{% for post in site.posts %}
<h2>
<a href="{{post.url}}">{{ post.title }}</a>
<aside class="subtitle left">{{ post.date | date: "%Y-%m-%d" }}</aside>
</h2>
{{post.excerpt}}

{% endfor %}