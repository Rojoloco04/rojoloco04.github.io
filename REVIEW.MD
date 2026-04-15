Act as a Senior Front-End Developer. Please perform a comprehensive code review of my HTML, CSS, and vanilla JavaScript portfolio website.

Your goal is to evaluate the code quality, identify bad practices, and suggest actionable improvements. Please review the codebase against the following core principles of front-end code quality:

1. Architecture & Separation of Concerns

Are HTML (structure), CSS (presentation), and JavaScript (behavior) strictly separated?

Are there any inline styles or inline event listeners (e.g., onclick) that should be moved to their respective files?

Is the folder and file structure logical and scalable?

2. HTML (Structure, Accessibility, & SEO)

Semantic HTML: Are semantic tags (<header>, <main>, <section>, <article>, <nav>, <footer>) used correctly instead of excessive <div> tags?

Accessibility (a11y): Are images equipped with meaningful alt attributes? Is the tab order logical? Are ARIA labels used appropriately where native semantics fall short? Are color contrasts sufficient?

SEO & Meta Tags: Are the <head> tags optimized (title, description, viewport, social open graph tags)?

3. CSS (Styling, Responsiveness, & Maintainability)

Responsiveness: Is the design built mobile-first? Are media queries used effectively to handle various screen sizes?

Maintainability: Is there a consistent naming convention (like BEM)? Are CSS Custom Properties (variables) used for colors, typography, and spacing to ensure consistency and make theme changes easy?

Efficiency: Are selectors overly specific or deeply nested? Are layout models like Flexbox and Grid used appropriately instead of outdated float or positioning hacks?

4. Vanilla JavaScript (Logic, Performance, & Best Practices)

Modern Syntax: Is the code utilizing modern ES6+ features (const/let, arrow functions, template literals, destructuring)?

DOM Manipulation: Is DOM manipulation kept to a minimum to prevent unnecessary reflows and repaints? Are elements cached in variables rather than queried repeatedly?

Event Handling: Is event delegation used where appropriate (e.g., for dynamically generated lists)? Are event listeners cleaned up if necessary?

Modularity: Is the code DRY (Don't Repeat Yourself)? Are large functions broken down into smaller, single-responsibility functions? Is the global namespace kept clean to avoid collisions?

5. Performance Optimization

Are assets (images, fonts) handled in a way that optimizes loading time?

Is there any blocking JavaScript that should be deferred (defer or async attributes)?

Output Format:
Please format your review into the following sections:

Critical Issues: Bugs, broken responsive layouts, or major accessibility failures.

Refactoring Recommendations: Areas where the code works but could be cleaner, more modular, or more efficient (include short code snippets showing the "before" and "after").

Nitpicks & Polish: Minor formatting, naming convention inconsistencies, or tiny optimizations.