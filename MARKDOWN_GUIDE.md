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