# Machine Learning

This directory contains ML models, datasets, and training scripts for the AEGIS system.

## Structure

- **datasets/**: Training and testing datasets
- **notebooks/**: Jupyter notebooks for analysis
- **training/**: Training scripts and configurations
- **evaluation/**: Evaluation scripts and metrics
- **models/**: Trained model files

## Setup

### Create Virtual Environment

```bash
python3.10 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

## Training

### Train Anomaly Detection Model

```bash
python training/train_anomaly.py --data-path datasets/network_traffic.csv
```

### Train Classification Model

```bash
python training/train_classifier.py --data-path datasets/labeled_events.csv
```

## Evaluation

### Evaluate Model

```bash
python evaluation/evaluate.py --model-path models/anomaly.pkl --test-path datasets/test.csv
```

### Generate Report

```bash
python evaluation/report.py --model-path models/anomaly.pkl
```

## Notebooks

### Data Exploration

```bash
jupyter notebook notebooks/exploration.ipynb
```

### Model Development

```bash
jupyter notebook notebooks/model_development.ipynb
```

## Model Deployment

### Export Model

```bash
python training/export_model.py --model-path models/anomaly.pkl --output-format onnx
```

### Deploy to AEGIS

Copy model to `src-tauri/src/ml/models/`:
```bash
cp models/anomaly.pkl ../src-tauri/src/ml/models/
```

## Datasets

### Public Datasets

- **KDD Cup 99**: Classic intrusion detection dataset
- **UNSW-NB15**: Modern network intrusion dataset
- **CICIDS2017**: Comprehensive intrusion detection dataset

### Custom Datasets

Place custom datasets in `datasets/` directory.

## Requirements

### Python Requirements

```text
numpy>=1.21.0
pandas>=1.3.0
scikit-learn>=1.0.0
tensorflow>=2.8.0
torch>=1.11.0
jupyter>=1.0.0
matplotlib>=3.5.0
seaborn>=0.11.0
onnx>=1.10.0
onnxruntime>=1.8.0
```

## Model Versioning

### Version Control

Track model versions using Git LFS:
```bash
git lfs track "*.pkl"
git lfs track "*.onnx"
git add .gitattributes
```

### Model Registry

Maintain model metadata in `models/registry.json`:
```json
{
  "models": [
    {
      "name": "anomaly_detection",
      "version": "1.0.0",
      "path": "models/anomaly.pkl",
      "accuracy": 0.95,
      "trained_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```
