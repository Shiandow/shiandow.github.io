---
title: Home
layout: default
---

# Latest Posts

<dl>
{% for post in site.posts limit:10 %}
<dt>{{ post.date }}</dt>
<dd>[{{ post.title }}]({{ post.url }})</dd>
{% endfor %}
</dl>

[More.](/posts)