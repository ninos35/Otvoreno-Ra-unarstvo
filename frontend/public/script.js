window.onload = function() {

    fetch('/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Set headers if needed
        },
        credentials: 'same-origin'  // Include cookies for session-based authentication (if needed)
      })
      .then(response=>{
        if(!response.ok){
            document.getElementById("profilelink").style.display="none"
            document.getElementById("logoutlink").style.display="none"
            document.getElementById("refreshlink").style.display="none"
            document.getElementById("loginlink").style.display="inline"
        }
        else{
            document.getElementById("profilelink").style.display="inline"
            document.getElementById("logoutlink").style.display="inline"
            document.getElementById("refreshlink").style.display="inline"
            document.getElementById("loginlink").style.display="none"
            
        }
      })
    
       
}