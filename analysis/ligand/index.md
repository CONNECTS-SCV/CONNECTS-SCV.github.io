---
layout: page
title: "Ligand Analysis"
description: >
  리간드 도킹, 스크리닝, 최적화 도구들
permalink: /analysis/ligand/
---

## 💊 리간드 분석 도구

리간드 도킹, 가상 스크리닝, ADMET 예측 등 다양한 리간드 관련 분석 도구들을 소개합니다.

---

{% assign ligand_posts = site.posts | where_exp: "post", "post.categories contains 'ligand'" %}

{% if ligand_posts.size > 0 %}
  {% for post in ligand_posts %}
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
  <p class="message">아직 등록된 리간드 분석 도구가 없습니다.</p>
{% endif %}
