---
title: "DeepFRI: 단백질 기능 및 중요 잔기 예측 도구"
author: author1
date: 2024-12-20
categories: [analysis, prediction, sequence, structure]
tags: [DeepFRI, 단백질기능예측, 잔기중요도분석, saliency-map, GCN, LSTM, GO-term, EC-number]
description: "DeepFRI는 단백질의 기능을 예측하고 동시에 해당 기능에 관여하는 핵심 잔기들을 식별하는 딥러닝 기반 도구입니다."
slug: deepfri-protein-function-residue-prediction
---

## 목적

단백질의 기능(GO term, EC number) 예측과 기능 관련 중요 잔기 식별

## 작동 원리

- GCN(Graph Convolutional Networks)과 LSTM 결합 모델
- Uniprot와 GO term annotation 데이터 기반 학습
- 구조와 서열 정보를 통합한 기능 예측

## 용도

- **신규 단백질 기능 예측**: annotation이 부족한 단백질의 기능 탐색
- **돌연변이 영향 분석**: 변이가 중요 잔기에 발생했는지 판단
- **신약 개발 초기 연구**: 효소 활성 부위 및 상호작용 hotspot 탐색

## 차별 포인트

- 기능 예측과 동시에 관련 잔기 식별
- Saliency heatmap과 3D 구조 시각화 제공
- 서열 및 구조 기반 분석 모두 지원

## 비교해 볼 만한 모델

- **InterProScan**: 도메인 기반 기능 예측
- **COFACTOR**: 구조 기반 기능 예측
- **Deeprank2**: 잔기 중요도 분석

## 연계해 볼 만한 모델

- **Mutabind2**: 돌연변이 영향 분석
- **DLKcat**: 효소 활성 예측
- **RFdiffusion**: 기능 부위 기반 구조 디자인

## 사용 방법

### 입력
* **단백질 구조 파일** (PDB 형식)
* **단백질 서열** (FASTA 또는 plain text)

### 출력
* 예측된 GO term 및 EC number 리스트
* 각 예측에 대한 prediction score (0~1)
* Saliency heatmap 및 3D 구조 시각화

### 설정 옵션
* **-ont**: GO ontology 선택
  * BP: 생물학적 과정
  * MF: 분자 기능
  * CC: 세포 구성 요소

### 주의사항
* 구조와 서열 모두 필요
* Prediction score는 상대적 기준
* 기능 검증은 추가 실험 필요
* 단독 사용보다 보조 도구로 활용 권장

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/deepfri?from=blog', '_blank'); return false;">DeepFRI 사용하러 가기</a>