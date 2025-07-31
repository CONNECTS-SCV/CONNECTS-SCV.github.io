---
layout: list
title: "Ligand"
permalink: /analysis/ligand/
---

<ul>
  {% for post in site.posts %}
    {% if post.categories contains 'analysis' and post.categories contains 'ligand' %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
