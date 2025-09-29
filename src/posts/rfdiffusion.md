---
layout: post
title: "RFdiffusion : Diffusion 기반 단백질 구조 설계 모델"
description: "Binder, pocket, motif, oligomer 등 다양한 제약조건을 반영하여 단백질 구조를 설계하는 Diffusion 기반의 SOTA 단백질 생성 모델입니다."
categories: [분석 모델]
tags: [RFdiffusion, 단백질 설계, Diffusion Model, De Novo Design, 단백질 구조 생성]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---
## 개요
---
RFdiffusion은 diffusion 기반 단백질 구조 생성/설계 모델입니다. Binder, pocket, motif, oligomer 등 다양한 제약조건을 반영하여 단백질을 설계할 수 있습니다. 현존하는 단백질 생성 도구 중 가장 범용성과 확장성이 큰 SOTA로 평가됩니다.

## 작동 원리
---
Diffusion 구조를 바탕으로 무작위 노이즈에서 시작하여 denoising을 하면서 점진적으로 원하는 구조를 만들어갑니다.
다양한 제약 조건에서 단백질을 설계할 수 있는 서브 모듈들로 구성되어 있습니다.

| 서브 모듈이름 | 기능 | 활용 예시 | 유사 모듈 |
| :--- | :--- | :--- | :--- |
| Binder design | Binder 단백질 설계 | 항체, PPI 억제제 설계 | ProteinMPNN |
| Ligand binding pocket design | Pocket 생성 | 효소 활성 부위 설계 | PocketGen |
| Motif scaffolding | Scaffold redesign(motif 고정) | Epitope embedding | - |
| Oligomer design | Oligomer 생성 (대칭 구조) | Protein self-assembly | |
| Partial design | 부분 구조 inpainting | Domain 손상 복원 | Alphafill (이온) |
| Unconditional generation | de novo generation | 새로운 scaffold 디자인 | Chai-1, Boltz-2 |

## 입력・출력・설정 옵션
---

| 서브모듈 | 입력 | 설정 옵션 | 출력                        |
| :--- | :--- | :--- |:--------------------------|
| **Binder design** | 단백질 구조 (PDB 포맷) | - Contigs (바인더가 붙을 영역)<br>- Noise scale (Cα)<br>- Noise scale (Structure)<br>- Number of designs | 생성된 binder 구조 (PDB)       |
| **Ligand binding pocket design** | 리간드가 결합한 단백질 구조 (PDB 포맷) | - Contigs (어디에 포켓을 만들지?)<br>- Guide Scale (수치가 높을수록 자유도 올라감)<br>- Guiding Potentials (R) - 당기는 힘 작용하는 거리 cutoff<br>- Guiding Potentials (S) - 당기는 힘의 세기<br>- Guiding Potentials (Repulsive R) - 미는 힘 작용하는 거리 cutoff<br>- Guiding Potentials (Repulsive S) - 미는 힘의 세기<br>- Guiding Potentials (Repulsive Min) - 이 거리보다 가까우면 안됨<br>- Number of Designs | Pocket이 만들어진 단백질 구조 (PDB) |
| **Motif scaffolding** | 단백질 구조 (PDB 포맷) | - Contigs - 남길 영역 (motif), 만들 영역 (scaffold)<br>- Inpaint sequence (리디자인하고 싶은 motif)<br>- Length (전체 단백질 길이 제약)<br>- Number of Designs | 새롭게 생성된 구조 (PDB)          |
| **Oligomer design** | - | - 대칭 정보 (C6, C4, D2, tetrahedral)<br>- Guide Scale (수치가 높을수록 자유도 올라감)<br>- weight intra (intrachain interaction 강도)<br>- weight inter (interchain interaction 강도)<br>- Decay (상수, 1차식, 2차식, 3차식)<br>- Number of Designs | 생성된 Oligomer 구조 (PDB)     |
| **Partial design** | 단백질 구조 (PDB 포맷) | - Contigs - 리디자인 하고자하는 영역<br>- Partial diffusion step - 수치가 높을수록 더 적극적으로 수정<br>- Redesign sequence - 서열까지 변경하여 만들어줌<br>- Number of Designs | 생성된 구조 (PDB)              |
| **Unconditional generation** | - | - Contigs (설계하고자 하는 길이)<br>- Number of Designs |  생성된 구조                   |

## 용도・차별 포인트
---

**용도** :
- 사용자가 원하는 제약조건을 만족하는 모든 종류의 단백질을 설계할 수 있습니다.
- 합성생물학의 영역에서도 다양한 접근이 가능한데 예를 들어 새로운 효소를 설계하거나, 캐리어로 사용할 수 있는 self-assembly 단백질을 만드는 방식으로도 활용할 수 있습니다.

**차별 포인트** :
- 현존하는 단백질 생성 도구 중 가장 범용성과 확장성이 큰 SOTA 모델로 평가됩니다.

## 비교해 볼만한 모델
---
- PocketGen은 pocket에 특화하여 특정 ligand에 최적화된 pocket을 설계할 수 있습니다. RFdiffusion이 제공하는 기능 중에서도 유사한 기능이 존재합니다.

## 연계해 볼 만한 모델
---

- RFdiffusion은 기본적으로 단백질의 구조를 만들어주는 모델이고, 정확한 서열은 아직 부여되지 않은 상태입니다. ProteinMPNN과 같은 도구들은 RFdiffusion을 통해서 만들어낸 구조에 대하여 최적화된 아미- 노산 서열을 부여해줄 수 있습니다.
- De novo로 생성된 구조들의 동적 안정성을 확인하기 위해서는 Bioemu와 같은 도구들을 사용해볼 수 있습니다.

---

[tool-button:RFdiffusion]