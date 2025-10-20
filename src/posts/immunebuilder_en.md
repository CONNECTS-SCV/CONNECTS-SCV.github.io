---
layout: post
title: "Immunebuilder : An AlphaFold-Based Model for Antibody and TCR Structure Prediction"
description: "An AlphaFold-based deep learning model specialized for predicting the 3D structures of antibodies (including nanobodies) and T-cell receptors (TCRs)."
categories: [analysis]
tags: [Immunebuilder, AlphaFold, Antibody, TCR, Structure Prediction]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
---
Immunebuilder is an AlphaFold-based deep learning model specialized for predicting the 3D structures of antibodies (including nanobodies) and T-cell receptors (TCRs).
Developed by the OPIG group, the model builds on AlphaFold’s multimer framework and has evolved through multiple versions, with AntibodyBuilder v3 being the latest for antibody-specific predictions.

## Mechanism
---
Immunebuilder extends **AlphaFold-Multimer** by fine-tuning its structure prediction module specifically for **antibody**, **nanobody**, and **TCR** systems. It uses a **transformer-based attention network** to learn spatial relationships between amino acid residues.

When a sequence is input, the model begins with all residues collapsed into a single point and iteratively updates their **spatial coordinates** and **orientations** through multiple refinement steps. After convergence, torsion angles between residues are adjusted, and the final 3D structure is output. Unlike traditional models that grow the chain sequentially (N-to-C direction), Immunebuilder predicts the **entire structure simultaneously**, capturing global interactions more effectively.

## Input, Output, Options
---

**Input**:
- Amino acid sequence (FASTA format)

**Output**:
- Predicted 3D structure of the input sequence (PDB format)

**Options**:
- Structure type: **Antibody**, **Nanobody**, or **TCR**

## Applications & Key Features
---
- Generate **in silico antibody libraries** from sequence data in the early stages of antibody discovery.
- Predict structural outcomes of **CDR loop engineering** or sequence mutations.
- Outperforms **AlphaFold-Multimer** in both **speed and accuracy** for antibody and TCR structures due to domain-specific fine-tuning.
- Optimized for antibody-specific geometry, particularly **CDR loop conformations**.
- Does **not** account for antigen interactions; therefore, additional optimization using models like **RFantibody** is recommended.

## Comparable Models
---
- **AlphaFold-Multimer:** General-purpose structure prediction model for protein complexes; useful for cross-validation.
- **DeepAb:** Specialized in detailed **CDR3 loop refinement** for antibody modeling.
- **Nanonet:** Focused on **nanobody design** and structure generation.


## Related Models
---
- Predicted antibody structures from **Immunebuilder** can be docked to antigens using **HADDOCK** for complex formation. **PRODIGY** can then estimate **binding affinity** of the predicted complexes.
- For antigen-aware optimization, additional refinement using **MPNN-based** or **diffusion-based** models (e.g., **ProteinMPNN**, **RFdiffusion**) is recommended.

---

[tool-button:Immunebuilder]
