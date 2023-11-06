import AlephAlphaOptions from "./AlephAlphaOptions";
import AAMultiModalOption from "./AAMultiModalOption";
export default class AlephAlphaJS {
    static url: string;
    static COST_PER_N_TOKENS: number;
    static MODEL_INPUT_TOKEN_COST: {
        "luminous-base": number;
        "luminous-extended": number;
        "luminous-supreme": number;
        "luminous-supreme-control": number;
    };
    static MODEL_INPUT_IMAGE_COST: {
        "luminous-base": number;
        "luminous-extended": number;
    };
    private readonly API_TOKEN;
    private header;
    constructor(options: AlephAlphaOptions);
    version(): Promise<any>;
    tokens(): Promise<any>;
    createToken(options: {
        description: string;
    }): Promise<any>;
    deleteToken(options: {
        token_id: string;
    }): Promise<any>;
    getAvailableModels(): Promise<any>;
    completion(options: {
        model: string;
        prompt: string | AAMultiModalOption[];
        temperature?: number;
        maximum_tokens?: number;
        stop_sequences?: string[];
    }): Promise<{
        completion: any;
        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            images_count: number;
            cost: number;
        };
    }>;
    evaluate(options: {
        model: string;
        prompt: string | AAMultiModalOption[];
        completion_expected: string;
    }): Promise<{
        evaluation: {
            log_probability: any;
            log_perplexity: any;
            log_perplexity_per_token: any;
            log_perplexity_per_character: any;
            correct_greedy: any;
        };
        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            images_count: number;
            cost: number;
        };
    }>;
    semanticEmbed(options: {
        prompt: string | AAMultiModalOption[];
        model?: string;
        representation?: string;
        compress_to_size?: number;
    }): Promise<{
        embed: any;
    }>;
    batchedSemanticEmbed(options: {
        prompts: string[];
        model?: string;
        representation?: string;
        compress_to_size?: number;
    }): Promise<{
        embeddings: any;
    }>;
    private post;
    private delete;
    private get;
}
