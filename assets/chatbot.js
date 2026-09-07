(() => {
  const suggestions = [
    '¿Cómo creo un evento?',
    '¿Cómo agrego una actividad?',
    '¿Cómo confirmo una agenda?',
    '¿Qué significa el estado Confirmada?'
  ];
  const welcomeMessage = 'Hola, soy el asistente de AgendaPro. Puedo ayudarte a entender cómo crear eventos, agregar actividades y confirmar agendas.';
  const errorMessage = 'El asistente no pudo responder en este momento. Intenta nuevamente.';
  let requestInProgress = false;

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  const launcher = createElement('button', 'ap-chat-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'agendaProChatPanel');
  launcher.setAttribute('aria-label', 'Abrir el asistente de AgendaPro');
  const launcherIcon = createElement('i', 'bi bi-chat-dots-fill');
  launcherIcon.setAttribute('aria-hidden', 'true');
  launcher.append(launcherIcon, createElement('span', '', '¿Necesitas ayuda?'));

  const panel = createElement('section', 'ap-chat-panel');
  panel.id = 'agendaProChatPanel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Asistente de AgendaPro');

  const header = createElement('header', 'ap-chat-header');
  const headingGroup = createElement('div');
  const title = createElement('h2', 'ap-chat-title', 'Asistente AgendaPro');
  title.id = 'agendaProChatTitle';
  const subtitle = createElement('p', 'ap-chat-subtitle', 'Ayuda sobre el producto');
  headingGroup.append(title, subtitle);
  const closeButton = createElement('button', 'ap-chat-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Cerrar el asistente');
  header.append(headingGroup, closeButton);

  const messages = createElement('div', 'ap-chat-messages');
  messages.setAttribute('role', 'log');
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('aria-relevant', 'additions text');

  const suggestionList = createElement('div', 'ap-chat-suggestions');
  suggestionList.setAttribute('aria-label', 'Preguntas sugeridas');

  const form = createElement('form', 'ap-chat-form');
  const input = createElement('textarea', 'ap-chat-input');
  input.name = 'question';
  input.rows = 1;
  input.maxLength = 500;
  input.required = true;
  input.placeholder = 'Escribe tu pregunta…';
  input.setAttribute('aria-label', 'Pregunta para el asistente de AgendaPro');
  const sendButton = createElement('button', 'ap-chat-send');
  sendButton.type = 'submit';
  sendButton.setAttribute('aria-label', 'Enviar pregunta');
  const sendIcon = createElement('i', 'bi bi-send-fill');
  sendIcon.setAttribute('aria-hidden', 'true');
  sendButton.append(sendIcon);
  form.append(input, sendButton);

  panel.append(header, messages, suggestionList, form);
  document.body.append(launcher, panel);

  function appendMessage(text, role, extraClass = '') {
    const message = createElement(
      'div',
      `ap-chat-message ap-chat-message-${role}${extraClass ? ` ${extraClass}` : ''}`,
      text
    );
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function setBusy(isBusy) {
    requestInProgress = isBusy;
    input.disabled = isBusy;
    sendButton.disabled = isBusy;
    suggestionList.querySelectorAll('button').forEach((button) => {
      button.disabled = isBusy;
    });
  }

  function openChat() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Cerrar el asistente de AgendaPro');
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir el asistente de AgendaPro');
    launcher.focus();
  }

  async function sendQuestion(question) {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion || requestInProgress) return;

    appendMessage(normalizedQuestion, 'user');
    input.value = '';
    setBusy(true);
    const thinkingMessage = appendMessage(
      'Pensando…',
      'assistant',
      'ap-chat-message-thinking'
    );

    try {
      const response = await fetch('/api/chat-agendapro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: normalizedQuestion })
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || typeof result?.answer !== 'string' || !result.answer.trim()) {
        throw new Error('Chat request failed');
      }

      thinkingMessage.classList.remove('ap-chat-message-thinking');
      thinkingMessage.textContent = result.answer.trim();
    } catch {
      thinkingMessage.classList.remove('ap-chat-message-thinking');
      thinkingMessage.textContent = errorMessage;
    } finally {
      setBusy(false);
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }

  suggestions.forEach((question) => {
    const button = createElement('button', 'ap-chat-suggestion', question);
    button.type = 'button';
    button.addEventListener('click', () => sendQuestion(question));
    suggestionList.append(button);
  });

  appendMessage(welcomeMessage, 'assistant');

  launcher.addEventListener('click', () => {
    if (panel.hidden) openChat();
    else closeChat();
  });
  closeButton.addEventListener('click', closeChat);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendQuestion(input.value);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closeChat();
  });
})();
