import { usePage } from '@inertiajs/react';
import { useStream } from '@laravel/stream-react';
import { MessageCircle, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { stream } from '@/actions/App/Http/Controllers/ChatController';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageList } from '@/components/chat/message-list';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChatMessage, SharedData } from '@/types';

const CONVERSATION_MARKER_REGEX = /\n?<<conversation:([a-f0-9-]*)>>/g;
const CONVERSATION_EXTRACT_REGEX = /<<conversation:([a-f0-9-]+)>>/;

export function FloatingChat() {
    const { auth } = usePage<SharedData>().props;

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [streamingContent, setStreamingContent] = useState('');
    const conversationIdRef = useRef<string | null>(null);
    const accumulatedRef = useRef('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    const { send, isFetching, isStreaming } = useStream(stream.url(), {
        onData: (chunk: string) => {
            accumulatedRef.current += chunk;
            setStreamingContent(accumulatedRef.current.replace(CONVERSATION_MARKER_REGEX, ''));
        },
        onFinish: () => {
            const fullContent = accumulatedRef.current;
            const match = fullContent.match(CONVERSATION_EXTRACT_REGEX);
            const cleanContent = fullContent.replace(CONVERSATION_MARKER_REGEX, '').trim();

            if (cleanContent) {
                const assistantMessage: ChatMessage = {
                    id: `assistant-${Date.now()}`,
                    role: 'assistant',
                    content: cleanContent,
                    created_at: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, assistantMessage]);
            }

            setStreamingContent('');
            accumulatedRef.current = '';

            if (match) {
                conversationIdRef.current = match[1];
            }
        },
        onError: () => {
            setStreamingContent('');
            accumulatedRef.current = '';
        },
    });

    const handleSend = useCallback(
        (message: string) => {
            const userMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: message,
                created_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setStreamingContent('');
            accumulatedRef.current = '';

            send({
                message,
                conversation_id: conversationIdRef.current,
            });
        },
        [send],
    );

    if (!auth.user) {
        return null;
    }

    return (
        <>
            <Button
                size="icon"
                className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg"
                onClick={() => setOpen(true)}
            >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Open chat</span>
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/80"
                    onClick={() => setOpen(false)}
                />
            )}

            <div
                className={cn(
                    'bg-background fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l shadow-lg transition-transform duration-300 ease-in-out sm:max-w-md',
                    open ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <h2 className="text-foreground font-semibold">Chat</h2>
                        <p className="text-muted-foreground text-sm">Pregúntale a nuestro asistente de IA cualquier cosa.</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cerrar</span>
                    </Button>
                </div>
                <MessageList messages={messages} streamingContent={streamingContent || undefined} />
                <ChatInput onSend={handleSend} disabled={isFetching || isStreaming} />
            </div>
        </>
    );
}
