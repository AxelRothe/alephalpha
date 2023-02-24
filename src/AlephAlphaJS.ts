import axios from "axios";
import AlephAlphaOptions from "./AlephAlphaOptions";
import AAMultiModalOption from "./AAMultiModalOption";

export default class AlephAlphaJS {
  static url = "https://api.aleph-alpha.com";
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
    //if the prompt is a string then check if it has trailing whitespaces and remove them
    if (typeof options.prompt === "string") {
      options.prompt = options.prompt.trim();
    }
    //if the prompt is an array of multimodal options then check if each option has trailing whitespaces and remove them
    else if (Array.isArray(options.prompt)) {
      options.prompt.forEach((option) => {
        //check if string
        if (option.type === "string") {
          option.data = option.data.trim();
        }
      });
    }

    try {
      return await this.post("/complete", {
        model: options.model,
        prompt: options.prompt,
        temperature: options.temperature,
        maximum_tokens: options.maximum_tokens,
        stop_sequences: options.stop_sequences,
      });
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
