---
layout: post
title: "GROMACS : GPU 버전 설치 튜토리얼 (Ubuntu)"
description: "Ubuntu 환경에서 GPU를 활용한 GROMACS 2024.3 버전을 설치하는 과정을 설명합니다."
categories: [analysis]
tags: [GROMACS, GPU, Ubuntu, CUDA, Molecular Dynamics]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/tutorial/gromacs_1.webp"
---

![image](/image/info/tutorial/gromacs_1.webp){center:880}

이 가이드는 Ubuntu 환경에서 **GPU를 활용한 GROMACS 2024.3** 버전을 설치하는 과정을 설명합니다.
설치 과정에는 **NVIDIA 드라이버**, **CUDA Toolkit**, **OpenMPI**, **NVIDIA HPC SDK** 등을 포함하며 최종적으로 GPU 가속이 가능한 분자 동역학 시뮬레이션 환경을 구축하게 됩니다.

# 1\. NVIDIA 드라이버 설치

-----

먼저, 기존에 설치된 모든 NVIDIA 드라이버와 CUDA 관련 파일을 완전히 제거한 뒤 새로운 드라이버를 설치합니다.

```bash
# 기존 드라이버 및 CUDA 흔적 제거
sudo apt-get purge nvidia*
sudo apt-get autoremove
sudo apt-get autoclean
sudo rm -rf /usr/local/cuda*
```

이제 시스템을 업데이트한 후 드라이버를 재설치합니다.

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install ubuntu-drivers-common
```

다음 명령으로 시스템에 맞는 드라이버를 확인하세요.

```bash
ubuntu-drivers devices
```

여기서 **recommended** 라벨이 붙은 드라이버를 선택하여 설치합니다.

```bash
sudo apt-get install nvidia-driver-XXX   # 예: nvidia-driver-550
sudo reboot now
```

### 오류 해결: `ERROR:root:aplay command not found`

드라이버 탐색 중 아래와 같은 오류가 발생할 수 있습니다.

```text
ERROR:root:aplay command not found
```

이 경우 아래 명령으로 `alsa-utils`를 설치하세요.

```bash
sudo apt-get install alsa-utils
```

설치 중 비밀번호 등록 요청 시 8자리 비밀번호를 입력 후 재부팅합니다.

재부팅 과정에서 **MOK Key 등록 창**이 나타나면 이전에 입력한 비밀번호를 다시 입력하면 됩니다.

# 2\. CUDA Toolkit 설치

-----

GROMACS GPU 버전을 사용하기 위해서는 CUDA Toolkit이 필요합니다. 먼저 현재 설치된 드라이버가 지원하는 CUDA 버전을 확인합니다.

```bash
nvidia-smi
```

출력 결과에 나오는 `CUDA Version` 값(예: 12.4)에 맞는 Toolkit을 설치하세요.

**CUDA Toolkit 다운로드 페이지**: [CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)

예를 들어 CUDA 12.4를 설치하려면:

```bash
wget https://developer.download.nvidia.com/compute/cuda/12.4.0/local_installers/cuda_12.4.0_550.54.14_linux.run
sudo sh cuda_12.4.0_550.54.14_linux.run
```

설치 과정 중 “**Continue**”를 선택하고 **CUDA Toolkit만 설치**를 선택합니다 (Driver 재설치 불필요).

### 환경 변수 등록

CUDA 설치 후 아래 명령을 `.bashrc`에 추가합니다.

```bash
export PATH=$PATH:/usr/local/cuda-12.4/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-12.4/lib64
export CUDADIR=/usr/local/cuda-12.4
```

적용 후 확인:

```bash
source ~/.bashrc
nvcc -V
```

정상 출력 예시:

```text
nvcc: NVIDIA (R) Cuda compiler driver
Cuda compilation tools, release 12.4, V12.4.0
```

# 3\. OpenMPI 설치

-----

GROMACS는 병렬 연산을 지원하므로 **OpenMPI**가 필요합니다.

```bash
# 필요한 헤더 파일 설치
sudo apt-get install libibnetdisc-dev
```

OpenMPI 최신 버전을 공식 웹사이트에서 확인 후 다운로드합니다. [OpenMPI](http://www.open-mpi.org/)

```bash
wget https://www.open-mpi.org/software/ompi/v5.0/downloads/openmpi-5.0.0.tar.gz
tar -xvf openmpi-5.0.0.tar.gz
cd openmpi-5.0.0
```

CUDA 지원 경로를 포함하여 설정합니다.

```bash
./configure --prefix="/home/$USER/.openmpi" --with-cuda=/usr/local/cuda-12.4
make -j 12
sudo make install
```

### 환경 변수 추가:

```bash
export PATH="$PATH:/home/$USER/.openmpi/bin"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/home/$USER/.openmpi/lib/"
```

### 확인:

```bash
mpirun --version
```

# 4\. GROMACS 설치 전 준비 (필수 패키지)

-----

GROMACS 컴파일을 위해 필요한 기본 패키지를 설치합니다.

```bash
# C/C++ 컴파일러
sudo apt-get install gcc g++

# CMake (컴파일 설정 도구)
sudo apt-get install cmake
cmake --version

# Python
sudo apt install python3 python3-dev
python3 --version

# 빌드 관련 툴
sudo apt-get install build-essential

# FFTW 라이브러리 (Fourier Transform용)
sudo apt-get install libfftw3-dev libfftw-doc
sudo apt-get install fftw3 fftw3-dev pkg-config
```

# 5\. NVIDIA HPC SDK 설치 (cuFFT 포함)

-----

GPU 연산을 최적화하기 위해 **NVIDIA HPC SDK**를 설치합니다.

이 라이브러리에는 cuFFT, cuBLAS 등 GROMACS에서 사용하는 고성능 수학 모듈이 포함되어 있습니다.

```bash
wget https://developer.download.nvidia.com/hpc-sdk/24.5/nvhpc_2024_245_Linux_x86_64_cuda_12.4.tar.gz
tar xpzf nvhpc_2024_245_Linux_x86_64_cuda_12.4.tar.gz
sudo ./nvhpc_2024_245_Linux_x86_64_cuda_12.4/install
```

# 6\. GROMACS 설치

-----

```bash
# GROMACS 다운로드 및 압축 해제
wget https://ftp.gromacs.org/gromacs/gromacs-2024.3.tar.gz
tar xvzf gromacs-2024.3.tar.gz
cd gromacs-2024.3
mkdir build && cd build
```

CMake를 사용해 GPU와 MPI를 활성화하여 빌드합니다.

```bash
cmake .. \
  -DGMX_BUILD_OWN_FFTW=ON \
  -DREGRESSIONTEST_DOWNLOAD=ON \
  -DGMX_GPU=CUDA \
  -DGMX_MPI=ON
```

컴파일 및 설치:

```bash
make -j 12
make check -j 12
sudo make install -j 12
```

환경 변수 적용:

```bash
source /usr/local/gromacs/bin/GMXRC
```

버전 확인:

```bash
gmx --version
```

정상 출력 예시:

```text
GROMACS version:    2024.3
GPU support:        CUDA
MPI support:        enabled
```

# 7\. VMD 설치 (시각화 도구)

-----

**VMD (Visual Molecular Dynamics)** 는 GROMACS 시뮬레이션 결과를 시각화하는 도구입니다.

```bash
sudo su
./configure LINUXAMD64
cd src
make install
```

VMD를 실행하여 궤적(`.xtc`) 파일을 시각적으로 재생할 수 있습니다.

# 8\. Grace 설치 (그래프 도구)

GROMACS에서 생성된 `.xvg` 파일을 그래프로 시각화하기 위한 도구입니다.

```bash
sudo apt install grace
xmgrace
```

`xmgrace` 명령으로 RMSD, Rg, 에너지 변화를 실시간으로 플롯할 수 있습니다.

# 9\. 설치 확인 및 테스트

-----

다음 명령으로 모든 구성 요소가 올바르게 작동하는지 확인하세요.

```bash
gmx --version
nvidia-smi
nvcc -V
mpirun --version
```

정상 출력 예:

```text
GROMACS version: 2024.3
GPU support: CUDA
MPI support: enabled
CUDA 12.4
```

## 💡**참고 정보**
| 항목 | 설명 |
|---|---|
| **GROMACS** | 고성능 분자 동역학 시뮬레이터 (단백질·리간드 시뮬레이션) |
| **xmgrace** | GROMACS 결과(.xvg)를 플로팅·시각화하는 그래프 도구 |
| **VMD** | 시뮬레이션 궤적(.xtc)을 3D로 시각화하는 프로그램 |
| **OpenMPI** | 병렬 연산을 지원하는 메시지 교환 라이브러리 |
| **CUDA Toolkit** | GPU 연산용 NVIDIA 개발 도구 세트 |
| **HPC SDK** | NVIDIA 고성능 수학 연산 라이브러리(cuFFT, cuBLAS 등) 포함 패키지 |

# 10\. Reference

-----

- [CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)
- [Open MPI](https://www.open-mpi.org/)
- [NVIDIA HPC SDK](https://developer.nvidia.com/hpc-sdk)
- [GROMACS Documentation](https://manual.gromacs.org/)
- [VMD Homepage](https://www.ks.uiuc.edu/Research/vmd/)
- [Grace Homepage](https://plasma-gate.weizmann.ac.il/Grace/)

-----

[tool-button:GROMACS]