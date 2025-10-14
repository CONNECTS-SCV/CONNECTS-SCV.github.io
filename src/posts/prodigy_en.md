---
layout: post
title: "PRODIGY : Predicting Binding Affinity Between Protein Complexes"
description: "A structure-based tool that predicts the binding affinity (ΔG) and dissociation constant (Kd) of protein-protein complexes using a linear regression approach."
categories: [analysis]
tags: [PRODIGY, Binding Affinity, Protein-Protein Interaction, PPI, Linear Regression]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
PRODIGY is a structure-based tool that predicts the binding affinity (ΔG, kcal/mol) and dissociation constant (Kd) of protein–protein complexes from their 3D structures (PDB/mmCIF).

Unlike deep learning models, PRODIGY uses a linear regression approach based on interfacial contacts (ICs) and non-interacting surface (NIS) properties.

## Mechanism
When a protein complex structure is provided, PRODIGY first identifies the **interaction interface**.

Residues within a predefined distance (typically 5.5 Å) are considered contacts, which are categorized as **polar**, **non-polar**, or **charged** interactions.

The model also analyzes the **non-interacting surface** to measure the proportion of apolar and charged regions, as these can influence stability—for instance, hydrophobic residues surrounding the interface can strengthen binding.

Using these structural features, PRODIGY trains a **linear regression model** on the **SKEMPI database**, a benchmark of experimentally measured protein binding affinities.

The following features are used to predict ΔG:

- Amino acid composition at the interface
- Number of contacting residues
- Hydrophobic/polar interaction patterns and hydrogen bond counts
- Solvent-accessible surface area (ASA)

## Input, Output, Options

**Input**:
- Protein complex structure (PDB/mmCIF format)

**Output**:
- **ΔG (kcal/mol)** and **Kd (at room temperature)**
- Interface structure and list of interacting residues
- Interaction type statistics and overall binding affinity summary

**Configuration Parameters**:
- **Distance Cutoff (Å):** Maximum distance to define a contact (default 5 Å)
- **Acc Threshold (Å²):** Minimum ASA change to count as an interaction (default 0.5 Å²)
- **Temperature (°C):** Used for ΔG–Kd conversion (default: room temperature)
- **Selection Chains:** Select specific chains to analyze (e.g., focus only on heavy chain–antigen interaction, excluding intra-antibody chains)

## Applications & Key Features
- Rapidly estimate **PPI binding affinity** between protein pairs
- Evaluate **mutational effects** on interfacial stability and free energy changes
- Significantly faster than molecular dynamics (MD) or physics-based energy models
- Provides interpretable contact-level features for structural analysis

## Comparable Models
- **DeepRank2:** A CNN/GNN-based deep learning model offering more detailed, high-resolution affinity prediction.

## Related Models
- **HADDOCK** can be used to generate protein–protein complex structures as input for PRODIGY.
- Multiple complex ensembles produced by HADDOCK can be evaluated in batch mode with PRODIGY to **rank binding affinities** based on ΔG or Kd.

---

[tool-button:PRODIGY]
