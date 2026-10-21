<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class ContactMessageController extends Controller
{
    /**
     * Submit a public contact message.
     * Authentication is not required.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
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
            'message' => ['required', 'string', 'min:10', 'max:5000'],
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

    /**
     * List contact messages for the admin dashboard.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => [
                'sometimes',
                'nullable',
                Rule::in(['new', 'in_progress', 'resolved']),
            ],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $query = ContactMessage::query();

        if (!empty($validated['search'])) {
            $search = trim($validated['search']);

            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('topic', 'ilike', "%{$search}%")
                    ->orWhere('message', 'ilike', "%{$search}%");
            });
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $messages = $query
            ->latest()
            ->paginate($validated['per_page'] ?? 10)
            ->withQueryString();

        return response()->json($messages);
    }

    /**
     * Show one contact message.
     */
    public function show(string $id)
    {
        $contactMessage = ContactMessage::findOrFail($id);

        return response()->json([
            'contact_message' => $contactMessage,
        ]);
    }

    /**
     * Update the contact message status.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['new', 'in_progress', 'resolved']),
            ],
        ]);

        $contactMessage = ContactMessage::findOrFail($id);

        $contactMessage->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Contact message status updated successfully.',
            'contact_message' => $contactMessage->fresh(),
        ]);
    }

    /**
     * Send an email reply to the person who submitted the message.
     */
    public function reply(Request $request, string $id)
    {
        $validated = $request->validate([
            'reply' => ['required', 'string', 'min:1', 'max:10000'],
        ]);

        $contactMessage = ContactMessage::findOrFail($id);

        Mail::raw(trim($validated['reply']), function ($mail) use ($contactMessage) {
            $mail
                ->to($contactMessage->email)
                ->subject('Response to your message - Stand For People');
        });

        $contactMessage->update([
            'status' => 'in_progress',
        ]);

        return response()->json([
            'message' => 'Reply email sent successfully.',
            'contact_message' => $contactMessage->fresh(),
        ]);
    }
}
