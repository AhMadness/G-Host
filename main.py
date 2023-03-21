from flask import Flask, request, render_template, jsonify, send_file
import openai
import os

# Initialize Flask app
app = Flask(__name__, template_folder=".")

# Set up OpenAI API credentials
openai.api_key = "YOUR OPENAI API KEY HERE"


# favicon
@app.route('/favicon.ico')
def favicon():
    return send_file('favicon.ico', mimetype='image/vnd.microsoft.icon')


# Define default route
@app.route('/')
def index():
    return render_template('index.html')


# Define /api route for POST requests
@app.route('/api', methods=['POST'])
def api():
    # Get the message from the POST request
    message = request.form.get("message")
    # Send request to OpenAI API
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": message}
        ]
        )
    return completion.choices[0].message.content
    # print(f"AI: {response['content']}")


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)