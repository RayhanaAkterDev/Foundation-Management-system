<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'about',
                'support_types',
                'image',
                'active',
                'featured',
            ]);

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
