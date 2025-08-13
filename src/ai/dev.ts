import { config } from 'dotenv';
config();

// Important: load tools before flows that use them.
// import '@/ai/tools/findSupermercados.ts'; // A ferramenta agora é importada diretamente pelo fluxo que a utiliza
import '@/ai/flows/suggest-alternate-stores.ts';
import '@/ai/flows/suggest-missing-items.ts';
import '@/ai/flows/extract-promotion-details.ts';
