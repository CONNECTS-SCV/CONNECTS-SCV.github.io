---
title: "Antifold: 항체 구조 기반 서열 최적화 모델"
author: author1
date: 2024-12-20
categories: [analysis, protein, structure, prediction]
tags: [Antifold, antibody, sequence-design, Transformer, 항체설계, 단백질서열예측]
description: "Antifold는 항체의 3D 구조를 입력받아 최적의 아미노산 서열을 예측하는 Transformer 기반 모델입니다. 특히 CDR 영역의 정밀 예측에 강점을 가집니다."
slug: antifold-antibody-sequence-optimization
---

## 목적

항체의 구조 정보를 바탕으로 최적화된 아미노산 서열을 예측하여 항체 엔지니어링 지원

## 작동 원리

- Transformer 아키텍처로 구조-서열 관계 학습
- 항체 CDR 영역에 특화된 예측 알고리즘
- GPT가 문장과 단어의 관계를 학습하듯, 단백질 구조와 아미노산 관계 학습

## 용도

- **항체 서열 최적화 및 redesign**: 결합력 유지하며 새로운 서열 생성
- **특허 회피 전략**: 구조적 동일성 유지하되 서열 변경
- **다양한 variant 생성**: 특히 H-CDR3처럼 변동성 큰 영역에서 다양한 서열 확보

## 차별 포인트

- CDR 영역에서 높은 정확도
- MPNN 계열 모델의 Transformer-equivalent 구조
- ESM-IF1 평가 모드로 신뢰도 지표 제공

## 비교해 볼 만한 모델

- **ProteinMPNN**: 일반 단백질 서열 디자인에 더 적합
- **ABodyBuilder**: 항체 구조 예측에 특화
- **IgFold**: 항체 구조 folding 예측

## 연계해 볼 만한 모델

- **ImmuneBuilder**: 예측된 서열로 항체 구조 재구성
- **PLIP**: 항체-항원 상호작용 분석
- **AlphaFold**: 새로운 서열의 구조 검증

## 사용 방법

### 입력
* **항체 구조** (PDB 파일)
* 권장: 항체-항원 복합체 구조

### 출력
* Refinement된 항체 서열 목록
* 신뢰도 지표 (ESM-IF1 Mode 사용 시):
  * Perplexity (PPL): 전체 예측 불확실성
  * Residue-level Probability: 위치별 예측 신뢰도

### 설정 옵션
* **Number of Sequences per Target**: 생성할 variant 수
* **Sampling Temperature**: 다양성 조절 (낮을수록 보수적)
* **ESM-IF1 Evaluation Mode**: 신뢰도 지표 출력 여부

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/antifold?from=blog', '_blank'); return false;">Antifold 사용하러 가기</a>