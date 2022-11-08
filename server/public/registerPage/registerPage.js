async function registrationHandler (event) {
  const userName = document.getElementById('userName').value
  const password = document.getElementById('password').value
  console.log(userName, password)
  const response = await fetch(
    'http://localhost:8000/api/register',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userName, password })
    }
  )
console.log(response)
  const message = await response.json()
  if (response.ok) window.location.href = 'http://localhost:8000/static/login_page'
  else {
    document.querySelector('body').innerHTML = message
  }
}
