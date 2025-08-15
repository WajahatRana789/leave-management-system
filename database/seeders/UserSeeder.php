<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Designation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch designation IDs from DB by short_code
        $designationMap = [
            'CDI' => Designation::where('short_code', 'CDI')->first()->id ?? null,
            'SI'  => Designation::where('short_code', 'SI')->first()->id ?? null,
            'SJ'  => Designation::where('short_code', 'SJ')->first()->id ?? null,
            'SSE' => Designation::where('short_code', 'SSE')->first()->id ?? null,
            'SE'  => Designation::where('short_code', 'SE')->first()->id ?? null,
            'EA'  => Designation::where('short_code', 'EA')->first()->id ?? null,
        ];

        // Users data
        $users = [
            [1, 'Abdul Hameed Tabassum', 'CDI', 'ah.tabassum@gmail.com', '03335169581', 'super_admin'],
            [2, 'Javed Arif', 'SI', 'xplorer2471@gmail.com', '03345257669', 'manager'],
            [3, 'Amjad Rashid', 'SJ', 'amjadrashid3092@gmail.com', '03709582696', 'employee'],
            [4, 'Tahir Ameen', 'SSE', 'tahiraminch65@gmail.com', '03215359983', 'employee'],
            [5, 'Aftan Haider Haidery', 'SSE', 'haidarkhan51214@gmail.com', '03005807286', 'employee'],
            [6, 'Tariq Ali Anjum', 'SI', 'tariqalianjum123@gmail.com', '03005206233', 'manager'],
            [7, 'Hina Mehmood', 'SSE', 'hinamah456@gmail.com', '03356665577', 'employee'],
            [8, 'Shahid Farooq', 'SSE', 'shahidjournalist333@gmail.com', '03335883138', 'employee'],
            [9, 'Mulazim Hussain', 'SSE', 'mh_durrani@yahoo.com', '03335504974', 'employee'],
            [10, 'Haq Nawaz Bhutto', 'SE', 'haqnawaz.app@gmail.com', '03335069103', 'employee'],
            [11, 'Maryam Bhatti', 'SE', 'Mariamzeb45@gmail.com', '03026602245', 'employee'],
            [12, 'Memoona Khaliq', 'SE', 'khaliqmamoona7@gmail.com', '03335673007', 'employee'],
            [13, 'Bushra Sardar', 'SE', 'bushrasardar80@gmail.com', '03075332905', 'employee'],
            [14, 'Muhammad Imran Khan', 'SE', 'imranyaqoob480@gmail.com', '03007751553', 'employee'],
            [15, 'Shoukat Ghani', 'SE', 'shoukat.app@gmail.com', '03455080242', 'employee'],
            [16, 'Khalid Iqbal', 'SE', 'khalidjournalist84@gmail.com', '03408090622', 'employee'],
            [17, 'Wajid Abbas', 'SE', 'wajidzakia81@gmail.com', '03446027106', 'employee'],
            [18, 'Amir Ali', 'EA', 'amirjilalialli@gmail.com', '03335120166', 'employee'],
            [19, 'Zohaib Ehsan', 'EA', 'zamanzohaib3@gmail.com', '03214351989', 'employee'],
            [20, 'Abdul Sattar', 'EA', 'abdulsattar979@gmail.com', '03345544238', 'employee'],
            [21, 'Tariq Mehmood', 'SSE', 'mariqbhatti7@gmail.com', '03005353010', 'employee'],
            [22, 'Shehnaz Kausar', 'EA', 'Kausarhassnifizz@gmail.com', '03142897710', 'employee'],
            [23, 'Zafar Iqbal', 'EA', 'Zafariqbalmio@gmail.com', '03110404940', 'employee'],
            [24, 'Mirza Abdul Quddus', 'SE', 'mirzaaq2022@gmail.com', '03475415356', 'employee'],
        ];

        foreach ($users as [$code, $name, $shortCode, $email, $phone, $role]) {
            User::create([
                'code' => $code,
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => $role,
                'designation_id' => $designationMap[$shortCode] ?? null,
                'phone' => $phone,
            ]);
        }
    }
}
