---
layout: page
title: "Design Tools"
description: >
  단백질 및 분자 설계 도구들
permalink: /analysis/design/
---

## ✏️ 설계 도구

단백질 설계, 펩타이드 설계, 약물 설계 등 분자 설계 도구들을 소개합니다.

---

{% assign design_posts = site.posts | where_exp: "post", "post.categories contains 'design'" %}

{% if design_posts.size > 0 %}
{% for post in design_posts %}
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
  <p class="message">아직 등록된 설계 도구가 없습니다.</p>
{% endif %}