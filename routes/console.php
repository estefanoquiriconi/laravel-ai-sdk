<?php

use App\Ai\Agents\PersonalAssistant;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('assistant', function () {
    $response = (new PersonalAssistant())
    ->prompt('What is my name?');

    $this->info((string) $response);
});
