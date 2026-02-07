import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble';

type MessageListProps = {
    messages: ChatMessage[];
    streamingContent?: string;
};

export function MessageList({ messages, streamingContent }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    return (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && !streamingContent && (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    Send a message to start a conversation.
                </div>
            )}

            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}

            {streamingContent && (
                <div className="flex justify-start">
                    <div
                        className={cn(
                            'bg-muted text-muted-foreground max-w-[80%] rounded-lg px-4 py-2 text-sm',
                        )}
                    >
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <Markdown>{streamingContent}</Markdown>
                        </div>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}
