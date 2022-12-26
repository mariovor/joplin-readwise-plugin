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
 * Get Highlights from Readwise
 */
export function getHighlights(): HighlightExportResult[] {
    return [{
        title: 'Test Highlight',
        author: 'Some author'
    } as HighlightExportResult]

}