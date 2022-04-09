export type search = {
    meta: {
        status: number,
        message?: string,
    },
    response: {
        hits: [
            song
        ],
    }
}

export type song = {
    highlights: [],
    index: string,
    type: string,
    result: {
        annotation_count: number,
        api_path: string,
        artist_names: string,
        full_title: string,
        header_image_thumbnail_url: string,
        header_image_url: string,
        id: number,
        lyrics_owner_id: number,
        lyrics_state: string,
        path: string,
        pyongs_count: number,
        song_art_image_thumbnail_url: string,
        song_art_image_url: string,
        stats: {
            unreviewed_annotations: number,
            hot: boolean,
            pageviews: number,
        },
        title: string,
        title_with_featured: string,
        url: string,
        primary_artist: {
            api_path: string,
            header_image_url: string,
            id: number,
            image_url: string,
            is_meme_verified: boolean,
            is_verified: boolean,
            name: string,
            url: string,
            iq: number,
        }
    }
}