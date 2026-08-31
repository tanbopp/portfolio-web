<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    /**
     * Upload an image pasted/inserted into the WYSIWYG editor and return its URL.
     * This keeps article content small instead of embedding base64 data.
     */
    public function storeImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:10240',
        ]);

        $path = $request->file('image')->store('article-images', 'public');

        return response()->json([
            'url' => asset('storage/'.$path),
        ]);
    }
}
