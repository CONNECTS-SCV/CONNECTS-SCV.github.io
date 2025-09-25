---
title: "NetsolP: 단백질 용해도 예측을 위한 딥러닝 모델"
author: author1
date: 2024-12-20
categories: [analysis, prediction, sequence]
tags: [NetsolP, 단백질용해도, solubility-prediction, ESM, 딥러닝, 발현예측]
description: "NetsolP는 아미노산 서열만을 입력으로 E. coli에서의 단백질 용해도(solubility)를 예측하는 딥러닝 도구입니다."
slug: netsolp-protein-solubility-prediction
---

## 목적

단백질 서열로부터 E. coli 발현 기준 용해도(solubility) 예측

## 작동 원리

- ESM 언어모델 임베딩 기반
- PSI Biology, NESG 데이터 등에서 학습
- 구조 정보나 MSA 없이 서열만으로 예측

## 용도

- **단백질 발현 최적화**: 발현 가능한 서열 우선 선별
- **라이브러리 필터링**: 저용해도 단백질 사전 제거로 실험 비용 절감
- **후속 구조 기반 분석 전처리**: aggregation hotspot 탐지 도구와 결합

## 차별 포인트

- 빠른 예측 속도로 대규모 스크리닝 가능
- 다양한 ESM 모델 옵션 제공
- 구조 정보 없이 서열만으로 예측

## 비교해 볼 만한 모델

- **Camsol**: 위치별 aggregation 예측
- **Aggrescan3D**: 구조 기반 aggregation 분석
- **ZipperDB**: amyloid 형성 경향 예측

## 연계해 볼 만한 모델

- **Camsol**: hotspot 분석
- **Aggrescan3D**: 구조 기반 검증
- **ZipperDB**: 라이브러리 설계 최적화

## 사용 방법

### 입력
* **단백질 서열** (FASTA 형식)

### 출력
* Solubility score (0~1)
* Usability score (0~1)

### 설정 옵션
* **모델 선택**:
  * ESM1b: 정확도 높음
  * ESM12: 균형적 성능
  * ESM1b distilled: 속도 빠름

### 주의사항
* 출력 값은 예측 확률/스코어 (절대 수치 아님)
* 위치별 hotspot 제공 안 됨 (residue-level 분석 불가)

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/netsolp?from=blog', '_blank'); return false;">NetsolP 사용하러 가기</a>