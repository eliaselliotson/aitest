import { pipeline } from "@huggingface/transformers";

// Create a text generation pipeline
let smarts = 2;
let modals = ["onnx-community/LFM2-350M-ONNX", "onnx-community/LFM2-700M-ONNX", "onnx-community/LFM2-1.2B-ONNX"];

const generator = await pipeline(
  "text-generation",
  modals[smarts-1],
  { dtype: "q4" },
);

let roles = [
  "Your job is to ask thought provoking questions, with the goal of developing a plan for taking over the world.",
  "You must come up with brillient answers to the given questions."
];

// Define the list of messages
let messages = [
  { role: "system", content: "" },
];

// Generate a response
for (let i = 1; i <= 5; i++) {
    messages[0].content = roles[(i - 1) % roles.length];
    
    const output = await generator(messages, { max_new_tokens: 256 });

    messages.push({ role: 'assistant', content: output[0].generated_text.at(-1).content });
    for (const message of messages) {
      message.role = (message.role === 'user' ? 'assistant' : message.role === 'assistant' ? 'user' : message.role);
    }

    console.log(messages[messages.length - 1].content+'\n\n\n');
}
