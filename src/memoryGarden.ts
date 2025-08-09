export type FeedbackEntry = {
    id: string;
    timestamp: number;
    message: string;
    response: string;
    feedback: {
        score: number;
        comment?: string;
    };
    contextEmbeddings: number[];
    metadata: {
        userId: string;
        ethicalTags?: string[];
    };
};

export type MemoryGarden = {
    add: (entry: FeedbackEntry) => Promise<void>;
    query: (text: string) => Promise<any[]>;
};

export let memoryGardenDB: MemoryGarden | null = null;

export async function initializeMemoryGarden() {
    memoryGardenDB = {
        add: async (entry: FeedbackEntry) => {
            console.log('Feedback ajouté au jardin (simulation):', entry.id);
        },
        query: async (text: string) => {
            console.log(`Recherche dans le jardin pour "${text}" (simulation)`);
            return [];
        },
    };
    console.log('Jardin de mémoire initialisé (placeholder).');
}

export async function processFeedback(
    message: string,
    response: string,
    feedbackScore: number,
    feedbackComment?: string,
    ethicalTags?: string[],
) {
    if (!memoryGardenDB) {
        console.warn('Jardin de mémoire non initialisé.');
        return;
    }

    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const contextEmbeddings = Array(768).fill(0).map(() => Math.random());

    const feedbackEntry: FeedbackEntry = {
        id,
        timestamp: Date.now(),
        message,
        response,
        feedback: {
            score: feedbackScore,
            comment: feedbackComment,
        },
        contextEmbeddings,
        metadata: {
            userId: 'architecte_test_user',
            ethicalTags: ethicalTags || ['unclassified']
        }
    };

    await memoryGardenDB.add(feedbackEntry);
}
