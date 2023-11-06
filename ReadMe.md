# alephalphajs - JS Wrapper for the REST API of Aleph Alpha

This is a JS wrapper for the REST API of Aleph Alpha. It is a work in progress and not all endpoints are implemented yet.

## Installation

```
npm install alephalphajs
```

## Initialization

```javascript
import { AlephAlpha } from 'alephalphajs'

const aleph = new AlephAlpha({
	API_TOKEN: 'your-api-key'
});
```

## Usage 

```
const response = await aleph.completion({
      prompt: "Q: What is the capital of France? A:",
      model: "luminous-base",
      maximum_tokens: 128,
      stop_sequences: ["\n"],
    });

console.log(response);
```

## Usage Multimodal

```javascript

const response = await aleph.completion({
      prompt: [
        {
          type: "image",
          data: "/9j/4AAQSkZJRgABAQEASABIAAD/4QCgRXhpZgAATU0AKgAAAAg...", //base64 encoded image
        },
        {
          type: "text",
          data: "when you see this image you wonder",
        },
      ],
      model: "luminous-base",
      maximum_tokens: 128,
      stop_sequences: ["\n"],
    });

console.log(response);
```

### Get All Available Models

```
async aleph.getAvailableModels();
```

### Get Tokens

```
async aleph.tokens()
```

### Create Token
```
async aleph.createToken({ description: string}}
```

### Delete Token
```
async aleph.deleteToken({ token_id: string}}
```