# 마크다운 작성 가이드

## 카테고리
카테고리는 영어로 작성하면 자동으로 한글로 변환됩니다:
- `analysis` → 분석 모델
- `release` → 릴리즈 노트
- `feature` → 기능 개선

## Callout Box
중요한 내용을 강조할 때 사용:

```markdown
::callout
- **중요 내용 1**: 설명
- **중요 내용 2**: 설명
::/callout
```

## 중첩 리스트 Callout Box
두 단계 깊이의 리스트를 callout으로 감쌀 때:

```markdown
::list-callout
- 주요 항목 1
    - 세부 설명 1
- 주요 항목 2
    - 세부 설명 2
::/list-callout
```

## 깊은 중첩 리스트
세 단계 깊이의 리스트 (callout 없이):

```markdown
::deep-list
- 레벨 1
  - 레벨 2
    - 레벨 3
    - 레벨 3
  - 레벨 2
- 레벨 1
::/deep-list
```

## 이미지 삽입
간단한 문법으로 이미지 삽입:

```markdown
![이미지 설명](이미지경로){정렬:너비}[캡션]
```

### 단일 이미지 예시:
- `![PRODIGY 결과](/image/info/prodigy1.webp){center:600}` - 중앙 정렬, 600px 너비
- `![분석 화면](/image/analysis.png){left:400}[분석 결과 화면]` - 왼쪽 정렬, 400px 너비, 캡션 포함
- `![그래프](/image/graph.webp){right:300}[그림 1. 성능 비교 그래프]` - 오른쪽 정렬, 300px 너비, 캡션 포함
- `![스크린샷](/image/screen.png){center:full}` - 중앙 정렬, 전체 너비

### 가로 배치 (연속 입력):
```markdown
![WT(회색)와 G121V(핑크)](/image/info/detail/bioemu_6.webp){center:300}
![WT(회색)와 G121V(핑크)](/image/info/detail/bioemu_7.webp){center:300}
```
연속된 이미지는 자동으로 가로로 배치됩니다.

정렬 옵션: `left`, `center`, `right`
너비 옵션: 숫자(px) 또는 `full`(100%)
캡션: 선택사항, 대괄호 안에 텍스트 입력

## 파일 다운로드 링크
파일 다운로드 링크 생성:

```markdown
[Example File](/file/deepenzyme_detail.zip)
[PDF 문서](/file/document.pdf)
[CSV 데이터](/file/data.csv)
```

파일 링크는 자동으로 다운로드 아이콘이 추가되며, 클릭 시 파일이 다운로드됩니다.

## 도구 버튼
간단한 문법으로 도구 사용 버튼 추가:

```markdown
[tool-button:AbDev]
```

지원되는 도구들:
- AbDev
- ADMET-AI
- Antifold
- Bioemu
- Boltz-2
- Chai
- DeepFRI
- DiffDock
- DLKcat
- D-SCRIPT
- FixPDB
- GROMACS
- ImmuneBuilder
- LigandMPNN
- MHCflurry
- NetSolP
- PLIP
- ToxinPred3

## 예시 포스트 구조

```markdown
---
layout: post
title: "제목"
description: "설명"
categories: [analysis]
tags: [태그1, 태그2]
author: "author1"
date: "2025-01-02"
thumbnail: "/image/thumbnail.png"
---

## 개요
내용...

## 작동 원리
::callout
- **특징 1**: 설명
- **특징 2**: 설명
::/callout

## 입력・출력・설정 옵션
**입력**: 설명
**출력**: 설명
**설정 옵션**: 설명

## 용도・차별 포인트
**용도**: 설명
**차별 포인트**:
- 포인트 1
- 포인트 2

## 비교해 볼만한 모델
내용...

## 연계해 볼 만한 모델
내용...

---

[tool-button:도구이름]
```