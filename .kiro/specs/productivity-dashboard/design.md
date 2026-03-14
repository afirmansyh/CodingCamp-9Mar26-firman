# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application built with vanilla HTML, CSS, and JavaScript. It provides a minimal, focused interface for productivity with four core components: a time-aware greeting, a 25-minute focus timer, a to-do list, and quick links to favorite websites.

The application follows a simple architecture with no framework dependencies or backend requirements. All data persistence is handled through the browser's Local Storage API, making the application fully functional offline after the initial page load.

### Key Design Principles

- **Simplicity**: Single-page application with vanilla JavaScript, no build tools or frameworks
- **Client-side only**: All logic and data storage handled in the browser
- **Minimal dependencies**: Zero external libraries or frameworks
- **Responsive**: Immediate UI updates with no noticeable lag
- **Persistent**: Data survives browser sessions via Local Storage

## Architecture

### High-Level Structure

The application follows a simple component-based architecture implemented in vanilla JavaScript:

```
┌─────────────────────────────────────────┐
│         index.html (Entry Point)        │
│  ┌───────────────────────────────────┐  │
│  │     Greeting Component            │  │
│  │  (Time, Date, Time-based Message) │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Focus Timer Component         │  │
│  │  (25-min countdown, controls)     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     To-Do List Component          │  │
│  │  (Add, Edit, Complete, Delete)    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Quick Links Component         │  │
│  │  (Favorite website buttons)       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↕
    ┌──────────────┐
    │ Local Storage│
    │   (Browser)  │
    └──────────────┘
```

### File Structure

```
productivity-dashboard/
├── index.html           # Main HTML structure
├── css/
│   └── styles.css      # All styling (single file)
└── js/
    └── app.js          # All JavaScript logic (single file)
```

### Component Architecture

Each component is implemented as a JavaScript module pattern with:
- **Initialization**: Setup DOM references and event listeners
- **State Management**: Local component state
- **Rendering**: Update DOM based on state
- **Persistence**: Save/load from Local Storage when needed

## Components and Interfaces

### 1. Greeting Component

**Purpose**: Display current time, date, and time-appropriate greeting message.

**DOM Structure**:
```html
<div id="greeting-component">
  <div id="current-time"></div>
  <div id="current-date"></div>
  <div id="greeting-message"></div>
</div>
```

**Behavior**:
- Updates time display every second using `setInterval`
- Determines greeting based on hour of day:
  - 5:00-11:59: "Good morning"
  - 12:00-16:59: "Good afternoon"
  - 17:00-20:59: "Good evening"
  - 21:00-4:59: "Good night"
- Formats date as readable string (e.g., "Monday, January 15, 2024")

**Interface**:
```javascript
GreetingComponent = {
  init(): void
  updateTime(): void
  getGreeting(hour: number): string
}
```

### 2. Focus Timer Component

**Purpose**: Provide a 25-minute countdown timer for focused work sessions.

**DOM Structure**:
```html
<div id="timer-component">
  <div id="timer-display">25:00</div>
  <div id="timer-controls">
    <button id="timer-start">Start</button>
    <button id="timer-stop">Stop</button>
    <button id="timer-reset">Reset</button>
  </div>
</div>
```

**State**:
- `remainingSeconds`: Number (initially 1500 for 25 minutes)
- `isRunning`: Boolean
- `intervalId`: Number or null

**Behavior**:
- Start: Begin countdown, update display every second
- Stop: Pause countdown, preserve remaining time
- Reset: Set back to 25:00, stop if running
- Display format: MM:SS

**Interface**:
```javascript
FocusTimerComponent = {
  init(): void
  start(): void
  stop(): void
  reset(): void
  tick(): void
  updateDisplay(): void
  formatTime(seconds: number): string
}
```

### 3. To-Do List Component

**Purpose**: Manage tasks with add, edit, complete, and delete operations.

**DOM Structure**:
```html
<div id="todo-component">
  <div id="todo-input-section">
    <input id="todo-input" type="text" placeholder="Add a new task...">
    <button id="todo-add">Add</button>
  </div>
  <ul id="todo-list">
    <!-- Task items rendered here -->
  </ul>
</div>
```

**Task Item Structure**:
```html
<li class="todo-item" data-id="unique-id">
  <input type="checkbox" class="todo-checkbox">
  <span class="todo-text">Task description</span>
  <button class="todo-edit">Edit</button>
  <button class="todo-delete">Delete</button>
</li>
```

**State**:
- `tasks`: Array of Task objects

**Behavior**:
- Add: Create new task, append to list, save to Local Storage
- Edit: Replace text with input field, save on blur/enter
- Complete: Toggle checkbox, update task status, save
- Delete: Remove from array and DOM, save
- Load: Retrieve tasks from Local Storage on init

**Interface**:
```javascript
TodoComponent = {
  init(): void
  loadTasks(): void
  saveTasks(): void
  addTask(text: string): void
  editTask(id: string, newText: string): void
  toggleTask(id: string): void
  deleteTask(id: string): void
  renderTasks(): void
  generateId(): string
}
```

### 4. Quick Links Component

**Purpose**: Display and manage clickable buttons for favorite websites.

**DOM Structure**:
```html
<div id="links-component">
  <div id="links-input-section">
    <input id="link-name" type="text" placeholder="Link name">
    <input id="link-url" type="url" placeholder="https://example.com">
    <button id="link-add">Add Link</button>
  </div>
  <div id="links-container">
    <!-- Link buttons rendered here -->
  </div>
</div>
```

**Link Button Structure**:
```html
<div class="link-item" data-id="unique-id">
  <a href="url" target="_blank" class="link-button">Name</a>
  <button class="link-delete">×</button>
</div>
```

**State**:
- `links`: Array of Link objects

**Behavior**:
- Add: Create new link button, save to Local Storage
- Click: Open URL in new tab
- Delete: Remove from array and DOM, save
- Load: Retrieve links from Local Storage on init

**Interface**:
```javascript
QuickLinksComponent = {
  init(): void
  loadLinks(): void
  saveLinks(): void
  addLink(name: string, url: string): void
  deleteLink(id: string): void
  renderLinks(): void
  generateId(): string
}
```

## Data Models

### Task Model

```javascript
{
  id: string,        // Unique identifier (timestamp-based)
  text: string,      // Task description
  completed: boolean, // Completion status
  createdAt: number  // Timestamp (milliseconds since epoch)
}
```

**Local Storage Key**: `"productivity-dashboard-tasks"`

**Storage Format**: JSON array of Task objects

### Link Model

```javascript
{
  id: string,   // Unique identifier (timestamp-based)
  name: string, // Display name for the link
  url: string   // Full URL (must include protocol)
}
```

**Local Storage Key**: `"productivity-dashboard-links"`

**Storage Format**: JSON array of Link objects

### Timer State Model

The timer does not persist state between sessions. It always resets to 25:00 on page load.

### Local Storage Schema

```javascript
// Example stored data
localStorage = {
  "productivity-dashboard-tasks": '[
    {"id":"1705334400000","text":"Review design doc","completed":false,"createdAt":1705334400000},
    {"id":"1705334500000","text":"Write tests","completed":true,"createdAt":1705334500000}
  ]',
  "productivity-dashboard-links": '[
    {"id":"1705334600000","name":"GitHub","url":"https://github.com"},
    {"id":"1705334700000","name":"MDN","url":"https://developer.mozilla.org"}
  ]'
}
```

### Data Validation

**Task Validation**:
- `text`: Non-empty string after trimming whitespace
- `completed`: Boolean value
- `id`: Non-empty string

**Link Validation**:
- `name`: Non-empty string after trimming whitespace
- `url`: Valid URL format (basic validation with URL constructor)
- `id`: Non-empty string

## UI/UX Design Approach

### Visual Design

- **Layout**: Single-column centered layout with max-width for readability
- **Typography**: Clean sans-serif font (system font stack for performance)
- **Color Scheme**: Minimal palette with subtle accents
  - Background: Light neutral
  - Text: Dark gray for readability
  - Accents: Subtle blue for interactive elements
  - Completed tasks: Lighter gray with strikethrough
- **Spacing**: Generous whitespace between components
- **Borders**: Subtle borders to separate components

### Interaction Design

- **Buttons**: Clear hover states, cursor pointer
- **Inputs**: Focus states with border highlight
- **Checkboxes**: Large click targets for easy interaction
- **Timer**: Large, readable display with clear button labels
- **Feedback**: Immediate visual updates (no loading states needed)

### Responsive Behavior

- **Desktop**: Comfortable spacing, larger text
- **Mobile**: Stack components vertically, touch-friendly targets
- **Breakpoint**: ~768px for mobile/desktop transition

### Accessibility Considerations

- Semantic HTML elements
- Sufficient color contrast
- Keyboard navigation support
- Focus indicators
- ARIA labels where needed


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time-based greeting correctness

*For any* hour value (0-23), the greeting function should return the appropriate greeting message: "Good morning" for hours 5-11, "Good afternoon" for hours 12-16, "Good evening" for hours 17-20, and "Good night" for hours 21-4.

**Validates: Requirements 1.3**

### Property 2: Timer countdown behavior

*For any* timer state with remaining time greater than zero, starting the timer and waiting one second should decrease the remaining time by one second.

**Validates: Requirements 2.2**

### Property 3: Timer pause preserves state

*For any* running timer state, stopping the timer should preserve the current remaining time without further changes.

**Validates: Requirements 2.3**

### Property 4: Timer reset restores initial state

*For any* timer state (running or stopped, with any remaining time), resetting the timer should set the remaining time to 1500 seconds (25 minutes) and stop the countdown.

**Validates: Requirements 2.4**

### Property 5: Task addition increases list size

*For any* valid task text (non-empty after trimming), adding the task should increase the task list length by exactly one and the new task should appear in the list.

**Validates: Requirements 3.1**

### Property 6: Task editing updates text

*For any* existing task and any valid new text (non-empty after trimming), editing the task should update its text property to the new value while preserving its id and completed status.

**Validates: Requirements 3.2**

### Property 7: Task completion toggle updates status

*For any* existing task, toggling its completion status should flip the completed boolean value (true to false or false to true) while preserving all other properties.

**Validates: Requirements 3.3**

### Property 8: Task deletion removes from list

*For any* existing task in the list, deleting that task should remove it from the list and decrease the list length by exactly one.

**Validates: Requirements 3.4**

### Property 9: Task persistence round-trip

*For any* set of tasks, saving them to Local Storage and then loading them back should produce an equivalent set of tasks with the same ids, text, completed status, and createdAt timestamps.

**Validates: Requirements 3.5, 6.3**

### Property 10: Link addition increases list size

*For any* valid link name and URL (both non-empty after trimming, URL with valid format), adding the link should increase the links list length by exactly one and the new link should appear in the list.

**Validates: Requirements 4.1**

### Property 11: Link click triggers correct URL

*For any* link in the list, clicking the link button should trigger navigation to the exact URL stored in that link object.

**Validates: Requirements 4.2**

### Property 12: Link persistence round-trip

*For any* set of links, saving them to Local Storage and then loading them back should produce an equivalent set of links with the same ids, names, and URLs.

**Validates: Requirements 4.3, 6.3**

## Error Handling

### Input Validation

**Task Input**:
- Empty or whitespace-only task text: Prevent addition, show no error message (silent validation)
- Maximum length: No hard limit, but UI should handle long text gracefully with text wrapping

**Link Input**:
- Empty name or URL: Prevent addition, optionally show inline validation message
- Invalid URL format: Validate using URL constructor, show error message if invalid
- Missing protocol: Auto-prepend "https://" if no protocol specified

### Local Storage Errors

**Storage Quota Exceeded**:
- Catch `QuotaExceededError` when saving
- Show user-friendly message: "Storage limit reached. Please delete some items."
- Gracefully degrade: Continue functioning with in-memory state

**Corrupted Data**:
- Wrap `JSON.parse()` in try-catch
- If parsing fails, log error to console and initialize with empty array
- Don't crash the application

**Storage Unavailable**:
- Check for Local Storage availability on init
- If unavailable (private browsing, disabled), show warning message
- Continue functioning with in-memory state only

### Timer Edge Cases

**Timer reaches zero**:
- Stop the countdown automatically
- Optionally play a sound or show a notification (future enhancement)
- Display "00:00"

**Multiple rapid clicks**:
- Debounce or disable buttons during state transitions
- Prevent multiple intervals from running simultaneously

### Browser Compatibility

**Feature Detection**:
- Check for `localStorage` support before use
- Check for `setInterval` and `clearInterval` support (universally supported)
- Provide fallback message if critical features unavailable

## Testing Strategy

### Dual Testing Approach

The application will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Unit Testing

**Focus Areas**:
- Specific examples: Initial state, typical user flows
- Edge cases: Empty inputs, boundary values (timer at 0, single task)
- Error conditions: Invalid URLs, storage errors, corrupted data
- Integration points: DOM manipulation, Local Storage interactions

**Example Unit Tests**:
- Greeting displays "Good morning" at 9 AM
- Timer initializes to "25:00"
- Adding empty task is rejected
- Invalid URL shows error message
- Corrupted Local Storage data doesn't crash app

### Property-Based Testing

**Library**: Use `fast-check` for JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with comment referencing design property

**Tag Format**:
```javascript
// Feature: productivity-dashboard, Property 1: Time-based greeting correctness
```

**Property Test Implementation**:

Each correctness property from the design document must be implemented as a single property-based test:

1. **Property 1**: Generate random hours (0-23), verify greeting matches expected range
2. **Property 2**: Generate random timer states, verify countdown decreases by 1 second
3. **Property 3**: Generate random running timers, verify stop preserves time
4. **Property 4**: Generate random timer states, verify reset returns to 1500 seconds
5. **Property 5**: Generate random valid task text, verify list grows by 1
6. **Property 6**: Generate random tasks and new text, verify text updates correctly
7. **Property 7**: Generate random tasks, verify completion toggle flips boolean
8. **Property 8**: Generate random tasks, verify deletion removes from list
9. **Property 9**: Generate random task arrays, verify save/load round-trip
10. **Property 10**: Generate random valid links, verify list grows by 1
11. **Property 11**: Generate random links, verify click triggers correct URL
12. **Property 12**: Generate random link arrays, verify save/load round-trip

**Generators**:
- Random hours: 0-23
- Random task text: Non-empty strings with various characters
- Random task arrays: Arrays of 0-20 tasks with random properties
- Random link names: Non-empty strings
- Random URLs: Valid URL formats with various protocols and domains
- Random timer states: Remaining seconds 0-1500, running true/false

### Test Organization

```
productivity-dashboard/
├── tests/
│   ├── unit/
│   │   ├── greeting.test.js
│   │   ├── timer.test.js
│   │   ├── todo.test.js
│   │   └── links.test.js
│   └── properties/
│       ├── greeting.properties.test.js
│       ├── timer.properties.test.js
│       ├── todo.properties.test.js
│       └── links.properties.test.js
```

### Testing Tools

- **Test Runner**: Jest or Vitest (lightweight, fast)
- **Property Testing**: fast-check library
- **DOM Testing**: jsdom for simulating browser environment
- **Coverage**: Built-in coverage tools (aim for >80% coverage)

### Manual Testing Checklist

- Visual appearance in Chrome, Firefox, Edge, Safari
- Responsive behavior on mobile and desktop
- Keyboard navigation and accessibility
- Local Storage persistence across browser sessions
- Performance with large numbers of tasks/links (50+ items)
