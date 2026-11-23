"""
Training Pipeline & Model Comparison untuk Intent Classification Chatbot Mie Ayam Surabaya.
Sesuai Capstone Spec Asah 2026:
1. Text Preprocessing: case folding, cleaning, slang normalization.
2. Train/Test Split (80/20) tanpa data leakage.
3. Imbalance Handling: SMOTE (Synthetic Minority Over-sampling Technique) pada data latih.
4. Perbandingan 2 Model:
   - Model 1: TF-IDF + Logistic Regression (Baseline)
   - Model 2: TF-IDF + Linear SVM (GridSearchCV Hyperparameter Tuning)
5. Metrik Evaluasi: Macro F1-Score, Weighted F1-Score, Precision, Recall, Confusion Matrix.
6. Export Model Terbaik (.joblib) & Laporan Markdown.
"""

import os
import re
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score, confusion_matrix
from imblearn.over_sampling import SMOTE

# Kamus Normalisasi Slang & Singkatan Chat Lokal Sidoarjo / Surabaya
SLANG_MAP = {
    r"\bma\b": "mie ayam",
    r"\bmap\b": "mie ayam pangsit",
    r"\bmab\b": "mie ayam bakso",
    r"\bmak\b": "mie ayam komplit",
    r"\besteh\b": "es teh",
    r"\bteh anget\b": "teh hangat",
    r"\besteler\b": "es teler",
    r"\bbrp\b": "berapa",
    r"\budh\b": "sudah",
    r"\bsdh\b": "sudah",
    r"\bblm\b": "belum",
    r"\bbs\b": "bisa",
    r"\bgak\b": "tidak",
    r"\bga\b": "tidak",
    r"\bnggak\b": "tidak",
    r"\bgk\b": "tidak",
    r"\bdmn\b": "dimana",
    r"\btgl\b": "tanggal",
    r"\bbsk\b": "besok",
    r"\bhr\b": "hari",
    r"\bjm\b": "jam",
    r"\bkmrn\b": "kemarin",
    r"\btd\b": "tadi",
    r"\bdr\b": "dari",
    r"\bbwt\b": "buat",
    r"\butk\b": "untuk",
    r"\bmin\b": "admin",
    r"\bkak\b": "kakak",
    r"\bgmn\b": "bagaimana",
    r"\bdgn\b": "dengan",
    r"\bsy\b": "saya",
    r"\bak\b": "aku",
    r"\bmakasih\b": "terima kasih",
    r"\btq\b": "terima kasih",
    r"\bthx\b": "terima kasih"
}

def preprocess_text(text: str) -> str:
    """Case folding, standarisasi slang, dan pembersihan karakter non-alfanumerik."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    # Hapus URL
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    # Hapus karakter selain huruf dan angka
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    # Normalisasi slang
    for pattern, replacement in SLANG_MAP.items():
        text = re.sub(pattern, replacement, text)
    # Hapus multiple whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text

def main():
    print("=" * 60)
    print("MEMULAI TRAINING & EVALUASI INTENT CLASSIFICATION (4 KELAS)")
    print("=" * 60)

    dataset_path = "data-science/dataset/chat/intent_dataset.csv"
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"File dataset tidak ditemukan: {dataset_path}")

    df = pd.read_csv(dataset_path)
    print(f"\n1. Memuat dataset: {len(df)} total baris.")
    
    # Preprocessing
    df["clean_text"] = df["text"].apply(preprocess_text)
    
    # Train / Test Split (Stratified 80/20)
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        df["clean_text"],
        df["intent"],
        test_size=0.20,
        random_state=42,
        stratify=df["intent"]
    )
    
    print("\n2. Distribusi Data Train Sebelum SMOTE:")
    train_dist_before = y_train.value_counts()
    for intent, count in train_dist_before.items():
        print(f"   - {intent:<15}: {count} ({count/len(y_train)*100:.1f}%)")

    # Feature Extraction: TF-IDF
    # ngram_range (1, 2) untuk menangkap kombinasi kata seperti 'mie ayam', 'jam buka'
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True
    )
    X_train_vec = vectorizer.fit_transform(X_train_raw)
    X_test_vec = vectorizer.transform(X_test_raw)
    print(f"\n3. TF-IDF Vocabulary Size: {len(vectorizer.vocabulary_)} fitur.")

    # Imbalance Handling dengan SMOTE
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train_vec, y_train)

    print("\n4. Distribusi Data Train Setelah SMOTE:")
    train_dist_after = pd.Series(y_train_res).value_counts()
    for intent, count in train_dist_after.items():
        print(f"   - {intent:<15}: {count} ({count/len(y_train_res)*100:.1f}%)")

    # ==========================================
    # Model 1: TF-IDF + Logistic Regression (Baseline)
    # ==========================================
    print("\n" + "-" * 50)
    print("5. Training Model 1: TF-IDF + Logistic Regression (Baseline)...")
    clf_lr = LogisticRegression(max_iter=1000, random_state=42)
    clf_lr.fit(X_train_res, y_train_res)
    y_pred_lr = clf_lr.predict(X_test_vec)

    macro_f1_lr = f1_score(y_test, y_pred_lr, average="macro")
    weighted_f1_lr = f1_score(y_test, y_pred_lr, average="weighted")
    print(f"   [Model 1] Macro F1-Score:    {macro_f1_lr:.4f}")
    print(f"   [Model 1] Weighted F1-Score: {weighted_f1_lr:.4f}")

    # ==========================================
    # Model 2: TF-IDF + Linear SVM (GridSearchCV Tuned)
    # ==========================================
    print("\n" + "-" * 50)
    print("6. Training Model 2: TF-IDF + Linear SVM (GridSearchCV Hyperparameter Tuning)...")
    param_grid_svm = {
        "C": [0.1, 0.5, 1.0, 2.0, 5.0],
        "loss": ["hinge", "squared_hinge"],
        "max_iter": [2000]
    }
    grid_svm = GridSearchCV(
        LinearSVC(random_state=42),
        param_grid=param_grid_svm,
        cv=5,
        scoring="f1_macro",
        n_jobs=-1
    )
    grid_svm.fit(X_train_res, y_train_res)
    best_svm = grid_svm.best_estimator_
    print(f"   Best Params SVM: {grid_svm.best_params_}")
    
    y_pred_svm = best_svm.predict(X_test_vec)
    macro_f1_svm = f1_score(y_test, y_pred_svm, average="macro")
    weighted_f1_svm = f1_score(y_test, y_pred_svm, average="weighted")
    print(f"   [Model 2] Macro F1-Score:    {macro_f1_svm:.4f}")
    print(f"   [Model 2] Weighted F1-Score: {weighted_f1_svm:.4f}")

    # Bandingkan & Pilih Model Terbaik
    if macro_f1_svm >= macro_f1_lr:
        best_model = best_svm
        best_name = "TF-IDF + Linear SVM (Tuned)"
        best_f1_macro = macro_f1_svm
        best_f1_weighted = weighted_f1_svm
        best_y_pred = y_pred_svm
    else:
        best_model = clf_lr
        best_name = "TF-IDF + Logistic Regression"
        best_f1_macro = macro_f1_lr
        best_f1_weighted = weighted_f1_lr
        best_y_pred = y_pred_lr

    print("\n" + "=" * 60)
    print(f"MODEL TERPILIH: {best_name}")
    print(f"Macro F1-Score: {best_f1_macro:.4f} | Weighted F1-Score: {best_f1_weighted:.4f}")
    print("=" * 60)

    # Classification Report
    labels = sorted(list(y_test.unique()))
    report_dict = classification_report(y_test, best_y_pred, target_names=labels, output_dict=True)
    report_text = classification_report(y_test, best_y_pred, target_names=labels)
    print("\nClassification Report (Model Terpilih):")
    print(report_text)

    # Simpan Artifacts (.joblib)
    os.makedirs("data-science/models", exist_ok=True)
    os.makedirs("ml/app/classifier", exist_ok=True)

    pipeline_artifact = {
        "vectorizer": vectorizer,
        "model": best_model,
        "labels": labels,
        "model_name": best_name,
        "macro_f1": best_f1_macro,
        "weighted_f1": best_f1_weighted
    }
    
    joblib_path_ds = "data-science/models/intent_model_best.joblib"
    joblib_path_ml = "ml/app/classifier/intent_model_best.joblib"
    joblib.dump(pipeline_artifact, joblib_path_ds)
    joblib.dump(pipeline_artifact, joblib_path_ml)
    print(f"\nModel tersimpan di:")
    print(f" - {joblib_path_ds}")
    print(f" - {joblib_path_ml}")

    # Buat Laporan Evaluasi Markdown untuk README
    report_md_content = f"""# Laporan Evaluasi Model Klasifikasi Intent Chatbot

## 1. Distribusi Dataset & Penanganan Imbalanced Data
Distribusi data latih sebelum vs sesudah penanganan **SMOTE (Synthetic Minority Over-sampling Technique)**:

| Kelas Intent | Train Sebelum SMOTE (Sampel) | Persentase Sebelum | Train Sesudah SMOTE (Sampel) | Persentase Sesudah |
| :--- | :---: | :---: | :---: | :---: |
| `tanya_produk` | {train_dist_before.get('tanya_produk', 0)} | {train_dist_before.get('tanya_produk', 0)/len(y_train)*100:.1f}% | {train_dist_after.get('tanya_produk', 0)} | 25.0% |
| `pemesanan` | {train_dist_before.get('pemesanan', 0)} | {train_dist_before.get('pemesanan', 0)/len(y_train)*100:.1f}% | {train_dist_after.get('pemesanan', 0)} | 25.0% |
| `keluhan` | {train_dist_before.get('keluhan', 0)} | {train_dist_before.get('keluhan', 0)/len(y_train)*100:.1f}% | {train_dist_after.get('keluhan', 0)} | 25.0% |
| `lainnya` | {train_dist_before.get('lainnya', 0)} | {train_dist_before.get('lainnya', 0)/len(y_train)*100:.1f}% | {train_dist_after.get('lainnya', 0)} | 25.0% |
| **Total** | **{len(y_train)}** | **100%** | **{len(y_train_res)}** | **100%** |

---

## 2. Tabel Perbandingan Model (Wajib Rubrik Capstone Spec)

| Nama Model / Konfigurasi | Teknik Preprocessing & Tuning | Macro F1-Score | Weighted F1-Score | Keterangan |
| :--- | :--- | :---: | :---: | :--- |
| **Model 1: TF-IDF + Logistic Regression** | Case folding, Slang norm, TF-IDF (1,2) + SMOTE | **{macro_f1_lr:.4f}** | **{weighted_f1_lr:.4f}** | Baseline |
| **Model 2: TF-IDF + Linear SVM (Tuned)** | Case folding, Slang norm, GridSearchCV (`C={grid_svm.best_params_['C']}`, loss='{grid_svm.best_params_['loss']}') + SMOTE | **{macro_f1_svm:.4f}** | **{weighted_f1_svm:.4f}** | **Model Terpilih** |

---

## 3. Detail Performa per Kelas (Model Terpilih: {best_name})

| Kelas Intent | Precision | Recall | F1-Score | Support (Test Set) |
| :--- | :---: | :---: | :---: | :---: |
"""
    for lbl in labels:
        p = report_dict[lbl]["precision"]
        r = report_dict[lbl]["recall"]
        f = report_dict[lbl]["f1-score"]
        s = int(report_dict[lbl]["support"])
        report_md_content += f"| `{lbl}` | {p:.4f} | {r:.4f} | {f:.4f} | {s} |\n"
    
    report_md_content += f"""| **Macro Avg** | **{report_dict['macro avg']['precision']:.4f}** | **{report_dict['macro avg']['recall']:.4f}** | **{report_dict['macro avg']['f1-score']:.4f}** | **{len(y_test)}** |
| **Weighted Avg** | **{report_dict['weighted avg']['precision']:.4f}** | **{report_dict['weighted avg']['recall']:.4f}** | **{report_dict['weighted avg']['f1-score']:.4f}** | **{len(y_test)}** |
"""

    report_file = "data-science/evaluation/reports/intent_evaluation_report.md"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(report_md_content)
    print(f"\nLaporan evaluasi tersimpan di: {report_file}")

if __name__ == "__main__":
    main()
