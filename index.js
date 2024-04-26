// index.js
const { LMStudioClient } = require("@lmstudio/sdk");
const express = require("express");

async function main() {
    // Create a client to connect to LM Studio, then load a model
    const client = new LMStudioClient();
    const model = await client.llm.load("NousResearch/Hermes-2-Pro-Mistral-7B-GGUF");

    const app = express();

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Predict!
    app.post("/prediction", async (req, res) => {
        try {
            const prediction = await model.respond([
                { role: "system", content: "You are a helpful AI assistant that can answer any questions in Japanese, Vietnamese an English." },
                { role: "user", conten: "Please generate multiple choice questions in Japanese about anything. Include the questions, four choices for each question, the correct answer, and an explanation for the correct answer. Return the response in JSON format, write me in Japanese"},
            ]);
            let response = '';
            for await (const text of prediction) {
                response += text;
            }
            res.send(response);
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error");
        }
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

main();
