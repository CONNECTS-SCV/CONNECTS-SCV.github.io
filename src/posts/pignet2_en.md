---
layout: post
title: "PIGNET2 : A Model for Predicting Protein–Ligand Binding Affinity"
description: "A graph neural network (GNN) model that predicts the binding affinity of protein-ligand interactions by quantitatively estimating physical interaction energies."
categories: [analysis]
tags: [PIGNET2, GNN, Binding Affinity, Protein-Ligand, Deep Learning]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
PIGNET2 is a graph neural network (GNN)–based model that predicts the binding affinity of protein–ligand interactions.

It quantitatively estimates physical interaction energies and provides a composite score representing the overall stability of the protein–ligand complex.

## Mechanism
The protein–ligand complex is converted into a **graph representation**, where amino acid residues act as **nodes** and molecular interactions serve as **edges**.

The model learns various physical energy components — including **electrostatic**, **van der Waals**, **hydrogen bonding**, and **hydrophobic interactions** — to approximate the total binding energy.

Using experimentally measured **binding affinity datasets**, PIGNET2 is trained with augmented samples:

- **Positive samples** represent near-native docking poses.
- **Negative samples** represent incorrect or low-quality docking configurations.

Through GNN-based message passing, the model extracts interaction patterns and outputs a final **binding affinity score** via a scoring network.

## Input, Output, Options

**Input**:
- Protein structure (PDB format)
- Ligand structure (SDF format)

**Output**:
Predicted energy components and total estimated binding energy:
  - **Complex_E:** Total complex energy (Estimated Total Energy)
  - **elecE:** Electrostatic interaction energy
  - **vdwE:** van der Waals interaction energy
  - **hbondE:** Hydrogen bond energy
  - **hydrophobicE:** Hydrophobic interaction energy
  - **metalE:** Metal coordination energy
  - **piE:** π–π stacking and other aromatic interaction energies
  - **total:** Combined binding energy (overall affinity score)

**Configuration Parameters**:
- No user-defined parameters required

## Applications & Key Features
- Quantitatively estimate and compare **binding affinities** across different ligands bound to the same target
- Rank ligand candidates based on predicted stability and interaction energy
- Incorporates **physical interaction energies** into learning, improving interpretability
- Enables accurate affinity prediction given a well-defined protein–ligand complex structure

## Comparable Models
- **GenScore:** Provides docking pose quality scoring but does **not** directly predict binding affinity.
- **Boltz-2:** A more advanced model capable of **end-to-end complex prediction** and **affinity estimation**, making it complementary for cross-validation with PIGNET2.

## Related Models
- **DiffDock** can be used to generate protein–ligand complexes as inputs for PIGNET2, forming a unified workflow for **structure generation** and **affinity evaluation**.

---

[tool-button:PIGNET2]
