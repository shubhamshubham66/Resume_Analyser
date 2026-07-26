import type { ParsedResume } from "./pdf-parser";

export interface AnalysisResult {
  score: number;
  summary: string;
  sections: SectionAnalysis[];
  suggestions: Suggestion[];
  keywords: KeywordAnalysis;
}

export interface SectionAnalysis {
  name: string;
  found: boolean;
  score: number;
  feedback: string;
}

export interface Suggestion {
  type: "improvement" | "warning" | "positive";
  text: string;
  priority: "high" | "medium" | "low";
}

export interface KeywordAnalysis {
  found: string[];
  missing: string[];
  total: number;
}

// Common ATS-relevant keywords categorized
const ATS_KEYWORDS = {
  skills: [
    "javascript",
    "typescript",
    "python",
    "java",
    "c++",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "django",
    "flask",
    "spring",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "sql",
    "nosql",
    "mongodb",
    "postgresql",
    "redis",
    "graphql",
    "rest",
    "api",
    "ci/cd",
    "agile",
    "scrum",
    "machine learning",
    "data analysis",
    "html",
    "css",
    "tailwind",
    "sass",
    "webpack",
    "vite",
    "linux",
    "testing",
    "jest",
    "selenium",
  ],
  sections: [
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "summary",
    "objective",
    "achievements",
    "awards",
    "publications",
    "volunteer",
    "languages",
  ],
  actionVerbs: [
    "developed",
    "implemented",
    "designed",
    "led",
    "managed",
    "created",
    "built",
    "improved",
    "optimized",
    "reduced",
    "increased",
    "delivered",
    "architected",
    "deployed",
    "automated",
    "collaborated",
    "mentored",
    "analyzed",
    "resolved",
    "established",
  ],
  metrics: [
    "percent",
    "%",
    "revenue",
    "users",
    "performance",
    "efficiency",
    "growth",
    "reduced",
    "increased",
    "saved",
    "improved",
  ],
};

const EXPECTED_SECTIONS = [
  "contact",
  "summary",
  "experience",
  "education",
  "skills",
];

/**
 * Analyze a parsed resume and return scoring + feedback
 */
export function analyzeResume(parsed: ParsedResume): AnalysisResult {
  const text = parsed.text.toLowerCase();
  const lines = parsed.text.split("\n").filter((l) => l.trim().length > 0);

  // Analyze sections
  const sections = analyzeSections(text);

  // Analyze keywords
  const keywords = analyzeKeywords(text);

  // Generate suggestions
  const suggestions = generateSuggestions(text, sections, keywords, lines);

  // Calculate overall score
  const score = calculateScore(sections, keywords, text, lines);

  // Generate summary
  const summary = generateSummary(score, sections, keywords);

  return { score, summary, sections, suggestions, keywords };
}

function analyzeSections(text: string): SectionAnalysis[] {
  return EXPECTED_SECTIONS.map((section) => {
    const found = text.includes(section);
    let score = 0;
    let feedback = "";

    if (found) {
      score = 80 + Math.floor(Math.random() * 20);
      feedback = `${capitalize(section)} section detected.`;
    } else {
      score = 0;
      feedback = `Missing ${section} section. Consider adding one.`;
    }

    // Extra checks for specific sections
    if (section === "experience" && found) {
      const hasMetrics = ATS_KEYWORDS.metrics.some((m) => text.includes(m));
      if (hasMetrics) {
        score = Math.min(100, score + 10);
        feedback += " Includes quantifiable metrics.";
      } else {
        feedback += " Consider adding quantifiable achievements.";
      }
    }

    if (section === "skills" && found) {
      const skillCount = ATS_KEYWORDS.skills.filter((s) =>
        text.includes(s)
      ).length;
      if (skillCount >= 5) {
        score = Math.min(100, score + 10);
        feedback += ` Found ${skillCount} relevant technical skills.`;
      }
    }

    return { name: capitalize(section), found, score, feedback };
  });
}

function analyzeKeywords(text: string): KeywordAnalysis {
  const allKeywords = [
    ...ATS_KEYWORDS.skills,
    ...ATS_KEYWORDS.actionVerbs,
  ];
  const found = allKeywords.filter((kw) => text.includes(kw));
  const missing = ATS_KEYWORDS.skills
    .filter((kw) => !text.includes(kw))
    .slice(0, 10);

  return { found, missing, total: allKeywords.length };
}

function generateSuggestions(
  text: string,
  sections: SectionAnalysis[],
  keywords: KeywordAnalysis,
  lines: string[]
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Missing sections
  sections
    .filter((s) => !s.found)
    .forEach((s) => {
      suggestions.push({
        type: "warning",
        text: `Add a "${s.name}" section to improve ATS compatibility.`,
        priority: s.name === "Experience" || s.name === "Skills" ? "high" : "medium",
      });
    });

  // Short resume
  if (lines.length < 15) {
    suggestions.push({
      type: "warning",
      text: "Your resume appears too short. Aim for at least one full page of content.",
      priority: "high",
    });
  }

  // Too long
  if (lines.length > 100) {
    suggestions.push({
      type: "improvement",
      text: "Your resume is quite long. Consider condensing to 1-2 pages for better ATS results.",
      priority: "medium",
    });
  }

  // Action verbs
  const actionVerbCount = ATS_KEYWORDS.actionVerbs.filter((v) =>
    text.includes(v)
  ).length;
  if (actionVerbCount < 3) {
    suggestions.push({
      type: "improvement",
      text: 'Use more action verbs (e.g., "developed", "implemented", "led") to describe your experience.',
      priority: "high",
    });
  } else {
    suggestions.push({
      type: "positive",
      text: `Good use of action verbs (${actionVerbCount} found). This helps ATS parsing.`,
      priority: "low",
    });
  }

  // Metrics
  const hasMetrics = ATS_KEYWORDS.metrics.some((m) => text.includes(m));
  if (!hasMetrics) {
    suggestions.push({
      type: "improvement",
      text: "Add quantifiable metrics (percentages, numbers) to demonstrate impact.",
      priority: "high",
    });
  } else {
    suggestions.push({
      type: "positive",
      text: "Good — your resume includes quantifiable achievements.",
      priority: "low",
    });
  }

  // Email check
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  if (!emailRegex.test(text)) {
    suggestions.push({
      type: "warning",
      text: "No email address detected. Make sure your contact info is in plain text (not an image).",
      priority: "high",
    });
  }

  // Keywords
  if (keywords.found.length < 5) {
    suggestions.push({
      type: "improvement",
      text: "Include more industry-relevant keywords to improve ATS matching.",
      priority: "medium",
    });
  }

  return suggestions.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}

function calculateScore(
  sections: SectionAnalysis[],
  keywords: KeywordAnalysis,
  text: string,
  lines: string[]
): number {
  let score = 0;

  // Section completeness (40% weight)
  const sectionScore =
    sections.filter((s) => s.found).length / sections.length;
  score += sectionScore * 40;

  // Keywords (30% weight)
  const keywordRatio = Math.min(keywords.found.length / 15, 1);
  score += keywordRatio * 30;

  // Length appropriateness (15% weight)
  if (lines.length >= 15 && lines.length <= 80) {
    score += 15;
  } else if (lines.length >= 10 && lines.length <= 100) {
    score += 10;
  } else {
    score += 5;
  }

  // Formatting (15% weight)
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /[\d\s()+-]{10,}/.test(text);
  const hasMetrics = ATS_KEYWORDS.metrics.some((m) => text.includes(m));
  let formatScore = 0;
  if (hasEmail) formatScore += 5;
  if (hasPhone) formatScore += 5;
  if (hasMetrics) formatScore += 5;
  score += formatScore;

  return Math.min(100, Math.round(score));
}

function generateSummary(
  score: number,
  sections: SectionAnalysis[],
  keywords: KeywordAnalysis
): string {
  const foundSections = sections.filter((s) => s.found).length;
  const totalSections = sections.length;

  if (score >= 80) {
    return `Excellent! Your resume is well-optimized for ATS systems. It includes ${foundSections}/${totalSections} expected sections and ${keywords.found.length} relevant keywords. Minor tweaks could bring it to perfection.`;
  } else if (score >= 60) {
    return `Good foundation! Your resume has ${foundSections}/${totalSections} key sections and ${keywords.found.length} relevant keywords. With a few improvements to structure and keyword usage, you can significantly boost your ATS score.`;
  } else if (score >= 40) {
    return `Your resume needs work. Only ${foundSections}/${totalSections} expected sections were found, and keyword density is low (${keywords.found.length} found). Focus on adding missing sections and relevant technical keywords.`;
  } else {
    return `Your resume needs significant improvement for ATS compatibility. Key sections are missing and keyword density is very low. Consider restructuring with clear section headers and adding relevant skills and experience details.`;
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
