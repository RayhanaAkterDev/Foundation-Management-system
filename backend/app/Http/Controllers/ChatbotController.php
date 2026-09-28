<?php

namespace App\Http\Controllers;

use App\Services\Chatbot\ChatbotService;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    /**
     * Handle a public chatbot message.
     *
     * This endpoint does not require authentication.
     */
    public function chat(
        Request $request,
        ChatbotService $chatbotService
    ) {
        $validated = $request->validate([
            'message' => [
                'required',
                'string',
                'min:1',
                'max:2000',
            ],

            'page_context' => [
                'nullable',
                'array',
            ],
        ]);

        try {
            $response = $chatbotService->chat(
                $validated['message'],
                $validated['page_context'] ?? null
            );

            return response()->json([
                'message' => $response['message'],
                'source' => $response['source'] ?? 'local',
                'language' => $response['language'] ?? 'en',
            ], 200);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' =>
                'Unable to respond right now. Please try again.',
            ], 500);
        }
    }
}
