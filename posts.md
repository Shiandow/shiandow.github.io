---
title: Posts
layout: default
---

{% for post in site.posts %}
## [{{ post.title }}]({{post.url}}) ({{post.date}})

{{post.excerpt}}

{% endfor %}