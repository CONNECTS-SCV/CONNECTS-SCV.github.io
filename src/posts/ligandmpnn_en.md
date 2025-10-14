---
layout: post
title: "LigandMPNN : Optimizing Protein Sequences for Specific Ligand Binding"
description: "An MPNN-based deep learning model that optimizes protein sequences to improve binding affinity toward a specific ligand."
categories: [analysis]
tags: [LigandMPNN, ProteinMPNN, Deep Learning, Ligand Binding, Protein Design]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
---
LigandMPNN is an MPNN-based deep learning model that optimizes protein sequences to improve binding affinity toward a specific ligand provided as input. It refines the amino acid sequence of a protein so that its structure better accommodates the ligand’s geometry and chemical environment.

## Mechanism
---
LigandMPNN converts both **protein** and **ligand** into graph representations:

- For **proteins**, **nodes** represent amino acids, and **edges** encode distances between backbone atoms.
- For **ligands**, **nodes** represent atoms, and **edges** encode interatomic distances.

Intermolecular edges are added to represent **protein–ligand interactions**, and information is exchanged between the two graphs through **message passing**.

The network learns to generate sequences that yield **high binding affinity** to the ligand by updating residue embeddings iteratively.

LigandMPNN follows the same core concept as other ProteinMPNN variants that probabilistically sample amino acids for each residue position based on structural context, including:

- **ProteinMPNN (original)**
- **ThermoMPNN**
- **AntiBMPNN**
- **HyperMPNN**

## Input, Output, Options
---

**Input**:
- Protein–ligand complex structure (PDB format)
::note
Complexes can be easily generated using Chai or Boltz models.
::/note

**Output**:
- Optimized protein sequences with enhanced ligand-binding affinity
- Sequence-specific scoring metrics

**Configuration Parameters**:
- **Packing intensity [1–10]:** Controls exploration range (lower = local optimization, higher = broader search).
- **Number of packings per design:** Number of sequences to generate per structure.
- **Fixed residues:** Specify residues to remain unchanged during optimization.


## Applications & Key Features
---
- Optimization of **enzyme–cofactor** interactions in enzyme engineering.
- Directly tunes **protein sequences** to improve ligand binding.
- Performance is largely independent of ligand size or molecular complexity.
- Less suitable for drug discovery pipelines where modifying the protein sequence itself is impractical.


## Comparable Models
---
- **ADFLIP:** Optimizes **side-chain conformations** of fixed sequences, unlike LigandMPNN, which redesigns the sequence itself.
- **DiffDock:** Keeps protein sequence and structure fixed while optimizing the **ligand’s binding pose**.


## Related Models
---
- If only the **protein structure** and **ligand SMILES** are available, the **Boltz-2** model can generate the initial complex for LigandMPNN input.
- **RFdiffusion** can generate new proteins under ligand-binding constraints, which can then be fine-tuned using LigandMPNN.
- Since LigandMPNN does not directly output affinity scores, its results can be validated using **PIGNET2** or **AutoDock** for quantitative binding affinity evaluation.


[tool-button:LigandMPNN]
