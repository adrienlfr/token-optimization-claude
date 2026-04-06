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

### Phase 3: Implementation (À venir)
Implémentation des leviers optimaux:

- [ ] Claude API integration pour compter les tokens réels
- [ ] Test suite complète
- [ ] Documentation des patterns gagnants
- [ ] Calculator de ROI

### Phase 4: Best Practices (À venir)
Guidelines et patterns réutilisables.

## 📁 Structure

```
.
├── README.md                      # Ce fichier
├── setup_notion.js                # Setup initial Notion (pages + DB)
├── scripts/
│   ├── phase1_research.js         # ✅ Recherche fondamentale
│   ├── phase2_experiments.js      # 🔄 Expériences pratiques
│   ├── phase3_implementation.js   # À faire
│   └── phase4_best_practices.js   # À faire
├── results/
│   └── phase2_experiments.json    # Résultats des expériences
└── docs/
    └── findings.md                # Notes de recherche
```

## 🚀 Quickstart

```bash
# Setup initial Notion pages & database
node setup_notion.js

# Phase 1: Documentez les findings
node scripts/phase1_research.js

# Phase 2: Run experiments
node scripts/phase2_experiments.js

# View results
cat results/phase2_experiments.json
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
