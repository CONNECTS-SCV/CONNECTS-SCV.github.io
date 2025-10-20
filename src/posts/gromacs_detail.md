---
layout: post
title: "GROMACS : Lysozyme in Water"
description: "계란 흰자 라이소자임(hen egg white lysozyme)을 이용한 GROMACS의 기본적인 구조 전처리 및 시뮬레이션 튜토리얼"
categories: [analysis]
tags: [GROMACS, Lysozyme, Molecular Dynamics, Simulation, 1AKI]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/gromacs_1.webp"
---

![lysozyme](/image/info/detail/gromacs_1.webp){center:400}[http://www.mdtutorials.com/gmx/lysozyme]

이 글에서는 GROMACS를 처음 접하신 분들도 따라 하실 수 있도록 계란 흰자 라이소자임(hen egg white lysozyme, PDB 코드: 1AKI)을 이용해 기본적인 구조 전처리 과정을 함께 진행해보겠습니다.

이 과정은 [GROMACS 공식 튜토리얼](http://www.rcsb.org/pdb/home/home.do)을 바탕으로 하되 제가 직접 실습하며 정리한 블로그형 튜토리얼입니다.

그래서 초보자분들도 명령어 하나하나를 왜 쓰는지 이해할 수 있도록 자세히 설명드릴게요.

# 1 사용된 도구

---

- **GROMACS**: 분자 동역학 시뮬레이션을 수행하여 단백질, 리간드, 물질의 원자 수준 움직임을 계산하는 프로그램
- **XMGRACE**: 데이터 파일(.xvg)을 그래프로 시각화하는 과학용 플로팅(Plotting) 도구

# 2 GROMACS 설치 방법

-----

자세한 설치 방법은 아래 튜토리얼을 참고하세요.

- [GROMACS : GPU 버전 설치 튜토리얼 (Ubuntu)](https://www.google.com/search?q=%EB%A7%81%ED%81%AC/%EC%A3%BC%EC%86%8C)

# 3 Lysozyme in Water : 시스템 준비

-----

## 3.1 Step One: Prepare the Topology

### PDB 구조 다운로드

먼저 RCSB PDB 사이트([https://www.rcsb.org](https://www.rcsb.org))에서 **1AKI (Hen Egg White Lysozyme)** 구조 파일을 다운로드합니다.

다운로드한 파일(`1aki.pdb`)은 PyMOL, Chimera, 또는 VMD 같은 분자 시각화 프로그램으로 열어보세요.

분자 전체를 한 번 훑어보며 어떤 구조인지 감을 잡아보는 게 좋습니다.

### 결정수(물 분자) 제거하기

결정 구조에는 종종 결정화 과정에서 생긴 물 분자(HOH)가 포함되어 있습니다.

시뮬레이션에서는 불필요하므로 제거해주는 게 좋아요.

```bash
grep -v HOH 1aki.pdb > 1AKI_clean.pdb
```

이 명령은 `HOH`라는 문자열이 포함된 줄을 제외하고(`-v` 옵션), 새로운 파일(`1AKI_clean.pdb`)로 저장합니다.

결과적으로 물 분자가 모두 제거된 깨끗한 구조 파일이 만들어집니다.

### 누락된 원자(MISSING) 확인하기

이제 PDB 파일을 텍스트 에디터로 열어보면 상단 근처에 `"MISSING"`이라는 주석이 있을 수 있습니다.

이 부분은 결정 구조에 포함되지 않은 원자나 잔기(residue)를 알려줍니다. 예를 들어, 일부 곁사슬 원자나 말단 잔기가 누락된 경우가 종종 있습니다. 이런 누락된 부분은 GROMACS만으로는 자동 복원되지 않기 때문에 필요하다면 **Modeller**, **PyMOL** 등의 프로그램을 이용해 모델링을 추가로 해줘야 합니다.

### `pdb2gmx`로 토폴로지 생성하기

이제 가장 중요한 단계인 **토폴로지(topology) 생성**을 진행하겠습니다.

이 과정을 통해 GROMACS는 분자 내 결합 관계, 전하, 원자 유형 등 시뮬레이션에 필요한 모든 정보를 갖게 됩니다.

```bash
gmx pdb2gmx -f 1AKI_clean.pdb -o 1AKI_processed.gro -water tip3p
```

이 명령을 실행하면, GROMACS가 다음과 같은 세 가지 파일을 생성합니다.

- **`topol.top`** — 시스템의 토폴로지(힘장, 결합, 각도 등 정보)
- **`posre.itp`** — 무거운 원자 위치를 고정하기 위한 위치 제한 파일
- **`1AKI_processed.gro`** — GROMACS 형식으로 변환된 좌표 파일

### 힘장(force field) 선택하기

명령을 실행하면 아래와 같이 **포스필드 선택 메뉴**가 나타납니다.

```text
Select the Force Field:
From '/usr/local/gromacs/share/gromacs/top':
 1: AMBER03 protein, nucleic AMBER94 (Duan et al., J. Comp. Chem. 24, 1999-2012, 2003)
 2: AMBER94 force field (Cornell et al., JACS 117, 5179-5197, 1995)
 3: AMBER96 protein, nucleic AMBER94 (Kollman et al., Acc. Chem. Res. 29, 461-469, 1996)
 4: AMBER99 protein, nucleic AMBER94 (Wang et al., J. Comp. Chem. 21, 1049-1074, 2000)
 5: AMBER99SB protein, nucleic AMBER94 (Hornak et al., Proteins 65, 712-725, 2006)
 6: AMBER99SB-ILDN protein, nucleic AMBER94 (Lindorff-Larsen et al., Proteins 78, 1950-58, 2010)
 7: AMBERGS force field (Garcia & Sanbonmatsu, PNAS 99, 2782-2787, 2002)
 8: CHARMM27 all-atom force field (CHARM22 plus CMAP for proteins)
 9: GROMOS96 43a1 force field
10: GROMOS96 43a2 force field (improved alkane dihedrals)
11: GROMOS96 45a3 force field (Schuler JCC 2001 22 1205)
12: GROMOS96 53a5 force field (JCC 2004 vol 25 pag 1656)
13: GROMOS96 53a6 force field (JCC 2004 vol 25 pag 1656)
14: GROMOS96 54a7 force field (Eur. Biophys. J. (2011), 40,, 843-856, DOI: 10.1007/s00249-011-0700-9)
15: OPLS-AA/L all-atom force field (2001 aminoacid dihedrals)
```

각 항목은 서로 다른 힘장(force field)을 의미하며 단백질이나 핵산의 물리적 특성을 계산하는 방식이 조금씩 다릅니다.

이 튜토리얼에서는 **CHARMM36 포스필드**를 사용합니다. 공식 튜토리얼에서는 옵션 “9”로 표시되어 있지만 환경에 따라 다르게 표시될 수 있습니다.

### 유용한 옵션들 (선택 사항)

`pdb2gmx` 명령에는 다음과 같은 자주 쓰이는 옵션들이 있습니다:

- **`ignh`**: PDB에 포함된 수소 원자를 무시하고 새로 생성합니다. (특히 NMR 구조에는 수소 이름이 다르게 되어 있어 유용합니다.)
- **`ter`**: N-말단과 C-말단의 전하 상태를 직접 지정할 수 있습니다. (예: 양전하형 NH₃⁺, 음전하형 COO⁻ 등)
- **`inter`**: Glu, Asp, Lys, Arg, His 등의 잔기에 대한 전하 상태를 물어봅니다. 또한 이황화 결합을 형성할 Cys 잔기도 선택할 수 있습니다.

### 생성된 파일 살펴보기

명령이 끝나면 세 가지 주요 파일이 만들어집니다:
| 파일 이름 | 설명 |
|---|---|
| **`1AKI_processed.gro`** | GROMACS 전용 좌표 파일 (모든 원자 포함) |
| **`topol.top`** | 전체 시스템의 토폴로지 정보 |
| **`posre.itp`** | 위치 제한용 원자 리스트 |

참고로 `.gro` 파일은 좌표 정밀도가 제한적이라 좀 더 가독성이 높은 `.pdb` 형식을 원하신다면 출력 파일 이름에 `.pdb` 확장자를 지정하면 됩니다.

## 3.2 Step Two: Examine the Topology

### 파일을 열어보기

먼저 텍스트 편집기(예: VSCode, nano, vim 등)로 `topol.top` 파일을 열어보세요.

맨 위쪽에는 `;`로 시작하는 여러 줄의 주석이 보일 겁니다.

```text
#include "charmm36.ff/forcefield.itp"
```

이 줄은 \*\*CHARMM36 힘장(force field)\*\*을 불러오는 코드예요. 즉, 이후 나오는 모든 매개변수(전하, 결합 상수 등)는 이 `forcefield.itp` 파일에 정의된 CHARMM36 데이터에 기반해 계산된다는 뜻입니다.

### [ moleculetype ] — 분자 유형 정의

조금 아래로 내려보면 이런 부분이 있을 거예요.

```text
[ moleculetype ]
; Name            nrexcl
Protein_chain_A     3
```

여기서 `Protein_chain_A`는 PDB 파일에서 단백질이 “A 사슬(chain A)”로 지정되어 있었다는 뜻이에요. 즉, “이 분자 이름은 `Protein_chain_A`로 하자”라는 정의입니다. 옆의 숫자 `3`은 **nrexcl** 값으로 결합된 이웃 원자들 중 몇 번째까지의 상호작용을 제외할지를 나타냅니다.

### [ atoms ] — 원자 정보 표

이제 토폴로지의 핵심 부분으로 내려가면 **단백질을 구성하는 모든 원자에 대한 정보**가 표로 정리되어 있습니다.

```text
[ atoms ]
;   nr       type  resnr residue  atom   cgnr     charge       mass  typeB    chargeB      massB
; residue   1 LYS rtp LYS  q +2.0
     1        NH3      1    LYS      N      1       -0.3     14.007
     2         HC      1    LYS     H1      2        0.33     1.008
     3         HC      1    LYS     H2      3        0.33     1.008
     4         HC      1    LYS     H3      4        0.33     1.008
     5        CT1      1    LYS     CA      5        0.21    12.011
     6        HB1      1    LYS     HA      6        0.10     1.008
```

- **nr** → 원자 번호. 각 분자에서 1번부터 순서대로 번호가 매겨집니다.
- **type** → 원자 유형. 어떤 원소이며, 어떤 Lennard-Jones 매개변수를 가지는지를 결정합니다.
- **resnr / residue** → 아미노산 잔기 번호와 이름. 예를 들어 “1번 잔기 LYS(라이신)”처럼 표시됩니다.
- **atom** → 원자 이름 (예: N, CA, HA 등).
- **cgnr** → 전하 그룹 번호. 부분 전하를 묶는 단위로, GROMACS가 전하를 계산할 때 사용합니다.
- **charge** → 각 원자에 할당된 부분 전하(단위: e).
- **mass** → 원자의 질량(단위: amu).
- **typeB, chargeB, massB** → 자유에너지 섭동(FEP) 시뮬레이션용으로 일반적인 MD에서는 신경 쓰지 않아도 됩니다.

즉, `[ atoms ]` 섹션은 “단백질의 모든 원자 사전”이라고 생각하면 됩니다. 각 원자가 어떤 역할을 하는지, 어떤 힘으로 작용하는지를 이 표에서 정의하죠.

### 위치 제한(Position restraint)

조금 더 내려가면 이런 부분이 보일 겁니다.

```text
; Include Position restraint file
#ifdef POSRES
#include "posre.itp"
#endif
```

이 코드는 **`posre.itp` 파일을 불러오는 부분**입니다. 이 파일은 무거운 원자(heavy atom)들이 평형화 단계에서 너무 크게 움직이지 않도록 “자리 고정”을 하는 역할을 합니다. `#ifdef POSRES`는 GROMACS의 조건문 구문이에요. 즉, 나중에 `define = -DPOSRES` 옵션을 줬을 때만 이 위치 제한이 실제로 적용되도록 설정한 겁니다.

### 물 분자와 이온 정의

단백질 다음에는 용매(물)와 이온에 대한 정의가 이어집니다.

```text
; Include water topology
#include "charmm36.ff/tip3p.itp"

#ifdef POSRES_WATER
; Position restraint for each water oxygen
[ position_restraints ]
;  i funct       fcx        fcy        fcz
   1    1       1000       1000       1000
#endif
```

여기서 `tip3p.itp`는 우리가 `-water tip3p` 옵션으로 선택했던 **TIP3P 물 모델**을 불러옵니다.

`POSRES_WATER` 구문은 물 분자의 산소 원자에도 위치 제한을 걸 수 있도록 해주는 부분이에요.

기본적으로 1000 kJ mol⁻¹ nm⁻²의 강한 스프링 상수를 사용합니다.

그 다음은 이온입니다.

```text
; Include generic topology for ions
#include "charmm36.ff/ions.itp"
```

이 줄은 **Na⁺**, **Cl⁻ 등 기본적인 이온 파라미터를** 가져오는 코드입니다. 이 파일은 나중에 시스템을 중화시킬 때 자동으로 사용됩니다.

### [ system ], [ molecules ] — 전체 시스템 정의

마지막 부분은 시뮬레이션 전체를 정의하는 섹션입니다.

```text
[ system ]
; Name
LYSOZYME

[ molecules ]
; Compound        #mols
Protein_chain_A     1
```

여기서 `[ system ]`은 단순히 시뮬레이션의 이름을 지정하는 곳이에요. 여기서는 `LYSOZYME`이라고 적혀 있습니다. 그 아래의 `[ molecules ]`는 시스템 안에 어떤 분자가 몇 개 들어있는지를 나열합니다. 현재는 단백질 하나만 있으므로 `Protein_chain_A     1`로 되어 있죠.

## 3.3 Step Three: Defining the Unit Cell & Adding Solvent

### 상자 정의하기 (`editconf`)

시뮬레이션을 진행할 때 단백질이 ‘상자 안에 들어 있는 것처럼’ 취급됩니다. 이 상자를 단위 셀(unit cell)이라고 부르며 상자의 형태는 시뮬레이션의 효율과 계산량에 큰 영향을 줍니다.

이번 튜토리얼에서는 단순하게 **정육면체(cubic)** 상자를 사용할 거예요. 나중에 조금 더 익숙해지면, **마름모 십이면체(truncated octahedron)** 같은 형태를 써서 더 효율적으로 계산할 수도 있습니다.

```bash
gmx editconf -f 1AKI_processed.gro -o 1AKI_newbox.gro -c -d 1.2 -bt cubic
```

| 옵션 | 의미 |
|---|---|
| `-f 1AKI_processed.gro` | 입력 파일 (전 단계에서 만든 단백질 구조) |
| `-o 1AKI_newbox.gro` | 출력 파일 이름 |
| `-c` | 단백질을 상자의 정중앙에 배치 |
| `-d 1.2` | 단백질과 상자 벽 사이의 최소 거리 = 1.2 nm |
| `-bt cubic` | 상자 형태를 정육면체로 지정 |

즉, 단백질이 상자의 중심에 위치하고 모든 방향으로 상자 벽까지 최소 1.2 nm 떨어져 있게 설정한 것입니다. 이 간격(1.2 nm × 2 = 2.4 nm)은 대부분의 **비결합 상호작용 cutoff 거리**(예: 1.0 nm, 1.2 nm)에 충분한 여유를 둡니다.

### 상자에 물 채우기 (`solvate`)

이제 상자가 정의되었으니, 그 안을 물로 채워야 합니다. 이를 용매화(solvent filling)라고 부릅니다.

이 작업은 GROMACS의 `solvate` 명령으로 수행합니다.

```bash
gmx solvate -cp 1AKI_newbox.gro -cs spc216.gro -o 1AKI_solv.gro -p topol.top
```

옵션별로 설명드릴게요.

| 옵션 | 설명 |
|---|---|
| `-cp 1AKI_newbox.gro` | 단백질이 들어 있는 박스 (이전 단계 출력) |
| `-cs spc216.gro` | 기본 제공되는 물 박스 템플릿 |
| `-o 1AKI_solv.gro` | 물이 채워진 최종 출력 파일 |
| `-p topol.top` | 토폴로지 파일을 업데이트하도록 지정 |

여기서 `spc216.gro`는 GROMACS에 기본 포함된 표준 3점(3-point) 물 모델이에요. 이 모델은 TIP3P, SPC, SPC/E 등과 호환되며, 대부분의 단백질 시뮬레이션에서 안정적으로 사용됩니다.

즉, GROMACS는 `spc216.gro`를 이용해 상자에 물 분자를 복제·배치하고 단백질과 겹치는 물은 자동으로 제거하면서 상자를 꽉 채운 새로운 파일 `1AKI_solv.gro`를 만들어줍니다.

### 토폴로지(topol.top) 파일 업데이트 확인

`solvate`가 물 분자를 추가했기 때문에 토폴로지 파일(topol.top)에도 그 정보가 자동으로 반영됩니다. 파일 맨 아래쪽 **`[ molecules ]`** 섹션을 열어보세요.

```text
[ molecules ]
; Compound        #mols
Protein_chain_A     1
SOL             12596
```

보이시죠?

이제 **단백질 1개 + 물 분자 12,596개**가 시스템 안에 포함되어 있습니다. 이 숫자는 시스템 크기와 상자 간격(`-d` 값)에 따라 달라집니다. 즉, `solvate` 명령은 **새로운 물 분자의 개수를 자동 계산하여
topol.top에 추가 기록**해주는 친절한 친구예요.

## 3.4 Step Four: Adding Ions

### genion을 사용하기 위한 준비: .tpr 파일 만들기

`genion` 명령은 이온을 직접 추가하지 않고 먼저 시스템의 “원자 단위 정보”를 담은 **.tpr 파일**을 필요로 합니다. 이 `.tpr` 파일은 GROMACS의 전처리기인 **grompp** (GROMACS PreProcessor)가 만들어 줍니다. grompp는 다음 세 가지 입력을 조합해 `.tpr` 파일을 생성합니다:

| 입력 파일 | 역할 |
| --- | --- |
| `.mdp` | 시뮬레이션 매개변수 (cutoff, step size 등) |
| `.gro` | 좌표 파일 (우리의 단백질+용매 구조) |
| `.top` | 토폴로지 파일 (힘장 및 분자 정보) |

이 세 가지를 합쳐서 grompp는 **완전한 시스템 설명 파일 (ions.tpr)** 을 만들어주는 거예요.

### ions.mdp 파일 만들기

먼저 아래 내용을 복사해 `ions.mdp`라는 이름으로 저장하세요.

```text
; ions.mdp - used as input into grompp to generate ions.tpr
; Parameters describing what to do, when to stop and what to save
integrator  = steep         ; Algorithm (steepest descent minimization)
emtol       = 1000.0        ; Stop minimization when the maximum force < 1000.0 kJ/mol/nm
emstep      = 0.01          ; Minimization step size
nsteps      = 50000         ; Maximum number of (minimization) steps to perform

; Parameters describing how to find neighbors and calculate interactions
nstlist         = 1         ; Frequency to update neighbor list
cutoff-scheme   = Verlet    ; Buffered neighbor searching
ns_type         = grid      ; Method for neighbor list
coulombtype     = cutoff    ; Short-range electrostatics treatment
rcoulomb        = 1.0       ; Electrostatics cut-off (nm)
rvdw            = 1.0       ; Van der Waals cut-off (nm)
pbc             = xyz       ; Periodic Boundary Conditions in all 3 dimensions
```

이 파일은 아주 간단한 **에너지 최소화(em minimization)** 설정이에요. 단백질을 움직이기 위한 것이 아니라, 단지 genion이 시스템을 읽고 이온을 추가할 수 있도록 `.tpr` 파일을 만들기 위한 목적입니다.

### grompp로 .tpr 파일 생성

이제 아래 명령을 실행해 `.tpr` 파일을 만들어 줍니다.

```bash
gmx grompp -f inputs/ions.mdp -c 1AKI_solv.gro -p topol.top -o ions.tpr
```
이 명령의 역할을 살펴보면

| 옵션 | 설명 |
| --- | --- |
| `-f inputs/ions.mdp` | 시뮬레이션 매개변수 파일 |
| `-c 1AKI_solv.gro` | 용매화된 단백질 구조 |
| `-p topol.top` | 시스템의 토폴로지 파일 |
| `-o ions.tpr` | 생성될 출력 파일 (binary 실행 입력) |

이 과정을 통해 GROMACS는 **모든 원자 좌표, 전하, 결합, 힘 상수** 등을 하나로 묶은 바이너리 파일(`ions.tpr`)을 생성합니다.

이제 이 파일을 `genion` 명령의 입력으로 사용하면 됩니다.

### genion으로 이온 추가하기

이제 진짜로 이온을 추가할 차례입니다.

```bash
gmx genion -s ions.tpr -o 1AKI_solv_ions.gro -p topol.top -pname NA -nname CL -neutral
```

이 명령의 각 옵션은 다음과 같습니다:

| 옵션 | 설명 |
| --- | --- |
| `-s ions.tpr` | grompp에서 만든 입력 파일 |
| `-o 1AKI_solv_ions.gro` | 이온이 추가된 새로운 구조 파일 |
| `-p topol.top` | 토폴로지를 업데이트하도록 지정 |
| `-pname NA` | 양이온 이름 (Na⁺) |
| `-nname CL` | 음이온 이름 (Cl⁻) |
| `-neutral` | 전체 시스템을 중성으로 맞춤 (전하 0) |

명령을 실행하면 GROMACS가 다음과 같은 메시지를 띄울 거예요.

```text
Select a group:
```

이때 **"SOL" 그룹(일반적으로 번호 13)** 을 선택하세요. 이는 genion이 “물 분자 중 일부를 이온으로 바꿀 것”임을 의미합니다.

### 토폴로지(topol.top) 파일 업데이트 확인

이온이 추가되면 `topol.top` 파일의 **[ molecules ]** 섹션이 자동으로 업데이트됩니다.

```text
[ molecules ]
; Compound        #mols
Protein_chain_A     1
SOL             12588
CL                  8
```

이 예시에서는 Na⁺ 이온이 추가되며 전체 전하가 +8e였던 단백질이 중성으로 맞춰졌습니다.

GROMACS는 물 분자 일부를 제거하고, 그 자리에 이온을 넣는 방식으로 작동합니다.

이제 시스템에는 단백질 1개, 물 분자 12,588개, 염화이온(Cl⁻) 8개가 포함된, **전하가 완전히 중성인 생리적 환경**이 완성된 것입니다.

# 4 **Lysozyme in Wate : MD Run**

## 4.1 **Step Five: Energy Minimization**

### grompp로 .tpr 파일 만들기

에너지 최소화 과정도 이온 추가 단계와 마찬가지로 먼저 GROMACS 전처리기인 **grompp**를 사용해

바이너리 실행 입력 파일(`em.tpr`)을 만들어야 합니다.

이를 위해 `.mdp` 파일이 필요합니다. 아래는 사용할 설정 파일(`minim.mdp`) 예시입니다.

```bash
; minim.mdp - used as input into grompp to generate em.tpr
; Parameters describing what to do, when to stop and what to save
integrator  = steep         ; Algorithm (steepest descent minimization)
emtol       = 1000.0        ; Stop minimization when Fmax < 1000.0 kJ/mol/nm
emstep      = 0.01          ; Step size
nsteps      = 50000         ; Maximum number of minimization steps

; Parameters describing how to find neighbors and calculate interactions
nstlist         = 1         ; Neighbor list update frequency
cutoff-scheme   = Verlet    ; Buffered neighbor search
ns_type         = grid      ; Neighbor search method
coulombtype     = PME       ; Long-range electrostatics (Particle Mesh Ewald)
rcoulomb        = 1.0       ; Electrostatic cutoff
rvdw            = 1.0       ; Van der Waals cutoff
pbc             = xyz       ; Apply periodic boundary in all directions
```

### 설정 포인트

- **integrator = steep**

  → 가장 기본적인 “Steepest Descent” 알고리즘을 사용합니다.

- **emtol = 1000.0**

  → 최대 힘(`Fmax`)이 1000 kJ/mol/nm 이하로 떨어지면 종료합니다.

- **coulombtype = PME**

  → 긴 거리 전기적 상호작용은 PME 방식으로 계산합니다.

- **cutoff-scheme = Verlet**

  → 최신 GROMACS 버전에서 표준적인 neighbor-search 방식이에요.


### grompp 실행

이제 위의 `minim.mdp` 파일과 이전 단계의 결과물을 조합해 `.tpr` 파일을 만들어보겠습니다.

```bash
gmx grompp -f inputs/minim.mdp -c 1AKI_solv_ions.gro -p topol.top -o em.tpr
```

| 옵션 | 설명 |
| --- | --- |
| `-f inputs/minim.mdp` | 시뮬레이션 매개변수 파일 |
| `-c 1AKI_solv_ions.gro` | 이온이 포함된 구조 파일 |
| `-p topol.top` | 토폴로지 파일 |
| `-o em.tpr` | 에너지 최소화용 실행 파일 출력 |

이제 시스템의 모든 원자와 힘 상수가 `em.tpr`에 포함되었습니다. 이제 본격적으로 **에너지 최소화(EM)** 를 수행할 준비가 끝났어요!

### mdrun으로 에너지 최소화 실행

```bash
gmx mdrun -v -deffnm em
```

| 옵션 | 설명 |
| --- | --- |
| `-v` | 실행 중 과정을 터미널에 표시 |
| `-deffnm em` | “em”을 기본 파일 이름(prefix)으로 지정 |

이 과정을 수행하면 GROMACS가 구조를 조금씩 조정하면서 시스템 에너지를 점점 낮춰갑니다.

### 출력 파일 살펴보기

에너지 최소화가 완료되면 여러 출력 파일이 생성됩니다:

| 파일명 | 설명 |
| --- | --- |
| `em.log` | 실행 로그 (텍스트 형태) |
| `em.edr` | 에너지 항목(이진 포맷) |
| `em.trr` | 전체 정밀도 궤적 파일 |
| `em.gro` | 최소화된 구조 (이후 단계에서 사용) |

터미널에도 결과가 간단히 출력됩니다.

```text
Steepest Descents converged to Fmax < 1000 in 566 steps
Potential Energy  = -6.2751356e+05
Maximum force     =  9.8003864e+02 on atom 567
Norm of force     =  2.3013127e+01
```

이런 식으로 **Fmax**(최대 힘)과 **Potential Energy**(위치 에너지)가 표시됩니다.

### 결과 해석하기

에너지 최소화가 잘 되었는지 판단하는 핵심 기준은 두 가지입니다.

| 항목 | 기준 | 설명 |
| --- | --- | --- |
| **Potential Energy (Epot)** | 음수(-) 값 | 전체 시스템의 위치 에너지는 음수가 되어야 합니다. (보통 -10⁵ ~ -10⁶ kJ/mol 범위) |
| **Maximum Force (Fmax)** | 1000 kJ/mol/nm 이하 | minim.mdp에서 설정한 목표값(emtol)을 충족해야 합니다. |

위의 예에서는 Fmax = 980 kJ/mol/nm으로 기준을 만족했고 Potential Energy도 -6.27×10⁵로 안정적인 수준이므로 성공적인 최소화입니다.

### 에너지 분석 (gmx energy)

이제 에너지가 실제로 잘 수렴했는지 그래프로 확인해볼 수 있습니다.

```bash
gmx energy -f em.edr -o potential.xvg
```

이때 `11`은 “Potential” 항목을 선택한다는 뜻이고 `0`은 선택 종료를 의미합니다. 결과적으로 **potential.xvg** 파일이 생성되고 이 파일에는 에너지 최소화 동안의 위치 에너지가 저장됩니다.

![image](/image/info/detail/gromacs_2.webp){center:600}

이런 식으로 **Epot이 안정적으로 수렴**하면 우리 시스템의 구조가 충분히 안정화된 것입니다.

## 4.2 **Step Six: Equilibration, Part 1**

### 위치 제한 (Position Restraints)

`posre.itp` 파일을 기억하시나요? 이 파일은 단백질의 **무거운 원자(수소 제외)** 들에 대해 “움직이지 않도록 약한 스프링”을 거는 역할을 합니다. 즉, 평형화 과정 동안 **단백질은 거의 고정된 상태로 두고**,

물과 이온들이 자연스럽게 주변을 정리하게 만드는 것이죠.

이렇게 하면 단백질의 구조가 갑자기 무너지거나 틀어지는 일을 방지할 수 있습니다. `posre.itp`는 `grompp` 명령의 `-r` 옵션으로 전달되는 좌표 파일(`em.gro`)을 기준으로 작동합니다. 즉, 단백질의 원래 좌표를 기준으로 스프링이 걸리는 거예요.

### NVT 평형화 설정 파일 작성 (`nvt.mdp`)

아래 내용을 복사해서 `nvt.mdp` 파일로 저장하세요.

```bash
title                   = OPLS Lysozyme NVT equilibration
define                  = -DPOSRES  ; position restrain the protein
; Run parameters
integrator              = md        ; leap-frog integrator
nsteps                  = 50000     ; 2 * 50000 = 100 ps
dt                      = 0.002     ; 2 fs
; Output control
nstxout                 = 500       ; save coordinates every 1.0 ps
nstvout                 = 500       ; save velocities every 1.0 ps
nstenergy               = 500       ; save energies every 1.0 ps
nstlog                  = 500       ; update log file every 1.0 ps
; Bond parameters
continuation            = no        ; first dynamics run
constraint_algorithm    = lincs     ; holonomic constraints
constraints             = h-bonds   ; bonds involving H are constrained
lincs_iter              = 1         ; accuracy of LINCS
lincs_order             = 4         ; related to accuracy
; Nonbonded settings
cutoff-scheme           = Verlet    ; Buffered neighbor searching
ns_type                 = grid      ; neighbor search method
nstlist                 = 10        ; update every 20 fs
rcoulomb                = 1.0       ; short-range electrostatic cutoff (nm)
rvdw                    = 1.0       ; short-range van der Waals cutoff (nm)
DispCorr                = EnerPres  ; account for cut-off vdW scheme
; Electrostatics
coulombtype             = PME       ; Particle Mesh Ewald for long-range electrostatics
pme_order               = 4         ; cubic interpolation
fourierspacing          = 0.16      ; FFT grid spacing
; Temperature coupling
tcoupl                  = V-rescale             ; modified Berendsen thermostat
tc-grps                 = Protein Non-Protein   ; separate temperature groups
tau_t                   = 0.1     0.1           ; time constant (ps)
ref_t                   = 300     300           ; target temperature (K)
; Pressure coupling
pcoupl                  = no        ; NVT: no pressure coupling
; Periodic boundary conditions
pbc                     = xyz       ; 3D PBC
; Velocity generation
gen_vel                 = yes       ; assign velocities from Maxwell distribution
gen_temp                = 300       ; target temperature (K)
gen_seed                = -1        ; random seed
```

### 주요 파라미터 설명

| 파라미터 | 설명 |
| --- | --- |
| `define = -DPOSRES` | 단백질에 위치 제한(force restraint) 적용 |
| `integrator = md` | leap-frog 적분기 사용 (표준 MD 알고리즘) |
| `nsteps = 50000` | 50,000 스텝 × 2 fs = 100 ps (평형화 시간) |
| `tcoupl = V-rescale` | 온도 조절 방식 (Bussi thermostat) |
| `tc-grps = Protein Non-Protein` | 단백질과 용매/이온을 따로 온도 조절 |
| `pcoupl = no` | 압력 조절 비활성화 (NVT 단계) |
| `gen_vel = yes` | 초기 속도를 맥스웰 분포로부터 무작위 생성 |
| `gen_seed = -1` | 난수 시드 자동 생성 (재현 불필요) |

이 설정은 **단백질은 고정하고** 주변의 물과 이온이 목표 온도(300 K)에 맞춰 움직이도록 하는 환경을 만듭니다.

## grompp로 NVT 실행 파일 생성

```bash
gmx grompp -f inputs/nvt.mdp -c em.gro -r em.gro -p topol.top -o nvt.tpr
```

| 옵션 | 설명 |
| --- | --- |
| `-f inputs/nvt.mdp` | NVT 매개변수 파일 |
| `-c em.gro` | 에너지 최소화된 구조 |
| `-r em.gro` | 위치 제한 기준 구조 |
| `-p topol.top` | 토폴로지 파일 |
| `-o nvt.tpr` | 출력 실행 파일 |

## mdrun으로 NVT 실행

```bash
gmx mdrun -deffnm nvt
```

이 명령으로 100 ps 동안 시스템이 서서히 가열되고 온도가 목표값(300 K)에 도달하도록 조정됩니다.

실행이 끝나면 다음과 같은 출력 파일이 생깁니다.

| 파일명 | 설명 |
| --- | --- |
| `nvt.log` | 실행 로그 |
| `nvt.edr` | 에너지 기록 파일 |
| `nvt.trr` | 궤적 (trajectory) 파일 |
| `nvt.gro` | NVT 종료 후 구조 파일 |

### 온도 안정성 확인하기

평형화가 잘 되었는지 확인하려면 에너지 파일(`nvt.edr`)에서 온도 변화를 확인할 수 있습니다.

```bash
gmx energy -f nvt.edr -o temperature.xvg
```

- `16` → “Temperature” 항목 선택
- `0` → 선택 종료

이후 **temperature.xvg** 파일이 생성됩니다. 이 파일을 플롯으로 보면 아래와 같이 나타납니다.

![image](/image/info/detail/gromacs_3.webp){center:600}

그래프를 보면 온도가 299~301 K 근처에서 안정적으로 유지되고 있죠. 이제 시스템이 목표 온도에서 평형 상태에 도달했음을 알 수 있습니다.

## 4.3 **Step Seven: Equilibration, Part 2**

### NPT용 .mdp 파일 설정

NPT 단계에서 사용하는 `.mdp` 파일은 앞서 사용한 `nvt.mdp`와 대부분 비슷하지만 **압력 커플링(pressure coupling)** 관련 설정이 추가되었습니다. 그리고 시뮬레이션을 이어서 하기 때문에 `continuation = yes` 로 설정합니다.

아래 내용을 복사해 `npt.mdp` 파일을 만드세요.

```bash
title                   = OPLS Lysozyme NPT equilibration
define                  = -DPOSRES  ; position restrain the protein
; Run parameters
integrator              = md        ; leap-frog integrator
nsteps                  = 250000     ; 2 * 250000 = 500 ps
dt                      = 0.002     ; 2 fs
; Output control
nstxout                 = 500       ; save coordinates every 1.0 ps
nstvout                 = 500       ; save velocities every 1.0 ps
nstenergy               = 500       ; save energies every 1.0 ps
nstlog                  = 500       ; update log file every 1.0 ps
; Bond parameters
continuation            = yes       ; continue from NVT
constraint_algorithm    = lincs     ; holonomic constraints
constraints             = h-bonds   ; constrain all bonds involving H
lincs_iter              = 1
lincs_order             = 4
; Nonbonded settings
cutoff-scheme           = Verlet
ns_type                 = grid
nstlist                 = 10
rcoulomb                = 1.0
rvdw                    = 1.0
DispCorr                = EnerPres
; Electrostatics
coulombtype             = PME
pme_order               = 4
fourierspacing          = 0.16
; Temperature coupling
tcoupl                  = V-rescale
tc-grps                 = Protein Non-Protein
tau_t                   = 0.1     0.1
ref_t                   = 300     300
; Pressure coupling
pcoupl                  = Parrinello-Rahman     ; pressure coupling on
pcoupltype              = isotropic             ; uniform scaling
tau_p                   = 2.0                   ; pressure time constant (ps)
ref_p                   = 1.0                   ; reference pressure (bar)
compressibility         = 4.5e-5                ; isothermal compressibility of water
refcoord_scaling        = com
; Periodic boundary conditions
pbc                     = xyz
; Velocity generation
gen_vel                 = no        ; use velocities from NVT
```

### 주요 변경 사항 요약

| 항목 | 변경 내용 | 이유 |
| --- | --- | --- |
| `continuation = yes` | 이전 NVT 단계에서 계속 실행 | NVT 결과를 이어받음 |
| `gen_vel = no` | 새로운 속도 생성 안 함 | NVT에서 이미 생성한 속도 사용 |
| `pcoupl = Parrinello-Rahman` | 압력 커플링 활성화 | 압력 평형을 위해 필요 |
| `tau_p = 2.0` | 압력 조절 시간 (느리게 반응하도록) | 급격한 부피 변화 방지 |
| `ref_p = 1.0` | 목표 압력 = 1 bar | 실험 조건과 동일 |
| `compressibility = 4.5e-5` | 물의 압축율 | TIP3P/SPC 물 모델용 |

이제 **압력(Pressure)** 과 **밀도(Density)** 가 안정화될 때까지 시스템을 조정합니다.

### grompp 실행 — NPT 입력 파일 생성

NPT 평형화를 준비하기 위해 아래 명령을 입력하세요.

```bash
gmx grompp -f inputs/npt.mdp -c nvt.gro -r nvt.gro -t nvt.cpt -p topol.top -o npt.tpr
```

| 옵션 | 설명 |
| --- | --- |
| `-f inputs/npt.mdp` | NPT 매개변수 파일 |
| `-c nvt.gro` | NVT 단계의 최종 구조 |
| `-r nvt.gro` | 위치 제한 기준 좌표 |
| `-t nvt.cpt` | NVT 단계의 체크포인트 파일 (속도 정보 포함) |
| `-p topol.top` | 토폴로지 파일 |
| `-o npt.tpr` | 출력 실행 파일 |

### mdrun 실행 — NPT 평형화 수행

```bash
gmx mdrun -deffnm npt
```

이 명령은 500 ps 동안 시스템의 압력을 점진적으로 안정화시킵니다. 실행 후 다음과 같은 파일이 생성됩니다:

| 파일명 | 설명 |
| --- | --- |
| `npt.log` | 실행 로그 파일 |
| `npt.edr` | 에너지 데이터 |
| `npt.trr` | 궤적 (trajectory) |
| `npt.cpt` | 체크포인트 파일 |
| `npt.gro` | 평형화 완료 후 구조 파일 |

### 압력(Pressure) 분석

평형화가 잘 되었는지 확인하려면 에너지 파일(`npt.edr`)에서 압력 항목을 확인합니다.

```bash
gmx energy -f npt.edr -o pressure.xvg
```

- `17` → 압력(Pressure) 선택
- `0` → 입력 종료

결과 그래프는 다음과 같이 나타납니다:

![image](/image/info/detail/gromacs_4.webp){center:400}

처음 100 ps 동안 압력이 ± 수십 bar 단위로 크게 변할 수도 있지만 이는 **정상적인 현상**이에요.

그래프의 파란색 선은 **이동 평균(smoothing)** 을 보여주며 평균 압력은 `-3 ± 11 bar` 정도로 안정화됩니다. 목표 압력(1 bar)과 비교해도 오차 범위 내이므로, 충분히 타당한 결과입니다.

### 밀도(Density) 분석

이제 시스템의 밀도도 확인해봅시다.

```bash
gmx energy -f npt.edr -o density.xvg
```

- `23` → 밀도(Density) 선택
- `0` → 입력 종료

이제 밀도 그래프를 그려보면:

![image](/image/info/detail/gromacs_5.webp){center:600}

약 **1035 ± 0.5 kg/m³** 정도로 안정화된 것을 볼 수 있습니다. 이는 실험에서의 물 밀도(1000 kg/m³)보다는 약간 높지만 단백질과 이온이 포함된 시스템이므로 완벽한 일치는 기대하기 어렵습니다.

**중요한 것은 밀도가 일정하게 유지되는지,** **안정화되었는지** 여부입니다.

## 4.4 **Step Eight: Production MD**

### 생산 시뮬레이션 설정 파일 (`md.mdp`)

아래 내용을 복사해 `md.mdp` 파일로 저장하세요.

```bash
title                   = OPLS Lysozyme Production MD
; Run parameters
integrator              = md        ; leap-frog integrator
nsteps                  = 5000000    ; 2 * 5000000 = 10000 ps (10 ns)
dt                      = 0.002     ; 2 fs
; Output control
nstxout                 = 0         ; suppress bulky .trr file
nstvout                 = 0
nstfout                 = 0
nstenergy               = 5000      ; save energies every 10.0 ps
nstlog                  = 5000      ; update log file every 10.0 ps
nstxout-compressed      = 5000      ; save compressed coordinates every 10.0 ps
compressed-x-grps       = System    ; save the whole system
; Bond parameters
continuation            = yes       ; continue from NPT
constraint_algorithm    = lincs
constraints             = h-bonds
lincs_iter              = 1
lincs_order             = 4
; Neighborsearching
cutoff-scheme           = Verlet
ns_type                 = grid
nstlist                 = 10
rcoulomb                = 1.0
rvdw                    = 1.0
; Electrostatics
coulombtype             = PME
pme_order               = 4
fourierspacing          = 0.16
; Temperature coupling
tcoupl                  = V-rescale
tc-grps                 = Protein Non-Protein
tau_t                   = 0.1     0.1
ref_t                   = 300     300
; Pressure coupling
pcoupl                  = Parrinello-Rahman
pcoupltype              = isotropic
tau_p                   = 2.0
ref_p                   = 1.0
compressibility         = 4.5e-5
; Periodic boundary conditions
pbc                     = xyz
; Dispersion correction
DispCorr                = EnerPres
; Velocity generation
gen_vel                 = no
```

### 주요 포인트

| 항목 | 설명 |
| --- | --- |
| **nsteps = 500000** | 2 fs × 5000,000 = 10 ns 시뮬레이션 시간 |
| **continuation = yes** | 이전 NPT 상태에서 바로 이어서 진행 |
| **gen_vel = no** | 기존 속도를 그대로 사용 (새로 생성하지 않음) |
| **pcoupl = Parrinello-Rahman** | 압력 조절 활성화 (실제 환경 유지) |
| **tc-grps = Protein / Non-Protein** | 단백질과 용매를 따로 온도 조절 |
| **nstxout-compressed = 5000** | 10 ps마다 구조 기록 (필요한 데이터만 저장) |

이 설정으로 시뮬레이션 효율을 높이고 너무 많은 불필요한 데이터 파일이 생성되지 않도록 했습니다.

### grompp 실행 — 실행 파일 생성

이제 평형화가 완료된 구조(`npt.gro`)와 체크포인트(`npt.cpt`)를 기반으로 생산 MD 실행 파일을 만듭니다.

```bash
gmx grompp -f inputs/md.mdp -c npt.gro -t npt.cpt -p topol.top -o md_0_10.tpr
```

| 옵션 | 설명 |
| --- | --- |
| `-f inputs/md.mdp` | 시뮬레이션 매개변수 파일 |
| `-c npt.gro` | NPT 평형화의 최종 구조 |
| `-t npt.cpt` | 체크포인트 파일 (속도·압력 상태 포함) |
| `-p topol.top` | 토폴로지 파일 |
| `-o md_0_10.tpr` | 실행용 입력 파일 |

### mdrun 실행 — 실제 시뮬레이션 수행

```bash
gmx mdrun -deffnm md_0_10
```

이 명령을 실행하면, GROMACS가 본격적인 분자역학 시뮬레이션을 시작합니다.

시스템의 모든 원자들이 **물리 법칙에 따라 자유롭게 움직이게 되며** 시간에 따른 구조적 변화가 기록됩니다. 1 ns는 시뮬레이션 기준으로는 짧은 편이지만 튜토리얼 목적에서는 충분히 시스템 거동을 관찰할 수 있습니다.

### 출력 파일 정리

시뮬레이션이 완료되면 다음과 같은 파일들이 생성됩니다.

| 파일명 | 설명 |
| --- | --- |
| `md_0_10.log` | 실행 로그 |
| `md_0_10.edr` | 에너지 기록 파일 |
| `md_0_10.cpt` | 체크포인트 (이후 이어서 실행 가능) |
| `md_0_10.xtc` | 궤적(trajectory) 데이터 — 주요 결과 |
| `md_0_10.tpr` | 입력 정보 (구조 + 매개변수) |

특히 **`.xtc`** 파일이 가장 중요합니다. 이 파일에는 시뮬레이션 중의 모든 좌표 변화가 담겨 있어 이후 **RMSD, RMSF, 수소 결합, 거리 분석 등** 다양한 분석에 사용됩니다.

# 5 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **웹페이지 GUI**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/gromacs
```

이 화면은 **GROMACS 기반 분자 동역학(MD) 시뮬레이션을 웹 환경에서 간편하게 수행할 수 있도록 설계된 인터페이스**입니다. 복잡한 명령어나 스크립트 작성 없이, 사용자는 **필수 입력값만 설정** 하면 자동으로 최신 버전의 MDP 파라미터가 적용되어 시뮬레이션이 실행됩니다.

이를 통해 연구자는 **구조 파일 업로드 → 조건 설정 → 분석 시작**의 단순한 절차만으로, 전문적인 MD 시뮬레이션을 손쉽게 수행할 수 있습니다.

![image](/image/info/detail/gromacs_6.webp){center:880}

사용자는 **단백질의 구조 파일(PDB)을 업로드**하고, **시뮬레이션 시간·온도·이온 농도 등 기본 파라미터를 설정한 뒤 ‘분석 시작’ 버튼을 클릭**하면 자동으로 시뮬레이션이 실행됩니다.

복잡한 명령어나 스크립트 작성 없이도 최신화된 MDP 설정이 적용되며 **필요 시 Contact Map과 Free Energy Landscape(FEL) 분석 또한 버튼 한 번으로 수행**할 수 있습니다.

이를 통해 연구자는 **시뮬레이션부터 결과 분석까지 전 과정을 직관적이고 효율적으로 진행** 할 수 있습니다.

# 6 분석 결과

## 6.1 Correcting for Periodicity Effects

시뮬레이션이 끝난 후에는 궤적을 정리해 **주기적 경계 조건(Periodic Boundary Condition, PBC)** 의 영향을 보정해야 합니다. 이를 위해 `trjconv` 도구를 사용합니다. 이 명령은 좌표를 변환하고, 주기성으로 인해 단백질이 상자를 넘어가 “찢어진 것처럼” 보이는 현상을 바로잡으며, 궤적의 시간 간격이나 프레임 빈도도 조정할 수 있습니다.

주기성을 고려하여 단백질을 다시 중앙에 정렬하려면 아래 명령을 실행합니다:

```text
gmx trjconv -s md_0_10.tpr -f md_0_10.xtc -o md_0_10_noPBC.xtc -pbc mol -center
```

명령 실행 시 중심 기준 그룹으로 `1 (Protein)`을, 출력 그룹으로 `0 (System)`을 선택하세요.

이 과정을 거치면 단백질이 상자 중앙에 고정되고, 분자가 끊어지거나 점프하는 문제 없이 깨끗하게 정렬된 “재이미지화된(reimaged)” 궤적이 생성됩니다.

이후의 모든 분석은 이 보정된 궤적(`md_0_10_noPBC.xtc`)을 기준으로 수행합니다.

## 6.2 **Root-Mean-Square Deviation**

이제 시뮬레이션 동안 단백질 구조가 얼마나 변했는지를 확인해보겠습니다.

GROMACS에는 이를 계산할 수 있는 `rms` 유틸리티가 포함되어 있습니다. 다음 명령어를 실행하면 궤적에서 **RMSD (Root Mean Square Deviation)** 값을 계산할 수 있습니다.

```text
gmx rms -s md_0_10.tpr -f md_0_10_noPBC.xtc -o rmsd.xvg -tu ns
```

명령 실행 시 최소제곱 정렬과 RMSD 계산에 사용할 그룹으로 모두 `4 (Backbone)`을 선택합니다.

- `tu ns` 옵션은 결과를 나노초(ns) 단위로 변환하여 출력하도록 설정합니다.

이렇게 생성된 RMSD 플롯은 시뮬레이션 중 구조의 변화 정도를 한눈에 보여줍니다.

![image](/image/info/detail/gromacs_7.webp){center:600}

결과를 보면, RMSD 값이 약 **0.08 ± 0.01 nm (0.9 Å)** 수준에서 안정적으로 유지되고 있음을 알 수 있습니다. 이는 시뮬레이션 동안 단백질의 전반적인 구조가 크게 변하지 않았다는 뜻입니다. 다만 **RMSD는 전체 구조적 변화를 요약한 지표일 뿐**, 시스템의 수렴(convergence)이나 안정성(stability)을 직접적으로 평가하는 절대 기준은 아닙니다.

예를 들어, 대형 단백질 복합체의 경우 RMSD가 1.0 nm 수준이더라도 전체 구조는 여전히 안정적으로 유지될 수 있습니다. 즉, RMSD는 단지 **작은 구조적 변위가 누적된 결과를 수치로 표현한 값**이라는 점을 기억해 두세요.

## 6.3 **Analyzing Compactness: *Rg***

단백질의 **회전 반경(Radius of Gyration)** 은 분자가 얼마나 조밀하게 접혀 있는지를 나타내는 지표입니다. 단백질이 안정적으로 접힌 상태를 유지한다면 R<sub>g</sub> 값은 시뮬레이션 내내 거의 일정하게 유지되며 반대로 단백질이 펼쳐지거나 구조적으로 불안정해질 경우 R<sub>g</sub> 값이 시간에 따라 변동하게 됩니다.

아래 명령어로 시뮬레이션 궤적에서 Rg 값을 계산할 수 있습니다:

```text
gmx gyrate -s md_0_10.tpr -f md_0_10_noPBC.xtc -o gyrate.xvg -sel Protein -tu ns
```

![image](/image/info/detail/gromacs_8.webp){center:600}

결과 그래프를 보면, R<sub>g</sub> 값이 **1.419 ± 0.008 nm** 정도로 매우 안정적으로 유지되는 것을 확인할 수 있습니다. 이는 시뮬레이션 동안 단백질이 원래의 접힌 형태를 그대로 유지하며 298 K에서 10 ns 동안 특별한 확장이나 압축 없이 안정적인 구조를 유지했음을 의미합니다.

## 6.4 **Secondary Structure**

단백질의 안정성과 구조적 변화를 평가할 때, **α-나선(helix)** 과 **β-시트(sheet)** 같은 **2차 구조의 유지 여부**를 살펴보는 것이 중요합니다.

이를 위해 GROMACS에서는 `gmx dssp` 명령어를 사용하며, 이는 **DSSP (Dictionary of Secondary Structure of Proteins)** 알고리즘을 호출하여 각 잔기(residue)에 대해 어떤 2차 구조가 형성되어 있는지를 판별합니다.

```text
gmx dssp -s md_0_10.tpr -f md_0_10_noPBC.xtc -tu ns -o dssp.dat -num dssp_num.xvg
```

![image](/image/info/detail/gromacs_9.webp){center:600}[http://www.mdtutorials.com/gmx/lysozyme]

이 명령을 실행하면 시뮬레이션 전체에 걸친 α-나선과 β-시트의 형성 및 유지 패턴을 확인할 수 있습니다. 시간에 따라 2차 구조가 안정적으로 유지된다면, 단백질이 접힌 상태를 안정적으로 유지하고 있다는 의미입니다.

## 6.5 **Hydrogen Bonds**

단백질의 구조적 안정성은 **수소 결합(hydrogen bond)** 의 수와 지속성에도 크게 영향을 받습니다. GROMACS에서는 `gmx hbond` 도구를 통해 수소 결합의 개수를 계산할 수 있습니다.

수소 결합 여부는 두 가지 기준에 따라 결정됩니다.

1. **공여체-수용체-H 거리:** 기본값은 0.35 nm 이하 (`hbr` 옵션으로 변경 가능)
2. **공여체-수용체-H 각도:** 기본값은 30° 이하 (`hba` 옵션으로 변경 가능)

### 단백질 백본(Main Chain) 내 수소 결합 계산

먼저 단백질 주사슬 내에서 형성되는 수소 결합의 수를 계산합니다.

```text
gmx hbond -s md_0_10.tpr -f md_0_10_noPBC.xtc -tu ns -num hbnum_mainchain.xvg
```

프롬프트가 뜨면 두 선택 항목 모두에서 **“MainChain+H” 그룹(7)** 을 선택합니다. 이 그룹에는 주사슬 원자(N, Cα, C, O)와 아미드 수소(H)가 포함되어 있어, 백본 수소 결합 계산에 적합합니다.

### 측쇄(Side Chain) 간 수소 결합 계산

다음으로, 아미노산의 측쇄 사이에서 형성되는 수소 결합을 계산합니다.

```text
gmx hbond -s md_0_10.tpr -f md_0_10_noPBC.xtc -tu ns -num hbnum_sidechain.xvg
```

이때 두 그룹 모두 **“SideChain” 그룹(8)** 을 선택하세요.

### 단백질–물 사이의 수소 결합 계산

마지막으로 단백질과 물 분자 간에 형성되는 수소 결합을 확인합니다.

```text
gmx hbond -s md_0_10.tpr -f md_0_10_noPBC.xtc -tu ns -num hbnum_prot_wat.xvg
```

이 경우 첫 번째 그룹으로 **“Protein”(1)** 을 두 번째 그룹으로 **“Water”(12)** 또는 **“SOL”(13)** 을 선택합니다.

![image](/image/info/detail/gromacs_10.webp){center:600}[http://www.mdtutorials.com/gmx/lysozyme]

결과 그래프를 보면, 각 경우에서 수소 결합의 수가 시간에 따라 큰 변동 없이 안정적으로 유지되는 것을 알 수 있습니다.

이러한 결과는 **짧은 시뮬레이션(예: 10 ns)** 에서는 매우 일반적인 현상입니다. 라이소자임의 경우,

- **백본(MainChain+H)** 내에서는 약 **55개의 수소 결합**이 형성되고,
- **측쇄(SideChain)** 간에는 상대적으로 적은 **약 20개 내외의 결합**이 존재하며,
- **물 분자와의 상호작용**에서도 다수의 안정적인 수소 결합이 유지됩니다.

이러한 결과는 단백질이 시뮬레이션 동안 잘 접힌 상태를 유지하고 있음을 보여줍니다.

## 6.6 ETC.

### SASA

![image](/image/info/detail/gromacs_11.webp){center:600}

### RMSF

![image](/image/info/detail/gromacs_12.webp){center:600}

### CONTACTMAP

![image](/image/info/detail/gromacs_13.webp){center:600}

### FEL

![image](/image/info/detail/gromacs_14.webp){center:600}

# 7 마치며

---

이제 GROMACS 설치부터 라이소자임 시뮬레이션, 그리고 결과 분석까지의 여정을 모두 마쳤습니다.

처음엔 다소 복잡하게 느껴졌을 수도 있지만, 하나씩 따라오다 보면 어느새 분자 동역학 시뮬레이션의 기본 구조와 흐름을 자연스럽게 이해하게 됩니다.

GROMACS는 단순한 계산 프로그램이 아니라, 연구자가 **분자의 세계를 직접 실험실처럼 다루게 해주는 강력한 도구**입니다. 이번 튜토리얼을 통해 명령어의 의미를 단순히 외우는 데 그치지 않고, 각 단계가 “왜 필요한가”를 이해하는 데 도움이 되었길 바랍니다. 앞으로는 더 복잡한 시스템(단백질-리간드 복합체, 막 단백질, 멀티도메인 단백질 등)이나 고급 분석(Contact Map, FEL, PCA 등)에도 도전해보세요.

한 걸음씩 나아가면, 언젠가 자신만의 MD 워크플로우를 설계할 수 있게 될 거예요.

**Your Lab, Everywhere — CURIE와 함께 즐거운 시뮬레이션 하세요!**

# 8 Reference

---

- [Github GROMACS](https://github.com/gromacs/gromacs)
- [GROMACS Tutorials lysozyme](http://www.mdtutorials.com/gmx/lysozyme)
- CURIE : [GROMACS](https://curie.kr/Analysis/gromacs)

-----

[tool-button:GROMACS]