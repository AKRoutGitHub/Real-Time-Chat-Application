document.addEventListener('DOMContentLoaded', () => {
  // Add animated entrance for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      // Trigger reflow
      card.offsetHeight;
      
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + (index * 150));
  });
  
  // Form validation
  const joinForm = document.querySelector('.join-form');
  
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      const username = document.getElementById('username').value.trim();
      
      if (!username) {
        e.preventDefault();
        alert('Please enter a username');
        return;
      }
      
      // Store the last used username in localStorage
      localStorage.setItem('lastUsername', username);
      
      // Continue with form submission
    });
    
    // Restore last username if available
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
      document.getElementById('username').value = lastUsername;
    }
  }
  
  // Add smooth transition when submitting the form
  document.querySelector('.join-form').addEventListener('submit', function(e) {
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
          this.submit();
      }, 300);
  });
  
  // Add fade-in effect when page loads
  document.addEventListener('DOMContentLoaded', function() {
      document.body.style.opacity = 0;
      setTimeout(() => {
          document.body.style.opacity = 1;
      }, 100);
  });
});