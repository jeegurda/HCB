import * as dom from './dom'

import './css/fonts.css'
import './css/animations.css'
import './css/index.css'
import './css/mobile.css'

const deltaTreshold = 200
const r = 262
const fullArcLength = Math.PI * r
const shapeParams = [
  [ // left shape
    {
      part: 0.35,
      width: 45
    },
    {
      part: 0.25,
      width: 50
    }
  ],
  [ // right shape,
    {
      part: 0.75,
      width: 45
    },
    {
      part: 0.65,
      width: 50
    }
  ]
]
const steps = [
  'initial',
  'welcome',
  'main',
  'order',
  'call'
]

const cards = [0, 1]

let cardId = null

const _setPageClass = step => {
  dom.page.classList.remove(...steps.map(s => `step-${s}`))
  dom.page.classList.add(`step-${steps[step]}`)
}

const _setCircleClass = step => {
  dom.circleContainer.classList.remove(...steps.map(s => `back__circle-container_step_${s}`))
  dom.circleContainer.classList.add(`back__circle-container_step_${steps[step]}`)
}

const changeCard = id => {
  if (id === cardId) {
    return
  }

  cardId = id

  const el = dom.cardItems[cardId]

  dom.cardItems.forEach(ci => ci.classList.remove('main__card-item_active'))
  el.classList.add('main__card-item_active')

  dom.cardImages.forEach(group => group.forEach(ci => ci.classList.remove('card-image_active')))
  dom.cardImages.forEach(group => group.forEach((ci, i) => i === cardId && ci.classList.add('card-image_active')))

  dom.main.classList.remove(...cards.map(c => `main_active-card_${c}`))
  dom.main.classList.add(`main_active-card_${cardId}`)
}

const changeStep = (step = 0) => {
  _setPageClass(step)
  _setCircleClass(step)
}

const setShapes = () => {
  shapeParams.forEach((sp, id) => {
    const part = sp[cardId].part
    const width = sp[cardId].width

    const arcLength = fullArcLength * part

    dom.shapes[id].style.strokeDasharray = `${arcLength} 10000`
    dom.shapes[id].style.strokeDashoffset = -(fullArcLength - arcLength) / 2
    dom.shapes[id].style.strokeWidth = width
  })
}

let scrollLocked = true
const _addScrollEvent = () => {
  let totalDelta = 0
  let timeout

  document.body.addEventListener('wheel', e => {
    if (scrollLocked) {
      return
    }

    e.preventDefault()

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      totalDelta = 0
    }, 1000)

    totalDelta += e.deltaY
    if (totalDelta > deltaTreshold) {
      changeStep(2)
      scrollLocked = true
    }
  })
}

const addEvents = () => {
  dom.welcomeFooter.addEventListener('click', () => {
    if (scrollLocked) {
      return
    }
    changeStep(2)
  })

  dom.cardItems.forEach(ci => ci.addEventListener('click', e => {
    changeCard(Number(e.currentTarget.dataset.id))
    setShapes()
  }))

  dom.cardImageContainer.addEventListener('mouseenter', () => {
    dom.main.classList.add(`main_card-hover`)
  })
  dom.cardImageContainer.addEventListener('mouseleave', () => {
    dom.main.classList.remove(`main_card-hover`)
  })

  dom.orderButton.addEventListener('click', () => {
    changeStep(3)
  })
  dom.orderHide.addEventListener('click', () => {
    changeStep(2)
  })

  dom.orderCall.addEventListener('click', () => {
    changeStep(4)
  })
  dom.callHide.addEventListener('click', () => {
    changeStep(2)
  })

  _addScrollEvent()
}

class Line {
  constructor (props) {
    let line = document.createElement('span')
    line.style.transform = `rotate(${props.rotate}deg) translateY(0px)`
    line.classList.add('call__line')
    ;['top', 'left'].forEach(side => {
      line.style[side] = `calc(${props[side][0]}% + ${props[side][1]}px)`
    })

    let lineInner = document.createElement('span')
    lineInner.classList.add('call__line-inner')
    line.appendChild(lineInner)

    return line
  }
}

const angle = 30
const offset = 15

const lines = [{
  rotate: 180,
  top: [0, -offset],
  left: [50, 0]
}, {
  rotate: 210,
  top: [0, -offset],
  left: [100, -offset]
}, {
  rotate: -90,
  top: [50, 0],
  left: [100, offset]
}, {
  rotate: -angle,
  top: [100, offset],
  left: [100, -offset]
}, {
  rotate: 0,
  top: [100, offset],
  left: [50, 0]
}, {
  rotate: 30,
  top: [100, offset],
  left: [0, offset]
}, {
  rotate: 90,
  top: [50, 0],
  left: [0, -offset]
}, {
  rotate: 180 - angle,
  top: [0, -offset],
  left: [0, offset]
}]

const addLines = () => {
  lines.forEach(line => {
    dom.callLines.appendChild(new Line(line))
  })
}

const load = () => {
  addEvents()
  changeStep(0)

  changeCard(0)
  setShapes()

  addLines()

  setTimeout(() => {
    changeStep(1)
    scrollLocked = false
  }, 4000)
}

window.onload = load

// DEV

window.setShapes = setShapes
window.changeStep = changeStep
