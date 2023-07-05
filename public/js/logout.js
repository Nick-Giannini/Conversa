const logout = async () => {
    const response = await fetch('/api/logoutRoutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  };
  
  document
  .querySelector('#logoutBtn')
  .addEventListener('click', logout);