document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
  const messageTime1 = document.getElementById('message-time1').value;
  const messageTime2 = document.getElementById('message-time2').value;
  const messageTime3 = document.getElementById('message-time3').value;
  const validationMsg = document.getElementById('formValidationMsg');
  const signupCodeBox = document.getElementById('signupCodeBox');

  // Clear previous message at the start
  validationMsg.textContent = '';
  validationMsg.classList.remove('active');
  signupCodeBox.innerHTML = '';

  // Collect non-empty times into an array
  const messageTimes = [messageTime1, messageTime2, messageTime3].filter(Boolean);

  // Client-side validation
  
  if (!name) {
    validationMsg.textContent = 'Please enter your name.';
    validationMsg.classList.add('active');
    return;
  }

if (messageTimes.length === 0) {
  validationMsg.textContent = 'Please select at least one timing to receive your message.';
  validationMsg.classList.add('active');
  return;
}

  // Prepare data to send
  const formData = {
    name: name,
    interests: interests,
    message_times: messageTimes   // <-- send as array
  };

  try {
    // Send data to your backend (replace '/subscribe' with your actual endpoint)
    const response = await fetch('/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) // <-- sends message_times as array
    });

    if (response.ok) {
      const data = await response.json();
      validationMsg.style.color = 'green';
      validationMsg.textContent = data.msg;
      validationMsg.classList.add('active');
      document.getElementById('signup-form').reset();

      // Show the code and Telegram link
      if (data.signup_code) {
        signupCodeBox.innerHTML = `
          <div class="server-msg" style="margin-top:10px;text-align:center;">
            <strong>Your unique code:</strong>
            <div style="font-size:1.6em; margin:10px 0; color:#a9446e;">${data.signup_code}</div>
            <div>
              <a href="https://t.me/MyMotivationBuddy_Bot" target="_blank" style="color:#2a7ae2;">Click here to open the Telegram bot</a><br>
              and send the code above to complete your registration.
            </div>
          </div>
        `;
      } else {
        signupCodeBox.innerHTML = '';
      }
    } else {
      // Try to parse the actual error message from the server
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      validationMsg.style.color = '#d9534f';
      validationMsg.textContent = data.msg || 'Subscription failed. Please try again.';
      validationMsg.classList.add('active');
      signupCodeBox.innerHTML = '';
    }
  } catch (error) {
    validationMsg.style.color = '#d9534f';
    validationMsg.textContent = 'An error occurred. Please try again.';
    validationMsg.classList.add('active');
    signupCodeBox.innerHTML = '';
  }
});