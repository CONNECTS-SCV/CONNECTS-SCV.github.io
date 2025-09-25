---
title: "Dscript: 단백질 상호작용 예측을 위한 서열 기반 AI 도구"
author: author1
date: 2024-12-20
categories: [analysis, prediction, sequence]
tags: [Dscript, PPI예측, 단백질상호작용, 딥러닝, 서열기반예측, 단백질네트워크]
description: "Dscript는 단백질 서열만으로 단백질-단백질 상호작용(PPI)을 예측할 수 있는 딥러닝 모델입니다."
slug: dscript-protein-interaction-prediction
---

## 목적

단백질 아미노산 서열만으로 단백질-단백질 상호작용(PPI) 가능성 예측

## 작동 원리

- CNN 기반 서열 임베딩 모델
- 기능적 모티프 학습으로 잠재적 기능 영역 포착
- 단순 유사성 기반 접근을 넘어선 기능적 상호작용 예측

## 용도

- **신규 PPI 탐색**: 유전 질환 관련 단백질 간 잠재적 상호작용 예측
- **질병 네트워크 구축**: 상호작용 예측 기반 digenic interaction 분석
- **대규모 스크리닝**: 구조 정보 없이 빠른 PPI 선별

## 차별 포인트

- 구조 정보 없이 서열만으로 예측 가능
- 대규모 PPI 스크리닝에 최적화
- 다양한 예측 모델 제공 (Human, Topsy, tt3d)

## 비교해 볼 만한 모델

- **STRING**: 데이터베이스 기반 PPI 예측
- **AlphaFold-Multimer**: 구조 기반 복합체 예측
- **PRISM**: 템플릿 기반 PPI 예측

## 연계해 볼 만한 모델

- **AlphaFold-Multimer**: 구조 기반 정밀 분석
- **Boltz-2**: 구조 및 친화도 평가
- **PRODIGY**: 상호작용 친화도 계산

## 사용 방법

### 입력
* **단백질 서열** (FASTA 형식)
* **확인할 단백질 pair 리스트** (txt 파일)

### 출력
* 각 단백질 pair의 상호작용 점수 (0~1)
* 상호작용 가능성이 높은 순으로 정렬

### 설정 옵션
* **Threshold**: 상호작용 여부 판단 기준 점수 (예: 0.7)
* **Batch size**: 예측 처리 단위 (GPU 환경에 따라 조정)
* **Prediction 모델**: Human, Topsy, tt3d 중 선택

### 주의사항
* tt3d 모델은 정확하나 상대적으로 느림
* Threshold 값은 실험 목적에 따라 조정 필요

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/dscript?from=blog', '_blank'); return false;">Dscript 사용하러 가기</a>