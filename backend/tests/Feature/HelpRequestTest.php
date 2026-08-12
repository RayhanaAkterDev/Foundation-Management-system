<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HelpRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_individual_can_submit_help_request(): void
    {
        $user = User::factory()->create([
            'role' => 'individual',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/help-requests', [
            'title' => 'Emergency Food Assistance',
            'description' => 'My family needs emergency food support.',
            'category' => 'Food',
            'district' => 'Kurigram',
            'address' => 'Village address',
            'urgency' => 'high',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath(
                'help_request.status',
                'pending'
            );

        $this->assertDatabaseHas('help_requests', [
            'user_id' => $user->id,
            'title' => 'Emergency Food Assistance',
            'status' => 'pending',
        ]);
    }

    public function test_organization_can_submit_help_request(): void
    {
        $user = User::factory()->create([
            'role' => 'organization',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/help-requests', [
            'title' => 'Community Food Crisis',
            'description' => 'A community needs emergency food support.',
            'category' => 'Food',
            'district' => 'Dhaka',
            'urgency' => 'critical',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath(
                'help_request.status',
                'pending'
            );

        $this->assertDatabaseHas('help_requests', [
            'user_id' => $user->id,
            'title' => 'Community Food Crisis',
            'status' => 'pending',
        ]);
    }

    public function test_admin_cannot_submit_help_request(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/help-requests', [
            'title' => 'Admin Request',
            'description' => 'This should not be allowed.',
            'category' => 'Food',
            'district' => 'Dhaka',
        ]);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('help_requests', [
            'user_id' => $admin->id,
            'title' => 'Admin Request',
        ]);
    }

    public function test_user_can_view_their_own_help_request(): void
    {
        $user = User::factory()->create([
            'role' => 'individual',
        ]);

        Sanctum::actingAs($user);

        $createResponse = $this->postJson('/api/help-requests', [
            'title' => 'Medical Assistance',
            'description' => 'Need urgent assistance.',
            'category' => 'Medical',
            'district' => 'Dhaka',
            'urgency' => 'high',
        ]);

        $requestId = $createResponse->json('help_request.id');

        $response = $this->getJson(
            "/api/help-requests/{$requestId}"
        );

        $response->assertStatus(200)
            ->assertJsonPath(
                'help_request.id',
                $requestId
            );
    }

    public function test_user_cannot_view_another_users_help_request(): void
    {
        $owner = User::factory()->create([
            'role' => 'individual',
        ]);

        $otherUser = User::factory()->create([
            'role' => 'individual',
        ]);

        Sanctum::actingAs($owner);

        $createResponse = $this->postJson('/api/help-requests', [
            'title' => 'Private Help Request',
            'description' => 'Private request.',
            'category' => 'Food',
            'district' => 'Dhaka',
        ]);

        $requestId = $createResponse->json('help_request.id');

        Sanctum::actingAs($otherUser);

        $response = $this->getJson(
            "/api/help-requests/{$requestId}"
        );

        $response->assertStatus(403);
    }
}
