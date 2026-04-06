# Phase 3: Implementation - Real API Testing

## Configuration

Avant de lancer les tests, tu dois configurer ta clé API Claude :

### Step 1: Récupère ta clé API
1. Va sur https://console.anthropic.com/account/keys
2. Crée une nouvelle clé (ou copie une existante)
3. Copie la clé complète (commence par `sk-ant-`)

### Step 2: Configure le fichier `.env.phase3`

```bash
# Édite .env.phase3
ANTHROPIC_API_KEY=sk-ant-YOUR_ACTUAL_KEY_HERE
```

### Step 3: Lance les tests

```bash
# Execute the Phase 3 tests
node scripts/phase3_implementation.js
```

## Tests Inclus

1. **Prompt Compression** - Verbose vs Concise
   - Mesure les tokens économisés en réduisant la verbosité du system prompt
   - Expected savings: 5-15%

2. **Output Constraints** - Natural Language vs JSON
   - Compare le coût des outputs en format naturel vs JSON structuré
   - Expected savings: 5-20%

3. **Tool Definition Impact** - Many vs Few tools
   - Mesure l'overhead des tool definitions
   - Expected savings: 10-30%

4. **System Prompt Size** - Short vs Long
   - Impact du système prompt sur les tokens globaux
   - Expected increase: 5-15%

## Résultats

Les résultats sont :
- 📊 Sauvegardés dans `results/phase3_api_tests.json`
- 📝 Ajoutés automatiquement à Notion
- 💰 Incluent l'estimation des coûts

## Pricing Reference (Claude 3.5 Sonnet)

- **Input tokens**: $3 per million tokens
- **Output tokens**: $15 per million tokens
- Example: 1000 input + 500 output = $0.0045

## Troubleshooting

- ❌ "API key not configured" → Ajoute ton clé à `.env.phase3`
- ❌ "Rate limited" → Attends quelques secondes entre les tests
- ❌ "Invalid API key" → Vérifie que ta clé commence par `sk-ant-`

## Next: Phase 4

Une fois Phase 3 terminée, Phase 4 va:
- 📊 Analyser les résultats
- 🎯 Recommander les leviers prioritaires
- 📈 Créer un calculator ROI
- 📚 Écrire les best practices
