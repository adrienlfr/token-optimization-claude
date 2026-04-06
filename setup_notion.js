#!/usr/bin/env node
/**
 * Token Optimization for Claude — Setup Notion
 * Crée la page Notion et la base de données pour le projet
 */

const NOTION_TOKEN = "ntn_D96917719437ATVGhA5e9H2JbHsCdNPZ5GaPRmTIh4H4Sw";
const WORKSPACE_PAGE_ID = "33a241acb4278040b8dcee7f9ba40622"; // Page racine du workspace

const headers = {
  "Authorization": `Bearer ${NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28"
};

async function notion(method, path, body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Notion API error on ${path}: ${JSON.stringify(data)}`);
  return data;
}

async function createProjectPage() {
  console.log("📝 Création de la page projet Token Optimization...");

  const page = await notion("POST", "/pages", {
    parent: { page_id: WORKSPACE_PAGE_ID },
    icon: { type: "emoji", emoji: "⚡" },
    properties: {
      "title": {
        title: [{ type: "text", text: { content: "⚡ Token Optimization for Claude" } }]
      }
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📌 Objectifs" } }]
        }
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Comprendre le fonctionnement des tokens avec Claude" } }]
        }
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Identifier les leviers d'optimisation pour réduire la consommation de tokens" } }]
        }
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Documenter les résultats et les meilleures pratiques" } }]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "🔬 Méthodologie" } }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ 
            type: "text", 
            text: { content: "Phase 1 : Recherche fondamentale sur les tokens Claude\nPhase 2 : Expériences pratiques avec des scripts de test\nPhase 3 : Analyse des résultats et identification des leviers\nPhase 4 : Documentation des patterns et best practices" } 
          }]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📊 Base de données" } }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: "Base créée ci-dessous avec tous les résultats de recherche et expériences" } }]
        }
      }
    ]
  });

  console.log(`✅ Page créée : ${page.url}`);
  return page.id;
}

async function createDatabase(parentPageId) {
  console.log("📋 Création de la base de données Experiments...");

  const db = await notion("POST", "/databases", {
    parent: { page_id: parentPageId },
    icon: { type: "emoji", emoji: "🧪" },
    title: [{ type: "text", text: { content: "🧪 Experiments & Results" } }],
    is_inline: false,
    properties: {
      "Titre": { title: {} },
      "Type": {
        select: {
          options: [
            { name: "📖 Research", color: "blue" },
            { name: "🧪 Experiment", color: "purple" },
            { name: "📊 Result", color: "green" },
            { name: "📝 Finding", color: "yellow" }
          ]
        }
      },
      "Catégorie": {
        select: {
          options: [
            { name: "📏 Prompt Length", color: "blue" },
            { name: "🧠 Context Windows", color: "purple" },
            { name: "💾 Caching", color: "green" },
            { name: "🔄 Batch Processing", color: "orange" },
            { name: "📚 Embeddings & RAG", color: "pink" },
            { name: "🔧 API Usage", color: "red" },
            { name: "💡 Other", color: "gray" }
          ]
        }
      },
      "Levier d'optimisation": {
        checkbox: {}
      },
      "Impact (tokens)": {
        select: {
          options: [
            { name: "🚀 Très important (>30%)", color: "green" },
            { name: "📈 Important (10-30%)", color: "blue" },
            { name: "➖ Modéré (5-10%)", color: "yellow" },
            { name: "🔹 Mineur (<5%)", color: "gray" },
            { name: "❓ À évaluer", color: "purple" }
          ]
        }
      },
      "Statut": {
        select: {
          options: [
            { name: "🆕 À explorer", color: "blue" },
            { name: "⏳ En cours", color: "yellow" },
            { name: "✅ Validé", color: "green" },
            { name: "📌 Important finding", color: "red" }
          ]
        }
      },
      "Lien GitHub": { url: {} },
      "Notes": { rich_text: {} },
      "Date": { date: {} }
    }
  });

  console.log(`✅ Base de données créée : ${db.url}`);
  return db.id;
}

async function main() {
  console.log("🚀 Setup Notion pour Token Optimization...\n");

  const projectPageId = await createProjectPage();
  const databaseId = await createDatabase(projectPageId);

  console.log("\n✅ Setup terminé !");
  console.log(`📄 Page : https://www.notion.so/${projectPageId.replace(/-/g, "")}`);
  console.log(`🧪 Base : https://www.notion.so/${databaseId.replace(/-/g, "")}`);
}

main().catch(e => { console.error("❌ Erreur :", e); process.exit(1); });
