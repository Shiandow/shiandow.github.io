---
layout: default
title: About
permalink: /about/
---

## About

This blog is a place to post various articles which don't really fit anywhere else, but are nevertheless worth making public.

The author has a MSc in both Mathematics and Physics, and currently works as software/data scientists/engineer. 

These articles will vary from somewhat technical to very technical and will span across various subjects from mathematics, computer science, and possibly physics. 

## Latest Posts

{% for post in site.posts limit:10 %}
- [{{ post.title }}]({{ post.url }}) ({{ post.date | date: "%Y-%m-%d" }})  
{% endfor %}

[More.](/posts)

## Attributions

Hosted on Github Pages using Jekyll.

This Blog uses [\\( \KaTeX \\)](https://katex.org/).

Favicon generated with: <https://favicon.io/favicon-generator/>

<footer markdown="1">
Last processed on {{ site.time | date: "%Y-%m-%d %H:%M:%S %Z"}}
</footer>