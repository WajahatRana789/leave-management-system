<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Designation;
use App\Models\Shift;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{

    private function generateUniqueCode(): string
    {
        do {
            // Generate random 5-character alphanumeric code
            $code = Str::upper(Str::random(5));
        } while (User::where('code', $code)->exists());

        return $code;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get designation IDs
        $designationMap = [
            'CDI' => Designation::where('short_code', 'CDI')->first()->id ?? null,
            'SI'  => Designation::where('short_code', 'SI')->first()->id ?? null,
            'SJ'  => Designation::where('short_code', 'SJ')->first()->id ?? null,
            'SSE' => Designation::where('short_code', 'SSE')->first()->id ?? null,
            'SE'  => Designation::where('short_code', 'SE')->first()->id ?? null,
            'EA'  => Designation::where('short_code', 'EA')->first()->id ?? null,
        ];

        // Get shift IDs
        $shiftMap = [
            'Morning' => Shift::where('name', 'Morning')->first()->id ?? null,
            'Evening' => Shift::where('name', 'Evening')->first()->id ?? null,
        ];

        // 1) (Super Admin)
        User::create([
            'code' => $this->generateUniqueCode(),
            'name' => 'Wajahat Rana',
            'email' => 'wajahatrana789@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'designation_id' => $designationMap['CDI'],
            'phone' => '03182030658',
        ]);

        // 1) CDI (Super Admin)
        User::create([
            'code' => $this->generateUniqueCode(),
            'name' => 'Abdul Hameed Tabassum',
            'email' => 'ah.tabassum@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'designation_id' => $designationMap['CDI'],
            'phone' => '03335169581',
        ]);

        // 2) Shift Incharges with shift assignment
        $shift_incharges = [
            ['Javed Arif', 'SI', 'xplorer2471@gmail.com', '03345257669', 'Morning'],
            ['Tariq Ali Anjum', 'SI', 'tariqalianjum123@gmail.com', '03005206233', 'Evening'],
        ];

        foreach ($shift_incharges as [$name, $shortCode, $email, $phone, $shiftName]) {
            User::create([
                'code' => $this->generateUniqueCode(),
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'shift_incharge',
                'shift_id' => $shiftMap[$shiftName] ?? null,
                'designation_id' => $designationMap[$shortCode],
                'phone' => $phone,
            ]);
        }

        // 3) Employees
        $employees = [
            ['Amjad Rashid', 'SJ', 'amjadrashid3092@gmail.com', '03709582696', 'Evening'],
            ['Tahir Ameen', 'SSE', 'tahiraminch65@gmail.com', '03215359983', 'Evening'],
            ['Aftan Haider Haidery', 'SSE', 'haidarkhan51214@gmail.com', '03005807286', 'Evening'],
            ['Hina Mehmood', 'SSE', 'hinamah456@gmail.com', '03356665577', 'Evening'],
            ['Shahid Farooq', 'SSE', 'shahidjournalist333@gmail.com', '03335883138', 'Evening'],
            ['Mulazim Hussain', 'SSE', 'mh_durrani@yahoo.com', '03335504974', 'Evening'],
            ['Haq Nawaz Bhutto', 'SE', 'haqnawaz.app@gmail.com', '03335069103', 'Evening'],
            ['Maryam Bhatti', 'SE', 'Mariamzeb45@gmail.com', '03026602245', 'Evening'],
            ['Memoona Khaliq', 'SE', 'khaliqmamoona7@gmail.com', '03335673007', 'Evening'],
            ['Bushra Sardar', 'SE', 'bushrasardar80@gmail.com', '03075332905', 'Evening'],
            ['Muhammad Imran Khan', 'SE', 'imranyaqoob480@gmail.com', '03007751553', 'Evening'],
            ['Shoukat Ghani', 'SE', 'shoukat.app@gmail.com', '03455080242', 'Evening'],
            ['Khalid Iqbal', 'SE', 'khalidjournalist84@gmail.com', '03408090622', 'Evening'],
            ['Wajid Abbas', 'SE', 'wajidzakia81@gmail.com', '03446027106', 'Evening'],
            ['Amir Ali', 'EA', 'amirjilalialli@gmail.com', '03335120166', 'Evening'],
            ['Zohaib Ehsan', 'EA', 'zamanzohaib3@gmail.com', '03214351989', 'Evening'],
            ['Abdul Sattar', 'EA', 'abdulsattar979@gmail.com', '03345544238', 'Evening'],
            ['Tariq Mehmood', 'SSE', 'mariqbhatti7@gmail.com', '03005353010', 'Evening'],
            ['Shehnaz Kausar', 'EA', 'Kausarhassnifizz@gmail.com', '03142897710', 'Evening'],
            ['Zafar Iqbal', 'EA', 'Zafariqbalmio@gmail.com', '03110404940', 'Evening'],
            ['Mirza Abdul Quddus', 'SE', 'mirzaaq2022@gmail.com', '03475415356', 'Evening'],
        ];

        foreach ($employees as [$name, $shortCode, $email, $phone, $shiftName]) {
            User::create([
                'code' => $this->generateUniqueCode(),
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'employee',
                'shift_id' => $shiftMap[$shiftName] ?? null,
                'designation_id' => $designationMap[$shortCode],
                'phone' => $phone,
            ]);
        }
    }
}
