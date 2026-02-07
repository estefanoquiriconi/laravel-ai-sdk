<?php

namespace App\Http\Controllers;

use App\Ai\Agents\CustomerSupport;
use App\Http\Requests\Chat\SendMessageRequest;
use Generator;
use Illuminate\Support\Facades\DB;
use Laravel\Ai\Streaming\Events\TextDelta;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    /**
     * Stream a chat response from the CustomerSupport agent.
     */
    public function stream(SendMessageRequest $request): StreamedResponse
    {
        $user = $request->user();
        $message = $request->validated('message');
        $conversationId = $request->validated('conversation_id');

        $agent = new CustomerSupport;

        if ($conversationId) {
            $conversationRecord = DB::table('agent_conversations')
                ->where('id', $conversationId)
                ->where('user_id', $user->id)
                ->first();

            abort_unless($conversationRecord, 403);

            $stream = $agent->continue($conversationId, as: $user)->stream($message);
        } else {
            $stream = $agent->forUser($user)->stream($message);
        }

        return response()->stream(function () use ($stream): Generator {
            foreach ($stream as $event) {
                if ($event instanceof TextDelta) {
                    yield $event->delta;
                }
            }

            yield "\n<<conversation:{$stream->conversationId}>>";
        });
    }
}
