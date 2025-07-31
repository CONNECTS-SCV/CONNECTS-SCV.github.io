---
layout: list
title: "Release"
permalink: /release/
---

{% assign posts = site.posts | where_exp: "post", "post.categories contains 'release'" %}
<ul>
  {% for post in posts %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
