interface Highlight {
    text: string
}

export interface Article {
    user_book_id: number,
    title: string,
    author: string,
    source_url: string
    highlights: [Highlight]
}

export interface HighlightExportResponse {
    count: number,
    nextPageCursor: string,
    results: [Article]
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
 * Fetch data from Readwise, support pagination
 * @param token
 * @param updatedAfter
 */
const fetchFromExportApi = async (token, updatedAfter = null) => {
    let fullData = [];
    let nextPageCursor = null;

    while (true) {
        const queryParams = new URLSearchParams();
        if (nextPageCursor) {
            queryParams.append('pageCursor', nextPageCursor);
        }
        if (updatedAfter) {
            queryParams.append('updatedAfter', updatedAfter);
        }
        console.log('Making export api request with params ' + queryParams.toString());
        const response = await fetch('https://readwise.io/api/v2/export/?' + queryParams.toString(), {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        const responseJson = await response.json();
        fullData.push(...responseJson['results']);
        nextPageCursor = responseJson['nextPageCursor'];
        if (!nextPageCursor) {
            break;
        }
    }
    return fullData;
};

/**
 * Get Highlights from Readwise
 */
export async function getHighlights(token: string): Promise<Article[]> {
    return await fetchFromExportApi(token) as Article[]
}