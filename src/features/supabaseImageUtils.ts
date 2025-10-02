import { supabase } from "@/supabaseClient";

// Upload files to Supabase Storage
export async function uploadFilesToSupabase(files: File[], folderPath: string): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
        const filePath = `${folderPath}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("betegnabucket")
            .upload(filePath, file);

        if (uploadError) {
            console.error("Upload error:", uploadError.message);
            continue;
        }

        const { data } = supabase.storage
            .from("betegnabucket")
            .getPublicUrl(filePath);

        if (data?.publicUrl) {
            uploadedUrls.push(data.publicUrl);
        } else {
            console.warn("Failed to get public URL for:", filePath);
        }
    }

    return uploadedUrls;
}


// Delete image from Supabase Storage using its public URL
export async function deleteImageFromSupabase(imageUrl: string | null): Promise<void> {
    if (!imageUrl) return;

    const parts = imageUrl.split("/betegnabucket/");
    const path = parts[1]?.split("?")[0];

    if (!path) {
        console.error("Invalid image URL format. Cannot extract path.");
        return;
    }

    const { error } = await supabase.storage
        .from("betegnabucket")
        .remove([path]);

    if (error) {
        console.error("Delete error:", error.message);
    }
}
