export interface HighlightExportResult {
    user_book_id: number,
    title: string,
    author: string
}

export interface HighlightExportResponse {
    count: number,
    nextPageCursor: string,
    results: [HighlightExportResult]

}

/**
 * Verify the passed token with Readwise
 * @param token
 */
export async function verifyToken(token: string) {
    const result = await fetch(
        'https://readwise.io/api/v2/auth/',
        {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`
            }
        }
    )
    if (!result.ok) {
        throw Error('Invalid token')
    }
}


/**
 * Get Highlights from Readwise
 */
export function getHighlights(): HighlightExportResult[] {
    return [{
        title: 'Test Highlight',
        author: 'Some author'
    } as HighlightExportResult]

}