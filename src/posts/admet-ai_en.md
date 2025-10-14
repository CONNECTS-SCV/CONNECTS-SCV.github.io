---
layout: post
title: "ADMET-AI : AI Model for Predicting ADMET Properties of Small Molecules"
description: "An AI-powered computational screening tool for evaluating drug-likeness and safety profiles by predicting ADMET properties from small molecule structures."
categories: [analysis]
tags: [ADMET-AI, ADMET, Drug Discovery, AI, GNN, MPNN]
author: "author1"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
ADMET-AI is an artificial intelligence model that predicts ADMET properties — Absorption, Distribution, Metabolism, Excretion, and Toxicity — directly from the structure of small molecules.
It serves as an all-in-one computational screening tool for evaluating drug-likeness and safety profiles during the early stages of drug discovery.

## Mechanism
- Trained on over **1 million compound structures** collected from **ChEMBL**, **PubChem**, and **DrugBank**.
- Each compound is represented as a molecular graph and embedded using **GNN (Graph Neural Network)** and **MPNN (Message Passing Neural Network)** architectures.
- This model integrates multiple physicochemical and pharmacokinetic features during supervised learning, including:
  - **Solubility**
  - **Protein binding**
  - **CYP metabolism**
  - **hERG toxicity**
  - **LD50 (lethal dose)**

## Input, Output, Options

**Input** :
- Compound structure (SMILES format)

**Output** :
- Predicted physicochemical and ADMET-related properties
- (Planned) Visualization graphs for feature interpretation

**Configuration Parameters** :
- No user-defined parameters available at present

## Applications & Key Features
- Early-stage **drug screening** to assess the ADMET profiles of candidate molecules.
- Exhibits **state-of-the-art performance** particularly in **toxicity** and **metabolic stability prediction**.
- Enables **high-throughput**, structure-based profiling without experimental assays.

## Comparable Models
**ADMET-AI** currently represents the **state-of-the-art (SOTA)** for integrated ADMET prediction models. A key challenge lies in developing **efficient visualization methods** for large-scale prediction datasets.

## Related Models
- **DILI**, **hERGAI**: Specialized modules for validating individual toxicity endpoints (e.g., liver or cardiac toxicity).
- **DiffDock**: Predicts protein–ligand binding structures, providing structural context for ADMET interpretation.
- **PIGNET2**: Quantifies binding affinity, allowing combined assessment of both efficacy and safety.

---

[tool-button:ADMET-AI]