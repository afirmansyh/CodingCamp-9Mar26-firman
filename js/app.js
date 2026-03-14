// Productivity Dashboard Application
// Entry point and initialization

// Storage Manager - Handles Local Storage availability and fallback
const StorageManager = {
  isAvailable: false,
  inMemoryStorage: {},

  // Check if Local Storage is available
  checkAvailability() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.isAvailable = true;
      return true;
    } catch (error) {
      console.warn('Local Storage is unavailable:', error);
      this.isAvailable = false;
      return false;
    }
  },

  // Get item from storage (Local Storage or in-memory fallback)
  getItem(key) {
    if (this.isAvailable) {
      return localStorage.getItem(key);
    } else {
      return this.inMemoryStorage[key] || null;
    }
  },

  // Set item in storage (Local Storage or in-memory fallback)
  setItem(key, value) {
    if (this.isAvailable) {
      localStorage.setItem(key, value);
    } else {
      this.inMemoryStorage[key] = value;
    }
  },

  // Display warning if Local Storage is unavailable
  showWarningIfUnavailable() {
    if (!this.isAvailable) {
      const warningElement = document.getElementById('storage-warning');
      if (warningElement) {
        warningElement.style.display = 'block';
      }
    }
  }
};

// Greeting Component
const GreetingComponent = {
  // DOM references
  timeElement: null,
  dateElement: null,
  greetingElement: null,
  intervalId: null,

  // Initialize the component
  init() {
    this.timeElement = document.getElementById('current-time');
    this.dateElement = document.getElementById('current-date');
    this.greetingElement = document.getElementById('greeting-message');

    // Update immediately and then every second
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  },

  // Update time, date, and greeting
  updateTime() {
    const now = new Date();
    
    // Format time as HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.timeElement.textContent = `${hours}:${minutes}:${seconds}`;

    // Format date as "Weekday, Month Day, Year"
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.dateElement.textContent = now.toLocaleDateString('en-US', options);

    // Update greeting based on hour
    this.greetingElement.textContent = this.getGreeting(now.getHours());
  },

  // Get greeting based on hour (0-23)
  getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
      return 'Good morning';
    } else if (hour >= 12 && hour <= 16) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour <= 20) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  }
};

// Focus Timer Component
const FocusTimerComponent = {
  // DOM references
  displayElement: null,
  startButton: null,
  stopButton: null,
  resetButton: null,

  // State
  remainingSeconds: 1500, // 25 minutes
  isRunning: false,
  intervalId: null,

  // Initialize the component
  init() {
    this.displayElement = document.getElementById('timer-display');
    this.startButton = document.getElementById('timer-start');
    this.stopButton = document.getElementById('timer-stop');
    this.resetButton = document.getElementById('timer-reset');

    // Set up event listeners
    this.startButton.addEventListener('click', () => this.start());
    this.stopButton.addEventListener('click', () => this.stop());
    this.resetButton.addEventListener('click', () => this.reset());

    // Initialize display
    this.updateDisplay();
  },

  // Start the timer
  start() {
    if (this.isRunning) return; // Prevent multiple intervals
    
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
  },

  // Stop the timer
  stop() {
    if (!this.isRunning) return;
    
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
  },

  // Reset the timer
  reset() {
    this.stop();
    this.remainingSeconds = 1500;
    this.updateDisplay();
  },

  // Tick function called every second
  tick() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.updateDisplay();
    }
    
    // Stop automatically when reaching zero
    if (this.remainingSeconds === 0) {
      this.stop();
    }
  },

  // Update the display with formatted time
  updateDisplay() {
    this.displayElement.textContent = this.formatTime(this.remainingSeconds);
  },

  // Format seconds to MM:SS
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
};

// To-Do List Component
const TodoComponent = {
  // DOM references
  inputElement: null,
  addButton: null,
  listElement: null,

  // State
  tasks: [],

  // Initialize the component
  init() {
    this.inputElement = document.getElementById('todo-input');
    this.addButton = document.getElementById('todo-add');
    this.listElement = document.getElementById('todo-list');

    // Set up event listeners
    this.addButton.addEventListener('click', () => {
      const text = this.inputElement.value;
      this.addTask(text);
    });

    // Handle Enter key on input
    this.inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = this.inputElement.value;
        this.addTask(text);
      }
    });

    // Load tasks and render
    this.loadTasks();
    
    // Add default tasks if no tasks exist
    if (this.tasks.length === 0) {
      this.addDefaultTasks();
    }
    
    this.renderTasks();
  },

  // Add default tasks
  addDefaultTasks() {
    const defaultTasks = [
      { text: 'bekerja', completed: false },
      { text: 'belajar', completed: false }
    ];

    defaultTasks.forEach((task, index) => {
      const taskObj = {
        id: this.generateId() + '-' + index,
        text: task.text,
        completed: task.completed,
        createdAt: Date.now()
      };
      this.tasks.push(taskObj);
    });

    this.saveTasks();
  },

  // Generate unique ID based on timestamp
  generateId() {
    return String(Date.now() + Math.random());
  },

  // Load tasks from Local Storage
  loadTasks() {
    try {
      const stored = StorageManager.getItem('productivity-dashboard-tasks');
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading tasks from Local Storage:', error);
      this.tasks = [];
    }
  },

  // Save tasks to Local Storage
  saveTasks() {
    try {
      const json = JSON.stringify(this.tasks);
      StorageManager.setItem('productivity-dashboard-tasks', json);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please delete some tasks.');
        alert('Storage limit reached. Please delete some items.');
      } else {
        console.error('Error saving tasks to Local Storage:', error);
      }
    }
  },

  // Add a new task
  addTask(text) {
    // Validate non-empty text
    const trimmedText = text.trim();
    if (!trimmedText) {
      return; // Silent validation - don't add empty tasks
    }

    // Create task object
    const task = {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now()
    };

    // Add to array
    this.tasks.push(task);

    // Save and render
    this.saveTasks();
    this.renderTasks();

    // Clear input field
    this.inputElement.value = '';
  },

  // Edit a task
  editTask(id, newText) {
    // Validate non-empty text
    const trimmedText = newText.trim();
    if (!trimmedText) {
      return; // Don't update with empty text
    }

    // Find task by id
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = trimmedText;
      this.saveTasks();
      this.renderTasks();
    }
  },

  // Toggle task completion status
  toggleTask(id) {
    console.log('Toggle task called with id:', id);
    // Find task by id
    const task = this.tasks.find(t => t.id === id);
    console.log('Found task:', task);
    if (task) {
      task.completed = !task.completed;
      console.log('Task completed status:', task.completed);
      this.saveTasks();
      this.renderTasks();
    }
  },

  // Delete a task
  deleteTask(id) {
    // Filter out task by id
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  },

  // Render tasks to DOM
  renderTasks() {
    // Clear list
    this.listElement.innerHTML = '';

    // Create DOM elements for each task
    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = task.id;
      if (task.completed) {
        li.classList.add('completed');
      }

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', `Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);
      checkbox.addEventListener('change', () => this.toggleTask(task.id));

      // Text span
      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = task.text;

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'todo-delete';
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('aria-label', `Delete task "${task.text}"`);
      deleteButton.addEventListener('click', () => this.deleteTask(task.id));

      // Append elements
      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(deleteButton);

      this.listElement.appendChild(li);
    });
  }
};

// Quick Links Component
const QuickLinksComponent = {
  // DOM references
  nameInput: null,
  urlInput: null,
  addButton: null,
  linksContainer: null,

  // State
  links: [],

  // Initialize the component
  init() {
    this.nameInput = document.getElementById('link-name');
    this.urlInput = document.getElementById('link-url');
    this.addButton = document.getElementById('link-add');
    this.linksContainer = document.getElementById('links-container');

    // Set up event listener for add button
    this.addButton.addEventListener('click', () => {
      const name = this.nameInput.value;
      const url = this.urlInput.value;
      this.addLink(name, url);
    });

    // Load links and render
    this.loadLinks();
    
    // Add default links if no links exist
    if (this.links.length === 0) {
      this.addDefaultLinks();
    }
    
    this.renderLinks();
  },

  // Add default links (Google, Gmail, Calendar)
  addDefaultLinks() {
    const defaultLinks = [
      { name: 'Google', url: 'https://google.com' },
      { name: 'Gmail', url: 'https://gmail.com' },
      { name: 'Calendar', url: 'https://calendar.google.com' }
    ];

    defaultLinks.forEach((link, index) => {
      const linkObj = {
        id: this.generateId() + '-' + index,
        name: link.name,
        url: link.url
      };
      this.links.push(linkObj);
    });

    this.saveLinks();
  },

  // Generate unique ID based on timestamp
  generateId() {
    return String(Date.now() + Math.random());
  },

  // Load links from Local Storage
  loadLinks() {
    try {
      const stored = StorageManager.getItem('productivity-dashboard-links');
      if (stored) {
        this.links = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading links from Local Storage:', error);
      this.links = [];
    }
  },

  // Save links to Local Storage
  saveLinks() {
    try {
      const json = JSON.stringify(this.links);
      StorageManager.setItem('productivity-dashboard-links', json);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please delete some links.');
        alert('Storage limit reached. Please delete some items.');
      } else {
        console.error('Error saving links to Local Storage:', error);
      }
    }
  },

  // Add a new link
  addLink(name, url) {
    // Validate non-empty name and URL
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    
    if (!trimmedName || !trimmedUrl) {
      return; // Silent validation - don't add empty links
    }

    // Auto-prepend "https://" if no protocol
    let finalUrl = trimmedUrl;
    if (!trimmedUrl.match(/^https?:\/\//i)) {
      finalUrl = 'https://' + trimmedUrl;
    }

    // Validate URL format with URL constructor
    try {
      new URL(finalUrl);
    } catch (error) {
      console.error('Invalid URL format:', error);
      alert('Invalid URL format. Please enter a valid URL.');
      return;
    }

    // Create link object
    const link = {
      id: this.generateId(),
      name: trimmedName,
      url: finalUrl
    };

    // Add to array
    this.links.push(link);

    // Save and render
    this.saveLinks();
    this.renderLinks();

    // Clear input fields
    this.nameInput.value = '';
    this.urlInput.value = '';
  },

  // Delete a link
  deleteLink(id) {
    // Filter out link by id
    this.links = this.links.filter(link => link.id !== id);
    this.saveLinks();
    this.renderLinks();
  },

  // Render links to DOM
  renderLinks() {
    // Clear container
    this.linksContainer.innerHTML = '';

    // Create DOM elements for each link
    this.links.forEach(link => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      linkItem.dataset.id = link.id;

      // Anchor tag (opens in new tab)
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'link-button';
      anchor.textContent = link.name;
      anchor.setAttribute('aria-label', `${link.name} (opens in new tab)`);

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'link-delete';
      deleteButton.textContent = '×';
      deleteButton.setAttribute('aria-label', `Delete link "${link.name}"`);
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteLink(link.id);
      });

      // Append elements
      linkItem.appendChild(anchor);
      linkItem.appendChild(deleteButton);

      this.linksContainer.appendChild(linkItem);
    });
  }
};

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('Productivity Dashboard initialized');
  
  // Check Local Storage availability and show warning if unavailable
  StorageManager.checkAvailability();
  StorageManager.showWarningIfUnavailable();
  
  // Initialize components
  GreetingComponent.init();
  FocusTimerComponent.init();
  TodoComponent.init();
  QuickLinksComponent.init();
});
