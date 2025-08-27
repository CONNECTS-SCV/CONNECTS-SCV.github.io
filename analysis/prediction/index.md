---
layout: page
title: "Prediction Tools"
description: >
  구조 예측, 기능 예측, 특성 예측 도구들
permalink: /analysis/prediction/
---

## 🔮 예측 도구

단백질 구조 예측, 기능 예측, 물성 예측 등 다양한 예측 도구들을 소개합니다.

---

{% assign prediction_posts = site.posts | where_exp: "post", "post.categories contains 'prediction'" %}

{% if prediction_posts.size > 0 %}
{% for post in prediction_posts %}
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
  <p class="message">아직 등록된 예측 도구가 없습니다.</p>
{% endif %}