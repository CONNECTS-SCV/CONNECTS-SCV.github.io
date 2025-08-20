---
layout: page
title: "Release Notes"
description: >
  CONNECTS 플랫폼 업데이트 및 릴리즈 정보
permalink: /release/
---

## 📢 릴리즈 노트

CONNECTS 플랫폼의 새로운 기능, 개선사항, 버그 수정 등 모든 업데이트 내역을 확인하세요.

---

{% assign release_posts = site.posts | where_exp: "post", "post.categories contains 'release'" %}

{% if release_posts.size > 0 %}
  {% for post in release_posts %}
<article class="post-card">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y년 %m월 %d일" }}</time>
  <p>{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</p>
  <div class="tags">
    {% for tag in post.tags limit:3 %}
      <span class="tag">{{ tag }}</span>
    {% endfor %}
  </div>
</article>
<hr/>
  {% endfor %}
{% else %}
  <p class="message">아직 등록된 릴리즈 노트가 없습니다.</p>
{% endif %}

