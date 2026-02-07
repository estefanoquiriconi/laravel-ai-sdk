<?php

use App\Ai\Agents\CustomerSupport;
use Laravel\Ai\Prompts\AgentPrompt;

beforeEach(function () {
    CustomerSupport::fake([
        'Hello! How can I help you today?',
        'I can help you with that. Let me look into it.',
    ]);
});

it('can respond to a customer prompt', function () {
    $response = (new CustomerSupport)->prompt('I need help with my order.');

    expect($response->text)->toBe('Hello! How can I help you today?');

    CustomerSupport::assertPrompted(function (AgentPrompt $prompt) {
        return $prompt->contains('order');
    });
});

it('can handle multiple prompts in sequence', function () {
    $agent = new CustomerSupport;

    $first = $agent->prompt('I have a question.');
    $second = $agent->prompt('Can you tell me more?');

    expect($first->text)->toBe('Hello! How can I help you today?');
    expect($second->text)->toBe('I can help you with that. Let me look into it.');
});

it('has proper instructions', function () {
    $agent = new CustomerSupport;

    expect($agent->instructions())->toContain('customer support agent');
});
