<?php

namespace Database\Seeders;

use App\Models\Therapist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (! Therapist::where('email', 'therapist@radial.com')->exists()) {
            Therapist::create([
                'email' => 'therapist@radial.com',
                'name' => 'Dr. Anika Sharma',
                'password' => Hash::make('radial123'),
                'role' => 'admin',
            ]);

            $this->command->info('Seeded default admin therapist@radial.com / radial123');
        }
    }
}
