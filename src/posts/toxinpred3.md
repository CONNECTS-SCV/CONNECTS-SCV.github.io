---
title: "ToxinPred3.0: 펩타이드 독성 예측 모델"
author: author1
date: 2024-12-20
categories: [analysis, prediction, structure]
tags: [ToxinPred3.0, 독성예측, 펩타이드, 단백질, 머신러닝, 백신디자인, 신약개발]
description: "ToxinPred3.0은 단백질 및 펩타이드 서열의 잠재적 독성을 평가하는 머신러닝 기반 모델입니다."
slug: toxinpred3-peptide-toxicity-prediction
---

## 목적

입력된 단백질/펩타이드 서열의 잠재적 독성 평가

## 작동 원리

- 아미노산 조성, n-mer 패턴, 물리화학적 특성 등 feature 생성
- RF, ANN, SVM 등 분류기로 Swissprot 기반 독성/비독성 학습
- ML/MERCI 하이브리드 모델로 전역 패턴과 지역 motif 통합 고려

## 용도

- **펩타이드 신약 개발**: 후보 물질의 독성 가능성 사전 필터링
- **백신 디자인**: 면역원성 펩타이드의 독성 위험 최소화
- **바이오소재**: 나노 바이오 소재의 안전성 확보

## 차별 포인트

- ML/MERCI 기반 하이브리드 모델 제공
- 전역 패턴과 지역 motif 모두 고려
- 독성 기여 부위 시각화 (Region importance)

## 비교해 볼 만한 모델

- **DILI**: 간 독성 평가 모델
- **hERGAI**: 심장 독성 예측 모델
- **StrucToxNet**: 3D 구조 기반 독성 예측
- **HEMOPI2**: 정량적 score 기반 독성 평가

## 연계해 볼 만한 모델

- **AlphaProteo**: 구조 예측 → 독성 없는 구조 확인
- **ThermoMPNN**: 돌연변이 탐색 → 안정적이고 독성 적은 펩타이드 최적화
- **ProteinMPNN**: de novo 서열 생성 후 ToxinPred3.0으로 필터링

## 사용 방법

### 입력
* **단일 서열**: 직접 FASTA 입력
* **다수 서열**: FASTA 파일 업로드

### 출력 지표
* **ML score**: 1에 가까울수록 toxic (강도 아님)
* **MERCI score pos**: toxin motif와 유사도
* **MERCI score neg**: non-toxin motif와 유사도
* **Hybrid score**: ML + MERCI 통합 결과
* **Prediction**: 최종 예측 (0.5 기준 이상 toxic)
* **PPV**: Positive 예측 시 실제 양성일 확률

### 설정 옵션
* **ML**: 전역 서열 패턴 기반, 빠르지만 부정확 가능
* **MERCI**: motif 기반, 국소 패턴에 정밀
* **Hybrid**: Global+Local 패턴 통합, 가장 정확하지만 느림
* **Region importance**: 독성 기여 부위 시각화

### 주의사항
* Score가 높다고 독성이 더 강한 것은 아님 (binary 분류)
* 0.5 기준으로 toxic/non-toxic 분류

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/toxinpred3?from=blog', '_blank'); return false;">ToxinPred3.0 사용하러 가기</a>