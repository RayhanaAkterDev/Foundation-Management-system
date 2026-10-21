<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactMessageController extends Controller
{
    /**
     * Submit a public contact message.
     *
     * Authentication is not required.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email:rfc',
                'max:255',
            ],

            'topic' => [
                'required',
                'string',
                Rule::in([
                    'general',
                    'donation',
                    'campaign',
                    'volunteer',
                    'account',
                    'accessibility',
                    'other',
                ]),
            ],

            'message' => [
                'required',
                'string',
                'min:10',
                'max:5000',
            ],
        ]);

        $contactMessage = ContactMessage::create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'topic' => $validated['topic'],
            'message' => trim($validated['message']),
            'status' => ContactMessage::STATUS_NEW,
        ]);

        return response()->json([
            'message' => 'Your message has been submitted successfully.',
            'contact_message' => [
                'id' => $contactMessage->id,
                'status' => $contactMessage->status,
                'created_at' => $contactMessage->created_at,
            ],
        ], 201);
    }
}
