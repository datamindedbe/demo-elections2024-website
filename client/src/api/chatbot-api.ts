import { Http } from '@/http/http.ts';
import { ChatbotUrl } from '@/api/api-urls.ts';
import { runtimeConfig } from '@/config/runtime-config.ts';

const config = runtimeConfig();
const http = new Http(config.getChatbotUrl());

export type ChatbotDecision = {
    text: string;
    decisionUrl: string;
    title: string;
};

export type ChatbotResponse = {
    response: string;
    decisions: ChatbotDecision[];
};

export const getChatbotMessageAnswer = async (message: string | undefined): Promise<ChatbotResponse> => {
    if (!message) {
        throw new Error('A message is required to chat');
    }

    const encodedMessage = encodeURIComponent(message);

    const response = await http.get<{ body: string; status: number }>(
        ChatbotUrl.message,
        undefined,
        { query: encodedMessage },
        { 'x-api-key': 'GoyQ3lFfGN3TvZUsnwjGAaTz9Bx3GRWp9Ohj5vs7' },
    );

    if (response) {
        try {
            const body = JSON.parse(response.body);

            if (typeof body === 'string') {
                return {
                    response: body,
                    decisions: [],
                };
            }

            return {
                response: body.response,
                decisions: body.decisions?.map((decision: unknown): ChatbotDecision => {
                    if (!decision || typeof decision !== 'object') {
                        throw new Error('Unexpected payload');
                    }

                    if (!('title' in decision) || !('text' in decision) || !('decision_url' in decision)) {
                        throw new Error('Unexpected payload');
                    }

                    return {
                        title: decision.title as string,
                        text: decision.text as string,
                        decisionUrl: decision.decision_url as string,
                    };
                }),
            };
        } catch (_e) {
            return { response: response.body, decisions: [] };
        }
    }

    throw new Error('No data received');
};
