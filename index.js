// index.js
const { LMStudioClient } = require("@lmstudio/sdk");
const express = require("express");

async function main() {
    // Create a client to connect to LM Studio, then load a model
    const client = new LMStudioClient();
    const model = await client.llm.load("NousResearch/Hermes-2-Pro-Mistral-7B-GGUF");

    const app = express();

    // Predict!
    app.post("/prediction", async (req, res) => {
        const prediction = model.respond([
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: req.body.input },
        ]);
        let response = '';
        for await (const text of prediction) {
            response += text;
        }
        res.send(response);
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

main();
