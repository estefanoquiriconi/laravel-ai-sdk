<?php

use App\Ai\Agents\CustomerSupport;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

beforeEach(function () {
    CustomerSupport::fake([
        'Hello! How can I help you today?',
    ]);
});

test('guests cannot access the stream endpoint', function () {
    $this->postJson(route('chat.stream'), [
        'message' => 'Hello',
    ])->assertUnauthorized();
});

test('stream endpoint validates the message field', function () {
    $this->actingAs(User::factory()->create())
        ->postJson(route('chat.stream'), [])
        ->assertJsonValidationErrors(['message']);
});

test('stream endpoint validates conversation_id is a uuid', function () {
    $this->actingAs(User::factory()->create())
        ->postJson(route('chat.stream'), [
            'message' => 'Hello',
            'conversation_id' => 'not-a-uuid',
        ])
        ->assertJsonValidationErrors(['conversation_id']);
});

test('stream endpoint returns a streamed response', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('chat.stream'), [
            'message' => 'Hello',
        ])
        ->assertOk()
        ->assertStreamed();
});

test('stream endpoint prevents access to another user\'s conversation', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $conversationId = (string) Str::uuid7();

    DB::table('agent_conversations')->insert([
        'id' => $conversationId,
        'user_id' => $owner->id,
        'title' => 'Private conversation',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->actingAs($other)
        ->postJson(route('chat.stream'), [
            'message' => 'Hello',
            'conversation_id' => $conversationId,
        ])
        ->assertForbidden();
});
