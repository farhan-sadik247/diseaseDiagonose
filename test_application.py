#!/usr/bin/env python3
"""
Comprehensive test script for Disease Diagnosis application
Tests both backend API and frontend functionality
"""

import requests
import json
import time
import sys
from urllib.parse import urljoin

# Configuration
BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_test(test_name, status, message=""):
    color = Colors.GREEN if status == "PASS" else Colors.RED if status == "FAIL" else Colors.YELLOW
    print(f"{color}[{status}]{Colors.END} {test_name}")
    if message:
        print(f"      {message}")

def test_backend_health():
    """Test if Django backend is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/stats/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_test("Backend Health Check", "PASS", f"Found {data['total_diseases']} diseases")
            return True
        else:
            print_test("Backend Health Check", "FAIL", f"Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Backend Health Check", "FAIL", f"Connection error: {e}")
        return False

def test_disease_list_api():
    """Test disease list API endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/diseases/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                print_test("Disease List API", "PASS", f"Retrieved {len(data['results'])} diseases")
                return True
            else:
                print_test("Disease List API", "FAIL", "No diseases found in response")
                return False
        else:
            print_test("Disease List API", "FAIL", f"Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Disease List API", "FAIL", f"Request error: {e}")
        return False

def test_disease_search():
    """Test disease search functionality"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/diseases/?search=fever", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'results' in data:
                print_test("Disease Search", "PASS", f"Found {len(data['results'])} diseases with 'fever'")
                return True
            else:
                print_test("Disease Search", "FAIL", "Invalid response format")
                return False
        else:
            print_test("Disease Search", "FAIL", f"Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Disease Search", "FAIL", f"Request error: {e}")
        return False

def test_disease_filters():
    """Test disease filtering functionality"""
    try:
        # Test contagious filter
        response = requests.get(f"{BACKEND_URL}/api/diseases/?contagious=true", timeout=10)
        if response.status_code == 200:
            data = response.json()
            contagious_count = len(data['results'])
            
            # Test chronic filter
            response = requests.get(f"{BACKEND_URL}/api/diseases/?chronic=true", timeout=10)
            if response.status_code == 200:
                data = response.json()
                chronic_count = len(data['results'])
                print_test("Disease Filters", "PASS", 
                          f"Contagious: {contagious_count}, Chronic: {chronic_count}")
                return True
            else:
                print_test("Disease Filters", "FAIL", "Chronic filter failed")
                return False
        else:
            print_test("Disease Filters", "FAIL", "Contagious filter failed")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Disease Filters", "FAIL", f"Request error: {e}")
        return False

def test_disease_detail():
    """Test disease detail API endpoint"""
    try:
        # First get a disease ID
        response = requests.get(f"{BACKEND_URL}/api/diseases/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                disease_id = data['results'][0]['id']
                
                # Test detail endpoint
                response = requests.get(f"{BACKEND_URL}/api/diseases/{disease_id}/", timeout=10)
                if response.status_code == 200:
                    detail_data = response.json()
                    if 'name' in detail_data and 'symptoms' in detail_data:
                        print_test("Disease Detail API", "PASS", 
                                  f"Retrieved details for '{detail_data['name']}'")
                        return True
                    else:
                        print_test("Disease Detail API", "FAIL", "Missing required fields")
                        return False
                else:
                    print_test("Disease Detail API", "FAIL", f"Status code: {response.status_code}")
                    return False
            else:
                print_test("Disease Detail API", "FAIL", "No diseases available for testing")
                return False
        else:
            print_test("Disease Detail API", "FAIL", "Could not get disease list")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Disease Detail API", "FAIL", f"Request error: {e}")
        return False

def test_symptom_checker():
    """Test symptom checker API endpoint"""
    try:
        test_symptoms = ["fever", "headache", "nausea"]
        payload = {"symptoms": test_symptoms}
        
        response = requests.post(
            f"{BACKEND_URL}/api/symptom-checker/",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and 'total_matches' in data:
                print_test("Symptom Checker API", "PASS", 
                          f"Found {data['total_matches']} matches for {test_symptoms}")
                return True
            else:
                print_test("Symptom Checker API", "FAIL", "Invalid response format")
                return False
        else:
            print_test("Symptom Checker API", "FAIL", f"Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Symptom Checker API", "FAIL", f"Request error: {e}")
        return False

def test_frontend_health():
    """Test if React frontend is running"""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print_test("Frontend Health Check", "PASS", "React app is running")
            return True
        else:
            print_test("Frontend Health Check", "FAIL", f"Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test("Frontend Health Check", "FAIL", f"Connection error: {e}")
        return False

def test_api_performance():
    """Test API response times"""
    endpoints = [
        ("/api/stats/", "Stats"),
        ("/api/diseases/", "Disease List"),
        ("/api/diseases/?search=fever", "Disease Search")
    ]
    
    all_passed = True
    for endpoint, name in endpoints:
        try:
            start_time = time.time()
            response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=10)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200 and response_time < 2000:  # Less than 2 seconds
                print_test(f"Performance - {name}", "PASS", f"{response_time:.0f}ms")
            else:
                print_test(f"Performance - {name}", "FAIL", 
                          f"{response_time:.0f}ms (too slow or error)")
                all_passed = False
        except requests.exceptions.RequestException as e:
            print_test(f"Performance - {name}", "FAIL", f"Request error: {e}")
            all_passed = False
    
    return all_passed

def main():
    print(f"{Colors.BOLD}{Colors.BLUE}Disease Diagnosis Application Test Suite{Colors.END}")
    print("=" * 50)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Disease List API", test_disease_list_api),
        ("Disease Search", test_disease_search),
        ("Disease Filters", test_disease_filters),
        ("Disease Detail", test_disease_detail),
        ("Symptom Checker", test_symptom_checker),
        ("Frontend Health", test_frontend_health),
        ("API Performance", test_api_performance),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{Colors.YELLOW}Running: {test_name}{Colors.END}")
        if test_func():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"{Colors.BOLD}Test Results: {passed}/{total} tests passed{Colors.END}")
    
    if passed == total:
        print(f"{Colors.GREEN}🎉 All tests passed! Application is working correctly.{Colors.END}")
        return 0
    else:
        print(f"{Colors.RED}❌ Some tests failed. Please check the issues above.{Colors.END}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
