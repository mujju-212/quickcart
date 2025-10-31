import requests
import json

print("🧪 Testing QuickCart API...")
print("=" * 50)

# Test 1: Health Check
try:
    response = requests.get('http://localhost:5001/health')
    print(f"\n✅ Health Check: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"\n❌ Health Check Failed: {e}")

# Test 2: Get Categories
try:
    response = requests.get('http://localhost:5001/api/categories')
    data = response.json()
    print(f"\n✅ Categories: {response.status_code}")
    print(f"   Count: {data.get('count', 0)}")
    print(f"   Success: {data.get('success', False)}")
    if data.get('categories'):
        print(f"   First category: {data['categories'][0]['name']}")
except Exception as e:
    print(f"\n❌ Categories Failed: {e}")

# Test 3: Get Products
try:
    response = requests.get('http://localhost:5001/api/products')
    data = response.json()
    print(f"\n✅ Products: {response.status_code}")
    print(f"   Count: {data.get('count', 0)}")
    print(f"   Success: {data.get('success', False)}")
    if data.get('products'):
        print(f"   First product: {data['products'][0]['name']}")
except Exception as e:
    print(f"\n❌ Products Failed: {e}")

print("\n" + "=" * 50)
print("🎉 API Testing Complete!")
