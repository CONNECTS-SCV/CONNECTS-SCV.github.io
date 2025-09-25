---
title: "Bioemu: 빠르고 정확한 단백질 구조 샘플링 도구"
author: author1
date: 2024-12-20
categories: [analysis, prediction, structure]
tags: [Bioemu, 단백질구조예측, diffusion-model, MD-에뮬레이터, 빠른시뮬레이션, 구조샘플링]
description: "Bioemu는 단백질 서열만으로 열역학적으로 안정한 구조를 빠르게 생성할 수 있는 Diffusion 기반 시뮬레이션 도구입니다."
slug: bioemu-protein-structure-sampling
---

## 목적

단백질 아미노산 서열로부터 열역학적으로 안정한 구조를 빠르게 생성

## 작동 원리

- Diffusion 기반 구조 예측 모델
- MD 시뮬레이션처럼 시간 축을 따라가지 않고 동적 평형 상태 샘플링
- Representative 구조들을 빠르게 생성하여 다양성 확보

## 용도

- **약물 결합 포켓 탐색**: 구조 다양성 기반으로 포켓 형태 확인
- **기능적 도메인 구조 변화**: 상태 간 이동 구조 빠르게 포착
- **MD 보조용**: 초기 구조 확보 후 GROMACS 등에서 정밀 시뮬레이션
- **돌연변이 안정성 비교**: WT vs Mutant의 구조 다양성 비교

## 차별 포인트

- MD 시뮬레이션의 정확성과 딥러닝의 속도 결합
- 복잡한 파라미터 설정 불필요
- PDB와 xtc 포맷으로 구조 trajectory 제공

## 비교해 볼 만한 모델

- **AlphaFold**: 단일 구조 예측에 특화
- **RoseTTAFold**: 빠른 구조 예측
- **MD 시뮬레이션**: 더 정밀하나 시간 소요 많음

## 연계해 볼 만한 모델

- **HPacker**: side-chain 복원
- **GROMACS**: 안정화 및 시뮬레이션 확장
- **DiffDock**: 생성된 구조에 리간드 도킹

## 사용 방법

### 입력
* **단백질 아미노산 서열** (길이 500 이하 권장)

### 출력
* PDB 구조 파일
* 구조 샘플링 trajectory 파일 (xtc)

### 설정 옵션
* **샘플 수**: 생성할 구조의 개수 (예: 10개 샘플 중 가장 안정한 구조 선택)

### 제한사항
* 단일 단백질(monomer)만 가능
* Ligand 결합 불가 (apo 상태만 지원)
* 온도, pH, 전기장 등 환경 변수 반영 안 됨
* Backbone만 예측 (side-chain은 별도 복원 필요)

### 사용 링크
* [Bioemu 사용하러 가기](https://curie.kr:444/Analysis/bioemu)