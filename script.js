const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const usernameInput = document.getElementById('username-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-chat');
const toggleThemeBtn = document.getElementById('toggle-theme');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');

let messages = JSON.parse(localStorage.getItem('messages')) || [];
let darkMode = localStorage.getItem('darkMode') === 'true';

// Emoji List
const emojis = ["😀","😂","😎","😍","😜","😢","😡","👍","👎","🙏","🎉","💯","❤️","🔥"];
emojis.forEach(e => {
    const span = document.createElement('span');
    span.textContent = e;
    span.classList.add('emoji');
    span.addEventListener('click', () => {
        messageInput.value += e;
        emojiPicker.style.display = 'none';
    });
    emojiPicker.appendChild(span);
});

// Apply saved dark mode
if(darkMode) document.body.classList.add('dark');

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    darkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', darkMode);
});

clearBtn.addEventListener('click', () => {
    messages = [];
    localStorage.removeItem('messages');
    renderMessages();
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
});

emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'flex' ? 'none' : 'flex';
});

function renderMessages() {
    chatBox.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('message', msg.type);
        div.innerHTML = `<strong>${msg.user}</strong>: ${msg.text} <span class="timestamp">${msg.time}</span>`;
        chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    const user = usernameInput.value.trim() || 'You';
    if(text === '') return;

    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    messages.push({ user, text, type: 'sent', time });
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
    messageInput.value = '';

    setTimeout(() => {
        const reply = generateReply(text);
        messages.push({ user: 'Bot', text: reply, type: 'received', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
        localStorage.setItem('messages', JSON.stringify(messages));
        renderMessages();
    }, 1000);
}

// Simple auto-reply logic
function generateReply(userText) {
    const replies = [
        "Interesting!",
        "Tell me more...",
        "I see 😊",
        "Wow, really?",
        "Haha 😄",
        "That's cool!",
        "👍",
        "😂"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}

// Initial render
renderMessages();
