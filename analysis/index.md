---
layout: list
title: "Analysis"
permalink: /analysis/
---

<ul>
  {% for post in site.posts %}
    {% if post.categories contains 'analysis' %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
