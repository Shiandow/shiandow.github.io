---
title: Home
layout: default
---

# Latest Posts

{% for post in site.posts limit:10 %}
- [{{ post.title }}]({{ post.url }}) (({{ post.date | date: %Y-%m-%d }}))
{% endfor %}

[More.](/posts)