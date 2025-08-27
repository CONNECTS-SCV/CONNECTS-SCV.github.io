---
layout: page
title: "Machine Learning Tools"
description: >
  AI 및 머신러닝 기반 분석 도구들
permalink: /analysis/ml/
---

## 🤖 머신러닝 도구

딥러닝, 머신러닝 기반 구조 예측 및 분석 도구들을 소개합니다.

---

{% assign ml_posts = site.posts | where_exp: "post", "post.categories contains 'ml'" %}

{% if ml_posts.size > 0 %}
{% for post in ml_posts %}
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
  <p class="message">아직 등록된 머신러닝 도구가 없습니다.</p>
{% endif %}