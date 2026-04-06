# Token Optimization for Claude

Recherche systématique sur les leviers d'optimisation pour réduire la consommation de tokens avec Claude.

## 🎯 Objectifs

- Comprendre le fonctionnement des tokens avec Claude
- Identifier les leviers d'optimisation
- Mesurer l'impact réel sur les coûts
- Documenter les meilleures pratiques

## 📚 Documentation

- **Notion Page:** https://www.notion.so/Token-Optimization-for-Claude-33a241acb427811eb5c7d85f399e2816
- **Experiments DB:** https://www.notion.so/33a241acb42781718e08e515d5db690d

## 🔬 Phases de Recherche

### Phase 1: Token Fundamentals ✅
Recherche fondamentale documentée dans Notion avec 10 findings clés:

- **Tokenization:** Claude utilise BPE (Byte-Pair Encoding), ~1 token ≈ 4 caractères
- **Prompt Caching:** Réduit les coûts de 90% après le premier hit (cache)
- **Output Tokens:** Coûtent 3x plus chers que les input tokens
- **Batch API:** 50% de réduction + traitement garanti (24h)
- **Vision:** Les images coûtent 250-1200 tokens selon la taille
- **Tool Definitions:** Chaque tool a un coût en tokens
- **Context Window:** Ne pas impactée par la taille disponible (200K)

### Phase 2: Practical Experiments 🔄
Scripts de test pour mesurer l'impact réel:

- Prompt compression (verbose vs concise)
- Output constraints (natural language vs JSON)
- Caching impact (ROI du cache)
- Batch economics (cost analysis)
- Tool definition optimization

### Phase 3: Implementation 🚀
Implémentation des leviers optimaux avec vrais tests API:

- ✅ Claude API integration pour compter les tokens réels
- ✅ 4 test suites complètes (Compression, Constraints, Tools, System Prompt)
- ✅ Documentation des patterns gagnants
- ✅ Calculator de ROI
- 📄 Voir: `docs/PHASE3_SETUP.md` pour configurer ta clé API

### Phase 4: Best Practices ✅
Guidelines et patterns réutilisables documentés:

- ✅ 5 patterns clés avec implémentation
- ✅ ROI calculator (quick decision tree)
- ✅ Implementation roadmap (4 semaines)
- ✅ Monitoring guidelines
- 📄 Voir: `docs/BEST_PRACTICES.md`

## 📁 Structure

```
.
├── README.md                      # Ce fichier
├── .env.phase3                    # Config pour Phase 3 (ta clé API)
├── setup_notion.js                # Setup initial Notion (pages + DB)
├── scripts/
│   ├── phase1_research.js         # ✅ Recherche fondamentale
│   ├── phase2_experiments.js      # ✅ Expériences pratiques (planning)
│   ├── phase3_implementation.js   # 🚀 Tests réels API Claude
│   └── phase4_best_practices.js   # ✅ Patterns & ROI
├── results/
│   ├── phase2_experiments.json    # Résultats des expériences
│   └── phase3_api_tests.json      # Résultats tests API
├── docs/
│   ├── PHASE3_SETUP.md            # Guide de configuration Phase 3
│   ├── BEST_PRACTICES.md          # ✅ Guidelines & patterns
│   └── findings.md                # Notes de recherche
└── .gitignore
```

## 🚀 Quickstart

```bash
# Setup initial Notion pages & database
node setup_notion.js

# Phase 1: Documentez les findings
node scripts/phase1_research.js

# Phase 2: Run experiments planning
node scripts/phase2_experiments.js

# Phase 3: Real API testing (NEED YOUR API KEY)
# 1. Edit .env.phase3 and add your ANTHROPIC_API_KEY
# 2. Run:
node scripts/phase3_implementation.js

# Phase 4: Generate best practices & ROI
node scripts/phase4_best_practices.js

# View results
cat results/phase3_api_tests.json
cat docs/BEST_PRACTICES.md
```

## ⚡ Quick Start for Phase 3

To run the real API tests with actual token measurements:

```bash
# 1. Get your API key from https://console.anthropic.com/account/keys
# 2. Edit .env.phase3:
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE

# 3. Run the tests:
node scripts/phase3_implementation.js

# Results will be added to Notion automatically + saved to results/
```

## 💡 Key Findings So Far

| Lever | Savings | Implementation | ROI |
|-------|---------|-----------------|-----|
| Prompt Caching | 90% (after cache) | Medium | Very High |
| Batch API | 50% | High | High |
| Output Constraints | 60-70% | Easy | High |
| Prompt Compression | 70-80% | Easy | Very High |
| Tool Optimization | 75% overhead reduction | Medium | High |
| Vision Optimization | 30-50% | Medium | Medium |

## 🔗 Resources

- [Claude Tokenizer](https://github.com/openai/tiktoken) - Count tokens
- [Claude API Docs](https://claude.ai/docs) - Official documentation
- [Prompt Caching Guide](https://claude.ai/docs/guides/prompt-caching) - Official guide
- [Batch Processing](https://claude.ai/docs/guides/batch-api) - Batch API docs

## 📝 Notes

- All research is Claude-focused (can expand to other models later)
- Focus on practical, measurable optimizations
- Document everything in Notion for team visibility
- Code examples should be self-contained and runnable

---

*Robin's Lab - Exploring Token Optimization with Claude* 🤖
