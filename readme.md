---
layout: default
title: About
permalink: /about/
easteregg: true
footer: last-processed.html
---

## About

This blog was written by <span class="the_author">the author</span> over the course of various investigations into one, or frequently multiple, areas of interest (in particular: mathematics, computer science, data engineering, physics). Articles will probably vary quite a bit in size and complexity.

<span class="the_author">The author</span> has a MSc in both Mathematics and Physics, and currently works as software/data scientists/engineer in the Netherlands.

These articles will tend to involve at least some mathematics, but wherever possible the gist of the article will be kept accessible to people without a mathematical background.

## Latest Posts

{% for post in site.posts limit:3 %}
- [{{ post.title }}]({{ post.url }}) ({{ post.date | date: "%Y-%m-%d" }})  
{% endfor %}

[More.](/)

## Contact Info

Name
: <span class="the_author">The author</span> 

Email
: <a class="the_email">obfuscated@obfuscated.oo</a> 

LinkedIn
: <a class="the_linkedin">/out/there</a> 

## Attributions

Hosted on Github Pages using Jekyll.

This Blog uses [\\( \KaTeX \\)](https://katex.org/).

Favicon generated with: <https://favicon.io/favicon-generator/>

Font is [EB Garamond](https://github.com/octaviopardo/EBGaramond12).