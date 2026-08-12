//#region Dropdown Menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.querySelector('.HamburgerBtn')
  const navMenu = document.querySelector('.GlobalHeaderMenu')
  const footer = document.querySelector('footer')
  const header = document.querySelector('header')
  const body = document.body

  const setHeaderHeight = () => {
    document.documentElement.style.setProperty(
      '--header-height',
      `${header.getBoundingClientRect().height}px`,
    )
  }
  setHeaderHeight()
  window.addEventListener('resize', setHeaderHeight)

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-active')
      hamburgerBtn.classList.toggle('is-active')
      body.classList.toggle('menu-open')
      document.documentElement.classList.toggle('menu-open')

      if (isOpen) {
        navMenu.appendChild(footer)
      } else {
        body.appendChild(footer)
      }

      hamburgerBtn.setAttribute('aria-expanded', isOpen)
    })
  }
})
//#endregion Dropdown Menu

//#region Breadcrumb
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('breadcrumb-container')
  if (!container) return

  const cameFrom = document.referrer.toLowerCase()
  let parentStr = ''
  let urlStr = ''

  if (cameFrom.includes('sale.html')) {
    parentStr = 'Sale'
    urlStr = '/sale.html'
  } else {
    parentStr = 'Shop'
    urlStr = '/shop.html'
  }

  const parents = parentStr.split(',')
  const urls = urlStr.split(',')
  const current = container.dataset.breadcrumbCurrent || 'Product'

  let html = '<a href="/index.html">Home</a>'

  parents.forEach((parentName, index) => {
    const url = urls[index] || '#'
    html += ` &gt; <a href="${url}">${parentName.trim()}</a>`
  })

  html += ` &gt; <span>${current}</span>`

  container.innerHTML = html
})
//#endregion Breadcrumb

//#region Contact Form Submission
const form = document.querySelector(`#mock-contact-form`)

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = {
    fullName: form.querySelector('input[name = "full-name"]').value,
    email: form.querySelector('input[name = "email"]').value,
    subject: form.querySelector('input[name = "subject"]').value,
    message: form.querySelector('textarea[name = "message"]').value,
  }

  const response = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  if (response.ok) {
    alert('Your response has been saved successfully!')
    form.reset()
  } else {
    alert('Something went wrong sending your message.')
  }
})

const tx = document.getElementById('message')
tx.addEventListener('input', function () {
  this.style.height = 'auto'
  this.style.height = this.scrollHeight + 'px'
})
//#endregion Contact Form Submission
