# 🏠 Real Estate Price Predictor (Django + Machine Learning)

This project is a web-based real estate price prediction system powered by Machine Learning. It uses property details to estimate the price per square meter and the total estimated property cost.<!-- Optional if you want to show a preview -->

---

## 🚀 Features

- Predicts **price per m²** based on user inputs
- Calculates **total estimated price** based on property area
- Clean UI with **dynamic result display**
- Built using **Django**, **HTML/CSS**, and **JavaScript**
- ML model trained using **scikit-learn**
- Supports smooth scrolling and form validation

---

## 📊 Technologies Used

- Python 3
- Django (Backend)
- HTML, CSS, JavaScript (Frontend)
- Scikit-learn, NumPy, Joblib
- Pre-trained Regression Model

---

## 🧠 Model Details

The model was trained on historical housing data using features like:
- House age
- Distance to MRT station
- Number of stores nearby
- Latitude, Longitude
- Transaction year & month

The output is **price per square meter**, which is multiplied by the entered area to get the total price.

---

## ⚙️ How to Run Locally

1. Clone the repo:

   ```bash
   git clone https://github.com/Mehvish282/RealEstate_pricePredictor.git
   cd RealEstate_pricePredictor
