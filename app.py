from g4f.client import Client
from flask import Flask, render_template_string, request, session, redirect, url_for
import ast
import json

client = Client()

app = Flask(__name__)
app.secret_key = "wrjohfourwhuorfhjowhhkwhfiury79477248954y278nsjkbk"   

@app.route('/chat', methods=['POST', 'GET'])
def chat():
    if request.method == 'POST':
        data = json.loads(request.form['query'])

        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": 'system', "content": 'You are Trexbot,coded in JavaScript, a friendly chatbot which moderates, entertains and manages discord servers. People can add you to their servers through this link, https://bit.ly/addTrex.'}] + data,
        max_tokens=450
        )
        print(data)

        return response.choices[0].message.content
    
@app.route('/gen-image', methods=['POST', 'GET'])
def gen_img():
    if request.method == 'POST':
        response = client.images.generate(
            model="gemini",
            prompt=request.form['query']
        )

        img_url = response.data[0].url
        print(img_url)
        return img_url   
 
if __name__ == '__main__':
    app.run(debug=True)