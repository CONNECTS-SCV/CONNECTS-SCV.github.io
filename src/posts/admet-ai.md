---
title: "ADMET-AI: 약물 후보물질의 약동/독성 예측 도구"
author: author1
date: 2024-12-20
categories: [analysis, prediction, compound]
tags: [ADMET-AI, 약동학, 독성예측, 신약개발, SMILES, 화합물분석, Multi-task-learning]
description: "ADMET-AI는 신약개발 초기 단계에서 화합물의 ADMET(흡수, 분포, 대사, 배설, 독성) 특성을 빠르게 예측해주는 인공지능 기반 분석 도구입니다."
slug: admet-ai-drug-properties-prediction
---

## 목적

신약개발 과정에서 화합물의 ADMET 특성을 사전 평가하여 유망한 후보물질 선별

## 작동 원리

- 화합물의 그래프 구조와 molecular fingerprint를 통합
- Multi-task learning 기반으로 여러 ADMET 특성 동시 예측
- 대규모 실험 데이터셋을 학습한 딥러닝 모델 활용

## 용도

- **신약 후보물질 필터링**: 흡수율이나 독성 기준 미달 물질 제외
- **Virtual screening 후속 분석**: Diffdock 등과 결합하여 유망 물질 선별
- **약물동태 예측**: 대사 반응성, 체내 분포 경향 등 예측

## 차별 포인트

- Multi-task learning으로 여러 ADMET 특성 동시 예측
- 빠른 처리 속도 (수초~수분 내 결과)
- 시각화 자료(heatmap, plot) 제공으로 직관적 해석

## 비교해 볼 만한 모델

- **SwissADME**: 약동학 중심 예측, 무료
- **admetSAR**: 더 많은 독성 endpoint 제공
- **pkCSM**: 구조 기반 ADMET 예측

## 연계해 볼 만한 모델

- **DiffDock**: 결합 예측 후 ADMET 특성으로 필터링
- **ToxinPred3**: 독성 예측 교차 검증
- **DILI, Amesformer, hERG-prediction**: 특정 독성 세부 평가

## 사용 방법

### 입력
* **화합물 구조** (SMILES 포맷)

### 출력
* 예측된 ADMET 특성 값 (흡수율, 대사 안정성, 독성 등)
* Confidence score 및 예측값 ranking
* 시각화 자료 (heatmap, plot 등)

### 설정 옵션
* 별도 파라미터 설정 없음 (기본값 자동 적용)

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/admet-ai?from=blog', '_blank'); return false;">ADMET-AI 사용하러 가기</a>