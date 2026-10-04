export interface GuideSection {
  title: string;
  description: string;
  items: string[];
}

export interface ProjectTask {
  title: string;
  skill: string;
  milestone: string;
}

export interface ProjectMilestone {
  title: string;
  deadline: string;
  outcome: string;
}

export interface ProjectArchitecture {
  label: string;
  description: string;
}

export interface GitHubSource {
  repo: string;
  url: string;
  author: string;
  language: string;
  license: string;
  stars: number;
  forks: number;
}

export interface Project {
  slug: string;
  source: GitHubSource;
  interests: string[];
  category: string;
  title: string;
  description: string;
  level: string;
  time: string;
  color: string;
  tilt: string;
  brief: string;
  deadline: string;
  techStack: string[];
  setup: string[];
  githubSetup: string[];
  architecture: ProjectArchitecture[];
  timeline: string[];
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  guide: GuideSection[];
}

// Beginner and intermediate projects sourced from public GitHub repositories.
// Repo stats were captured from the GitHub API on 2026-10-04.
const projects: Project[] = [
  {
    slug: "vanilla-js-calculator",
    source: {
      repo: "WebDevSimplified/Vanilla-JavaScript-Calculator",
      url: "https://github.com/WebDevSimplified/Vanilla-JavaScript-Calculator",
      author: "Web Dev Simplified",
      language: "JavaScript",
      license: "No license listed",
      stars: 534,
      forks: 556,
    },
    interests: ["software engineering"],
    category: "SOFTWARE / YOUR FIRST BUILD",
    title: "JavaScript calculator",
    description: "Rebuild Web Dev Simplified's vanilla JavaScript calculator and learn how a class keeps interface, state, and logic in sync.",
    level: "Beginner",
    time: "1 week",
    color: "bg-[#f4f7e9]",
    tilt: "-rotate-2",
    brief: "Study a small, popular repo of three files (index.html, styles.css, script.js), then rebuild it yourself. A single Calculator class owns the current and previous operands, and the DOM only renders what the class holds.",
    deadline: "7 days from your start date",
    techStack: ["HTML", "CSS Grid", "JavaScript (ES6 classes)"],
    setup: ["Clone the repository or download it as a zip", "Open index.html in a browser; there is no build step", "Install the Live Server extension for auto-reload", "Read script.js before changing anything"],
    githubSetup: ["Create your own repository named js-calculator", "Credit the original repo in your README", "Commit the HTML layout before adding logic", "Open an issue for each feature you add beyond the original"],
    architecture: [
      { label: "Layout", description: "index.html uses data-number and data-operation attributes on buttons." },
      { label: "Calculator class", description: "Holds currentOperand, previousOperand, and the selected operation." },
      { label: "Rendering", description: "updateDisplay() formats numbers with toLocaleString and writes them to the screen." },
    ],
    timeline: ["Day 1: read the repo and sketch the grid layout", "Days 2–3: HTML and CSS Grid", "Days 4–5: Calculator class and button wiring", "Days 6–7: edge cases, keyboard support, and README"],
    milestones: [
      { title: "Layout matches", deadline: "Day 3", outcome: "The button grid and display render on desktop and mobile." },
      { title: "Math works", deadline: "Day 5", outcome: "All four operations, delete, and clear behave correctly." },
      { title: "Made it yours", deadline: "Day 7", outcome: "You added one feature the original does not have." },
    ],
    tasks: [
      { title: "Build the button grid with CSS Grid", skill: "CSS layout", milestone: "Layout matches" },
      { title: "Tag buttons with data attributes", skill: "Semantic HTML", milestone: "Layout matches" },
      { title: "Write the Calculator class and its state", skill: "Object-oriented JavaScript", milestone: "Math works" },
      { title: "Implement compute() for + − × ÷", skill: "Problem solving", milestone: "Math works" },
      { title: "Format large numbers with toLocaleString", skill: "Number formatting", milestone: "Math works" },
      { title: "Add keyboard input and divide-by-zero handling", skill: "Edge-case testing", milestone: "Made it yours" },
    ],
    guide: [
      {
        title: "Features to build",
        description: "These are the features in the original repo.",
        items: [
          "Number buttons for 0–9 and a decimal point",
          "Addition, subtraction, multiplication, and division",
          "AC (all clear) and DEL (delete last digit) buttons",
          "A display showing the previous operand with its operator above the current one",
          "Comma-formatted large numbers",
        ],
      },
      {
        title: "Core functions",
        description: "The Calculator class in script.js is built from these methods.",
        items: [
          "clear(): reset both operands and the operation",
          "delete(): remove the last character of the current operand",
          "appendNumber(number): add a digit, allowing only one decimal point",
          "chooseOperation(operation): store the operator, computing first if one is pending",
          "compute(): apply the operation to both operands",
          "getDisplayNumber(number) and updateDisplay(): format and render",
        ],
      },
      {
        title: "Build it in steps",
        description: "Read first, then rebuild without copying line by line.",
        items: [
          "Read index.html and note how the data attributes are used",
          "Recreate the grid in styles.css",
          "Write the Calculator class one method at a time",
          "Attach click listeners to each button group",
          "Test chained operations such as 2 + 3 × 4",
        ],
      },
      {
        title: "Go further",
        description: "The original leaves room for improvements.",
        items: [
          "Show a friendly message instead of Infinity when dividing by zero",
          "Add keyboard support",
          "Add a percent or ± button",
          "Write unit tests for compute()",
        ],
      },
    ],
  },
  {
    slug: "titanic-survival",
    source: {
      repo: "agconti/kaggle-titanic",
      url: "https://github.com/agconti/kaggle-titanic",
      author: "Andrew Conti",
      language: "Jupyter Notebook",
      license: "Apache-2.0",
      stars: 961,
      forks: 675,
    },
    interests: ["data science"],
    category: "DATA / FOLLOW YOUR CURIOSITY",
    title: "Titanic survival",
    description: "Work through a classic Kaggle tutorial notebook: clean passenger data, chart who survived, and train your first models.",
    level: "Beginner",
    time: "2 weeks",
    color: "bg-[#f3f6ef]",
    tilt: "rotate-1",
    brief: "Use Kaggle's Titanic dataset to ask which passengers were most likely to survive. The Titanic.ipynb notebook walks through loading data with pandas, handling missing values, visualizing survival by class and gender, and comparing logistic regression, SVM, and random forest models.",
    deadline: "14 days from your start date",
    techStack: ["Python", "Jupyter", "pandas", "Matplotlib", "scikit-learn", "statsmodels"],
    setup: ["Install Python 3 and create a virtual environment", "Install current versions of jupyter, pandas, matplotlib, scikit-learn, and statsmodels (the repo's requirements.txt pins 2014 versions that will not install)", "Clone the repo; train.csv and test.csv are in the data folder", "Run jupyter notebook and open Titanic.ipynb"],
    githubSetup: ["Create your own repository named titanic-analysis", "Write your own notebook rather than editing the original", "Commit after each section: cleaning, charts, models", "Put your Kaggle score and key charts in the README"],
    architecture: [
      { label: "Data", description: "Kaggle's train.csv and test.csv, loaded into pandas DataFrames." },
      { label: "Cleaning", description: "Drop or fill missing Age, Cabin, and Embarked values." },
      { label: "Analysis", description: "Survival charts broken down by class, gender, and age." },
      { label: "Models", description: "Logistic regression, SVM, and random forest predictions on the test set." },
    ],
    timeline: ["Days 1–3: load the data and handle missing values", "Days 4–7: exploratory charts", "Days 8–11: train and compare models", "Days 12–14: submit to Kaggle and write up findings"],
    milestones: [
      { title: "Clean data", deadline: "Day 3", outcome: "No missing values remain in the columns you model with." },
      { title: "Clear story", deadline: "Day 7", outcome: "Charts show how class, gender, and age affected survival." },
      { title: "First submission", deadline: "Day 14", outcome: "A model's predictions are scored on Kaggle." },
    ],
    tasks: [
      { title: "Load train.csv with pandas and inspect it", skill: "Data loading", milestone: "Clean data" },
      { title: "Decide how to handle missing Age and Cabin values", skill: "Data cleaning", milestone: "Clean data" },
      { title: "Plot survival by class and by gender", skill: "Data visualization", milestone: "Clear story" },
      { title: "Train a logistic regression model", skill: "Supervised learning", milestone: "First submission" },
      { title: "Compare against SVM and random forest", skill: "Model evaluation", milestone: "First submission" },
      { title: "Export predictions and submit to Kaggle", skill: "Communicating results", milestone: "First submission" },
    ],
    guide: [
      {
        title: "What you will learn",
        description: "These are the skills the notebook demonstrates.",
        items: [
          "Importing data with pandas",
          "Cleaning missing values",
          "Exploring data with Matplotlib charts",
          "Logistic regression with statsmodels",
          "Support vector machines with three kernels",
          "A basic random forest",
        ],
      },
      {
        title: "Questions to answer",
        description: "Let these guide your analysis.",
        items: [
          "Did women and children survive at higher rates?",
          "How much did ticket class matter?",
          "Which single feature predicts survival best?",
          "Which model scored highest, and why might that be?",
        ],
      },
      {
        title: "Build it in steps",
        description: "Reading the notebook is not the same as doing it, so type each step yourself.",
        items: [
          "Read the competition overview on Kaggle",
          "Reproduce the cleaning steps in a fresh notebook",
          "Recreate each chart and write one sentence about what it shows",
          "Fit each model and record its accuracy",
          "Submit your best predictions",
        ],
      },
    ],
  },
  {
    slug: "caesar-cipher-cracker",
    source: {
      repo: "CarterPerez-dev/Cybersecurity-Projects",
      url: "https://github.com/CarterPerez-dev/Cybersecurity-Projects/tree/main/PROJECTS/beginner/caesar-cipher",
      author: "Carter Perez",
      language: "Python",
      license: "AGPL-3.0",
      stars: 7768,
      forks: 1135,
    },
    interests: ["cybersecurity"],
    category: "CYBER / TRY SOMETHING NEW",
    title: "Caesar cracker",
    description: "Build a command-line tool that encrypts and decrypts Caesar ciphers and cracks them with frequency analysis.",
    level: "Beginner",
    time: "1 week",
    color: "bg-[#fffaf0]",
    tilt: "rotate-2",
    brief: "From the beginner tier of a popular cybersecurity projects repository. You build a CLI that encrypts and decrypts text, then breaks unknown ciphertext by trying all 26 shifts and ranking them with a chi-squared test of how English-like each result is.",
    deadline: "7 days from your start date",
    techStack: ["Python 3.12+", "Typer", "Rich", "pytest"],
    setup: ["Install Python 3.12 or newer", "Clone the repo and cd into PROJECTS/beginner/caesar-cipher", "Run pip install -e . to install the CLI", "Try caesar-cipher crack \"KHOOR ZRUOG\""],
    githubSetup: ["Create your own repository named caesar-cipher", "Keep the src/ and tests/ layout from the original", "Credit the original project and its AGPL-3.0 license in your README", "Add a test before each new feature"],
    architecture: [
      { label: "cipher.py", description: "Shifts letters with modular arithmetic for encryption and decryption." },
      { label: "analyzer.py", description: "Counts letter frequencies and scores candidates with chi-squared." },
      { label: "main.py", description: "Typer CLI with encrypt, decrypt, and crack commands, plus Rich tables for output." },
    ],
    timeline: ["Days 1–2: read the learn/ modules on concepts", "Days 3–4: encrypt and decrypt with tests", "Days 5–6: brute force and frequency ranking", "Day 7: CLI polish and one extension challenge"],
    milestones: [
      { title: "Round trip", deadline: "Day 4", outcome: "Decrypting encrypted text returns the original message." },
      { title: "Cracked", deadline: "Day 6", outcome: "crack ranks the correct plaintext first for English text." },
      { title: "Extended", deadline: "Day 7", outcome: "One challenge from 04-CHALLENGES.md is complete." },
    ],
    tasks: [
      { title: "Implement the shift with (index + key) % 26", skill: "Modular arithmetic", milestone: "Round trip" },
      { title: "Preserve case, spaces, and punctuation", skill: "String handling", milestone: "Round trip" },
      { title: "Write pytest tests for encrypt and decrypt", skill: "Automated testing", milestone: "Round trip" },
      { title: "Brute-force all 26 shifts", skill: "Brute-force attacks", milestone: "Cracked" },
      { title: "Score candidates with chi-squared", skill: "Frequency analysis", milestone: "Cracked" },
      { title: "Add ROT13 mode or a Vigenère cipher", skill: "Cryptography", milestone: "Extended" },
    ],
    guide: [
      {
        title: "What it does",
        description: "These are the three commands in the original project.",
        items: [
          "caesar-cipher encrypt \"HELLO WORLD\" --key 3",
          "caesar-cipher decrypt \"KHOOR ZRUOG\" --key 3",
          "caesar-cipher crack \"KHOOR ZRUOG\" tries all 26 shifts and ranks them",
        ],
      },
      {
        title: "Why it matters",
        description: "Breaking a weak cipher teaches skills that carry over to real security work.",
        items: [
          "Small key spaces can always be brute-forced, like short PINs and weak passwords",
          "Letter frequencies survive simple substitution, which gives the plaintext away",
          "ROT13 is still used today, and it is a Caesar cipher with key 13",
          "Frequency analysis is a staple of CTF challenges",
        ],
      },
      {
        title: "Learn modules",
        description: "The project folder includes step-by-step lessons in learn/.",
        items: [
          "00 – Overview and prerequisites",
          "01 – Security concepts and real-world breaches",
          "02 – Architecture and data flow",
          "03 – Implementation walkthrough",
          "04 – Extension challenges",
        ],
      },
    ],
  },
  {
    slug: "personal-portfolio",
    source: {
      repo: "soumyajit4419/Portfolio",
      url: "https://github.com/soumyajit4419/Portfolio",
      author: "Soumyajit Behera",
      language: "JavaScript",
      license: "No license listed (credit requested)",
      stars: 6493,
      forks: 3450,
    },
    interests: ["software engineering", "product design"],
    category: "WEB / SHOW YOUR WORK",
    title: "Personal portfolio",
    description: "Build a multi-page React portfolio with your projects, skills, GitHub activity, and résumé, using a popular open-source site as your reference.",
    level: "Intermediate",
    time: "2 weeks",
    color: "bg-[#fffdf5]",
    tilt: "-rotate-1",
    brief: "Study a widely forked React portfolio with Home, About, Projects, and Resume pages, then build your own version. The original is small (about 50 source files), so you can read all of it, but it still covers routing, reusable components, third-party widgets, and deployment.",
    deadline: "14 days from your start date",
    techStack: ["React", "React Router", "React-Bootstrap", "CSS", "Vercel"],
    setup: ["Install Node.js LTS and Git", "Clone the repository and run npm install", "Run npm start and open localhost:3000", "Read src/components/ folder by folder before changing anything"],
    githubSetup: ["Create your own repository named portfolio", "Link back to soumyajit4419/Portfolio in your README, as the author asks", "Replace every piece of their content (text, images, résumé) with your own", "Deploy to Vercel and put the live link in your repo description"],
    architecture: [
      { label: "Routing", description: "App.js maps /, /about, /project, and /resume to page components with React Router." },
      { label: "Pages", description: "Home, About, Projects, and Resume folders, each built from smaller components." },
      { label: "Reusable pieces", description: "ProjectCards for each project, plus a shared Navbar, Footer, and particle background." },
      { label: "Widgets", description: "A GitHub contribution calendar, a typewriter headline, and an embedded PDF résumé." },
    ],
    timeline: ["Days 1–2: read the repo and plan your own pages", "Days 3–6: layout, navbar, and Home page", "Days 7–10: About, Projects, and Resume pages", "Days 11–14: responsive polish, deploy, and share"],
    milestones: [
      { title: "Skeleton live", deadline: "Day 4", outcome: "All four routes render with a working navbar." },
      { title: "Your story", deadline: "Day 10", outcome: "Your real projects, skills, and résumé replace the placeholders." },
      { title: "Shipped", deadline: "Day 14", outcome: "The site is deployed, responsive, and linked from your GitHub profile." },
    ],
    tasks: [
      { title: "Set up routes for Home, About, Projects, and Resume", skill: "Client-side routing", milestone: "Skeleton live" },
      { title: "Build a responsive navbar that collapses on mobile", skill: "Responsive layout", milestone: "Skeleton live" },
      { title: "Create a reusable ProjectCard component", skill: "Component design", milestone: "Your story" },
      { title: "Add your tech stack and GitHub contribution calendar", skill: "Third-party components", milestone: "Your story" },
      { title: "Embed your résumé with a download button", skill: "Working with files", milestone: "Your story" },
      { title: "Deploy to Vercel and test on a phone", skill: "Deployment", milestone: "Shipped" },
    ],
    guide: [
      {
        title: "Features to build",
        description: "These are the pages and features in the original site.",
        items: [
          "Home page with a typewriter-style headline and short intro",
          "About page with your background, tech stack, and tools",
          "GitHub contribution calendar",
          "Projects page with cards linking to code and live demos",
          "Resume page with an embedded PDF and a download button",
          "Multi-page layout that works on phones",
        ],
      },
      {
        title: "Make it yours",
        description: "Copying someone else's portfolio defeats the purpose.",
        items: [
          "Write your own intro instead of editing theirs",
          "Pick your own colors and fonts",
          "Show two or three projects you actually built",
          "Write one line per project saying what you learned",
        ],
      },
      {
        title: "Build it in steps",
        description: "Get a plain version deployed early, then improve it.",
        items: [
          "Create a React app and add React Router",
          "Build the navbar and an empty page for each route",
          "Fill in one page at a time, starting with Projects",
          "Deploy to Vercel as soon as the first page works",
          "Add the extras last: particles, typewriter, calendar",
        ],
      },
      {
        title: "Done when...",
        description: "Check these before sharing the link.",
        items: [
          "Every link and button goes somewhere real",
          "The site is readable on a 375px-wide phone screen",
          "Your résumé downloads correctly",
          "None of the original author's content is left",
        ],
      },
    ],
  },
  {
    slug: "ai-study-buddy",
    source: {
      repo: "kaorii-ako/Shiori-v1",
      url: "https://github.com/kaorii-ako/Shiori-v1",
      author: "Tawin Tangsukson",
      language: "JavaScript",
      license: "MIT",
      stars: 44,
      forks: 3,
    },
    interests: ["software engineering"],
    category: "AI / STUDY SMARTER",
    title: "AI study buddy",
    description: "Build an AI study companion that logs your study sessions and habits, then turns your notes and syllabus into quizzes, flashcards, and an exam-prep plan.",
    level: "Intermediate",
    time: "3 weeks",
    color: "bg-[#eef4fb]",
    tilt: "rotate-1",
    brief: "Shiori is an open-source study app built with React, Supabase, and Gemini. You log focus sessions, habits, assignments, and grades. The AI then generates quizzes and flashcards from notes you paste in, and builds a day-by-day study plan from your syllabus and exam dates. Use it as a reference for your own leaner version aimed at one exam or certification.",
    deadline: "21 days from your start date",
    techStack: ["React", "Vite", "Zustand", "Supabase", "Gemini API", "Vercel"],
    setup: ["Install Node.js LTS", "Clone the repo, copy .env.example to .env, and run npm install", "Create a free Supabase project and run supabase/schema.sql", "Get a free Gemini API key from Google AI Studio", "Ignore the Stripe and Pro files; they are not needed to learn from the app"],
    githubSetup: ["Create your own repository named study-buddy", "Add .env to .gitignore before your first commit", "Credit Shiori and keep its MIT license notice if you copy code", "Open one issue per feature: logging, quiz, flashcards, study plan"],
    architecture: [
      { label: "Frontend", description: "React pages (Quiz, Flashcards, FocusMode, Habits, StudyPlans, Analytics) with Zustand stores for state." },
      { label: "Data", description: "Supabase Postgres tables for courses, assignments, notes, flashcards, habits, events, and study plans." },
      { label: "Study log", description: "Focus sessions and daily habit completions feed streaks and a study-time chart." },
      { label: "AI layer", description: "Gemini prompts turn pasted notes into JSON quiz questions and flashcards, and assignments into a 7-day plan." },
    ],
    timeline: ["Days 1–3: run Shiori locally and map its pages to your feature list", "Days 4–8: auth, data model, and the study log", "Days 9–15: AI quiz and flashcards from notes", "Days 16–21: exam-prep plan, analytics, and deploy"],
    milestones: [
      { title: "Logging works", deadline: "Day 8", outcome: "You can log a focus session and see your streak and total study time." },
      { title: "AI quizzes you", deadline: "Day 15", outcome: "Pasting notes produces a quiz and flashcards you can answer." },
      { title: "Exam ready", deadline: "Day 21", outcome: "Entering an exam date and topics produces a day-by-day prep plan." },
    ],
    tasks: [
      { title: "Design tables for sessions, topics, and exams", skill: "Data modeling", milestone: "Logging works" },
      { title: "Build a focus timer that saves each session", skill: "State and persistence", milestone: "Logging works" },
      { title: "Show streaks and study time per topic", skill: "Data visualization", milestone: "Logging works" },
      { title: "Prompt Gemini to return quiz questions as JSON", skill: "Prompt engineering", milestone: "AI quizzes you" },
      { title: "Validate the AI response and handle failures", skill: "Defensive programming", milestone: "AI quizzes you" },
      { title: "Generate a study plan from an exam date and your weakest topics", skill: "Product thinking", milestone: "Exam ready" },
      { title: "Keep the API key on the server, not in the browser", skill: "API security", milestone: "Exam ready" },
    ],
    guide: [
      {
        title: "Features to build",
        description: "These come from Shiori; trim them to fit your exam.",
        items: [
          "Focus (Pomodoro) timer that logs each study session",
          "Habit tracker with daily check-ins and streaks",
          "AI quiz generator from pasted notes",
          "AI flashcards with spaced repetition",
          "Syllabus import that pulls out exams and due dates",
          "Day-by-day study plan built around upcoming deadlines",
          "Analytics page with a study-time chart",
        ],
      },
      {
        title: "Make it exam-specific",
        description: "Shiori is built for general coursework. Point yours at one exam or certification.",
        items: [
          "Ask the user for the exam name, date, and official topic list",
          "Log study time against each exam topic",
          "Have the quiz favor the topics with the lowest scores",
          "Show a readiness score per topic before exam day",
        ],
      },
      {
        title: "Build it in steps",
        description: "Build the logging first so the AI has data to work with.",
        items: [
          "Run Shiori locally and try every page",
          "Set up Supabase auth and your tables",
          "Build the session log and streaks",
          "Add the AI quiz, then flashcards",
          "Add the exam-prep plan last",
        ],
      },
      {
        title: "Watch out for",
        description: "Common problems with AI study apps.",
        items: [
          "The AI can return invalid JSON, so parse it safely and retry",
          "AI answers can be wrong, so let users flag bad questions",
          "Free API keys have rate limits",
          "Never commit your .env file",
        ],
      },
    ],
  },
];

export function getProjects() {
  return projects;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProject(): Project {
  return projects[0];
}
