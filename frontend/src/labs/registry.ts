import React from 'react';

export interface LabDefinition {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'ml' | 'probability' | 'fun' | 'game' | 'utility' | 'analytics';
  status: 'active' | 'coming-soon';
  icon: string; // Key of Lucide icons
  releaseDate?: string; // e.g., "Q3 2026"
  component?: React.LazyExoticComponent<React.ComponentType<any>>;
}

export interface CategoryDefinition {
  id: 'ai' | 'ml' | 'probability' | 'fun' | 'game' | 'utility' | 'analytics';
  name: string;
  description: string;
  icon: string;
  colorClass: string; // Tailwind classes for gradient and text accents
  glowClass: string; // Shadow glow color
}

export const LAB_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'ai',
    name: 'AI Lab',
    description: 'Leverage LLMs for intelligent assistance, mock interviews, and code roasts.',
    icon: 'Sparkles',
    colorClass: 'from-violet-500 to-indigo-500 text-indigo-400',
    glowClass: 'rgba(139, 92, 246, 0.15)',
  },
  {
    id: 'ml',
    name: 'ML Lab',
    description: 'Run regression and classification models to predict placement, salary, and career paths.',
    icon: 'Brain',
    colorClass: 'from-pink-500 to-rose-500 text-rose-400',
    glowClass: 'rgba(244, 63, 94, 0.15)',
  },
  {
    id: 'probability',
    name: 'Probability Lab',
    description: 'Simulate and visualize statistics, Monte Carlo algorithms, and mathematical paradoxes.',
    icon: 'Dices',
    colorClass: 'from-emerald-500 to-teal-500 text-teal-400',
    glowClass: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'fun',
    name: 'Fun Lab',
    description: 'Dev jokes, program horror stories, developer horoscopes, and procrastination utilities.',
    icon: 'Ghost',
    colorClass: 'from-amber-500 to-orange-500 text-orange-400',
    glowClass: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'game',
    name: 'Game Lab',
    description: 'Test your typing speed, learn algorithms visually, and hunt down compiler bugs.',
    icon: 'Gamepad2',
    colorClass: 'from-cyan-500 to-blue-500 text-blue-400',
    glowClass: 'rgba(59, 130, 246, 0.15)',
  },
  {
    id: 'utility',
    name: 'Utility Lab',
    description: 'Everyday developer tools, regex testers, converters, and payload formatters.',
    icon: 'Wrench',
    colorClass: 'from-gray-400 to-slate-500 text-slate-300',
    glowClass: 'rgba(148, 163, 184, 0.15)',
  },
  {
    id: 'analytics',
    name: 'Analytics Lab',
    description: 'Visualize your coding history, Leetcode statistics, and annual GitHub Wrapped logs.',
    icon: 'BarChart3',
    colorClass: 'from-fuchsia-500 to-purple-500 text-purple-400',
    glowClass: 'rgba(217, 70, 239, 0.15)',
  },
];

export const LABS_REGISTRY: LabDefinition[] = [
  // ==========================================
  // ACTIVE LABS (PHASE 1 - FLAGSHIP)
  // ==========================================
  {
    id: 'github-roast',
    name: 'GitHub Roast AI',
    description: 'Get a brutally honest, AI-powered roast of your GitHub profile and public repositories.',
    category: 'ai',
    status: 'active',
    icon: 'GitPullRequest',
    component: React.lazy(() => import('./ai/GitHubRoast')),
  },
  {
    id: 'resume-roast',
    name: 'Resume Roast AI',
    description: 'Upload your resume PDF and let our AI roast your format, bullet points, and impact scores.',
    category: 'ai',
    status: 'active',
    icon: 'FileText',
    component: React.lazy(() => import('./ai/ResumeRoast')),
  },
  {
    id: 'interview-simulator',
    name: 'AI Interview Simulator',
    description: 'Practice real-time interactive technical, behavioral, and system design interviews with AI feedback.',
    category: 'ai',
    status: 'active',
    icon: 'MessageSquare',
    component: React.lazy(() => import('./ai/InterviewSimulator')),
  },
  {
    id: 'placement-predictor',
    name: 'Placement Probability Predictor',
    description: 'Predict your placement likelihood based on skills, GPA, projects, and interview stats using a Random Forest model.',
    category: 'ml',
    status: 'active',
    icon: 'GraduationCap',
    component: React.lazy(() => import('./ml/PlacementPredictor')),
  },
  {
    id: 'salary-predictor',
    name: 'Salary Predictor',
    description: 'Estimate your earning potential based on tech stack, location, experience, and role with multiple linear regression.',
    category: 'ml',
    status: 'active',
    icon: 'Coins',
    component: React.lazy(() => import('./ml/SalaryPredictor')),
  },
  {
    id: 'monte-carlo',
    name: 'Monte Carlo Simulator',
    description: 'Simulate random paths and approximate Pi, stock price walk, and coin toss statistics over thousands of iterations.',
    category: 'probability',
    status: 'active',
    icon: 'TrendingUp',
    component: React.lazy(() => import('./probability/MonteCarlo')),
  },
  {
    id: 'personality-test',
    name: 'Developer Personality Test',
    description: 'Discover your true developer archetype. Are you a 10x Rockstar, a StackOverflow copy-paster, or a vim purist?',
    category: 'fun',
    status: 'active',
    icon: 'Terminal',
    component: React.lazy(() => import('./fun/PersonalityTest')),
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, query with JSONPath, and compress your JSON data instantly.',
    category: 'utility',
    status: 'active',
    icon: 'Braces',
    component: React.lazy(() => import('./utility/JsonFormatter')),
  },

  // ==========================================
  // COMING SOON LABS (PLACEHOLDERS)
  // ==========================================
  // AI Lab
  {
    id: 'portfolio-roast',
    name: 'Portfolio Roast AI',
    description: 'Analyze your portfolio website and get roasting reviews on layout, responsiveness, and project showcase.',
    category: 'ai',
    status: 'coming-soon',
    icon: 'Monitor',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'linkedin-roast',
    name: 'LinkedIn Roast AI',
    description: 'Brutally honest feedback on your LinkedIn summary, work descriptions, and banner layout.',
    category: 'ai',
    status: 'coming-soon',
    icon: 'Linkedin',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'commit-generator',
    name: 'Commit Message Generator',
    description: 'Generate semantic Git commit messages from your diff files using smart fine-tuned LLM suggestions.',
    category: 'ai',
    status: 'coming-soon',
    icon: 'GitCommit',
    releaseDate: 'Q4 2026',
  },
  {
    id: 'readme-generator',
    name: 'README Generator',
    description: 'Generate professional, beautiful, and informative README markdown files for your projects in seconds.',
    category: 'ai',
    status: 'coming-soon',
    icon: 'FileCode',
    releaseDate: 'Q4 2026',
  },
  {
    id: 'project-generator',
    name: 'AI Project Generator',
    description: 'Bored of building Todo apps? Generate production-grade project specs tailored to your current tech stack.',
    category: 'ai',
    status: 'coming-soon',
    icon: 'Layers',
    releaseDate: 'Q4 2026',
  },
  {
    id: 'startup-name-generator',
    name: 'AI Startup Name Generator',
    description: 'Generate unique, techy, available startup names and domain checks based on your raw ideas.',
    category: 'ai',
    status: 'coming-soon',
    icon: 'Lightbulb',
    releaseDate: 'Q1 2027',
  },

  // ML Lab
  {
    id: 'resume-ats-scorer',
    name: 'ATS Score Predictor',
    description: 'Deep scan your resume for keyword matches against typical parser configurations and score job suitability.',
    category: 'ml',
    status: 'coming-soon',
    icon: 'ShieldCheck',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'burnout-predictor',
    name: 'Developer Burnout Predictor',
    description: 'Evaluate your work habits, meetings count, screen time, and sleep data to predict burnout warning thresholds.',
    category: 'ml',
    status: 'coming-soon',
    icon: 'Flame',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'learning-path-recommender',
    name: 'Learning Path Recommender',
    description: 'Analyze your target role and current skill level to generate a custom step-by-step developer learning roadmap.',
    category: 'ml',
    status: 'coming-soon',
    icon: 'Map',
    releaseDate: 'Q4 2026',
  },
  {
    id: 'skill-gap-analyzer',
    name: 'Skill Gap Analyzer',
    description: 'Compare your resume skills against thousands of active job descriptions to find critical missing tech stack gaps.',
    category: 'ml',
    status: 'coming-soon',
    icon: 'Compass',
    releaseDate: 'Q4 2026',
  },

  // Probability Lab
  {
    id: 'dice-simulator',
    name: 'Dice Simulator',
    description: 'Roll multiple dice with custom faces, simulate thousands of rolls to verify probability distributions, and plot histograms.',
    category: 'probability',
    status: 'coming-soon',
    icon: 'Dice5',
    releaseDate: 'Q4 2026',
  },
  {
    id: 'coin-toss',
    name: 'Coin Toss',
    description: 'Simulate coin flips over vast quantities to watch the Law of Large Numbers converge on 50% probability.',
    category: 'probability',
    status: 'coming-soon',
    icon: 'CircleDot',
    releaseDate: 'Q4 2026',
  },
  {
    id: 'birthday-paradox',
    name: 'Birthday Paradox',
    description: 'Simulate and visualize the counterintuitive probability of shared birthdays in groups of varying sizes.',
    category: 'probability',
    status: 'coming-soon',
    icon: 'Calendar',
    releaseDate: 'Q1 2027',
  },

  // Fun Lab
  {
    id: 'programming-lang-match',
    name: 'Which Language Are You?',
    description: 'Take a fun quiz to match your coding style and personality to a programming language.',
    category: 'fun',
    status: 'coming-soon',
    icon: 'Smile',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'programmer-excuse',
    name: 'Developer Excuse Generator',
    description: 'Need to explain why your code is broken in production? Generate a bulletproof, technical-sounding excuse instantly.',
    category: 'fun',
    status: 'coming-soon',
    icon: 'HeartCrack',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'rubber-duck',
    name: 'Rubber Duck Debugger',
    description: 'Explain your code bugs to an existential rubber duck and get surprisingly helpful (or deeply philosophical) feedback.',
    category: 'fun',
    status: 'coming-soon',
    icon: 'MessageCircle',
    releaseDate: 'Q4 2026',
  },

  // Game Lab
  {
    id: 'typing-speed-game',
    name: 'Typing Speed Game',
    description: 'Test your raw typing speed using actual programming syntax, keyword patterns, and bracket combinations.',
    category: 'game',
    status: 'coming-soon',
    icon: 'Keyboard',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'sorting-visualizer',
    name: 'Sorting Visualizer',
    description: 'Watch algorithms (Quick Sort, Merge Sort, Bubble Sort) organize arrays of data in real-time with smooth animations.',
    category: 'game',
    status: 'coming-soon',
    icon: 'BarChart',
    releaseDate: 'Q4 2026',
  },

  // Utility Lab
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Write, test, explain, and debug regular expressions with real-time highlighting and visual capture groups.',
    category: 'utility',
    status: 'coming-soon',
    icon: 'Regex',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode, inspect, and verify the signature details of JSON Web Tokens client-side without exposing your keys.',
    category: 'utility',
    status: 'coming-soon',
    icon: 'Key',
    releaseDate: 'Q3 2026',
  },
  {
    id: 'uuid-generator',
    name: 'UUID & Password Generator',
    description: 'Generate secure cryptographically strong random passwords, API keys, and UUID (v4/v7) values.',
    category: 'utility',
    status: 'coming-soon',
    icon: 'Shield',
    releaseDate: 'Q4 2026',
  },

  // Analytics Lab
  {
    id: 'github-wrapped',
    name: 'GitHub Wrapped',
    description: 'A Spotify Wrapped-style yearly interactive summary showing your pull requests, commit hours, and languages.',
    category: 'analytics',
    status: 'coming-soon',
    icon: 'GitFork',
    releaseDate: 'Dec 2026',
  },
];
