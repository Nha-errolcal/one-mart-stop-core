<?php

namespace App\Http\Controllers;

use App\Models\AttendFile;
use App\Helpers\FileHelper;

class AttendFileController extends Controller
{
    public function view($id)
    {
        try {
            $file = AttendFile::findOrFail($id);
            $url = $file->file_path ? asset('storage/' . $file->file_path) : null;
            return response()->json(['file_url' => $url]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'File not found', 'error' => $th->getMessage()], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $file = AttendFile::findOrFail($id);
            FileHelper::deleteFile($file->file_path, 'public');
            $file->delete();
            return response()->json(['message' => 'File deleted']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Delete failed', 'error' => $th->getMessage()], 500);
        }
    }
}
