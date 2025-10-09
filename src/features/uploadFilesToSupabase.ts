/**
 * Deletes an image from Supabase Storage given its public URL or storage path.
 * @param imageUrlOrPath The public URL or storage path of the image to delete
 * @returns Promise<void>
 */
export async function deleteImageFromSupabase(imageUrlOrPath: string): Promise<void> {
    // If a full public URL is provided, extract the storage path
    let path = imageUrlOrPath;
    const publicUrlPrefix = supabase.storage.from('viavelabucket').getPublicUrl('').data.publicUrl;
    if (imageUrlOrPath.startsWith(publicUrlPrefix)) {
        path = imageUrlOrPath.replace(publicUrlPrefix, '');
        if (path.startsWith('/')) path = path.slice(1);
    }
    const { error } = await supabase.storage.from('viavelabucket').remove([path]);
    if (error) throw new Error(error.message);
}
import { supabase } from '../supabaseClient';

/**
 * Uploads files to Supabase Storage and returns their public URLs.
 * @param files Array of File objects to upload
 * @param folderPath Storage folder path (e.g. 'betegnabucket/provider_id')
 * @returns Array of public URLs for the uploaded files
 */
export async function uploadFilesToSupabase(files: File[], folderPath: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
        const filePath = `${folderPath}/${Date.now()}_${file.name}`;

        const { error } = await supabase.storage.from('viavelabucket').upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });
        console.log('Upload result:', { filePath, error });

        if (error) throw new Error(error.message);

        // ✅ Get public URL
        const { data: publicUrlData } = supabase.storage.from('viavelabucket').getPublicUrl(filePath);
        if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL');

        urls.push(publicUrlData.publicUrl);
    }

    return urls;
}
