// =========================================================
// WebDev Registration App
// Vanilla JS: DOM selection, form validation, member list,
// counter, success message, and dark mode toggle.
// =========================================================

// ---- A. DOM element references ----
const form = document.getElementById('regform');

const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirmPassword: document.getElementById('confirm-password'),
  gender: document.getElementById('gender'),
  dob: document.getElementById('dob'),
  country: document.getElementById('country'),
  phone: document.getElementById('phone'),
  bio: document.getElementById('bio'),
};

const errors = {
  name: document.getElementById('nameError'),
  email: document.getElementById('emailError'),
  password: document.getElementById('passwordError'),
  confirmPassword: document.getElementById('confirmError'),
  gender: document.getElementById('genderError'),
  dob: document.getElementById('dobError'),
  country: document.getElementById('countryError'),
  phone: document.getElementById('phoneError'),
  bio: document.getElementById('bioError'),
};

const successMsg = document.getElementById('successMsg');
const memberList = document.getElementById('memberList');
const countEl = document.getElementById('count');
const themeBtn = document.getElementById('theme');

// Log what was found so the student can verify every element exists.
// (No field values are logged, only whether the reference was found.)
console.log('--- DOM reference check ---');
console.log('form:', Boolean(form));
Object.keys(fields).forEach((key) => {
  console.log(`field "${key}":`, Boolean(fields[key]), '| error element:', Boolean(errors[key]));
});
console.log('successMsg:', Boolean(successMsg));
console.log('memberList:', Boolean(memberList));
console.log('count:', Boolean(countEl));
console.log('theme button:', Boolean(themeBtn));

// ---- C. Validation helpers ----

function isValidEmail(value) {
  // Simple, practical email pattern: text@text.text
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  // Allow an optional leading +, digits, spaces, and dashes.
  // Require between 7 and 15 actual digits (a sensible phone number length).
  const shapeOk = /^[+]?[\d\s-]{7,20}$/.test(value);
  const digitCount = value.replace(/\D/g, '').length;
  return shapeOk && digitCount >= 7 && digitCount <= 15;
}

// Shows/clears an error message and toggles the .invalid style on the field.
function setError(key, message) {
  errors[key].textContent = message;
  fields[key].classList.toggle('invalid', Boolean(message));
  fields[key].setAttribute('aria-invalid', Boolean(message));
}

// Validates one field by key, updates its error UI, and returns true/false.
function validateField(key) {
  const el = fields[key];
  const value = el.value.trim();
  let message = '';

  switch (key) {
    case 'name':
      if (!value) message = 'Full name is required.';
      else if (value.length < 2) message = 'Name must be at least 2 characters.';
      break;

    case 'email':
      if (!value) message = 'Email is required.';
      else if (!isValidEmail(value)) message = 'Enter a valid email address.';
      break;

    case 'password':
      if (!value) message = 'Password is required.';
      else if (value.length < 6) message = 'Password must be at least 6 characters.';
      break;

    case 'confirmPassword':
      if (!value) message = 'Please confirm your password.';
      else if (value !== fields.password.value.trim()) message = 'Passwords do not match.';
      break;

    case 'gender':
      if (!value) message = 'Please select a gender.';
      break;

    case 'dob':
      if (!value) message = 'Date of birth is required.';
      else if (new Date(value) > new Date()) message = 'Date of birth cannot be in the future.';
      break;

    case 'country':
      if (!value) message = 'Country is required.';
      break;

    case 'phone':
      if (!value) message = 'Phone number is required.';
      else if (!isValidPhone(value)) message = 'Enter a valid phone number (7-15 digits).';
      break;

    case 'bio':
      // Bio is optional, just keep it a reasonable length.
      if (value.length > 500) message = 'Bio must be under 500 characters.';
      break;

    default:
      break;
  }

  setError(key, message);
  return !message;
}

// ---- Real-time validation: revalidate as the user types/changes a value ----
Object.keys(fields).forEach((key) => {
  const el = fields[key];
  const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(eventType, () => validateField(key));
});

// Confirm Password depends on Password, so re-check the match when the
// password itself changes (only if the user already typed a confirmation).
fields.password.addEventListener('input', () => {
  if (fields.confirmPassword.value) validateField('confirmPassword');
});

// ---- F. Success message helpers ----
function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.remove('hidden');
}

function hideSuccess() {
  successMsg.textContent = '';
  successMsg.classList.add('hidden');
}

// ---- E. Member counter + empty-state handling ----
function updateCount() {
  const total = memberList.querySelectorAll('.member-item').length;
  countEl.textContent = total;

  // Show/hide the "No members yet" note based on whether any members exist.
  let note = document.getElementById('emptyNote');
  if (total === 0 && !note) {
    note = document.createElement('li');
    note.className = 'empty';
    note.id = 'emptyNote';
    note.textContent = 'No members yet. Register someone to begin.';
    memberList.appendChild(note);
  } else if (total > 0 && note) {
    note.remove();
  }
}

// ---- D. Register a member ----
function addMemberToList(member) {
  const li = document.createElement('li');
  li.className = 'member-item';

  const info = document.createElement('div');
  info.className = 'info';

  const nameEl = document.createElement('strong');
  nameEl.textContent = member.name;

  const detailsEl = document.createElement('span');
  detailsEl.textContent = `${member.email} • ${member.gender} • ${member.country}`;

  info.append(nameEl, detailsEl);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove';
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    li.remove();
    updateCount();
  });

  li.append(info, removeBtn);
  memberList.appendChild(li);
  updateCount();
}

function resetForm() {
  form.reset();
  Object.keys(fields).forEach((key) => setError(key, ''));
}

function registerMember() {
  const member = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    gender: fields.gender.value,
    dob: fields.dob.value,
    country: fields.country.value.trim(),
    phone: fields.phone.value.trim(),
    bio: fields.bio.value.trim(),
  };

  addMemberToList(member);
  resetForm();
  showSuccess(`${member.name} has been registered successfully!`);
}

// ---- B. Form submission ----
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Clear any success message left over from a previous submission.
  hideSuccess();

  // Validate every field; collect results so all errors show at once.
  const allValid = Object.keys(fields)
    .map((key) => validateField(key))
    .every(Boolean);

  if (!allValid) return;

  registerMember();
});

// ---- G. Dark Mode toggle ----
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  themeBtn.setAttribute('aria-pressed', String(isDark));
});

// ---- Initialize counter/empty-state on page load ----
updateCount();
