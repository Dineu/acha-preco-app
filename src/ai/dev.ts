import { config } from 'dotenv';
config();

// Important: load tools before flows that use them.
// By commenting out the imports, we prevent the models from being pre-loaded during development,
// which can save memory on the VM. The server actions will import them directly when needed.
import '@/ai/tools/findSupermercados.ts';
// import '@/ai/flows/suggest-alternate-stores.ts';
// import '@/ai/flows/suggest-missing-items.ts';
// import '@/ai/flows/extract-promotion-details.ts';
// import '@/ai/flows/test-ai-flow.ts';
