<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider('gemini')]
class CustomerSupport implements Agent, Conversational
{
    use Promptable, RemembersConversations;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
        You are a friendly and professional customer support agent. Your role is to:

        - Answer customer questions clearly and concisely.
        - Help resolve issues with empathy and patience.
        - Escalate complex problems when you cannot resolve them directly.
        - Always maintain a polite and helpful tone.

        If you don't know the answer, be honest and suggest the customer contact a human agent for further assistance.
        PROMPT;
    }
}
