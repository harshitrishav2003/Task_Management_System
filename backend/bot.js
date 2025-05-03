
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
const HF_API_KEY = process.env.HF_API_KEY;

let conversationHistory = [];  

const MAX_CONVERSATION_TOKENS = 1024; 


const manageConversationHistory = () => {
    let totalTokens = 0;
    const newHistory = [];

    
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
        const msg = conversationHistory[i];
        totalTokens += msg.content.length;

        if (totalTokens > MAX_CONVERSATION_TOKENS) {
            break;  
        }

        newHistory.unshift(msg);  
    }

    conversationHistory = newHistory;  
};

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log("Received message:", message);

    
    conversationHistory.push({ role: "user", content: message });

   
    manageConversationHistory();

    try {
        const response = await axios.post(HF_API_URL, {
            inputs: conversationHistory.map(msg => msg.content).join("\n"),  
        }, {
            headers: { Authorization: `Bearer ${HF_API_KEY}` },
            params: {
                max_length: 50,  
                top_p: 0.9,
                temperature: 0.7
            }
        });

        console.log("Hugging Face API response:", response.data);

       
        const botMessage = { role: "bot", content: response.data[0].generated_text };
        conversationHistory.push(botMessage);  

        res.json({ reply: botMessage.content });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Error processing request" });
    }
});


app.listen(5001, () => console.log('Server running on port 5001'));
