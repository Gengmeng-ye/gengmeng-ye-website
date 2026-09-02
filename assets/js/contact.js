/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message'),
      submitButton = contactForm.querySelector('[type="submit"]'),
      honeypot = contactForm.querySelector('[name="company_website"]')

const cooldownKey = 'gengmeng-contact-last-sent',
      cooldownMs = 60000

const showMessage = (message) => {
    contactMessage.textContent = message

    setTimeout(() => {
        contactMessage.textContent = ''
    }, 5000)
}

const setSending = (isSending) => {
    submitButton.disabled = isSending
    submitButton.textContent = isSending ? 'Sending...' : 'Send'
}

const sendEmail = (e) => {
    e.preventDefault()

    if (honeypot.value) {
        contactForm.reset()
        return
    }

    const captchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : ''

    if (!captchaResponse) {
        showMessage('Please complete the human verification first.')
        return
    }

    const lastSentAt = Number(localStorage.getItem(cooldownKey) || 0),
          remainingSeconds = Math.ceil((cooldownMs - (Date.now() - lastSentAt)) / 1000)

    if (remainingSeconds > 0) {
        showMessage(`Please wait ${remainingSeconds} seconds before sending another message.`)
        return
    }

    setSending(true)

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_b6swgum', 'template_pj1f9pc', '#contact-form', '4cHcNxeNSNFlOaDzs')
        .then(() => {
            localStorage.setItem(cooldownKey, Date.now().toString())
            showMessage("Message sent successfully ✅ Thanks for reaching out. I'll get back to you soon. :)")
            contactForm.reset()
            grecaptcha.reset()
        }, () => {
            showMessage('Message not sent. Please refresh the verification and try again. ❌')
            grecaptcha.reset()
        })
        .finally(() => {
            setSending(false)
        })
}

contactForm.addEventListener('submit', sendEmail)
