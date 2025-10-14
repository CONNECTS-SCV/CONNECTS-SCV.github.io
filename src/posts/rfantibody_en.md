---
layout: post
title: "RFantibody : A De Novo Antibody Design Model (In-Silico Antibody Library)"
description: "An integrated AI workflow combining RFdiffusion, ProteinMPNN, and RoseTTAFold2 for fully automated, end-to-end de novo antibody design."
categories: [analysis]
tags: [RFantibody, Antibody Design, RFdiffusion, ProteinMPNN, RoseTTAFold2, De Novo Design]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
**RFantibody** is a de novo antibody design pipeline that enables rapid and systematic in-silico antibody library generation.

Traditionally, antibody discovery relied on **phage display** or **physical screening libraries**, but RFantibody replaces these labor-intensive processes with an integrated AI workflow.

It combines three state-of-the-art protein design models — **RFdiffusion**, **ProteinMPNN**, and **RoseTTAFold2** — to achieve a fully automated, end-to-end antibody design process.

## Mechanism
The pipeline consists of three stages:

1.  **Structure Generation (RFdiffusion)**
    - Generates antibody backbone structures centered on the **CDR regions** using a diffusion model.
    - Trained on PDB structural data to learn **CDR conformational diversity** through noise-to-structure denoising.
2.  **Sequence Assignment (ProteinMPNN)**
    - Assigns optimal amino acid sequences to the generated CDR structures.
    - Uses a conditional design model to maximize **structure–sequence compatibility**.
3.  **Structure Prediction & Validation (RoseTTAFold2)**
    - Predicts the 3D structure of the designed sequence.
    - Compares it with the initial RFdiffusion-generated structure to verify design plausibility and consistency.

## Input, Output, Options

**Input**:
- Target antigen structure (PDB format)
- Framework antibody structure (PDB format)

**Output**:
- Comprehensive toxicity-related metrics
- Designed antibody structure (PDB format)
- Compatibility evaluation metrics

**Configuration Parameters**:
- Epitope information
- CDR loop range
- Number of designs
- Diffusion step / Final step (controls generation stage)
- Deterministic inference (reduces randomness when TRUE)
- Temperature (controls diversity; higher = more diverse outputs)
- Number of sequences per structure (ProteinMPNN stage)

## Applications & Key Features
- Enables de novo antibody design based on **epitope information** of the target antigen.
- Generates new **CDR loop conformations** and predicts binding patterns.
- Integrates **RFdiffusion**, **ProteinMPNN**, and **RoseTTAFold2** into a unified end-to-end workflow.
- Demonstrates high reliability, particularly in **CDR-H3** loop modeling and prediction accuracy.

## Comparable Models
- **SabPred:** An integrated platform for antibody structure prediction and developability assessment.
- **ABlooper:** Specializes in **CDR-specific loop design**.
- **AbodyBuilder3 (OPIG):** Predicts antibody structures from sequence-based inputs with high accuracy.

## Related Models
- **DeepSP** can be used to evaluate the **developability** of the designed antibodies.
- **Prodigy** or **HADDOCK** can analyze **antigen–antibody binding interactions** for validation and docking refinement.

---

[tool-button:RFantibody]
