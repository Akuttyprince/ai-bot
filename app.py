from flask import Flask, request, jsonify
from pymongo import MongoClient
import pyttsx3
import json
import requests
from config import XAI_API_KEY
import speech_recognition as sr
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Try MongoDB, fallback to JSON
try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    db = client['AI-BOT']
    questions_collection = db['questions']
    data = {'questions': list(questions_collection.find({}, {'_id': 0}))}
    print("Connected to MongoDB")
except Exception as e:
    print(f"MongoDB failed: {e}. Falling back to questions.json")
    with open('questions.json', 'r') as f:
        data = json.load(f)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('input').lower()
    response = "I don’t know that one, bro!"
    matched_question = None

    # Check predefined questions
    for item in data['questions']:
        if user_input in item['question'].lower():
            matched_question = item
            response = "Question found! What’s your level?"
            return jsonify({'response': response, 'levels': ['beginner', 'medium', 'advanced'], 'question': item})

    # Fallback to Groq API
    headers = {'Authorization': f'Bearer {XAI_API_KEY}', 'Content-Type': 'application/json'}
    payload = {
        'model': 'llama-3.3-70b-versatile',
        'messages': [{'role': 'user', 'content': user_input}]
    }
    try:
        api_response = requests.post('https://api.groq.com/openai/v1/chat/completions', json=payload, headers=headers, timeout=5)
        print(f"API Status: {api_response.status_code}, Response: {api_response.text}")
        if api_response.status_code == 200:
            response = api_response.json()['choices'][0]['message']['content']
            return jsonify({
                'response': "Training data not found, but don’t worry—I’ve got you covered!",
                'answer': response
            })
        else:
            response = f"API errored out with status {api_response.status_code}"
    except requests.RequestException as e:
        response = f"API’s down, dude! Error: {str(e)}"
        print(response)

    return jsonify({'response': response})

@app.route('/voice_input', methods=['POST'])
def voice_input():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            return jsonify({'input': text})
        except:
            return jsonify({'error': 'Couldn’t understand!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)