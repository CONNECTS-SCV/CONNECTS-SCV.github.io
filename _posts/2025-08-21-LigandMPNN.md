---
layout: post
title: "LigandMPNN 리간드 결합 최적화 도구"
description: >
  LigandMPNN은 특정 리간드에 대해 단백질의 결합 부위를 최적화하는 Message Passing Neural Network(MPNN) 기반 모델입니다. 구조 기반 단백질 설계에 활용됩니다.
categories:
  - analysis
  - structure
  - prediction
tags: [LigandMPNN, 단백질-리간드 결합, 단백질 설계, MPNN, 구조 기반 최적화, 생물정보학, 구조생물학]
author: author
---

## 🔬 LigandMPNN이란?

**LigandMPNN**은 특정 **리간드에 잘 결합할 수 있도록 단백질의 결합 부위 서열을 최적화**해주는 구조 기반 단백질 설계 도구입니다.  
단백질-리간드 상호작용을 **MPNN(Message Passing Neural Network)** 기반으로 모델링하여, 리간드 친화력을 높이는 방향으로 아미노산 서열을 조정합니다.

> MPNN은 **원자들을 노드(node)**로, **결합을 엣지(edge)**로 간주한 **분자 그래프**를 입력받아 메시지를 전달하며 학습합니다.

> LigandMPNN은 아미노산을 node로 보고, 결합 거리 또는 각도를 edge로 사용합니다 (구현에 따라 차이 있음).

### 관련 모델들
- **ThermoMPNN**: 단백질 안정성 예측 및 돌연변이 설계
- **ProteinMPNN**: de novo 단백질 서열 생성
- **HyperMPNN**: 고차원 구조 특성 반영 MPNN 확장 모델

## 🧪 우리 플랫폼에서 어떻게 제공되나요?

우리 플랫폼에서는 **LigandMPNN을 직관적인 UI로 제공합니다.**  
복잡한 구조 파일 전처리 없이, **단백질-리간드 복합체 구조(PDB) 업로드**만으로 서열 최적화를 수행할 수 있습니다.

- 단백질과 리간드의 상호작용 구간 자동 추출
- 결합 부위 아미노산 서열 최적화
- 결과 서열 및 3D 구조 시각화 제공

## 📝 사용 방법 안내

### 1. 작업 이름 지정
```plaintext
Job Name: LigandMPNN_design1
````

### 2. 입력 방식 선택

* 단백질-리간드 복합체의 **PDB 파일 업로드**
* 리간드는 PDB 내 별도 chain 또는 ligand code로 지정

### 3. 파라미터 설정

| 옵션            | 설명                       |
| ------------- | ------------------------ |
| Target ligand | 결합 최적화를 원하는 리간드 지정       |
| Design region | 최적화할 잔기 범위 (자동/수동 지정 가능) |
| Sampling size | 생성할 서열 수 (기본: 10)        |

### 4. 결과 확인

* **최적화된 서열 목록** 제공
* **결합 에너지 예측값** 및 서열 다양성 지표
* 3D 시각화 뷰어에서 구조 확인 가능

## 🧬 분석 결과 활용 예시

* **단백질-리간드 친화력 향상을 위한 서열 설계**
* **스캐폴드 단백질에 특정 리간드 부착 기능 부여**
* **약물 전달용 나노 단백질 설계**
* **효소-기질 특이성 향상 설계**

## ⚠️ 주의사항

| 항목     | 내용                             |
| ------ | ------------------------------ |
| 입력 형식  | 단백질-리간드 복합체 PDB 필수             |
| 리간드 정보 | PDB 내 정의 필요 (HETATM, chain 등)  |
| 디자인 범위 | 너무 넓을 경우 시간 오래 걸릴 수 있음         |
| 결과 해석  | 점수는 상호작용 친화력의 추정치일 뿐, 실험 검증 필요 |

## 🔗 다른 도구와 연계 가능

* **Boltz**: Diffusion 기반 구조 생성 모델 → 구조 예측 기반 LigandMPNN 입력 준비
* **Themompnn**: 안정성 예측 → 결합력과 안정성 동시 최적화 가능
* **ProteinMPNN**: 비결합 영역 포함 전체 서열 디자인

## ✅ 마무리

LigandMPNN은 단백질-리간드 결합 부위의 정밀한 서열 최적화를 가능하게 하는 혁신적인 구조 기반 설계 도구입니다.

> 지금 바로 <a href="#" onclick="window.open('https://scv.bio/Analysis/ligandmpnn', '_blank'); return false;" rel="noopener noreferrer">LigandMPNN 분석 페이지</a>에서 직접 사용해보세요!
