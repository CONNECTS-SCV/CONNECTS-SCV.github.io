---
layout: page
title: "Structure Analysis"
description: >
  구조 분석 및 비교 도구들
permalink: /analysis/structure/
---

## 🔬 구조 분석 도구

단백질 구조 분석, 구조 비교, 구조 검증 도구들을 소개합니다.

---

{% assign structure_posts = site.posts | where_exp: "post", "post.categories contains 'structure'" %}

{% if structure_posts.size > 0 %}
{% for post in structure_posts %}
<article class="post-card">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <p class="post-date">{{ post.date | date: "%Y년 %m월 %d일" }}</p>
  <p>{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</p>
  {% if post.tags %}
  <div class="tags">
    {% for tag in post.tags %}
      <span class="tag">{{ tag }}</span>
    {% endfor %}
  </div>
  {% endif %}
</article>
<hr/>
{% endfor %}
{% else %}
  <p class="message">아직 등록된 구조 분석 도구가 없습니다.</p>
{% endif %}