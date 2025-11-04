"""
Test the analytics API endpoint
"""
import requests

# Test endpoint (without auth for now - will need admin token in production)
url = "http://localhost:5001/api/analytics/dashboard-stats"

try:
    response = requests.get(url)
    print("=" * 60)
    print("📊 ANALYTICS API TEST")
    print("=" * 60)
    print(f"Status Code: {response.status_code}")
    print()
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            stats = data['data']
            totals = stats.get('totals', {})
            
            print("✅ API WORKING! Here's the data:")
            print()
            print("📊 Dashboard Totals:")
            print(f"  • Total Orders: {totals.get('totalOrders', 0)}")
            print(f"  • Total Products: {totals.get('totalProducts', 0)}")
            print(f"  • Total Users: {totals.get('totalUsers', 0)}")
            print(f"  • Total Revenue: ₹{totals.get('totalRevenue', 0):,.2f}")
            print()
            
            print("📈 Orders by Status:")
            orders_by_status = stats.get('ordersByStatus', {})
            for status, count in orders_by_status.items():
                print(f"  • {status}: {count}")
            print()
            
            print(f"📦 Recent Orders: {len(stats.get('recentOrders', []))} orders")
            print(f"🏆 Top Products: {len(stats.get('topProducts', []))} products")
            print(f"📂 Category Sales: {len(stats.get('categorySales', []))} categories")
            
        else:
            print(f"❌ Error: {data.get('message')}")
    else:
        print(f"❌ HTTP Error: {response.status_code}")
        print(response.text)
    
    print("=" * 60)
    
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend. Make sure it's running on port 5001")
except Exception as e:
    print(f"❌ Error: {e}")
