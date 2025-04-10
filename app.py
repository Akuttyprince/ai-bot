from flask import Flask, request, jsonify
from pymongo import MongoClient
import pyttsx3
import json
import requests
from config import XAI_API_KEY
import speech_recognition as sr
from flask_cors import CORS

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['AI-BOT']
questions_collection = db['questions']
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load predefined questions (fix: exclude _id from MongoDB)
data = {'questions': list(questions_collection.find({}, {'_id': 0}))}

# Text-to-speech setup with reinitialization
def get_engine():
    engine = pyttsx3.init()
    engine.stop()  # Clear any existing run loop
    return engine

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('input').lower()
    response = "I don’t know that one, bro!"
    engine = get_engine()  # Fresh engine instance

    # Check predefined questions
    for item in data['questions']:
        if user_input in item['question'].lower():
            response = item['answer']['basic']
            engine.say(response)
            engine.runAndWait()
            print(f"Predefined response: {response}")
            return jsonify({'response': response})

    # Fallback to xAI API (Note: You’re using Groq, not xAI—fix if needed)
    headers = {'Authorization': f'Bearer {XAI_API_KEY}', 'Content-Type': 'application/json'}
    payload = {
        'model': 'llama-3.3-70b-versatile',  # Groq model
        'messages': [{'role': 'user', 'content': user_input}]
    }
    try:
        api_response = requests.post('https://api.groq.com/openai/v1/chat/completions', json=payload, headers=headers, timeout=5)
        print(f"API Status: {api_response.status_code}, Response: {api_response.text}")
        if api_response.status_code == 200:
            response = api_response.json()['choices'][0]['message']['content']
            engine.say(response)
            engine.runAndWait()
            print(f"API response: {response}")
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