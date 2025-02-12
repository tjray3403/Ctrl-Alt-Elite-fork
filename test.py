import requests

# Define the API URL
url = "http://127.0.0.1:8080/suggest"

# Define test input
test_data = {"mood": "joy"}

# Make a POST request
response = requests.post(url, json=test_data)

# Print the response
print("Response:", response.json())
