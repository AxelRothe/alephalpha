import AlephAlphaOptions from "./AlephAlphaOptions";
import AAMultiModalOption from "./AAMultiModalOption";
export default class AlephAlphaJS {
    static url: string;
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
        usage: any;
    }>;
    async: any;
    private post;
    private delete;
    private get;
}
