<?php

namespace App\Services;

class YbocsData
{
    /** @return array<int,array{label:string,min:int,max:int,color:string}> */
    public static function severityBands(): array
    {
        return [
            ['label' => 'Subclinical', 'min' => 0,  'max' => 7,  'color' => '#F5C9A6'],
            ['label' => 'Mild',        'min' => 8,  'max' => 15, 'color' => '#E89866'],
            ['label' => 'Moderate',    'min' => 16, 'max' => 23, 'color' => '#C8612C'],
            ['label' => 'Severe',      'min' => 24, 'max' => 31, 'color' => '#8E3A1C'],
            ['label' => 'Extreme',     'min' => 32, 'max' => 40, 'color' => '#3F1C0E'],
        ];
    }

    public static function severityBand(int $total): string
    {
        return match (true) {
            $total <= 7 => 'Subclinical',
            $total <= 15 => 'Mild',
            $total <= 23 => 'Moderate',
            $total <= 31 => 'Severe',
            default => 'Extreme',
        };
    }
}
