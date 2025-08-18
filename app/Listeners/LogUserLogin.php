<?php

namespace App\Listeners;

use App\Models\LoginLog;
use Illuminate\Auth\Events\Login;

class LogUserLogin
{
    public function handle(Login $event): void
    {
        LoginLog::create([
            'user_id'    => $event->user->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
            'event'      => 'login',
        ]);

        // Update last_login_at in users table
        $event->user->update([
            'last_login_at' => now(),
        ]);
    }
}
