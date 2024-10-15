// Task creation for seed data
const createTask = () => {
    const { title, description, priority } = generateRandomTask();
    return (({
        title,
        description,
        priority,
        isDeleted: false,
        isExpanded: true,
        created: new Date(),
    }));
};

const generateRandomTask = () => {
    const randomIndex = Math.floor(Math.random() * randomTasks.length);
    const { title, description, priority } = randomTasks[randomIndex];

    return { title, description, priority };
};

const randomTasks = [
    { title: "Read a Book", description: "Read pages 20-50 of the novel Harry Potter", priority: "High" },
    { title: "Cook Dinner", description: "Lemon garlic shrimp scampi over pasta and parmesan cheese", priority: "Medium" },
    { title: "Go for a Run", description: "Run 5 kilometers around the park", priority: "Low" },
    { title: "Do Laundry", description: "Wash and fold clothes, separate by colors", priority: "High" },
    { title: "Buy Groceries", description: "Purchase eggs, milk, bread, and fresh veggies", priority: "Medium" },
    { title: "Write Emails", description: "Send follow-up emails to clients", priority: "Low" },
    { title: "Plan a Trip", description: "Research flights and hotels for a weekend getaway", priority: "High" },
    { title: "Study for Exam", description: "Review chapters 3 to 7 of the biology textbook", priority: "Medium" },
    { title: "Clean the House", description: "Vacuum floors and dust all surfaces", priority: "Low" },
    { title: "Practice Guitar", description: "Play scales and practice chords for 30 minutes", priority: "High" },
    { title: "Meal Prep", description: "Cook chicken, rice, and vegetables for the week", priority: "Medium" },
    { title: "Organize Desk", description: "Sort paperwork and clean out old files", priority: "Low" },
    { title: "Attend Meeting", description: "Join the 2 PM team meeting on Zoom", priority: "High" },
    { title: "Meditate", description: "Practice 10 minutes of guided meditation", priority: "Medium" },
    { title: "Water Plants", description: "Water all indoor and outdoor plants", priority: "Low" },
    { title: "Go Grocery Shopping", description: "Purchase ingredients for a new recipe", priority: "High" },
    { title: "Clean Car", description: "Wash the car inside and out, vacuum seats", priority: "Medium" },
    { title: "Write Blog Post", description: "Draft a 1,000-word article about sustainable living", priority: "Low" },
    { title: "Bake a Cake", description: "Bake a chocolate cake from scratch with frosting", priority: "High" },
    { title: "Sort Emails", description: "Delete old messages and organize important ones", priority: "Medium" },
    { title: "Attend Workout Class", description: "Join the 6 PM HIIT workout session", priority: "Low" },
    { title: "Create a Budget", description: "Track monthly expenses and set financial goals", priority: "High" },
    { title: "Wash Dishes", description: "Clean all dishes and organize the kitchen", priority: "Medium" },
    { title: "Practice Yoga", description: "Do a 30-minute Vinyasa yoga session", priority: "Low" },
    { title: "Clean the Garage", description: "Organize tools and get rid of unwanted items", priority: "High" },
    { title: "Read News", description: "Catch up on world news and current events", priority: "Medium" },
    { title: "Finish a Puzzle", description: "Complete a 1,000-piece jigsaw puzzle", priority: "Low" },
    { title: "Call a Friend", description: "Catch up with Sarah on the phone for 30 minutes", priority: "High" },
    { title: "Write a To-Do List", description: "List out tasks for the next two days", priority: "Medium" },
    { title: "Fix a Leaky Faucet", description: "Replace the washer and stop the leak", priority: "Low" },
    { title: "Check Emails", description: "Go through new emails and respond to urgent ones", priority: "High" },
    { title: "Clean Windows", description: "Wash all windows inside and out for a clearer view", priority: "Medium" },
    { title: "Plan Weekend Activities", description: "Organize plans for hiking or a picnic", priority: "Low" },
    { title: "Go for a Bike Ride", description: "Cycle 10 miles through the neighborhood", priority: "High" },
    { title: "Watch a Movie", description: "Watch a comedy film on Netflix", priority: "Medium" },
    { title: "Declutter Closet", description: "Donate clothes you haven’t worn in over a year", priority: "Low" },
    { title: "Learn a New Language", description: "Practice Spanish vocabulary for 30 minutes", priority: "High" },
    { title: "Prepare for Presentation", description: "Final review of slides and practice delivery", priority: "Medium" },
    { title: "Go to the Doctor", description: "Schedule an annual physical check-up appointment", priority: "Low" },
    { title: "Do a Workout", description: "Complete a 30-minute strength training routine", priority: "High" },
    { title: "Organize Photos", description: "Sort vacation photos into labeled albums", priority: "Medium" },
    { title: "Feed the Pets", description: "Feed the cat and walk the dog", priority: "Low" },
    { title: "Take Out Trash", description: "Collect trash bags from all rooms and take them to the curb", priority: "High" },
    { title: "Write a Letter", description: "Draft a letter to your grandmother", priority: "Medium" },
    { title: "Clean Refrigerator", description: "Throw out expired items and organize shelves", priority: "Low" },
    { title: "Schedule a Meeting", description: "Set up a meeting with the project team for next week", priority: "High" },
    { title: "Groom Pet", description: "Brush the dog's fur and trim the nails", priority: "Medium" },
    { title: "Shop for New Clothes", description: "Buy a pair of jeans and a new sweater", priority: "Low" },
    { title: "Check Weather Forecast", description: "See if it will rain tomorrow and plan accordingly", priority: "High" },
    { title: "Update Resume", description: "Add recent projects and update contact information", priority: "Medium" },
    { title: "Start a New Hobby", description: "Begin learning how to paint with watercolors", priority: "Low" },
    { title: "Visit a Friend", description: "Spend the afternoon visiting Chris and having coffee", priority: "High" },
    { title: "Do a Digital Cleanup", description: "Delete old files and clear out your desktop", priority: "Medium" },
    { title: "Prepare Lunch", description: "Make a turkey sandwich with avocado and greens", priority: "Low" },
    { title: "Clean Bathroom", description: "Scrub sink, toilet, and clean mirrors", priority: "High" },
    { title: "Do a Random Act of Kindness", description: "Pay for someone's coffee or hold the door", priority: "Medium" },
    { title: "Stretch", description: "Do a series of gentle stretches to relieve tension", priority: "Low" },
    { title: "Pay Bills", description: "Pay the electricity and internet bills for the month", priority: "High" }
];

module.exports = { createTask };
