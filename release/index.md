---
layout: list
title: "Release"
permalink: /release/
---

<ul>
  {% for post in site.posts %}
    {% if post.categories contains 'release' %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>

