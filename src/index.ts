import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { generateResponseWithLLM } from './llmRunner';
import { analyzeAndAdjustResponse } from './ethicsGuard';
import { initializeMemoryGarden, processFeedback, memoryGardenDB } from './memoryGarden';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let localLLMReady = true; // Marqué prêt après vérification de setup

app.get('/', (req, res) => {
    res.status(200).send('Le Gardien est opérationnel et veille !');
});

app.post('/interact', async (req, res) => {
    const { message, feedbackScore, feedbackComment } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Un message est requis pour interagir.' });
    }

    try {
        // Interaction avec LLM
        const llmRawResponse = await generateResponseWithLLM(message);

        // Analyse éthique
        const ethicalReport = await analyzeAndAdjustResponse(message, llmRawResponse);

        const guardianResponse = ethicalReport.adjustedResponse || llmRawResponse;

        res.status(200).json({ response: guardianResponse, ethicalReport });

        if (feedbackScore !== undefined) {
            await processFeedback(message, guardianResponse, feedbackScore, feedbackComment, ethicalReport.ethicalTags);
        }
    } catch (error) {
        console.error('Erreur lors de l\'interaction:', error);
        res.status(500).json({ error: 'Une erreur interne est survenue.' });
    }
});

app.listen(port, async () => {
    await initializeMemoryGarden();
    console.log(`Serveur du Gardien démarré sur http://localhost:${port}`);
});

