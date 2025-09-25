---
title: "Immunebuilder: 항체 및 TCR 구조 예측 전용 모델"
author: author1
date: 2024-12-20
categories: [analysis, prediction, structure]
tags: [Immunebuilder, 항체구조예측, TCR예측, CDR-loop, nanobody, antibody, immune-modeling]
description: "Immunebuilder는 항체(nanobody, antibody) 및 T 세포 수용체(TCR)의 서열을 기반으로 빠르고 정확하게 구조를 예측하는 딥러닝 모델입니다."
slug: immunebuilder-antibody-tcr-structure
---

## 목적

항체(antibody, nanobody)와 TCR 구조를 서열 기반으로 빠르게 예측

## 작동 원리

- AlphaFold2 아키텍처를 면역 단백질에 특화
- CDR loop 구조 예측에 최적화
- VH/VL, TCR αβ 체인 간 pairing 구조 지원

## 용도

- **항체 설계 초기 단계**: CDR 변형 후보 구조 빠르게 확보
- **TCR 구조 모델링**: TCR 기반 면역 치료제 설계용 구조 예측
- **엔지니어링 전처리**: loop 구조 안정성 검토 후 downstream 분석

## 차별 포인트

- 면역 단백질 특화 경량화 모델
- CDR loop 구조 정확도 우수
- 추론 속도 빠름

## 비교해 볼 만한 모델

- **ABodyBuilder**: 항체 구조 예측
- **IgFold**: 항체 folding 예측
- **AlphaFold2**: 일반 단백질 구조 예측

## 연계해 볼 만한 모델

- **DiffDock-PP**: 항체-항원 도킹
- **GROMACS**: 구조 안정성 시뮬레이션
- **PRODIGY**: 복합체 결합력 평가

## 사용 방법

### 입력
* **아미노산 서열** (FASTA 형식)
  * VH/VL chain (항체)
  * TCR α/β chain (TCR)

### 출력
* 예측된 3D 구조 (PDB 포맷)

### 설정 옵션
* **Molecule type**:
  * Antibody
  * Nanobody
  * TCR

### 제한사항
* 단일체 구조 예측만 가능
* 항원 포함 복합체 예측 불가
* 항체-항원 도킹은 별도 도구 필요

### 사용 링크
* [Immunebuilder 사용하러 가기](https://curie.kr:444/Analysis/immunebuilder)