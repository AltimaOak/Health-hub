(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .ai-assistant-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .ai-chat-launcher {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ai-chat-launcher:hover {
            transform: scale(1.1) rotate(5deg);
        }
        .ai-chat-window {
            width: 380px;
            height: 520px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
            margin-bottom: 20px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .ai-chat-header {
            padding: 20px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ai-chat-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.5;
        }
        .message.ai {
            align-self: flex-start;
            background: #f3f4f6;
            color: #1f2937;
            border-bottom-left-radius: 4px;
        }
        .message.user {
            align-self: flex-end;
            background: #6366f1;
            color: white;
            border-bottom-right-radius: 4px;
        }
        .message ul, .message ol {
            margin: 10px 0 10px 20px;
            padding: 0;
        }
        .message li {
            margin-bottom: 5px;
        }
        .ai-chat-footer {
            padding: 15px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
            background: white;
        }
        .ai-input {
            flex: 1;
            border: 1px solid #d1d5db;
            border-radius: 30px;
            padding: 10px 20px;
            outline: none;
            font-size: 14px;
        }
        .ai-voice-btn {
            background: #f3f4f6;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #4b5563;
        }
        .ai-voice-btn.active {
            background: #ef4444;
            color: white;
            animation: pulse-voice 1.5s infinite;
        }
        @keyframes pulse-voice {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
    `;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.className = 'ai-assistant-widget';
    widget.innerHTML = `
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <div>
                    <strong id="aiHeaderTitle">MC Assistant</strong>
                    <div id="aiHeaderSubtitle" style="font-size: 10px; opacity: 0.8;">Empowering Journeys</div>
                </div>
                <button id="closeChat" style="background:none; border:none; color:white; cursor:pointer; font-size:20px;">×</button>
            </div>
            <div class="ai-chat-body" id="aiChatBody">
                <!-- Initial welcome message will be injected here -->
            </div>
            <div class="ai-chat-footer">
                <button class="ai-voice-btn" id="voiceBtn" title="Voice Control">🎤</button>
                <input type="text" class="ai-input" id="aiInput" placeholder="Type a message...">
                <button id="sendBtn" style="background:none; border:none; color:#6366f1; cursor:pointer; font-size:20px;">➤</button>
            </div>
        </div>
        <div class="ai-chat-launcher" id="aiLauncher">
            💬
        </div>
    `;
    document.body.appendChild(widget);

    const launcher = document.getElementById('aiLauncher');
    const windowEl = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('closeChat');
    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatBody = document.getElementById('aiChatBody');
    const voiceBtn = document.getElementById('voiceBtn');
    const headerTitle = document.getElementById('aiHeaderTitle');
    const headerSubtitle = document.getElementById('aiHeaderSubtitle');

    const getTranslation = (key, lang) => {
        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            return window.translations[lang][key];
        }
        // Fallback to English if possible
        if (window.translations && window.translations['en'] && window.translations['en'][key]) {
            return window.translations['en'][key];
        }
        return key;
    };

    const updateChatUI = () => {
        const langCode = localStorage.getItem('language') || 'en';
        headerTitle.textContent = getTranslation('ai_title', langCode);
        headerSubtitle.textContent = getTranslation('ai_subtitle', langCode);
        input.placeholder = getTranslation('ai_placeholder', langCode);
        
        // Update welcome message if chat body is empty
        if (chatBody.children.length === 0) {
            addMessage(getTranslation('ai_welcome', langCode), 'ai');
        }
    };

    launcher.addEventListener('click', () => {
        windowEl.style.display = 'flex';
        launcher.style.display = 'none';
        if (chatBody.children.length === 0) updateChatUI();
    });

    closeBtn.addEventListener('click', () => {
        windowEl.style.display = 'none';
        launcher.style.display = 'flex';
    });

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
        return msg;
    };

    const formatResponse = (text) => {
        if (!text) return "";
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Handle simple lists
        formatted = formatted.replace(/^\s*[-•*]\s+(.*)/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Final wrap in paragraph if needed
        if (formatted.includes('</p>')) {
            formatted = '<p>' + formatted + '</p>';
        }
        return formatted;
    };

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        const aiMsg = addMessage('...', 'ai');
        const langCode = localStorage.getItem('language') || localStorage.getItem('siteLang') || 'en';
        
        // Map lang codes to full names for the backend if needed, 
        // but backend usually expects 'Hindi', 'Marathi', etc. 
        // Let's create a mapping.
        const langMap = {
            'en': 'English',
            'hi': 'Hindi',
            'mr': 'Marathi',
            'bn': 'Bengali',
            'te': 'Telugu'
        };

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    role: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'guest',
                    language: langMap[langCode] || 'English'
                })
            });
            const result = await response.json();
            const replyText = result.reply || getTranslation('ai_error', langCode);
            aiMsg.innerHTML = formatResponse(replyText);
            
            // Text to speech (strip HTML and markdown for speech)
            const speechText = replyText
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .replace(/[-•]\s+/g, '')
                .replace(/#+\s+/g, '')
                .replace(/<[^>]*>/g, '');
            speak(speechText);
        } catch (err) {
            aiMsg.textContent = getTranslation('ai_error', langCode);
        }
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSend(); });

    // Voice Synthesis (TTS)
    const speak = (text) => {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        const langCode = localStorage.getItem('language') || 'en';
        
        // Better language mapping for TTS
        const speakMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'mr': 'mr-IN',
            'bn': 'bn-IN',
            'te': 'te-IN'
        };
        utterance.lang = speakMap[langCode] || 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    // Voice Recognition (STT)
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Recognition) {
        const recognition = new Recognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            voiceBtn.classList.add('active');
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('active');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            handleSend();
        };

        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceBtn.style.display = 'none';
    }

    // Initialize UI
    updateChatUI();

    // Listen for language changes from language-engine.js
    window.addEventListener('languageChanged', (e) => {
        updateChatUI();
    });

})();

