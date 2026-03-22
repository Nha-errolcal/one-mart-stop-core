<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileHelper
{
    /**
     * Store a file and return its path.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string $disk
     * @return string $filePath
     */
    public static function storeFile(UploadedFile $file, string $folder = 'products', string $disk = 'public'): string
    {
        // Store file in given folder and disk
        return $file->store($folder, $disk);
    }

    /**
     * Delete a file if exists.
     *
     * @param string|null $filePath
     * @param string $disk
     * @return bool
     */
    public static function deleteFile(?string $filePath, string $disk = 'public'): bool
    {
        if ($filePath && Storage::disk($disk)->exists($filePath)) {
            return Storage::disk($disk)->delete($filePath);
        }
        return false;
    }

    /**
     * Update file: delete old file, store new one.
     *
     * @param UploadedFile|null $newFile
     * @param string|null $oldFilePath
     * @param string $folder
     * @param string $disk
     * @return string|null
     */
    public static function updateFile(?UploadedFile $newFile, ?string $oldFilePath, string $folder = 'products', string $disk = 'public'): ?string
    {
        if ($newFile) {
            // Delete old file
            self::deleteFile($oldFilePath, $disk);

            // Store new file
            return self::storeFile($newFile, $folder, $disk);
        }

        // No new file uploaded, keep old file
        return $oldFilePath;
    }
}
