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

export interface Project {
  slug: string;
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

const projectDetails: Record<string, Omit<Project, "slug" | "interests" | "category" | "title" | "description" | "level" | "time" | "color" | "tilt" | "guide">> = {
  calculator: {
    brief: "Create a reliable calculator that turns button presses into math results. The project teaches how an interface, state, and business logic work together.",
    deadline: "7 days from your start date",
    techStack: ["HTML", "CSS", "JavaScript", "Vitest"],
    setup: ["Install Node.js LTS", "Create an app with Vite", "Add a test runner such as Vitest", "Run the development server locally"],
    githubSetup: ["Create a repository named calculator", "Add a README with your feature checklist", "Commit the first layout before adding logic", "Open an issue for every bug you find"],
    architecture: [
      { label: "UI", description: "Display, operation label, and reusable calculator buttons." },
      { label: "State", description: "Current value, previous value, selected operation, and error state." },
      { label: "Logic", description: "Pure functions calculate results without depending on the DOM." },
    ],
    timeline: ["Day 1: wireframe and HTML", "Days 2–3: styling and input state", "Days 4–5: operations and edge cases", "Days 6–7: tests, keyboard support, and polish"],
    milestones: [
      { title: "Working display", deadline: "Day 2", outcome: "Users can enter numbers and decimals." },
      { title: "First calculation", deadline: "Day 4", outcome: "The four basic operations return correct results." },
      { title: "Ready to share", deadline: "Day 7", outcome: "The app is responsive, tested, and documented." },
    ],
    tasks: [
      { title: "Sketch the display and button layout", skill: "Interface design", milestone: "Working display" },
      { title: "Build reusable number and operation buttons", skill: "Component thinking", milestone: "Working display" },
      { title: "Add state for current and previous values", skill: "State management", milestone: "Working display" },
      { title: "Implement the operation functions", skill: "Problem solving", milestone: "First calculation" },
      { title: "Handle divide-by-zero and decimal input", skill: "Edge-case testing", milestone: "First calculation" },
      { title: "Add keyboard support and responsive styling", skill: "Accessibility", milestone: "Ready to share" },
    ],
  },
  "spending-dashboard": {
    brief: "Turn a month of spending into a clear dashboard. You will practice transforming raw records into totals, categories, and visual insights.",
    deadline: "7 days from your start date",
    techStack: ["React", "TypeScript", "CSS", "Recharts"],
    setup: ["Create a React app with Vite", "Install TypeScript and Recharts", "Add a sample expenses JSON file", "Create a .gitignore before your first commit"],
    githubSetup: ["Create a repository named spending-dashboard", "Add sample data instead of private financial data", "Use issues for chart and filter tasks", "Add screenshots to the README"],
    architecture: [
      { label: "Data layer", description: "Expense records and functions that group and total them." },
      { label: "Dashboard state", description: "Selected month, category filter, and calculated summaries." },
      { label: "Views", description: "Summary cards, transaction table, and category chart." },
    ],
    timeline: ["Days 1–2: data model and entry form", "Days 3–4: totals and transaction list", "Days 5–6: charts and filters", "Day 7: responsive polish and documentation"],
    milestones: [
      { title: "Data is visible", deadline: "Day 2", outcome: "Expenses can be added and displayed." },
      { title: "Insights work", deadline: "Day 5", outcome: "Totals and categories update from the data." },
      { title: "Dashboard complete", deadline: "Day 7", outcome: "Charts, filters, and documentation are finished." },
    ],
    tasks: [
      { title: "Design the expense data model", skill: "Data modeling", milestone: "Data is visible" },
      { title: "Build the add-expense form", skill: "Form handling", milestone: "Data is visible" },
      { title: "Calculate totals by category", skill: "Data transformation", milestone: "Insights work" },
      { title: "Render summary cards and a table", skill: "Information design", milestone: "Insights work" },
      { title: "Add a chart and month filter", skill: "Data visualization", milestone: "Dashboard complete" },
    ],
  },
  "password-checker": {
    brief: "Build a local password-strength checker that gives useful feedback without saving or sending sensitive input.",
    deadline: "14 days from your start date",
    techStack: ["React", "TypeScript", "CSS Modules", "Vitest"],
    setup: ["Create a React app with TypeScript", "Use local component state only", "Add Vitest for validation tests", "Do not add analytics or network requests"],
    githubSetup: ["Create a private repository first", "Add a security-focused README", "Never commit real passwords or screenshots", "Use pull requests for validation changes"],
    architecture: [
      { label: "Input", description: "A password field with visibility and accessible labels." },
      { label: "Rules", description: "Small pure validators for length, numbers, symbols, and common patterns." },
      { label: "Feedback", description: "A score and suggestions that never expose the password." },
    ],
    timeline: ["Days 1–3: input and requirements", "Days 4–7: validation rules", "Days 8–10: score and feedback", "Days 11–14: tests, accessibility, and privacy review"],
    milestones: [
      { title: "Private input", deadline: "Day 3", outcome: "The password is handled only in local state." },
      { title: "Useful score", deadline: "Day 10", outcome: "Each rule gives clear feedback." },
      { title: "Safe release", deadline: "Day 14", outcome: "Tests and privacy checks pass." },
    ],
    tasks: [
      { title: "Build the password input and requirements list", skill: "Accessible forms", milestone: "Private input" },
      { title: "Write one validator per requirement", skill: "Testable functions", milestone: "Useful score" },
      { title: "Combine rules into a strength score", skill: "Algorithm design", milestone: "Useful score" },
      { title: "Add tests for weak and strong examples", skill: "Automated testing", milestone: "Safe release" },
      { title: "Review privacy and error states", skill: "Security mindset", milestone: "Safe release" },
    ],
  },
  "study-planner": {
    brief: "Create a planner that turns a deadline into manageable tasks, then makes progress visible without adding stress.",
    deadline: "7 days from your start date",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
    setup: ["Create a React TypeScript app", "Add Tailwind CSS", "Choose a sample school schedule", "Use browser storage for persistence"],
    githubSetup: ["Create a repository named study-planner", "Add a project board with To do, Doing, and Done", "Commit after each milestone", "Document the data model"],
    architecture: [
      { label: "Task model", description: "Task title, subject, due date, and completion status." },
      { label: "Planner state", description: "Task list, active subject, and progress calculations." },
      { label: "Views", description: "Task form, grouped list, and progress summary." },
    ],
    timeline: ["Day 1: data model and wireframe", "Days 2–3: task creation and list", "Days 4–5: filtering and persistence", "Days 6–7: progress view and polish"],
    milestones: [
      { title: "Plan exists", deadline: "Day 3", outcome: "Tasks can be created and completed." },
      { title: "Plan persists", deadline: "Day 5", outcome: "Tasks remain after a refresh." },
      { title: "Progress is clear", deadline: "Day 7", outcome: "Subjects show useful progress summaries." },
    ],
    tasks: [
      { title: "Design the task data model", skill: "Data structures", milestone: "Plan exists" },
      { title: "Build task creation and completion", skill: "State updates", milestone: "Plan exists" },
      { title: "Add subject filters and sorting", skill: "Collection methods", milestone: "Plan persists" },
      { title: "Save tasks to local storage", skill: "Browser APIs", milestone: "Plan persists" },
      { title: "Calculate and display progress", skill: "Product thinking", milestone: "Progress is clear" },
    ],
  },
  "weather-api": {
    brief: "Build a weather search experience that turns an external API response into a friendly, resilient interface.",
    deadline: "14 days from your start date",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Weather API"],
    setup: ["Create a Next.js app with TypeScript", "Choose an API and read its rate limits", "Store the API key in .env.local", "Create loading, empty, and error states"],
    githubSetup: ["Create a repository named weather-dashboard", "Add .env.local to .gitignore", "Document environment variables without exposing secrets", "Track API and UI tasks as issues"],
    architecture: [
      { label: "Search", description: "Validates a city query and starts a request." },
      { label: "API layer", description: "Fetches and normalizes weather data in one module." },
      { label: "Presentation", description: "Renders current conditions, forecast, loading, and errors." },
    ],
    timeline: ["Days 1–3: search form and API connection", "Days 4–7: current conditions", "Days 8–10: forecast and icons", "Days 11–14: caching, errors, and responsive polish"],
    milestones: [
      { title: "First response", deadline: "Day 3", outcome: "A valid city returns weather data." },
      { title: "Useful forecast", deadline: "Day 10", outcome: "Current and future conditions are readable." },
      { title: "Resilient app", deadline: "Day 14", outcome: "Errors, secrets, and mobile layout are handled." },
    ],
    tasks: [
      { title: "Build and validate the city search", skill: "Input validation", milestone: "First response" },
      { title: "Create a reusable API client", skill: "Async programming", milestone: "First response" },
      { title: "Render current conditions", skill: "API data mapping", milestone: "Useful forecast" },
      { title: "Add the five-day forecast", skill: "Component composition", milestone: "Useful forecast" },
      { title: "Handle errors, secrets, and loading", skill: "Production readiness", milestone: "Resilient app" },
    ],
  },
};

const projects: Project[] = [
  {
    slug: "calculator",
    interests: ["software engineering"],
    category: "WEB / YOUR FIRST BUILD",
    title: "Calculator",
    description: "Build a calculator that handles everyday math and teaches you how interface, state, and logic work together.",
    level: "Beginner",
    time: "1 week",
    color: "bg-[#f4f7e9]",
    tilt: "-rotate-2",
    ...projectDetails.calculator,
    guide: [
      {
        title: "Features to build",
        description: "Start with a small working calculator, then add polish as you learn.",
        items: [
          "Number buttons for 0–9 and a decimal point",
          "Addition, subtraction, multiplication, and division",
          "Equals button that displays the result",
          "Clear button that resets the current calculation",
          "Backspace button for correcting the last digit",
          "Visible current number and previous operation",
        ],
      },
      {
        title: "Core functions",
        description: "Keep each responsibility in its own function so the calculator is easy to reason about.",
        items: [
          "inputDigit(digit): append a digit to the current display",
          "chooseOperation(operation): save the first number and operation",
          "computeResult(): calculate the answer from both numbers",
          "clearCalculator(): return every value to its initial state",
          "deleteLastDigit(): remove the final character from the display",
          "formatResult(value): keep long decimal results readable",
        ],
      },
      {
        title: "Build it in steps",
        description: "Finish one small piece before moving to the next.",
        items: [
          "Sketch the display and button layout",
          "Render buttons from a reusable button component",
          "Store the display value and selected operation in state",
          "Wire number and decimal buttons to the display",
          "Add operation and equals behavior",
          "Handle divide-by-zero and repeated equals safely",
          "Add keyboard support and responsive styling",
        ],
      },
      {
        title: "Done when...",
        description: "Use these checks before you call the project finished.",
        items: [
          "2 + 3 displays 5 and 10 / 2 displays 5",
          "A user can chain operations without refreshing",
          "Clear resets the display every time",
          "The layout works on a phone and a desktop",
          "The interface shows a friendly error instead of Infinity or NaN",
        ],
      },
    ],
  },
  {
    slug: "spending-dashboard",
    interests: ["data science"],
    category: "DATA / FOLLOW YOUR CURIOSITY",
    title: "Spending dashboard",
    description: "Turn a month of personal spending into a dashboard with categories, totals, and useful insights.",
    level: "Beginner",
    time: "1 week",
    color: "bg-[#f3f6ef]",
    tilt: "rotate-1",
    ...projectDetails["spending-dashboard"],
    guide: [
      { title: "Features to build", description: "Make the data easy to enter and understand.", items: ["Add expenses with a name, amount, and category", "Show total spending and category totals", "Display a bar chart or pie chart", "Filter by category or month"] },
      { title: "Core functions", description: "Keep data processing separate from the interface.", items: ["addExpense(expense)", "calculateTotals(expenses)", "groupByCategory(expenses)", "filterExpenses(expenses, filter)", "formatCurrency(amount)"] },
      { title: "Build it in steps", description: "Start with accurate totals before adding visualizations.", items: ["Create an expense data model", "Render a form and expense list", "Calculate totals from the list", "Add a chart and filters"] },
    ],
  },
  {
    slug: "password-checker",
    interests: ["cybersecurity"],
    category: "CYBER / TRY SOMETHING NEW",
    title: "Password checker",
    description: "Build a local password-strength checker that teaches validation, privacy, and safe security habits.",
    level: "Intermediate",
    time: "2 weeks",
    color: "bg-[#fffaf0]",
    tilt: "rotate-2",
    ...projectDetails["password-checker"],
    guide: [
      { title: "Features to build", description: "Give useful feedback without storing the password.", items: ["Score length and character variety", "Show which requirements are missing", "Add a visibility toggle", "Never send or save the password"] },
      { title: "Core functions", description: "Make each rule testable on its own.", items: ["checkLength(password)", "hasNumber(password)", "hasSymbol(password)", "calculateStrength(password)", "getSuggestions(password)"] },
      { title: "Build it in steps", description: "Treat every password as private input.", items: ["Build the input and requirements list", "Write one validator per rule", "Combine results into a strength score", "Add accessible feedback and tests"] },
    ],
  },
  {
    slug: "study-planner",
    interests: ["software engineering", "product design"],
    category: "PRODUCT / MAKE LIFE EASIER",
    title: "Study planner",
    description: "Create a focused planner that turns a deadline into small tasks and tracks progress.",
    level: "Beginner",
    time: "1 week",
    color: "bg-[#fffdf5]",
    tilt: "-rotate-1",
    ...projectDetails["study-planner"],
    guide: [
      { title: "Features to build", description: "Make planning feel lighter than the work itself.", items: ["Create tasks with a due date", "Group tasks by subject", "Mark tasks complete", "Show progress for each subject"] },
      { title: "Core functions", description: "Use predictable state updates.", items: ["addTask(task)", "toggleTask(taskId)", "getTasksForSubject(subject)", "calculateProgress(tasks)", "sortByDueDate(tasks)"] },
      { title: "Build it in steps", description: "Build the list first, then add progress.", items: ["Design the task model", "Create task and subject components", "Add completion state", "Calculate and display progress"] },
    ],
  },
  {
    slug: "weather-api",
    interests: ["software engineering", "data science"],
    category: "APIS / CONNECT TO THE WORLD",
    title: "Weather dashboard",
    description: "Build a weather search experience that consumes an API and turns JSON into a friendly interface.",
    level: "Intermediate",
    time: "2 weeks",
    color: "bg-[#eef4fb]",
    tilt: "rotate-1",
    ...projectDetails["weather-api"],
    guide: [
      { title: "Features to build", description: "Practice the full request, loading, and error cycle.", items: ["Search for a city", "Show current temperature and conditions", "Display a five-day forecast", "Handle loading and API errors"] },
      { title: "Core functions", description: "Keep API work easy to replace and test.", items: ["fetchWeather(city)", "parseWeatherResponse(data)", "formatTemperature(value)", "getWeatherIcon(condition)", "handleApiError(error)"] },
      { title: "Build it in steps", description: "Make the empty, loading, and error states intentional.", items: ["Create the search form", "Call the weather API", "Render the response", "Add loading and error states", "Make the layout responsive"] },
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
