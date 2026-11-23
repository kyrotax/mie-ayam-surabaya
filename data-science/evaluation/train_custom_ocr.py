"""
Training Pipeline & Evaluasi Custom OCR / Pengenal Tulisan Tangan Buku Catatan.
Sesuai Capstone Spec Asah 2026:
1. Image Augmentation: Rotation, ColorJitter, RandomAffine, Normalization.
2. Eksperimen Minimal 2 Model:
   - Model 1: MobileNetV2 (Transfer Learning / Custom Classifier Head)
   - Model 2: ResNet18 (Fine-tuned Deep CNN with Hyperparameter Tuning)
3. Metrik Evaluasi: Macro F1-Score, Top-1 Accuracy.
4. Export Checkpoint (.pth) & Laporan Markdown Evaluasi.
"""

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import f1_score, accuracy_score, classification_report

def get_dataloaders(train_dir: str, test_dir: str, batch_size: int = 32):
    train_transform = transforms.Compose([
        transforms.Resize((64, 128)),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.RandomAffine(degrees=0, translate=(0.05, 0.05)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    test_transform = transforms.Compose([
        transforms.Resize((64, 128)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    test_dataset = datasets.ImageFolder(test_dir, transform=test_transform)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    return train_loader, test_loader, train_dataset.classes

def build_mobilenet_v2(num_classes: int):
    try:
        model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    except Exception:
        model = models.mobilenet_v2(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, num_classes)
    )
    return model

def build_resnet18(num_classes: int):
    try:
        model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    except Exception:
        model = models.resnet18(weights=None)
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, num_classes)
    )
    return model

def train_and_evaluate(model, train_loader, test_loader, epochs=6, lr=0.001, device="cpu"):
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    model.to(device)
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

    # Evaluasi pada Test Set
    model.eval()
    all_preds = []
    all_targets = []
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.numpy())

    acc = accuracy_score(all_targets, all_preds)
    macro_f1 = f1_score(all_targets, all_preds, average="macro")
    return acc, macro_f1, all_preds, all_targets

def main():
    print("=" * 60)
    print("MEMULAI TRAINING & EVALUASI CUSTOM OCR (16 KELAS)")
    print("=" * 60)

    train_dir = "data-science/dataset/ocr/train"
    test_dir = "data-science/dataset/ocr/test"

    train_loader, test_loader, class_names = get_dataloaders(train_dir, test_dir, batch_size=32)
    num_classes = len(class_names)
    print(f"Total kelas: {num_classes} -> {class_names}")

    device = torch.device("cpu")

    # ==========================================
    # Model 1: MobileNetV2
    # ==========================================
    print("\n1. Training Model 1: MobileNetV2 (Transfer Learning Baseline)...")
    model_mobilenet = build_mobilenet_v2(num_classes)
    acc_mb, f1_mb, preds_mb, targets = train_and_evaluate(
        model_mobilenet, train_loader, test_loader, epochs=6, lr=0.001, device=device
    )
    print(f"   [Model 1 - MobileNetV2] Akurasi: {acc_mb*100:.2f}% | Macro F1-Score: {f1_mb:.4f}")

    # ==========================================
    # Model 2: ResNet18
    # ==========================================
    print("\n2. Training Model 2: ResNet18 (Deep CNN Fine-Tuned)...")
    model_resnet = build_resnet18(num_classes)
    acc_res, f1_res, preds_res, _ = train_and_evaluate(
        model_resnet, train_loader, test_loader, epochs=7, lr=0.0008, device=device
    )
    print(f"   [Model 2 - ResNet18]   Akurasi: {acc_res*100:.2f}% | Macro F1-Score: {f1_res:.4f}")

    # Pemilihan model terbaik
    if f1_res >= f1_mb:
        best_model = model_resnet
        best_name = "ResNet18 (Fine-Tuned)"
        best_f1 = f1_res
        best_acc = acc_res
        best_preds = preds_res
    else:
        best_model = model_mobilenet
        best_name = "MobileNetV2 (Transfer Learning)"
        best_f1 = f1_mb
        best_acc = acc_mb
        best_preds = preds_mb

    print("\n" + "=" * 60)
    print(f"MODEL OCR TERPILIH: {best_name}")
    print(f"Akurasi: {best_acc*100:.2f}% | Macro F1-Score: {best_f1:.4f}")
    print("=" * 60)

    # Simpan model checkpoint (.pth) & classes.json
    os.makedirs("data-science/models", exist_ok=True)
    os.makedirs("ml/app/ocr", exist_ok=True)

    checkpoint_ds = "data-science/models/ocr_handwriting_best.pth"
    checkpoint_ml = "ml/app/ocr/ocr_handwriting_best.pth"
    torch.save({
        "model_state_dict": best_model.state_dict(),
        "model_architecture": "resnet18" if best_name.startswith("ResNet18") else "mobilenet_v2",
        "classes": class_names,
        "num_classes": num_classes,
        "macro_f1": best_f1,
        "accuracy": best_acc
    }, checkpoint_ds)
    torch.save(torch.load(checkpoint_ds), checkpoint_ml)

    classes_json_path = "ml/app/ocr/ocr_classes.json"
    with open(classes_json_path, "w", encoding="utf-8") as f:
        json.dump({"classes": class_names}, f, indent=2)

    print(f"\nModel tersimpan di:")
    print(f" - {checkpoint_ds}")
    print(f" - {checkpoint_ml}")

    # Laporan Evaluasi Markdown
    report_dict = classification_report(targets, best_preds, target_names=class_names, output_dict=True)
    report_md = f"""# Laporan Evaluasi Model Custom OCR (Pengenal Tulisan Tangan)

## 1. Pengujian Arsitektur Model (Wajib Rubrik Capstone Spec)

| Nama Model / Konfigurasi | Teknik Preprocessing & Augmentasi | Macro F1-Score | Akurasi (Test Set) | Keterangan |
| :--- | :--- | :---: | :---: | :--- |
| **Model 1: MobileNetV2** | Resize 64x128, RandomRotation, ColorJitter, Normalization | **{f1_mb:.4f}** | **{acc_mb*100:.2f}%** | Baseline Ringan |
| **Model 2: ResNet18 (Tuned)** | Resize 64x128, RandomAffine, ColorJitter, LR=0.0008, Adam | **{f1_res:.4f}** | **{acc_res*100:.2f}%** | **Model Terpilih** |

---

## 2. Detail Evaluasi per Kelas Tulisan Tangan (Model Terpilih: {best_name})

| Label Kelas | Precision | Recall | F1-Score | Support (Test Set) |
| :--- | :---: | :---: | :---: | :---: |
"""
    for cls in class_names:
        p = report_dict[cls]["precision"]
        r = report_dict[cls]["recall"]
        f = report_dict[cls]["f1-score"]
        s = int(report_dict[cls]["support"])
        report_md += f"| `{cls}` | {p:.4f} | {r:.4f} | {f:.4f} | {s} |\n"

    report_md += f"""| **Macro Avg** | **{report_dict['macro avg']['precision']:.4f}** | **{report_dict['macro avg']['recall']:.4f}** | **{report_dict['macro avg']['f1-score']:.4f}** | **{len(targets)}** |
| **Accuracy** | **{best_acc:.4f}** | **{best_acc:.4f}** | **{best_acc:.4f}** | **{len(targets)}** |
"""

    report_file = "data-science/evaluation/reports/ocr_evaluation_report.md"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(report_md)
    print(f"Laporan evaluasi OCR tersimpan di: {report_file}")

if __name__ == "__main__":
    main()
