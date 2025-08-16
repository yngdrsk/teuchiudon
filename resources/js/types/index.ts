export interface Post {
    id: number;
    title: string;
    content: string;
    image_path?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}