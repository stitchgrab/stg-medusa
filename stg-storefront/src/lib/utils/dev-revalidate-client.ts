export const triggerDevRevalidation = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const response = await fetch('/api/dev/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        console.log('✅ Development cache revalidated')
        // Force a page refresh to show updated data
        window.location.reload()
      } else {
        console.error('❌ Failed to revalidate cache')
      }
    } catch (error) {
      console.error('❌ Error triggering revalidation:', error)
    }
  }
}

export const addDevRevalidationButton = () => {
  if (process.env.NODE_ENV === 'development') {
    // Add a floating button for development
    const button = document.createElement('button')
    button.innerHTML = '🔄'
    button.title = 'Revalidate Cache (Dev Only)'
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 20px;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `

    button.addEventListener('click', triggerDevRevalidation)
    document.body.appendChild(button)
  }
} 