# Laporan Evaluasi Model Klasifikasi Intent Chatbot

## 1. Distribusi Dataset & Penanganan Imbalanced Data
Distribusi data latih sebelum vs sesudah penanganan **SMOTE (Synthetic Minority Over-sampling Technique)**:

| Kelas Intent | Train Sebelum SMOTE (Sampel) | Persentase Sebelum | Train Sesudah SMOTE (Sampel) | Persentase Sesudah |
| :--- | :---: | :---: | :---: | :---: |
| `tanya_produk` | 143 | 45.3% | 143 | 25.0% |
| `pemesanan` | 78 | 24.7% | 143 | 25.0% |
| `keluhan` | 47 | 14.9% | 143 | 25.0% |
| `lainnya` | 48 | 15.2% | 143 | 25.0% |
| **Total** | **316** | **100%** | **572** | **100%** |

---

## 2. Tabel Perbandingan Model (Wajib Rubrik Capstone Spec)

| Nama Model / Konfigurasi | Teknik Preprocessing & Tuning | Macro F1-Score | Weighted F1-Score | Keterangan |
| :--- | :--- | :---: | :---: | :--- |
| **Model 1: TF-IDF + Logistic Regression** | Case folding, Slang norm, TF-IDF (1,2) + SMOTE | **0.9564** | **0.9618** | Baseline |
| **Model 2: TF-IDF + Linear SVM (Tuned)** | Case folding, Slang norm, GridSearchCV (`C=2.0`, loss='hinge') + SMOTE | **0.9715** | **0.9748** | **Model Terpilih** |

---

## 3. Detail Performa per Kelas (Model Terpilih: TF-IDF + Linear SVM (Tuned))

| Kelas Intent | Precision | Recall | F1-Score | Support (Test Set) |
| :--- | :---: | :---: | :---: | :---: |
| `keluhan` | 1.0000 | 0.9167 | 0.9565 | 12 |
| `lainnya` | 1.0000 | 0.9167 | 0.9565 | 12 |
| `pemesanan` | 1.0000 | 1.0000 | 1.0000 | 20 |
| `tanya_produk` | 0.9474 | 1.0000 | 0.9730 | 36 |
| **Macro Avg** | **0.9868** | **0.9583** | **0.9715** | **80** |
| **Weighted Avg** | **0.9763** | **0.9750** | **0.9748** | **80** |
