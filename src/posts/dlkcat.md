---
title: "DLKcat: 효소 활성도 예측을 위한 Kcat 딥러닝 모델"
author: author1
date: 2024-12-20
categories: [analysis, prediction, sequence, compound]
tags: [DLKcat, Kcat예측, 효소활성, 딥러닝, SMILES, FASTA, 효소공학]
description: "DLKcat은 단백질 서열과 리간드 구조만으로 효소의 Kcat(촉매 속도 상수)을 빠르게 예측할 수 있는 딥러닝 기반 모델입니다."
slug: dlkcat-enzyme-activity-prediction
---

## 목적

특정 기질에 대한 효소의 Kcat(초당 촉매 활성도) 예측

## 작동 원리

- BRENDA DB를 학습한 딥러닝 회귀 모델
- 단백질 서열과 리간드 구조 정보만으로 예측
- 복잡한 구조 예측이나 docking 불필요

## 용도

- **돌연변이 효과 분석**: 다양한 변이 서열에 대해 Kcat 비교
- **생합성 경로 최적화**: 경로 효소들의 상대적 효율성 분석
- **효소 스크리닝**: 고활성 효소 후보를 선별하는 전처리 과정

## 차별 포인트

- 구조 정보 없이 서열만으로 예측 가능
- 대규모 변이체 스크리닝에 적합
- 빠른 처리 속도

## 비교해 볼 만한 모델

- **kcat-cnn**: CNN 기반 Kcat 예측
- **UniKP**: 다양한 효소 파라미터 예측
- **KEGG**: 효소 데이터베이스 기반 분석

## 연계해 볼 만한 모델

- **Protenix**: 구조 안정성 평가
- **PIGNET2**: 결합 친화도 예측
- **DeepFRI**: 효소 기능 분류

## 사용 방법

### 입력
* **단백질 서열** (FASTA 형식)
* **리간드 구조** (SMILES 형식)

### 출력
* 예측된 Kcat 값 (단위: s⁻¹)
* 값이 클수록 해당 효소가 기질을 더 빠르게 처리

### 설정 옵션
* 별도 옵션 없음 (기본 설정으로 자동 분석)

### 주의사항
* 효소-기질 1:1 매핑 필수
* Kcat은 비교용 수치이므로 절대값보다 상대 비교에 적합

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/dlkcat?from=blog', '_blank'); return false;">DLKcat 사용하러 가기</a>