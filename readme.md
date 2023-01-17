---
layout: default
title: About
permalink: /about/
easteregg: true
---

## About

This blog is a place for <span class="the_author">the author</span> to put various articles which were the result of an investigation into one, or frequently multiple, areas of interest (in particular: mathematics, computer science, data engineering, physics). 

<span class="the_author">The author</span> has a MSc in both Mathematics and Physics, and currently works as software/data scientists/engineer in the Netherlands.

These articles will tend to involve at least some mathematics, but wherever possible the gist of the article will be kept accessible to people without a mathematical background.[^snakes]

[^snakes]: Just try not to run at the first sign of an integral sign $\int$.

## Latest Posts

{% for post in site.posts limit:10 %}
- [{{ post.title }}]({{ post.url }}) ({{ post.date | date: "%Y-%m-%d" }})  
{% endfor %}

[More.](/posts)

## Contact Info

Name
: <span class="the_author">The author</span> 
Email
: <a class="the_email">obfuscated@obfuscated.oo</span> 
LinkedIn
: <a class="the_linkedin">/out/there</span> 

## Attributions

Hosted on Github Pages using Jekyll.

This Blog uses [\\( \KaTeX \\)](https://katex.org/).

Favicon generated with: <https://favicon.io/favicon-generator/>

<footer markdown="1">
Last processed on {{ site.time | date: "%Y-%m-%d %H:%M:%S %Z"}}
</footer>