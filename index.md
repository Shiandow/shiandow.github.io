---
title: Posts
layout: default
---

{% for post in site.posts %}
## [{{ post.title }}]({{post.url}}) <aside class="subtitle left">{{ post.date | date: "%Y-%m-%d" }}<aside>

{{post.excerpt}}

{% endfor %}