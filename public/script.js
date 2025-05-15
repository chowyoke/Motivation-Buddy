document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const startDate = document.getElementById('start-date').value;
  const messageTime = document.getElementById('message-time').value;
  const validationMsg = document.getElementById('formValidationMsg');

  // Client-side validation
  const phonePattern = /^[89][0-9]{7}$/;
  if (!name) {
    validationMsg.textContent = 'Please enter your name.';
    return;
  }
  if (!phonePattern.test(phone)) {
    validationMsg.textContent = 'Please enter a valid 8-digit mobile number starting with 8 or 9.';
    return;
  }
  if (!startDate) {
    validationMsg.textContent = 'Please select a start date.';
    return;
  }
  if (!messageTime) {
    validationMsg.textContent = 'Please select a time to receive your message.';
    return;
  }

  // Prepare data to send
  const formData = {
    name: name,
    phone: phone,
    start_date: startDate,
    message_time: messageTime
  };

  try {
    // Send data to your backend (replace '/subscribe' with your actual endpoint)
    const response = await fetch('/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      validationMsg.style.color = 'green';
      validationMsg.textContent = 'Subscription successful!';
      // Optionally, reset the form
      document.getElementById('signup-form').reset();
    } else {
      validationMsg.style.color = '#d9534f';
      validationMsg.textContent = 'Subscription failed. Please try again.';
    }
  } catch (error) {
    validationMsg.style.color = '#d9534f';
    validationMsg.textContent = 'An error occurred. Please try again.';
  }
});