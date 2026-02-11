import { pipeline, TextStreamer } from '@huggingface/transformers';

// A simple implementation of the stream writer, e.g., to a DOM element
class MyTextStreamer extends TextStreamer {
    constructor(tokenizer, outputElement) {
        super(tokenizer, { skip_special_tokens: true, skip_prompt: true });
        this.outputElement = outputElement;
    }

    // Override the onToken method to handle each new token as it arrives
    onToken(token) {
        // Append the new token to the output element (e.g., a <p> tag)
        this.outputElement.textContent += token;
        // Optional: Scroll to the bottom to see the latest text
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
}

async function generateWithStreaming() {
    // 1. Load the text-generation pipeline
    const generator = await pipeline('text-generation', 'Xenova/tiny-stories-what-if', {
        // Optional: Use WebGPU for faster speed if available
        // device: 'webgpu', 
    });

    // 2. Get a reference to your output element in the DOM
    const output = document.getElementById('output-area');

    // 3. Create an instance of the custom streamer
    const streamer = new MyTextStreamer(generator.tokenizer, output);

    // 4. Generate the response with the streamer
    // The 'streamer' parameter ensures tokens are processed as they are generated
    await generator('Once upon a time,', {
        streamer: streamer,
        max_new_tokens: 50,
    });
}

// Call the function to start generation
generateWithStreaming();
