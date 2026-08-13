<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Individual profile relationship.
     */
    public function individualProfile()
    {
        return $this->hasOne(IndividualProfile::class);
    }

    /**
     * Organization relationship.
     */
    public function organization()
    {
        return $this->hasOne(Organization::class);
    }

    /**
     * Volunteer relationship.
     */
    public function volunteer()
    {
        return $this->hasOne(Volunteer::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
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
