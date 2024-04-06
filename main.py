"""import json
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes, VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
import requests
from PIL import Image, ImageDraw, ImageFont

# Load credentials from JSON file
credential = json.load(open('creds.json'))
API_KEY = credential['API_KEY']
ENDPOINT = credential['ENDPOINT']

# Initialize Computer Vision client
cv_client = ComputerVisionClient(ENDPOINT, API_KEY)

# URL of the image you want to analyze
image_url = 'https://roboquill.io/wp-content/uploads/2020/07/Untitled-design-6.jpg'
response = cv_client.read(url=image_url, Language='en', raw=True)
operationLocation = response.headers["Operation-Location"]
operation_id = operationLocation.split('/')[-1]
result = cv_client.get_read_result(operation_id)

print(result)
print(result.status)
print(result.analyze_result)

if result.status == OperationStatusCodes.succeeded:
    read_results = result.analyze_result.read_results
    for analyzed_result in read_results:
        for line in analyzed_result.lines:
            print(line)
            break
"""

import json
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes, VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
from msrest.exceptions import HttpOperationError

# Load credentials from JSON file
credential = json.load(open('creds.json'))
API_KEY = credential['API_KEY']
ENDPOINT = credential['ENDPOINT']

# Initialize Cognitive Services credentials
credentials = CognitiveServicesCredentials(API_KEY)

# Initialize Computer Vision client
cv_client = ComputerVisionClient(ENDPOINT, credentials)

# URL of the image you want to analyze
image_url = 'https://i.pinimg.com/736x/d2/6d/2a/d26d2aab2ff63cb48b3a91b0e8e0aa55.jpg'

# Attempt to analyze the image
try:
    analyze_result = cv_client.analyze_image(image_url, visual_features=[VisualFeatureTypes.tags])
    print("Tags detected in the image:")
    for tag in analyze_result.tags:
        print(tag.name)
except HttpOperationError as e:
    print(f"Error analyzing image: {e}")

