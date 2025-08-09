export interface EthicsReport {
    ethicalTags: string[];
    issuesDetected: boolean;
    adjustedResponse?: string;
    analysisDetails?: string;
}

export async function analyzeAndAdjustResponse(userMessage: string, llmRawResponse: string): Promise<EthicsReport> {
    let issuesDetected = false;
    let ethicalTags: string[] = ['neutral'];
    let adjustedResponse = llmRawResponse;
    let analysisDetails = 'Analyse éthique simple.';

    if (llmRawResponse.toLowerCase().includes('nuire') || llmRawResponse.toLowerCase().includes('malveillance')) {
        issuesDetected = true;
        ethicalTags.push('harmful');
        adjustedResponse = "Je ne peux pas répondre à cette demande car elle semble contraire à une éthique de bienveillance.";
        analysisDetails = 'Détection de contenu potentiellement nuisible.';
    } else if (llmRawResponse.toLowerCase().includes('biais')) {
        ethicalTags.push('biased');
        analysisDetails = 'Détection d\'un possible biais. Réponse non modifiée.';
    } else {
        ethicalTags.push('safe');
    }

    console.log(`EthicsGuard: "${llmRawResponse}" -> "${adjustedResponse}" (Issues: ${issuesDetected})`);

    return {
        ethicalTags,
        issuesDetected,
        adjustedResponse,
        analysisDetails
    };
}
