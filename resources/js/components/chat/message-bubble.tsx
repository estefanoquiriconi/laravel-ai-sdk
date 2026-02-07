import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

export function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user';

    return (
        <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
            <div
                className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                )}
            >
                {isUser ? (
                    <span className="whitespace-pre-wrap">{message.content}</span>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <Markdown>{message.content}</Markdown>
                    </div>
                )}
            </div>
        </div>
    );
}
