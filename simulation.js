(() => {
  const sim = document.querySelector('[data-simulation]')
  if (!sim) return

  const steps = [
    { title: 'The client registers with DNS', detail: 'acm-app → acm-dns · 10.0.0.4', from: 'client', to: 'dns', verb: 'POST /register', d: 'M132 180 L300 65', done: ['client', 'dns'] },
    { title: 'The server registers with DNS', detail: 'acm-server → acm-dns · 10.0.0.5', from: 'server', to: 'dns', verb: 'POST /register', d: 'M468 180 L300 65', done: ['server', 'dns'] },
    { title: 'The database registers with DNS', detail: 'acm-db → acm-dns · 10.0.0.6', from: 'db', to: 'dns', verb: 'POST /register', d: 'M300 295 L300 65', done: ['db', 'dns'] },
    { title: 'The client asks for the server', detail: 'acm-app → acm-dns · domain: acm-server', from: 'client', to: 'dns', verb: 'GET /lookup', d: 'M132 180 L300 65', done: ['client', 'dns'] },
    { title: 'DNS returns the server address', detail: '10.0.0.5 → acm-app · lookup complete', from: 'dns', to: 'client', verb: '10.0.0.5', d: 'M300 65 L132 180', done: ['client', 'dns'] },
    { title: 'The client contacts the server', detail: 'acm-app → acm-server · POST /login', from: 'client', to: 'server', verb: 'POST /login', d: 'M132 180 L468 180', done: ['client', 'server'] },
    { title: 'The server asks DNS for the database', detail: 'acm-server → acm-dns · domain: acm-db', from: 'server', to: 'dns', verb: 'GET /lookup', d: 'M468 180 L300 65', done: ['server', 'dns'] },
    { title: 'DNS returns the database address', detail: '10.0.0.6 → acm-server · lookup complete', from: 'dns', to: 'server', verb: '10.0.0.6', d: 'M300 65 L468 180', done: ['server', 'dns'] },
    { title: 'The server requests the user record', detail: 'acm-server → acm-db · GET /db/users/alex', from: 'server', to: 'db', verb: 'GET /db/users/alex', d: 'M468 180 L300 295', done: ['server', 'db'] },
    { title: 'The database returns the record', detail: 'acm-db → acm-server · user record + password hash', from: 'db', to: 'server', verb: '200 · user record', d: 'M300 295 L468 180', done: ['server', 'db'] },
    { title: 'The server validates. The client succeeds.', detail: 'Credentials match · session cookie set · flow complete', from: 'server', to: 'client', verb: '200 · authenticated', d: 'M468 180 L132 180', done: ['server', 'client'], success: true },
  ]

  const playButton = sim.querySelector('.sim-play')
  const replayButton = sim.querySelector('.sim-replay')
  const packet = sim.querySelector('.flow-packet')
  const activeWire = sim.querySelector('.active-wire')
  const toast = sim.querySelector('.map-toast')
  const event = sim.querySelector('.sim-event')
  const eventTitle = event.querySelector('strong')
  const eventDetail = event.querySelector('p')
  const count = sim.querySelector('.step-count')
  const progress = sim.querySelector('.progress-track i')
  const rail = [...sim.querySelectorAll('.step-rail li')]
  const nodes = Object.fromEntries([...sim.querySelectorAll('[data-node]')].map(node => [node.dataset.node, node]))
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const remembered = new Set()
  const stepDuration = 1900
  let current = -1
  let timer = null
  let running = false
  let toastTimer = null

  function showStep(index) {
    current = index
    const step = steps[index]
    const from = nodes[step.from]
    const to = nodes[step.to]
    const map = sim.querySelector('.network-map')
    const mapBox = map.getBoundingClientRect()
    const fromBox = from.getBoundingClientRect()
    const toBox = to.getBoundingClientRect()
    const center = el => ({
      x: ((el.left + el.width / 2 - mapBox.left) / mapBox.width) * 100,
      y: ((el.top + el.height / 2 - mapBox.top) / mapBox.height) * 100,
    })
    const start = center(from)
    const end = center(to)
    packet.style.setProperty('--packet-rotation', `${Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)}deg`)

    Object.values(nodes).forEach(node => {
      node.classList.remove('is-active', 'is-success')
      node.classList.toggle('is-complete', remembered.has(node.dataset.node))
    })
    from.classList.add('is-active')
    to.classList.add('is-active')
    packet.style.left = `${start.x}%`
    packet.style.top = `${start.y}%`
    activeWire.setAttribute('d', step.d)
    toast.textContent = step.verb
    toast.classList.remove('show')
    window.clearTimeout(toastTimer)
    requestAnimationFrame(() => {
      packet.style.left = `${end.x}%`
      packet.style.top = `${end.y}%`
      toast.classList.add('show')
    })

    event.classList.toggle('is-success', Boolean(step.success))
    eventTitle.textContent = step.title
    eventDetail.textContent = step.detail
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${steps.length} · ${step.success ? 'Complete' : 'In progress'}`
    progress.style.width = `${((index + 1) / steps.length) * 100}%`
    rail.forEach((item, i) => {
      item.classList.toggle('is-done', i < index)
      item.classList.toggle('is-current', i === index)
    })
    step.done.forEach(name => {
      remembered.add(name)
      nodes[name].querySelector('.node-state').textContent = '✓'
    })
    if (step.success) {
      nodes.client.classList.add('is-success')
      nodes.client.querySelector('.node-state').textContent = '✓'
    }
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1200)
  }

  function finish() {
    running = false
    window.clearTimeout(timer)
    sim.classList.remove('is-running')
    sim.classList.add('is-done')
    playButton.textContent = 'Flow complete'
    playButton.disabled = true
    replayButton.disabled = false
  }

  function advance() {
    if (!running) return
    const next = current + 1
    if (next >= steps.length) return finish()
    showStep(next)
    timer = window.setTimeout(advance, stepDuration)
  }

  function start() {
    if (running || sim.classList.contains('is-done')) return
    running = true
    sim.classList.add('is-running')
    sim.classList.remove('is-done')
    playButton.textContent = 'Pause flow'
    playButton.disabled = false
    replayButton.disabled = true
    advance()
  }

  function pause() {
    running = false
    window.clearTimeout(timer)
    sim.classList.remove('is-running')
    playButton.textContent = 'Resume flow'
    replayButton.disabled = false
  }

  playButton.addEventListener('click', () => running ? pause() : start())
  replayButton.addEventListener('click', () => {
    window.clearTimeout(timer)
    window.clearTimeout(toastTimer)
    running = false
    current = -1
    remembered.clear()
    sim.classList.remove('is-running', 'is-done')
    Object.values(nodes).forEach(node => {
      node.classList.remove('is-active', 'is-complete', 'is-success')
      node.querySelector('.node-state').textContent = ''
    })
    packet.style.left = '22%'
    packet.style.top = '50%'
    packet.style.opacity = '0'
    toast.classList.remove('show')
    activeWire.setAttribute('d', 'M132 180 L300 65')
    event.classList.remove('is-success')
    eventTitle.textContent = 'Ready to run it again'
    eventDetail.textContent = 'Watch the services register, discover one another, and complete the request.'
    count.textContent = 'Ready to begin'
    progress.style.width = '0%'
    rail.forEach(item => item.classList.remove('is-done', 'is-current'))
    playButton.textContent = 'Play flow'
    playButton.disabled = false
    replayButton.disabled = true
    requestAnimationFrame(() => {
      packet.style.opacity = ''
      start()
    })
  })

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect()
        window.setTimeout(start, 550)
      }
    }, { threshold: 0.35 })
    observer.observe(sim)
  }
})()
