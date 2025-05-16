document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
  const messageTime1 = document.getElementById('message-time1').value;
  const messageTime2 = document.getElementById('message-time2').value;
  const messageTime3 = document.getElementById('message-time3').value;
  const validationMsg = document.getElementById('formValidationMsg');

  // Clear previous message at the start
  validationMsg.textContent = '';
  validationMsg.classList.remove('active');

  // Collect non-empty times into an array
  const messageTimes = [messageTime1, messageTime2, messageTime3].filter(Boolean);

  // Client-side validation
  const phonePattern = /^[89][0-9]{7}$/;
  if (!name) {
    validationMsg.textContent = 'Please enter your name.';
    validationMsg.classList.add('active');
    return;
  }
  if (!phonePattern.test(phone)) {
    validationMsg.textContent = 'Please enter a valid 8-digit mobile number starting with 8 or 9.';
    validationMsg.classList.add('active');
    return;
  }

if (messageTimes.length === 0) {
  validationMsg.textContent = 'Please select at least one time to receive your message.';
  validationMsg.classList.add('active');
  return;
}

  // Prepare data to send
  const formData = {
    name: name,
    phone: phone,
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
      validationMsg.style.color = 'green';
      validationMsg.textContent = 'Subscription successful!';
      validationMsg.classList.add('active');
      // Optionally, reset the form
      document.getElementById('signup-form').reset();
    } else {
      validationMsg.style.color = '#d9534f';
      validationMsg.textContent = 'Subscription failed. Please try again.';
      validationMsg.classList.add('active');
    }
  } catch (error) {
    validationMsg.style.color = '#d9534f';
    validationMsg.textContent = 'An error occurred. Please try again.';
    validationMsg.classList.add('active');
  }
});