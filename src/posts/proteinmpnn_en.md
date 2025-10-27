---
layout: post
title: "ProteinMPNN : A Model for Designing Sequences That Fit Protein Structures"
description: "An MPNN-based deep learning model that performs inverse folding to design amino acid sequences optimized for a given 3D protein structure."
categories: [analysis]
tags: [ProteinMPNN, MPNN, Inverse Folding, Protein Design, Deep Learning]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
comment_id: "proteinmpnn_main"
paired_post: "proteinmpnn"
---

## Overview
---
ProteinMPNN is an MPNN-based deep learning model that designs amino acid sequences optimized for a given 3D protein structure.

As an inverse folding model, it focuses on mapping from structure → sequence, generating realistic sequences that fit structural constraints.

## Mechanism
---
ProteinMPNN follows the **Message Passing Neural Network (MPNN)** architecture.

From the input protein structure, it constructs a graph where **nodes** represent residues and **edges** encode geometric relationships (distance and orientation). Through iterative message passing, each residue embedding is updated based on its neighbors, and the model outputs a **probability distribution of amino acids** that best fit the given structure.

However, the model’s performance depends heavily on the **quality of the input structure**. Poorly resolved or synthetic structures (e.g., fusion proteins) can yield unstable predictions.

Additionally, while the model optimizes sequence–structure compatibility, it does **not guarantee functional properties**, so experimental or cross-model validation is recommended.

## Input, Output, Options
---

**Input** :
- Protein 3D structure (PDB format)

**Output**:
- Optimized amino acid sequence (FASTA format)

**Configuration Parameters**:
- **Sampling temperature:** Controls sequence diversity (higher = more diverse sequences)
- **Sequences for target:** Number of sequences to generate
- **Constraints:**
  - **fixed** – Keep specific residues unchanged
  - **tied** – Force residues to share the same amino acid
  - **design only** – Modify only selected regions
  - **auto-tie** – Automatically tie symmetric residues
  - Include or exclude specific amino acids (e.g., reduce hydrophobic residues)
- **PSSM multiplier:** Controls how strongly MSA-based amino acid preferences are reflected

## Applications & Key Features
---
- Generate novel sequences compatible with de novo protein structures
- Design **CDR loop sequences** that fit antibody–antigen interfaces
- Significantly faster inference than legacy inverse folding models
- Trained directly on **PDB structures**, producing more realistic and experimentally viable sequences

## Comparable Models
---
- **ProteinMPNN** remains the **state-of-the-art** in inverse folding for both speed and accuracy.
- For antibody-specific sequence generation, cross-validation can be performed with **Antifold**.

## Related Models
---
- Combine with **RFdiffusion** to generate a structure first, then assign sequences using ProteinMPNN.
  - The **RFantibody** workflow integrates these steps into one pipeline.
- The designed sequences can be validated by predicting structures with **Boltz-2** or **AlphaFold**, followed by binding affinity estimation using **Prodigy**.

---

[tool-button:ProteinMPNN]
