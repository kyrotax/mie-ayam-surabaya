from pathlib import Path
import joblib
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from app.normalize import normalize_text

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset" / "intent_dataset.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "intent_svm.joblib"


def build_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    sublinear_tf=True,
                    min_df=1,
                ),
            ),
            (
                "clf",
                CalibratedClassifierCV(
                    estimator=LinearSVC(C=1.0, random_state=42),
                    cv=5,
                ),
            ),
        ]
    )


def main() -> None:
    df = pd.read_csv(DATASET_PATH)
    df["normalized_text"] = df["text"].astype(str).apply(normalize_text)

    X = df["normalized_text"]
    y = df["intent"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    eval_pipeline = build_pipeline()
    eval_pipeline.fit(X_train, y_train)

    y_pred = eval_pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Validation Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, digits=4))

    # Latih ulang pada seluruh dataset untuk artefak produksi
    prod_pipeline = build_pipeline()
    prod_pipeline.fit(X, y)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(prod_pipeline, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()
