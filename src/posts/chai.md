---
title: "Chai: 단백질-Ligand/Glycan 결합 예측 도구"
author: author1
date: 2024-12-20
categories: [analysis, structure, prediction]
tags: [Chai, docking, structure-prediction, 단백질구조예측, 결합예측, ligand, glycan]
description: "Chai는 단백질 구조 예측과 ligand, glycan과의 결합 구조를 동시에 예측하는 AI 기반 시뮬레이션 도구입니다."
slug: chai-protein-ligand-glycan-docking
---

## 목적

단백질과 ligand/glycan 간의 결합 구조를 예측하여 복합체 구조 분석

## 작동 원리

- Transformer 및 Diffusion 모델 기반
- 단백질 구조 예측과 docking을 동시에 수행
- Boltz 계열의 equivalent transformer 구조와 diffusion 모델 결합
- 단백질의 유연성까지 고려한 정밀 예측

## 용도

- **신약개발 초기 단계**: ligand와 단백질의 결합 구조 빠른 예측
- **타겟 검증**: glycan이나 저분자 화합물과의 상호작용 구조 분석
- **돌연변이 분석**: 단백질 변이의 결합 변화 예측을 통한 기능 분석

## 차별 포인트

- 단백질 구조 예측과 docking 동시 수행
- 복잡한 파라미터 설정 불필요
- 정량 지표와 시각화 자료 제공

## 비교해 볼 만한 모델

- **DiffDock**: 리간드 도킹에 특화
- **RFdiffusion**: 구조 생성에 특화
- **AlphaFold-Multimer**: 단백질 복합체 예측

## 연계해 볼 만한 모델

- **DLKcat**: 효소 활성 예측
- **Boltz-2**: 구조 생성 및 도킹 교차 검증
- **PLIP**: 예측된 복합체의 상호작용 분석

## 사용 방법

### 입력
* **단백질 서열** (FASTA 형식)
* **Glycan 서열** (CCD 형식) 또는 **소분자 구조** (SMILES 형식)

### 출력
* 복합체 구조 (PDB 형식)
* 주요 예측 지표:
  * aggregate_score: 종합 예측 품질 점수
  * chain_chain_clashes: 체인 간 충돌 수
  * iptm: 체인 간 상대 위치 예측 정확도
  * ptm: 단백질 자체 구조 예측 정확도
* MSA coverage plot

### 설정 옵션
* 별도 설정 필요 없음 (기본값 자동 적용)

### 사용 링크
* [Chai 사용하러 가기](https://curie.kr:444/Analysis/chai)