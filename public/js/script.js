// Form validation
const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', (event) => {
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    // Validate form fields
    let isValid = true;
    for (const field in formValues) {
      if (formValues[field].trim() === '') {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      event.preventDefault();
      alert('Please fill in all fields');
    }
  });
});

// Password strength indicator
const passwordInputs = document.querySelectorAll('input[type="password"]');

passwordInputs.forEach(input => {
  input.addEventListener('input', () => {
    const passwordValue = input.value;
    const strength = calculatePasswordStrength(passwordValue);
    displayPasswordStrength(strength, input);
  });
});

function calculatePasswordStrength(password) {
  const strengthScores = {
    length: 0,
    uppercase: 0,
    lowercase: 0,
    numbers: 0,
    specialChars: 0
  };

  if (password.length >= 8) {
    strengthScores.length = 1;
  }

  const uppercaseRegex = /[A-Z]/;
  if (uppercaseRegex.test(password)) {
    strengthScores.uppercase = 1;
  }

  const lowercaseRegex = /[a-z]/;
  if (lowercaseRegex.test(password)) {
    strengthScores.lowercase = 1;
  }

  const numbersRegex = /\d/;
  if (numbersRegex.test(password)) {
    strengthScores.numbers = 1;
  }

  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (specialCharsRegex.test(password)) {
    strengthScores.specialChars = 1;
  }

  const strengthScore = Object.values(strengthScores).reduce((total, score) => total + score, 0);

  return strengthScore;
}

function displayPasswordStrength(strength, input) {
  const strengthIndicator = document.createElement('div');
  strengthIndicator.classList.add('strength-indicator');

  switch (strength) {
    case 0:
      strengthIndicator.textContent = 'Weak';
      strengthIndicator.classList.add('weak');
      break;
    case 1:
    case 2:
      strengthIndicator.textContent = 'Medium';
      strengthIndicator.classList.add('medium');
      break;
    case 3:
    case 4:
    case 5:
      strengthIndicator.textContent = 'Strong';
      strengthIndicator.classList.add('strong');
      break;
    default:
      break;
  }

  const parent = input.parentNode;
  if (parent.querySelector('.strength-indicator')) {
    parent.querySelector('.strength-indicator').remove();
  }
  parent.appendChild(strengthIndicator);
}