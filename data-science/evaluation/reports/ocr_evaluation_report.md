# Laporan Evaluasi Model Custom OCR (Pengenal Tulisan Tangan)

## 1. Pengujian Arsitektur Model (Wajib Rubrik Capstone Spec)

| Nama Model / Konfigurasi | Teknik Preprocessing & Augmentasi | Macro F1-Score | Akurasi (Test Set) | Keterangan |
| :--- | :--- | :---: | :---: | :--- |
| **Model 1: MobileNetV2** | Resize 64x128, RandomRotation, ColorJitter, Normalization | **0.1150** | **18.75%** | Baseline Ringan |
| **Model 2: ResNet18 (Tuned)** | Resize 64x128, RandomAffine, ColorJitter, LR=0.0008, Adam | **0.9937** | **99.38%** | **Model Terpilih** |

---

## 2. Detail Evaluasi per Kelas Tulisan Tangan (Model Terpilih: ResNet18 (Fine-Tuned))

| Label Kelas | Precision | Recall | F1-Score | Support (Test Set) |
| :--- | :---: | :---: | :---: | :---: |
| `1` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `2` | 1.0000 | 0.9000 | 0.9474 | 10 |
| `3` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `4` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `5` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `BKS` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `ESTEH` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `MA` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `MAB` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `MAK` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `MAP` | 0.9091 | 1.0000 | 0.9524 | 10 |
| `PGR` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `QRIS` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `TEH` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `TELER` | 1.0000 | 1.0000 | 1.0000 | 10 |
| `TUNAI` | 1.0000 | 1.0000 | 1.0000 | 10 |
| **Macro Avg** | **0.9943** | **0.9938** | **0.9937** | **160** |
| **Accuracy** | **0.9938** | **0.9938** | **0.9938** | **160** |
