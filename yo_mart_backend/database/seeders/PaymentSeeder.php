<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $paymentMethods = [
            ['name' => 'ABA Bank'],
            ['name' => 'ACLEDA Bank'],
            ['name' => 'Wing',],
            ['name' => 'Cash',],
        ];

        foreach ($paymentMethods as $method) {
            PaymentMethod::updateOrCreate(
                [
                    'payment_name' => $method['name']
                ]
            );
        }
    }
}


