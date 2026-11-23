"""
Model Klasifikasi Sentimen Ulasan Pelanggan Mie Ayam Surabaya (Side Quest).
2 Kelas: 'positif' dan 'negatif'.
Pipeline: TF-IDF + Logistic Regression.
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score

reviews = [
    # Positif
    ("mie ayamnya enak banget, kuah kaldunya gurih harum mantap", "positif"),
    ("porsi pas, mie kenyal dan topping ayamnya melimpah", "positif"),
    ("pangsit gorengnya renyah gurih juara, wajib coba", "positif"),
    ("pelayanan ramah dan tempatnya bersih nyaman", "positif"),
    ("es telernya seger banget buahnya melimpah gak pelit", "positif"),
    ("mie ayam oriental terenak di sidoarjo rek!", "positif"),
    ("harga sangat terjangkau dengan rasa seenak ini", "positif"),
    ("recommended banget mie komplitnya baksonya berdaging", "positif"),
    ("sangat puas makan di sini, bakal langganan terus", "positif"),
    ("packing rapi dan kuah dipisah aman saat delivery", "positif"),
    ("sambalnya pedas nampol cocok banget sama kuah manisnya", "positif"),
    ("baksonya kenyal sedap, pelayanan cepat walau ramai", "positif"),
    
    # Negatif
    ("kecewa banget mie nya lembek kaya bubur", "negatif"),
    ("kuahnya asin kebangetan gak bisa kemakan", "negatif"),
    ("nunggu pesanannya lama banget hampir sejam padahal sepi", "negatif"),
    ("pelayan kasirnya judes dan kurang sopan melayani", "negatif"),
    ("tadi nemu rambut di mangkok mie ayam tolong jaga kebersihan", "negatif"),
    ("porsi sedikit banget gak sebanding sama harganya", "negatif"),
    ("es tehnya tawar kayak air kobokan gulanya gak berasa", "negatif"),
    ("pangsitnya alot dan bau apek gak renyah", "negatif"),
    ("kembalian kurang dan kasir gak minta maaf sama sekali", "negatif"),
    ("ayamnya ada yang bau basi tolong dicek kualitasnya", "negatif"),
    ("kuah dingin dan hambar gak ada rasa kaldunya", "negatif"),
    ("salah kasih menu minta komplit malah dikasih biasa", "negatif"),
]

# Sintesis variasi
extended_reviews = []
for text, sentiment in reviews:
    extended_reviews.append({"text": text, "sentiment": sentiment})
    extended_reviews.append({"text": text.lower() + " mantap", "sentiment": sentiment})
    extended_reviews.append({"text": "asli " + text.lower(), "sentiment": sentiment})

df = pd.DataFrame(extended_reviews)
X_train, X_test, y_train, y_test = train_test_split(df["text"], df["sentiment"], test_size=0.25, random_state=42, stratify=df["sentiment"])

vec = TfidfVectorizer(ngram_range=(1, 2))
X_train_vec = vec.fit_transform(X_train)
X_test_vec = vec.transform(X_test)

model = LogisticRegression(random_state=42)
model.fit(X_train_vec, y_train)

preds = model.predict(X_test_vec)
f1 = f1_score(y_test, preds, average="macro")
print(f"Sentiment Model Macro F1-Score: {f1:.4f}")

artifact = {
    "vectorizer": vec,
    "model": model,
    "classes": list(model.classes_)
}

os.makedirs("ml/app/classifier", exist_ok=True)
joblib.dump(artifact, "ml/app/classifier/sentiment_model.joblib")
print("Model sentimen tersimpan di: ml/app/classifier/sentiment_model.joblib")
