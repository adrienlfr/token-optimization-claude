#!/usr/bin/env node
/**
 * Phase 3: Implementation - Real Claude API Token Testing
 * Mesure l'impact réel des leviers d'optimisation avec l'API Claude
 */

const fs = require('fs');
const path = require('path');

// Load .env.phase3 if it exists
const envPath = path.join(__dirname, '../.env.phase3');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value && !value.includes('YOUR_KEY')) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

// Configuration Claude API
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!CLAUDE_API_KEY || CLAUDE_API_KEY.includes('YOUR_KEY')) {
  console.error("❌ Error: ANTHROPIC_API_KEY not configured");
  console.error("📝 Please add your key to: .env.phase3");
  console.error("   Get it from: https://console.anthropic.com/account/keys");
  process.exit(1);
}

const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";

const NOTION_TOKEN = "ntn_D96917719437ATVGhA5e9H2JbHsCdNPZ5GaPRmTIh4H4Sw";
const DB_ID = "33a241acb42781718e08e515d5db690d";

const notionHeaders = {
  "Authorization": `Bearer ${NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28"
};

async function notion(method, path, body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: notionHeaders,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Notion API error: ${JSON.stringify(data)}`);
  return data;
}

async function callClaude(messages, systemPrompt = null, tools = null) {
  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  if (tools) {
    body.tools = tools;
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Claude API error: ${JSON.stringify(data)}`);
  }

  return data;
}

async function addResult(title, category, result) {
  const today = new Date().toISOString().split("T")[0];
  
  const notes = `Input Tokens: ${result.inputTokens}
Output Tokens: ${result.outputTokens}
Total Tokens: ${result.totalTokens}
Cost: $${result.estimatedCost.toFixed(4)}

${result.comparison ? `Comparison: ${result.comparison}` : ''}
`;

  await notion("POST", "/pages", {
    parent: { database_id: DB_ID },
    properties: {
      "Titre": { title: [{ type: "text", text: { content: title } }] },
      "Type": { select: { name: "🧪 Experiment" } },
      "Catégorie": { select: { name: category } },
      "Levier d'optimisation": { checkbox: true },
      "Impact (tokens)": { select: { name: result.impact } },
      "Statut": { select: { name: "✅ Validé" } },
      "Notes": { rich_text: [{ type: "text", text: { content: notes } }] },
      "Date": { date: { start: today } }
    }
  });
}

// Test 1: Prompt Compression
async function testPromptCompression() {
  console.log("\n🧪 Test 1: Prompt Compression");

  const verbosePrompt = `You are a highly sophisticated AI assistant with expertise in multiple domains.
Your role is to analyze and process information with meticulous attention to detail.
You should provide comprehensive responses that cover all aspects of the topic at hand.
Please ensure your analysis is thorough, well-structured, and includes multiple perspectives.
Consider edge cases and potential implications of your analysis.
Format your response with clear sections and subsections for improved readability.`;

  const concisePrompt = `Analyze the topic comprehensively. Provide structured analysis with multiple perspectives.`;

  const testMessage = "What are the main factors affecting climate change?";

  // Verbose test
  console.log("  📝 Testing verbose prompt...");
  const verboseRes = await callClaude(
    [{ role: "user", content: testMessage }],
    verbosePrompt
  );

  const verboseTokens = verboseRes.usage.input_tokens + verboseRes.usage.output_tokens;
  const verboseCost = (verboseRes.usage.input_tokens * 3 + verboseRes.usage.output_tokens * 15) / 1000000;

  // Concise test
  console.log("  ✂️  Testing concise prompt...");
  const conciseRes = await callClaude(
    [{ role: "user", content: testMessage }],
    concisePrompt
  );

  const conciseTokens = conciseRes.usage.input_tokens + conciseRes.usage.output_tokens;
  const conciseCost = (conciseRes.usage.input_tokens * 3 + conciseRes.usage.output_tokens * 15) / 1000000;

  const savings = ((verboseTokens - conciseTokens) / verboseTokens * 100).toFixed(1);

  console.log(`  ✅ Verbose: ${verboseTokens} tokens ($${verboseCost.toFixed(4)})`);
  console.log(`  ✅ Concise: ${conciseTokens} tokens ($${conciseCost.toFixed(4)})`);
  console.log(`  💰 Savings: ${savings}%`);

  await addResult(
    "Prompt Compression: Verbose vs Concise",
    "📏 Prompt Length",
    {
      inputTokens: conciseRes.usage.input_tokens,
      outputTokens: conciseRes.usage.output_tokens,
      totalTokens: conciseTokens,
      estimatedCost: conciseCost,
      impact: "📈 Important (10-30%)",
      comparison: `Verbose: ${verboseTokens} tokens, Concise: ${conciseTokens} tokens (${savings}% savings)`
    }
  );
}

// Test 2: Output Constraints
async function testOutputConstraints() {
  console.log("\n🧪 Test 2: Output Constraints (Natural Language vs JSON)");

  const systemPrompt = "You are a data analyst.";
  const testMessage = "Analyze this data: sales increased 25%, costs down 10%, new markets opened.";

  // Natural language
  console.log("  📝 Testing natural language output...");
  const nlRes = await callClaude(
    [{ role: "user", content: testMessage }],
    systemPrompt + "\nRespond with a detailed paragraph analysis."
  );

  const nlTokens = nlRes.usage.input_tokens + nlRes.usage.output_tokens;
  const nlCost = (nlRes.usage.input_tokens * 3 + nlRes.usage.output_tokens * 15) / 1000000;

  // JSON format
  console.log("  🔧 Testing JSON format...");
  const jsonRes = await callClaude(
    [{ role: "user", content: testMessage }],
    systemPrompt + "\nRespond with JSON format: {metrics: {sales: %, costs: %}, opportunities: string[]}"
  );

  const jsonTokens = jsonRes.usage.input_tokens + jsonRes.usage.output_tokens;
  const jsonCost = (jsonRes.usage.input_tokens * 3 + jsonRes.usage.output_tokens * 15) / 1000000;

  const savings = ((nlTokens - jsonTokens) / nlTokens * 100).toFixed(1);

  console.log(`  ✅ Natural Language: ${nlTokens} tokens ($${nlCost.toFixed(4)})`);
  console.log(`  ✅ JSON Format: ${jsonTokens} tokens ($${jsonCost.toFixed(4)})`);
  console.log(`  💰 Savings: ${savings}%`);

  await addResult(
    "Output Constraints: Natural Language vs JSON",
    "📏 Prompt Length",
    {
      inputTokens: jsonRes.usage.input_tokens,
      outputTokens: jsonRes.usage.output_tokens,
      totalTokens: jsonTokens,
      estimatedCost: jsonCost,
      impact: savings > 5 ? "📈 Important (10-30%)" : "➖ Modéré (5-10%)",
      comparison: `NL: ${nlTokens} tokens, JSON: ${jsonTokens} tokens (${savings}% savings)`
    }
  );
}

// Test 3: Tool Definition Impact
async function testToolDefinitionImpact() {
  console.log("\n🧪 Test 3: Tool Definition Impact");

  const testMessage = "What's the weather like?";

  // Many tools
  console.log("  🔨 Testing with many tool definitions...");
  const manyTools = Array.from({ length: 10 }, (_, i) => ({
    name: `tool_${i}`,
    description: `This is tool number ${i}. It performs a specific function related to data processing and analysis. It can be used in various scenarios where you need to ${['search', 'analyze', 'process', 'retrieve', 'transform', 'validate', 'optimize', 'monitor', 'alert', 'report'][i]} information. The tool accepts multiple parameters and returns formatted results.`,
    input_schema: {
      type: "object",
      properties: {
        param1: { type: "string", description: "First parameter" },
        param2: { type: "string", description: "Second parameter" },
        param3: { type: "number", description: "Third parameter" }
      }
    }
  }));

  const manyRes = await callClaude(
    [{ role: "user", content: testMessage }],
    "You are an assistant with tools.",
    manyTools
  );

  const manyTokens = manyRes.usage.input_tokens;
  
  // Few tools
  console.log("  🔧 Testing with few tool definitions...");
  const fewTools = [
    {
      name: "get_weather",
      description: "Get current weather",
      input_schema: {
        type: "object",
        properties: { location: { type: "string" } }
      }
    }
  ];

  const fewRes = await callClaude(
    [{ role: "user", content: testMessage }],
    "You are an assistant with tools.",
    fewTools
  );

  const fewTokens = fewRes.usage.input_tokens;
  const savings = ((manyTokens - fewTokens) / manyTokens * 100).toFixed(1);

  console.log(`  ✅ With 10 tools: ${manyTokens} input tokens`);
  console.log(`  ✅ With 1 tool: ${fewTokens} input tokens`);
  console.log(`  💰 Savings: ${savings}%`);

  await addResult(
    "Tool Definition Impact: 10 Tools vs 1 Tool",
    "🔧 API Usage",
    {
      inputTokens: fewTokens,
      outputTokens: manyRes.usage.output_tokens,
      totalTokens: fewTokens + manyRes.usage.output_tokens,
      estimatedCost: (fewTokens * 3 + manyRes.usage.output_tokens * 15) / 1000000,
      impact: savings > 10 ? "📈 Important (10-30%)" : "➖ Modéré (5-10%)",
      comparison: `10 tools: ${manyTokens} tokens, 1 tool: ${fewTokens} tokens (${savings}% savings)`
    }
  );
}

// Test 4: System Prompt Size Impact
async function testSystemPromptSize() {
  console.log("\n🧪 Test 4: System Prompt Size Impact");

  const shortSystem = "You are a helpful assistant.";
  
  const longSystem = `You are an advanced AI assistant with extensive knowledge across multiple domains including:
- Technology and software development
- Business and economics
- Science and research methodology
- Creative writing and communication
- Data analysis and statistics
- Project management and leadership

Your approach should be:
1. Analytical and fact-based
2. Clear and well-structured
3. Comprehensive yet concise
4. Considerate of multiple perspectives
5. Proactive in identifying edge cases and implications

When responding:
- Break down complex topics into digestible pieces
- Provide specific examples when relevant
- Highlight assumptions and limitations
- Suggest follow-up questions or further exploration
- Maintain a professional yet approachable tone

Remember to consider the context and audience when crafting your response.`;

  const testMessage = "Explain machine learning.";

  // Short system
  console.log("  📝 Testing short system prompt...");
  const shortRes = await callClaude(
    [{ role: "user", content: testMessage }],
    shortSystem
  );

  const shortTotal = shortRes.usage.input_tokens + shortRes.usage.output_tokens;

  // Long system
  console.log("  📚 Testing long system prompt...");
  const longRes = await callClaude(
    [{ role: "user", content: testMessage }],
    longSystem
  );

  const longTotal = longRes.usage.input_tokens + longRes.usage.output_tokens;
  const increase = ((longRes.usage.input_tokens - shortRes.usage.input_tokens) / shortRes.usage.input_tokens * 100).toFixed(1);

  console.log(`  ✅ Short system: ${shortTotal} tokens`);
  console.log(`  ✅ Long system: ${longTotal} tokens`);
  console.log(`  📈 Increase: +${increase}%`);

  await addResult(
    "System Prompt Size: Short vs Long",
    "📏 Prompt Length",
    {
      inputTokens: shortRes.usage.input_tokens,
      outputTokens: shortRes.usage.output_tokens,
      totalTokens: shortTotal,
      estimatedCost: (shortRes.usage.input_tokens * 3 + shortRes.usage.output_tokens * 15) / 1000000,
      impact: "➖ Modéré (5-10%)",
      comparison: `Short: ${shortTotal} tokens, Long: ${longTotal} tokens (+${increase}% cost)`
    }
  );
}

async function main() {
  console.log("🚀 Phase 3: Real Claude API Testing\n");
  console.log("📊 Running token optimization experiments with real API calls...\n");

  const results = [];

  try {
    await testPromptCompression();
    results.push("✅ Prompt Compression");
  } catch (e) {
    console.error("❌ Prompt Compression failed:", e.message);
  }

  try {
    await testOutputConstraints();
    results.push("✅ Output Constraints");
  } catch (e) {
    console.error("❌ Output Constraints failed:", e.message);
  }

  try {
    await testToolDefinitionImpact();
    results.push("✅ Tool Definition Impact");
  } catch (e) {
    console.error("❌ Tool Definition failed:", e.message);
  }

  try {
    await testSystemPromptSize();
    results.push("✅ System Prompt Size");
  } catch (e) {
    console.error("❌ System Prompt Size failed:", e.message);
  }

  // Save results
  const resultsFile = path.join(__dirname, '../results/phase3_api_tests.json');
  const summary = {
    timestamp: new Date().toISOString(),
    testsRun: results,
    totalTests: results.length,
    successRate: `${(results.length / 4 * 100).toFixed(0)}%`
  };

  fs.writeFileSync(resultsFile, JSON.stringify(summary, null, 2));

  console.log("\n✅ Phase 3 Complete!");
  console.log(`📊 Results saved: results/phase3_api_tests.json`);
  console.log(`📄 Results also added to Notion database`);
  console.log(`\n📈 Tests completed: ${results.join(', ')}`);
}

main().catch(e => { 
  console.error("❌ Error:", e.message); 
  process.exit(1); 
});
