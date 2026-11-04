<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'therapists',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'therapists',
        ],
    ],

    'providers' => [
        'therapists' => [
            'driver' => 'eloquent',
            'model' => App\Models\Therapist::class,
        ],
    ],

    'passwords' => [
        'therapists' => [
            'provider' => 'therapists',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
