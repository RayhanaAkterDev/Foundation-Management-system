<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'verification_method',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Generate a verification URL that expires after 1 minute.
     */
    public function verificationUrl(): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(1),
            [
                'id' => $this->getKey(),
                'hash' => sha1($this->getEmailForVerification()),
            ]
        );
    }

    public function individualProfile()
    {
        return $this->hasOne(IndividualProfile::class);
    }

    public function organization()
    {
        return $this->hasOne(Organization::class);
    }

    public function volunteer()
    {
        return $this->hasOne(Volunteer::class);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function donationAttempts(): HasMany
    {
        return $this->hasMany(DonationAttempt::class);
    }

    public function campaignVolunteerAssignments(): HasMany
    {
        return $this->hasMany(
            CampaignVolunteerAssignment::class,
            'volunteer_id'
        );
    }

    public function createdCampaigns()
    {
        return $this->hasMany(Campaign::class, 'created_by');
    }
}
