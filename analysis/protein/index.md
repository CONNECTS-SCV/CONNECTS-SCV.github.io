---
layout: page
title: "Protein Analysis"
description: >
  단백질 구조 분석, 설계, 예측 도구들
permalink: /analysis/protein/
---

## 🧬 단백질 분석 도구

단백질 구조 분석, 서열 설계, 상호작용 예측 등 다양한 단백질 관련 분석 도구들을 소개합니다.

---

{% assign protein_posts = site.posts | where_exp: "post", "post.categories contains 'protein'" %}

{% if protein_posts.size > 0 %}
  {% for post in protein_posts %}
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
  <p class="message">아직 등록된 단백질 분석 도구가 없습니다.</p>
{% endif %}
