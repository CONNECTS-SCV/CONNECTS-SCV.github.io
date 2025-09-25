---
title: "LigandMPNN: 단백질-리간드 결합 최적화 도구"
author: author1
date: 2024-12-20
categories: [analysis, structure, prediction]
tags: [LigandMPNN, 단백질설계, 리간드최적화, 단백질-리간드, MPNN, 단백질구조예측, 단백질공학, 약물디자인]
description: "LigandMPNN은 단백질이 특정 리간드에 더 잘 결합할 수 있도록 결합 부위의 서열을 최적화하는 MPNN 기반 모델입니다."
slug: ligandmpnn-protein-ligand-optimization
---

## 목적

단백질이 특정 리간드에 더 잘 결합할 수 있도록 결합 부위의 아미노산 서열 최적화

## 작동 원리

- MPNN(Message Passing Neural Network) 구조 기반
- 단백질-리간드 복합체의 상호작용을 그래프 구조로 학습
- ProteinMPNN을 기반으로 리간드 결합력 고려한 확장 모델

## 용도

- **효소 공학**: 효소-cofactor 결합 친화도 최적화
- **약물 개발**: 약물 후보와 결합하는 단백질 서열 설계
- **리간드 특이적 단백질 디자인**: ATP, NADH, 금속 이온 등과의 상호작용 최적화

## 차별 포인트

- 리간드와의 결합력을 고려한 서열 설계
- 복잡한 파라미터 설정 없이 기본 최적화 수행 가능
- 서열 자체를 설계한다는 점에서 다른 모델들과 차별화

## 비교해 볼 만한 모델

- **ADFLIP**: 고정된 서열에서 conformation 최적화
- **DiffDock**: 단백질 고정, 리간드 위치 최적화
- **Antifold**: 항체-리간드 상호작용 특화 모델

## 연계해 볼 만한 모델

- **Boltz/Chai**: 단백질+리간드로 복합체 생성
- **RFdiffusion**: rough 설계 후 LigandMPNN으로 미세조정
- **AlphaFold2**: 최적화된 서열로 구조 예측
- **DiffDock**: 리간드 pose 탐색 후 서열 최적화
- **AutoDock**: 서열 변경 전후 docking score 비교

## 사용 방법

### 입력
* **복합체 구조 파일** (PDB 형식)
* 단백질과 리간드가 결합된 구조 필요

### 출력
* 최적화된 후보 단백질 서열
* 각 서열에 대한 결합 점수 (score)

### 설정 옵션
* **Pack side chains 재설정 강도**: 1-10 범위 (값이 클수록 광범위한 재설정)
* **Number of Packs per Design**: 생성할 후보 서열 수
* **Fixed residues**: 고정할 잔기 지정 (예: A45,A78,B12)

### 주의사항
* 입력 파일은 단백질-리간드 복합체 구조여야 함
* 고정 잔기 지정 시 체인과 잔기 번호 명확히 확인
* AlphaFold2 등으로 결과 검증 권장

### 사용 링크
* [LigandMPNN 사용하러 가기](https://curie.kr:444/Analysis/ligandmpnn)