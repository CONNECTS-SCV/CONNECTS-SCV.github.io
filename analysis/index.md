---
layout: list
title: "Analysis"
permalink: /analysis/
---

{% assign posts = site.posts | where_exp: "post", "post.categories contains 'analysis'" %}
<ul>
  {% for post in posts %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
