---
title: "MHCflurry: MHC class I 펩타이드 결합 친화도 예측 모델"
author: author2
date: 2024-12-20
categories: [analysis, prediction, immunology]
tags: [MHCflurry, MHC class I, 펩타이드, 면역원성, 백신개발, 암면역치료, IC50]
description: "MHCflurry는 MHC class I 분자와 펩타이드 간의 결합 친화도(면역원성)를 예측하는 머신러닝 모델입니다."
slug: mhcflurry-peptide-binding-prediction
---

## 목적

MHC class I 분자와 펩타이드의 결합 친화도(IC50)를 예측하여 면역원성 분석에 활용

## 작동 원리

- IEDB 기반의 대규모 MHC-펩타이드 결합 데이터셋을 allele 단위로 학습
- 펩타이드 서열을 다층 퍼셉트론(MLP) 모델로 처리하여 결합 친화도 회귀 예측
- 추가적으로 presentation 효율까지 추정 가능

## 용도

- **백신 개발**: 항원 후보 펩타이드 발굴
- **암 면역치료**: 환자 맞춤형 신생 항원 서열 예측
- **치료제 개발**: 치료제의 면역원성 여부 및 유발 부위 예측

## 차별 포인트

- MHC allele별 결합 가능성을 정밀하게 예측 가능
- 단순 결합 예측뿐 아니라 pMHC presentation 효율까지 추정 가능
- 다양한 allele(HLA-A, HLA-B, HLA-C 계열)에 적용 가능

## 비교해 볼 만한 모델

- **MixMHCPred**: mass spec 데이터 기반 presentation 예측에 특화 (유료)
- **NetMHCIIpan**: MHC class II 펩타이드 결합 예측에 특화 (유료)

## 연계해 볼 만한 모델

- **tcrmodel2**: peptide-MHC complex 구조 예측
- **RFdiffusion**: 예측된 pMHC를 기반으로 TCR 결합부위 디자인
- **ProteinMPNN**: 디자인된 구조에 맞는 서열 생성
- **Immunebuilder**: TCR 구조 재구성
- 최종적으로 TCR-pMHC complex 모델링 및 단계별 비교 가능

## 사용 방법

### 입력
* **펩타이드 서열** (FASTA 포맷)

### 출력
* 예측된 결합 친화도 (IC50 값)

### 설정 옵션
* **Allele 선택**: 기본값 HLA-A*02:01
  * 지원하는 주요 allele:
    * HLA-A 계열: A02:01, A01:01, A03:01, A24:02
    * HLA-B 계열: B07:02, B08:01, B15:01, B44:02, B57:01
    * HLA-C 계열: C04:01, C07:02

### 사용 링크
* [MHCflurry 사용하러 가기](https://curie.kr:444/Analysis/mhcflurry)