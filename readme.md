---
layout: default
title: About
permalink: /about/
---

## About the Author

TODO

## About the Blog

TODO

## Latest Posts

{% for post in site.posts limit:10 %}
- [{{ post.title }}]({{ post.url }}) ({{ post.date | date: "%Y-%m-%d" }})
{% endfor %}

[More.](/posts)

## Attributions

Hosted on Github Pages using Jekyll.

This Blog uses [$\KaTeX$](https://katex.org/)

Favicon generated with: https://favicon.io/favicon-generator/