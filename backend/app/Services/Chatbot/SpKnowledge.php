<?php

namespace App\Services\Chatbot;

class SpKnowledge
{
    /**
     * Core knowledge about Stand For People.
     *
     * This knowledge is intentionally controlled and factual.
     * The chatbot should answer from this information rather than
     * inventing platform behavior.
     */
    public static function get(): array
    {
        return [
            'platform' => [
                'name' => 'Stand For People',
                'short_name' => 'SP',
                'description' =>
                    'Stand For People is a centralized humanitarian coordination platform that connects people who need help with individuals and organizations that can contribute support.',
            ],

            'help_requests' => [
                'description' =>
                    'Individuals can submit a Help Request when they need humanitarian assistance.',
                'process' => [
                    'The individual describes their situation.',
                    'SP can analyze the description and suggest a title, category, urgency, district, address, deadline metadata, and keywords.',
                    'The individual reviews and edits the suggested information.',
                    'The individual confirms and submits the Help Request.',
                    'The request enters SP’s existing verification workflow.',
                ],
                'important' =>
                    'The AI assistant does not approve, reject, or automatically submit a Help Request.',
            ],

            'campaigns' => [
                'description' =>
                    'Campaigns are public humanitarian initiatives that can receive support through the platform.',
                'types' => [
                    'local_case' => 'Local Case',
                    'organization_proposed' => 'Organization Proposed',
                    'global_situation' => 'Global Situation',
                ],
            ],

            'categories' => [
                'education' => 'শিক্ষা',
                'healthcare' => 'স্বাস্থ্যসেবা',
                'food-assistance' => 'খাদ্য',
                'shelter' => 'আশ্রয়',
                'livelihood' => 'জীবিকা',
                'disaster-relief' => 'দুর্যোগ সহায়তা',
                'water-sanitation' => 'বিশুদ্ধ পানি',
                'child-support' => 'শিশু সহায়তা',
                'women-support' => 'নারী সহায়তা',
                'disability-support' => 'প্রতিবন্ধী সহায়তা',
                'emergency-relief' => 'জরুরি সহায়তা',
                'other' => 'অন্যান্য',
            ],

            'volunteering' => [
                'description' =>
                    'Individuals can participate in humanitarian activities as volunteers through SP.',
                'important' =>
                    'Volunteer participation is associated with verified individual users.',
            ],

            'donations' => [
                'description' =>
                    'Users can support eligible campaigns through the donation system available on SP.',
                'important' =>
                    'The chatbot should guide users to the donation flow rather than handling payments itself.',
            ],

            'accounts' => [
                'individual' =>
                    'Individual accounts are for people who use SP to request or provide humanitarian support and participate in volunteering.',
                'organization' =>
                    'Organization accounts are for organizations participating in humanitarian coordination through SP.',
                'admin' =>
                    'Admin accounts are used by SP administrators to manage and review platform activities.',
            ],

            'navigation' => [
                'help_request' => 'Request Help',
                'campaigns' => 'Campaigns',
                'categories' => 'Categories',
                'volunteer' => 'Volunteer',
                'donation' => 'Donation',
                'login' => 'Login',
                'register' => 'Register',
            ],

            'limitations' => [
                'no_approval' =>
                    'The chatbot cannot approve or reject Help Requests.',
                'no_submission' =>
                    'The chatbot cannot submit a Help Request on behalf of a user.',
                'no_private_data' =>
                    'The chatbot should not expose private user or administrative information.',
                'no_medical_diagnosis' =>
                    'The chatbot should not diagnose medical conditions.',
                'no_legal_advice' =>
                    'The chatbot should not provide professional legal advice.',
                'no_guarantees' =>
                    'The chatbot should not promise that a user will receive financial or humanitarian assistance.',
                'no_invented_information' =>
                    'The chatbot should not invent campaign details, availability, eligibility, locations, or other platform information.',
            ],
        ];
    }
}