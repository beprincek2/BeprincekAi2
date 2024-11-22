import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the Hugging Face Inference Client
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from the AI Backend!',
  });
});

// POST route to handle chat completion requests
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Make a request to Hugging Face's API with BlenderBot, passing a single string as input
    const chatCompletion = await client.textGeneration({
      model: "facebook/blenderbot-400M-distill", // Choose the model
      inputs: prompt, // The user input prompt as a string
      max_tokens: 500, // Limit the response length (optional)
    });

    // Send the response back to the frontend
    res.status(200).send({
      bot: chatCompletion.generated_text, // Access the generated response
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.message || 'Something went wrong!',
    });
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
