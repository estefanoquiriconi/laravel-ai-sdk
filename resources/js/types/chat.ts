export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
};

export type ChatConversation = {
    id: string;
    title: string;
    updated_at: string;
};
