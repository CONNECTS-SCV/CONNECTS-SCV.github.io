---
layout: page
title: Model Review
description: >
  AI 모델 사용 경험과 실험 결과 공유
hide_description: true
---

## 최근 리뷰

{% for post in site.categories.review limit:10 %}
### [{{ post.title | remove: "[리뷰] " }}]({{ post.url | relative_url }})
{{ post.date | date: "%Y년 %m월 %d일" }}

{{ post.excerpt | strip_html | truncate: 200 }}

---
{% endfor %}