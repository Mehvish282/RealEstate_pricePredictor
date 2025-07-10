import os
import json
import joblib
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

# Load model and scaler once at startup
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, 'model', 'real_estate_model.pkl')
scaler_path = os.path.join(base_dir, 'model', 'scalar.pkl')

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

@csrf_exempt
def home(request):
    return render(request, 'index.html')


@csrf_exempt
def predict_price(request):
    if request.method == 'POST':
        try:
            # Get data from form POST
            house_age = float(request.POST.get("houseAge"))
            distance = float(request.POST.get("distanceToMRT"))
            stores = int(request.POST.get("numberOfStores"))
            latitude = float(request.POST.get("latitude"))
            longitude = float(request.POST.get("longitude"))
            year = int(request.POST.get("transactionYear"))
            month = int(request.POST.get("transactionMonth"))
            area_m2 = float(request.POST.get("propertyArea"))

            # Check for missing values
            if None in [house_age, distance, stores, latitude, longitude, year, month, area_m2]:
                return JsonResponse({"error": "Missing one or more required fields."}, status=400)

            # Prepare input and scale
            input_features = np.array([[house_age, distance, stores, latitude, longitude, year, month]])
            scaled_features = scaler.transform(input_features)
            price_per_m2 = model.predict(scaled_features)[0]
            total_price = price_per_m2 * area_m2

            # Predict
            return JsonResponse({
                "price_per_unit": round(price_per_m2, 2),
                "estimated_total_price": round(total_price, 2)
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)
