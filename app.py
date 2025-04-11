from flask import Flask, request, jsonify
from pymongo import MongoClient
import json
import requests
from config import XAI_API_KEY
import speech_recognition as sr
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, resources={
    r"/chat": {"origins": "http://localhost:5173"},
    r"/voice_input": {"origins": "http://localhost:5173"},
    r"/save_history": {"origins": "http://localhost:5173"},
    r"/get_history": {"origins": "http://localhost:5173"}
})

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Try MongoDB, fallback to JSON
try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    db = client['AI-BOT']
    questions_collection = db['questions']
    history_collection = db['history']
    data = {'questions': list(questions_collection.find({}, {'_id': 0}))}
    logger.info("Connected to MongoDB")
except Exception as e:
    logger.error(f"MongoDB failed: {e}. Falling back to questions.json")
    with open('questions.json', 'r') as f:
        data = json.load(f)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.json.get('input').lower()
        response = "I don’t know that one, bro!"
        matched_question = None

        for item in data['questions']:
            if user_input in item['question'].lower():
                matched_question = item
                response = "Question found! What’s your level?"
                return jsonify({'response': response, 'levels': ['beginner', 'medium', 'advanced'], 'question': item})

        headers = {'Authorization': f'Bearer {XAI_API_KEY}', 'Content-Type': 'application/json'}
        payload = {
            'model': 'llama-3.3-70b-versatile',
            'messages': [{'role': 'user', 'content': user_input}]
        }
        api_response = requests.post('https://api.groq.com/openai/v1/chat/completions', json=payload, headers=headers, timeout=5)
        logger.debug(f"API Status: {api_response.status_code}, Response: {api_response.text}")
        if api_response.status_code == 200:
            response = api_response.json()['choices'][0]['message']['content']
            return jsonify({
                'response': "Training data not found, but don’t worry—I’ve got you covered!",
                'answer': response
            })
        else:
            response = f"API errored out with status {api_response.status_code}"
    except Exception as e:
        response = f"Chat error: {str(e)}"
        logger.error(response)

    return jsonify({'response': response})

@app.route('/voice_input', methods=['POST'])
def voice_input():
    try:
        recognizer = sr.Recognizer()
        logger.info("Initializing microphone...")
        
        # List available mics for debugging
        mic_list = sr.Microphone.list_microphone_names()
        logger.debug(f"Available microphones: {mic_list}")
        if not mic_list:
            return jsonify({'error': 'No microphone detected!'}), 500

        with sr.Microphone() as source:
            logger.info("Adjusting for ambient noise... Please wait 2 seconds.")
            recognizer.adjust_for_ambient_noise(source, duration=2)
            logger.info("Listening for audio...")
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            logger.info("Audio captured, recognizing...")
            text = recognizer.recognize_google(audio)
            logger.info(f"Recognized text: {text}")
            return jsonify({'input': text})
    except sr.UnknownValueError:
        logger.error("Speech recognition couldn’t understand the audio")
        return jsonify({'error': 'Couldn’t understand the audio!'}), 400
    except sr.RequestError as e:
        logger.error(f"Speech recognition request failed: {e}")
        return jsonify({'error': f"Speech service down: {str(e)}"}), 503
    except Exception as e:
        logger.error(f"Voice input error: {e}")
        return jsonify({'error': f"Voice input failed: {str(e)}"}), 500

@app.route('/save_history', methods=['POST'])
def save_history():
    try:
        history_entry = request.json
        history_collection.insert_one(history_entry)
        return jsonify({'status': 'saved'})
    except Exception as e:
        logger.error(f"Save history error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_history', methods=['GET'])
def get_history():
    try:
        history = list(history_collection.find({}, {'_id': 0}))
        return jsonify(history)
    except Exception as e:
        logger.error(f"Get history error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)