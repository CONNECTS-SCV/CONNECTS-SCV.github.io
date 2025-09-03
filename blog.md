---
layout: page
title: 블로그
description: CONNECTS 최신 소식과 업데이트
permalink: /blog/
menu: true
order: 1
---

## 최신 포스트

<div class="message">
📝 CONNECTS 플랫폼의 최신 소식, 업데이트, 그리고 구조 생물학 분야의 혁신적인 연구 결과를 공유합니다.
</div>

{% for post in site.posts limit:10 %}
<article class="post-preview">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y년 %m월 %d일" }}</time>
  <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
</article>
{% endfor %}

### 카테고리별 보기

- [Protein Analysis](/analysis/protein/)
- [Ligand Analysis](/analysis/ligand/)
- [Release Notes](/release/)