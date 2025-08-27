---
layout: page
title: "Docking Analysis"
description: >
  분자 도킹 및 가상 스크리닝 도구들
permalink: /analysis/docking/
---

## 🎯 도킹 분석 도구

분자 도킹, 가상 스크리닝, 바인딩 사이트 예측 도구들을 소개합니다.

---

{% assign docking_posts = site.posts | where_exp: "post", "post.categories contains 'docking'" %}

{% if docking_posts.size > 0 %}
{% for post in docking_posts %}
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
  <p class="message">아직 등록된 도킹 분석 도구가 없습니다.</p>
{% endif %}