<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson('/api/admin/dashboard');

        $response->assertStatus(200);

        $response->assertJsonStructure([
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
            'pendingHelpRequests',
            'pendingVerifications',
            'recentUsers',
            'recentActivity',
        ]);
    }

    public function test_individual_cannot_access_admin_dashboard(): void
    {
        $individual = User::factory()->create([
            'role' => 'individual',
        ]);

        $token = $individual->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_organization_cannot_access_admin_dashboard(): void
    {
        $organization = User::factory()->create([
            'role' => 'organization',
        ]);

        $token = $organization->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(401);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        User::factory()->count(3)->create([
            'role' => 'individual',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson('/api/admin/users');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'users',
        ]);
    }

    public function test_admin_can_view_a_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $targetUser = User::factory()->create([
            'role' => 'individual',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson("/api/admin/users/{$targetUser->id}");

        $response->assertStatus(200);

        $response->assertJsonPath(
            'user.id',
            $targetUser->id
        );
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->postJson('/api/admin/users', [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'role' => 'individual',
        ]);

        $response->assertStatus(201);

        $response->assertJsonPath(
            'user.email',
            'testuser@example.com'
        );

        $this->assertDatabaseHas('users', [
            'email' => 'testuser@example.com',
            'role' => 'individual',
        ]);
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $targetUser = User::factory()->create([
            'role' => 'individual',
            'name' => 'Old Name',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->putJson("/api/admin/users/{$targetUser->id}", [
            'name' => 'Updated Name',
            'email' => $targetUser->email,
            'role' => 'individual',
            'status' => 'active',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $targetUser = User::factory()->create([
            'role' => 'individual',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->deleteJson("/api/admin/users/{$targetUser->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('users', [
            'id' => $targetUser->id,
        ]);
    }

    public function test_admin_can_list_organizations(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson('/api/admin/organizations');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'organizations',
        ]);
    }

    public function test_admin_can_create_organization(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->postJson('/api/admin/organizations', [
            'name' => 'Test Foundation',
            'organization_type' => 'NGO',
            'registration_number' => 'REG-TEST-001',
            'phone' => '01700000000',
            'website' => 'https://example.com',
            'address' => 'Dhaka, Bangladesh',
            'email' => 'foundation@example.com',
        ]);

        $response->assertStatus(201);

        $response->assertJsonPath(
            'organization.name',
            'Test Foundation'
        );

        $this->assertDatabaseHas('organizations', [
            'name' => 'Test Foundation',
            'verification_status' => 'pending',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'foundation@example.com',
            'role' => 'organization',
        ]);
    }

    public function test_admin_can_view_an_organization(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $organizationUser = User::factory()->create([
            'role' => 'organization',
        ]);

        $organization = \App\Models\Organization::create([
            'user_id' => $organizationUser->id,
            'name' => 'View Test Foundation',
            'verification_status' => 'pending',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->getJson("/api/admin/organizations/{$organization->id}");

        $response->assertStatus(200);

        $response->assertJsonPath(
            'organization.id',
            $organization->id
        );
    }

    public function test_admin_can_update_organization(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $organizationUser = User::factory()->create([
            'role' => 'organization',
        ]);

        $organization = \App\Models\Organization::create([
            'user_id' => $organizationUser->id,
            'name' => 'Old Foundation Name',
            'verification_status' => 'pending',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->putJson("/api/admin/organizations/{$organization->id}", [
            'name' => 'Updated Foundation Name',
            'organization_type' => 'NGO',
            'registration_number' => 'REG-001',
            'phone' => '01700000000',
            'website' => 'https://example.com',
            'address' => 'Dhaka',
            'mission' => 'Helping communities.',
            'focus_areas' => 'Education',
            'communities_served' => 'Rural communities',
            'team_size' => 10,
            'primary_activities' => 'Relief',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
            'name' => 'Updated Foundation Name',
        ]);
    }

    public function test_admin_can_update_organization_verification(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $organizationUser = User::factory()->create([
            'role' => 'organization',
        ]);

        $organization = \App\Models\Organization::create([
            'user_id' => $organizationUser->id,
            'name' => 'Verification Test Foundation',
            'verification_status' => 'pending',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->patchJson(
            "/api/admin/organizations/{$organization->id}/verification",
            [
                'verification_status' => 'verified',
            ]
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
            'verification_status' => 'verified',
        ]);
    }

    public function test_admin_can_delete_organization(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $organizationUser = User::factory()->create([
            'role' => 'organization',
        ]);

        $organization = \App\Models\Organization::create([
            'user_id' => $organizationUser->id,
            'name' => 'Delete Test Foundation',
            'verification_status' => 'pending',
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->deleteJson("/api/admin/organizations/{$organization->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('organizations', [
            'id' => $organization->id,
        ]);
    }
}
