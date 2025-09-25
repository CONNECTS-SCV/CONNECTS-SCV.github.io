---
title: "DiffDock: 리간드 도킹 포즈 예측 도구"
author: author1
date: 2024-12-20
categories: [analysis, docking, prediction, ml]
tags: [DiffDock, 리간드도킹, 단백질-리간드, 포즈예측, 단백질구조, small-molecule, 도킹]
description: "DiffDock은 단백질이 고정된 상태에서 리간드의 최적 결합 위치와 형태를 예측하는 diffusion 기반 모델입니다."
slug: diffdock-ligand-docking-prediction
---

## 목적

단백질 구조가 고정된 상태에서 리간드의 최적 결합 위치와 형태 예측

## 작동 원리

- 딥러닝 기반의 확률적 모델(diffusion) 활용
- 복합체 구조를 확률 분포로부터 샘플링
- 전통적 도킹 모델 대비 속도와 정확도 우수

## 용도

- **약물 개발 초기 스크리닝**: 리간드가 단백질 포켓에 잘 들어맞는지 빠르게 확인
- **Drug Repositioning**: 기존 약물이 새로운 타깃에 결합 가능한지 확인
- **구조 기반 약물 설계**: 결합 포즈 기반 최적화

## 차별 포인트

- 전통적 도킹(슈뢰딩거 등) 대비 속도와 정확도 우수
- Diffusion 기반 확률적 접근법
- Confidence score로 신뢰도 평가 가능

## 비교해 볼 만한 모델

- **AutoDock**: 전통적 스코어링 기반 도킹
- **Glide**: 상용 도킹 소프트웨어
- **Chai**: 단백질 구조와 도킹 동시 예측

## 연계해 볼 만한 모델

- **LigandMPNN**: DiffDock 예측 포즈 기반으로 단백질 서열 최적화
- **SS-GNN**: 생성된 복합체 구조의 binding affinity 정량 예측
- **ADMET-AI**: 도킹된 리간드의 ADMET 특성 평가

## 사용 방법

### 입력
* **단백질 구조** (.pdb 형식)
* **리간드 구조** (.smi SMILES 또는 .sdf 형식)

### 출력
* 도킹된 리간드 포즈 구조 (복합체)
* 각 포즈의 confidence score (native pose일 확률 지표)

### 설정 옵션
* **Number of designs**: 생성할 도킹 포즈 수 설정

### 주의사항
* .pdb, .smi, .sdf 파일만 지원
* 3D 구조가 없다면 .smi로 입력 가능하나 .sdf 권장
* 결과는 확률적이므로 후속 평가 필요

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/DiffDock?from=blog', '_blank'); return false;">DiffDock 사용하러 가기</a>