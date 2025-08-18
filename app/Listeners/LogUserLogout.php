<?php

namespace App\Listeners;

use App\Models\LoginLog;
use Illuminate\Auth\Events\Logout;

class LogUserLogout
{
    public function handle(Logout $event): void
    {
        if ($event->user) {
            LoginLog::create([
                'user_id'    => $event->user->id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
                'event'      => 'logout',
            ]);
        }
    }
}
