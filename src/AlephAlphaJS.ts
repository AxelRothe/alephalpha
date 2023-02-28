import axios from "axios";
import AlephAlphaOptions from "./AlephAlphaOptions";
import AAMultiModalOption from "./AAMultiModalOption";
import { AlephAlpha } from "./index";

export default class AlephAlphaJS {
  static url = "https://api.aleph-alpha.com";
  static COST_PER_N_TOKENS = 1000;
  static MODEL_INPUT_TOKEN_COST = {
    "luminous-base": 0.006 / AlephAlpha.COST_PER_N_TOKENS,
    "luminous-extended": 0.009 / AlephAlpha.COST_PER_N_TOKENS,
    "luminous-supreme": 0.035 / AlephAlpha.COST_PER_N_TOKENS,
    "luminous-supreme-control": 0.04375 / AlephAlpha.COST_PER_N_TOKENS,
  };
  static MODEL_INPUT_IMAGE_COST = {
    "luminous-base": 0.006048,
    "luminous-extended": 0.009072,
  };

  private readonly API_TOKEN: string;
  private header: { Accept: string; Authorization: string };

  constructor(options: AlephAlphaOptions) {
    this.API_TOKEN = options.API_TOKEN;
    this.header = {
      Accept: "application/json",
      Authorization: "Bearer " + this.API_TOKEN,
    };
  }

  async version() {
    try {
      const result = await this.get("/version");
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async tokens() {
    try {
      return await this.get("/users/me/tokens");
    } catch (error) {
      console.log(error);
    }
  }

  async createToken(options: { description: string }) {
    try {
      const result = await this.post("/users/me/tokens", {
        description: options.description,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteToken(options: { token_id: string }) {
    try {
      const result = await this.delete("/users/me/tokens/" + options.token_id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getAvailableModels() {
    try {
      const result = await this.get("/models_available");
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async completion(options: {
    model: string;
    prompt: string | AAMultiModalOption[];
    temperature?: number;
    maximum_tokens?: number;
    stop_sequences?: string[];
  }) {
    //check whether the model is multimodal

    let cost = {
      prompt: 0,
      completion: 0,
      images: 0,
    };

    //if the prompt is a string then check if it has trailing whitespaces and remove them
    if (typeof options.prompt === "string") {
      options.prompt = options.prompt.trim();

      const prompt_tokens = await this.post("/tokenize", {
        model: options.model,
        prompt: options.prompt,
        tokens: true,
        token_ids: true,
      });
      cost.prompt += prompt_tokens.tokens.length;
    }
    //if the prompt is an array of multimodal options then check if each option has trailing whitespaces and remove them
    else if (Array.isArray(options.prompt)) {
      for (const option of options.prompt) {
        //check if string
        if (option.type === "text") {
          option.data = option.data.trim();
          const prompt_tokens = await this.post("/tokenize", {
            model: options.model,
            prompt: option.data,
            tokens: true,
            token_ids: true,
          });
          cost.prompt += prompt_tokens.tokens.length;
        } else if (option.type === "image") {
          cost.images += 1;
        }
      }
    }

    try {
      //run completion
      const completion = await this.post("/complete", {
        model: options.model,
        prompt: options.prompt,
        temperature: options.temperature,
        maximum_tokens: options.maximum_tokens,
        stop_sequences: options.stop_sequences,
        tokens: true,
      });

      cost.completion = completion.completions[0].completion_tokens.length;

      let costs =
        (cost.prompt + cost.completion) *
        AlephAlphaJS.MODEL_INPUT_TOKEN_COST[options.model];

      if (cost.images > 0) {
        const costPerImage = AlephAlphaJS.MODEL_INPUT_IMAGE_COST[options.model];
        if (!costPerImage)
          throw new Error("Invalid model selected for usage with images");
        costs += cost.images * costPerImage;
      }

      //return both the completion and the cost
      return {
        completion: completion.completions[0].completion,
        usage: {
          prompt_tokens: cost.prompt,
          completion_tokens: cost.completion,
          images_count: cost.images,
          cost: costs,
        },
      };
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async;

  // ========================
  //  UTILITIES
  // ========================

  private async post(url, data) {
    try {
      const result = await axios.post(AlephAlphaJS.url + url, data, {
        headers: {
          "Content-Type": "application/json",
          ...this.header,
        },
      });
      if (result.status === 200) return result.data;
      throw new Error("Error posting data");
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  private async delete(url) {
    try {
      const result = await axios.delete(AlephAlphaJS.url + url, {
        headers: {
          ...this.header,
        },
      });
      if (result.status === 204) return result.data;
      throw new Error("Error deleting data");
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  private async get(url) {
    try {
      const result = await axios.get(AlephAlphaJS.url + url, {
        headers: this.header,
      });
      if (result.status === 200) return result.data;
      throw new Error("Error getting data");
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
}
