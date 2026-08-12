<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\HelpRequest;
use App\Models\Organization;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminResourcesTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
        ]);
    }

    private function individual(): User
    {
        return User::factory()->create([
            'role' => 'individual',
        ]);
    }

    // ---------------------------------------------------------
    // Help Requests
    // ---------------------------------------------------------

    public function test_admin_can_list_help_requests(): void
    {
        $admin = $this->admin();
        $user = $this->individual();

        Sanctum::actingAs($user);

        $this->postJson('/api/help-requests', [
            'title' => 'Emergency Food Assistance',
            'description' => 'Family needs emergency food support.',
            'category' => 'Food',
            'district' => 'Kurigram',
            'address' => 'Village address',
            'urgency' => 'high',
        ])->assertStatus(201);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/help-requests');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'helpRequests',
            ]);
    }

    public function test_non_admin_cannot_list_help_requests(): void
    {
        $user = $this->individual();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/help-requests');

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------
    // Donations
    // ---------------------------------------------------------

    public function test_admin_can_list_donations(): void
    {
        $admin = $this->admin();
        $user = $this->individual();

        $campaign = Campaign::create([
            'organization_id' => null,
            'help_request_id' => null,
            'title' => 'Test Donation Campaign',
            'description' => 'Campaign for testing donations.',
            'category' => 'Food',
            'district' => 'Dhaka',
            'location' => 'Dhaka',
            'target_amount' => 50000,
            'collected_amount' => 0,
            'status' => 'active',
            'start_date' => null,
            'end_date' => null,
            'cover_image' => null,
        ]);

        Donation::create([
            'user_id' => $user->id,
            'campaign_id' => $campaign->id,
            'amount' => 1000,
            'status' => 'completed',
            'payment_method' => 'test',
            'transaction_id' => 'TEST-' . uniqid(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/donations');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'donations',
            ]);
    }

    public function test_non_admin_cannot_list_donations(): void
    {
        $user = $this->individual();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/donations');

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------
    // Volunteers
    // ---------------------------------------------------------

    public function test_admin_can_list_volunteers(): void
    {
        $admin = $this->admin();
        $user = $this->individual();

        Volunteer::create([
            'user_id' => $user->id,
            'organization_id' => null,
            'phone' => '01700000000',
            'district' => 'Dhaka',
            'address' => 'Test address',
            'skills' => 'First Aid',
            'availability' => 'Weekends',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/volunteers');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'volunteers',
            ]);
    }

    public function test_non_admin_cannot_list_volunteers(): void
    {
        $user = $this->individual();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/volunteers');

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------
    // Campaigns
    // ---------------------------------------------------------

    public function test_admin_can_list_campaigns(): void
    {
        $admin = $this->admin();

        Campaign::create([
            'organization_id' => null,
            'help_request_id' => null,
            'title' => 'Emergency Food Campaign',
            'description' => 'Providing emergency food support.',
            'category' => 'Food',
            'district' => 'Dhaka',
            'location' => 'Dhaka',
            'target_amount' => 50000,
            'collected_amount' => 0,
            'status' => 'pending',
            'start_date' => null,
            'end_date' => null,
            'cover_image' => null,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/campaigns');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'campaigns',
            ]);
    }

    public function test_non_admin_cannot_list_campaigns(): void
    {
        $user = $this->individual();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/campaigns');

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------
    // Reports
    // ---------------------------------------------------------

    public function test_admin_can_access_reports(): void
    {
        $admin = $this->admin();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/reports');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'stats' => [
                    'totalUsers',
                    'totalOrganizations',
                    'pendingVerification',
                    'totalHelpRequests',
                    'pendingHelpRequests',
                    'activeCampaigns',
                    'totalDonations',
                    'totalVolunteers',
                    'reportsGenerated',
                ],
            ]);
    }

    public function test_non_admin_cannot_access_reports(): void
    {
        $user = $this->individual();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/reports');

        $response->assertStatus(403);
    }
}
