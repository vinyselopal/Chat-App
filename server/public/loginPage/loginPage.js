async function loginHandler () {
  const userName = document.getElementById('userName').value
  const password = document.getElementById('password').value
  const response = await fetch('http://localhost:8000/api/login',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userName, password })
    })

  const creds = await response.json()
  console.log(creds)
  if (response.status === 200) {
    window.location.href = `http://localhost:8000/static/room/?user_id=${creds.user_id}&user_name=${creds.user_name}`
  } else {
    document.querySelector('body').innerHTML = creds
  }
}
