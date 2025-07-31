---
layout: list
title: "Protein"
permalink: /analysis/protein/
---

{% assign posts = site.posts | where_exp: "post", "post.categories contains 'analysis' and post.categories contains 'protein'" %}
<ul>
  {% for post in posts %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
