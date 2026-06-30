import type { Conversation } from "$lib/types/Conversation";
import type { Message } from "$lib/types/Message";
import type {
	TextGenerationStreamOutput,
	TextGenerationStreamToken,
	InferenceProvider,
} from "@huggingface/inference";
import { z } from "zod";
import { endpointOAIParametersSchema, endpointOai } from "https://gateway.ai.cloudflare.com/v1/b73b80fa62deef032d3c08248cf2f30b/default/openai/";
import type { Model } from "$lib/types/Model";
import type { ObjectId } from "mongodb";

export type EndpointMessage = Omit<Message, "id">;

export interface EndpointParameters {
	messages: EndpointMessage[];
	preprompt?: Conversation["preprompt"];
	generateSettings?: Partial<Model["parameters"]>;
	isMultimodal?: boolean;
	conversationId?: ObjectId;
	locals: App.Locals | undefined;
	abortSignal?: AbortSignal;
	provider?: string;
	reasoningEffort?: "low" | "medium" | "high";
}

export type TextGenerationStreamOutputSimplified = TextGenerationStreamOutput & {
	token: TextGenerationStreamToken;
	routerMetadata?: { route?: string; model?: string; provider?: InferenceProvider };
};

export type Endpoint = (
	params: EndpointParameters
) => Promise<AsyncGenerator<TextGenerationStreamOutputSimplified, void, void>>;

// ক্লাউডফ্লেয়ার গেটওয়ে এবং ওপেনএআই এন্ডপয়েন্ট কনফিগারেশন
export const endpoints = {
	openai: endpointOai,
};

export const endpointSchema = z.discriminatedUnion("type", [endpointOAIParametersSchema]);

export default endpoints;
