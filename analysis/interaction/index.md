---
layout: page
title: "Interaction Analysis"
description: >
  단백질-단백질, 단백질-리간드 상호작용 분석 도구들
permalink: /analysis/interaction/
---

## 🤝 상호작용 분석 도구

단백질-단백질, 단백질-리간드 상호작용 예측 및 분석 도구들을 소개합니다.

---

{% assign interaction_posts = site.posts | where_exp: "post", "post.categories contains 'interaction'" %}

{% if interaction_posts.size > 0 %}
{% for post in interaction_posts %}
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
  <p class="message">아직 등록된 상호작용 분석 도구가 없습니다.</p>
{% endif %}