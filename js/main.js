const 
    shadowBtns = document.querySelectorAll('.shadow'),
    setGameBox = document.querySelector('.game-set-box'),
    wrapper = document.querySelector('.wrapper'),
    playerCounters = document.querySelectorAll('input[readonly]'),
    request = new XMLHttpRequest()

request.open('GET', 'https://daniel-developer5.github.io/spy-game/locations.json')
request.responseType = 'json'
request.send()

let locations, random

request.addEventListener('load', e => {
    locations = e.target.response.locations
})

function randomLocation(arr) {
    return arr[random]
}

shadowBtns.forEach((elem, index) => {
    elem.addEventListener('click', createShadow)

    if (elem.nodeName === 'BUTTON') {
        elem.moreData = {
            index: index
        }
        index <= 2 ? elem.moreData.min = 3 : elem.moreData.min = 1

        elem.addEventListener('click', changeBtnEvent)
    }
})

function createShadow(e) {
    const shadow = document.createElement('span') 
    this.appendChild(shadow)
    shadow.style.left = `${e.clientX - this.getBoundingClientRect().left - shadow.offsetWidth / 2}px`
    setTimeout(() => {
        shadow.style.transform = 'scaleX(15)'
        setTimeout(() => {
            shadow.remove()
            
            if (this.className.match(/start-btn/)) {
                setGameBox.classList.add('open')
                random = Math.floor(Math.random() * locations.length)
            } 
        }, 300)
    }, 1)
}

wrapper.addEventListener('click', e => {
    if (e.target.className != 'start-btn') {
        setGameBox.classList.remove('open')
    }
})

function changeBtnEvent() {
    if (this.moreData.index <= 2) {
        changeValue(0, this.moreData.index)
    } else {
        changeValue(1, this.moreData.index)
    } 
}

function changeValue(i, btnI) {
    playerCounters[i].value = +playerCounters[i].value + +shadowBtns[btnI].textContent
    
    if (+playerCounters[i].value === shadowBtns[btnI].moreData.min - 1) {
        playerCounters[i].value = +playerCounters[i].value + 1
    } 
    
    if (+playerCounters[1].value === +playerCounters[0].value) {
        playerCounters[1].value = +playerCounters[0].value - 1
    }
}

const 
    cardList = document.querySelector('.card-list'),
    cardHTML = `
        <div>
            <img src="img/card.jpg" alt="show card"/>
            <span></span>
        </div>
    `

shadowBtns[shadowBtns.length - 1].addEventListener('click', () => {
    shadowBtns[0].classList.add('close')
    cardList.classList.add('open')
    setGameBox.classList.remove('open')

    let spy

    if (+playerCounters[1].value > 1) {
        spy = new Set()

        while (spy.size < +playerCounters[1].value) {
            spy.add(Math.floor(Math.random() * +playerCounters[0].value))
        }
    } else {
        spy = Math.floor(Math.random() * +playerCounters[0].value)
    }

    for (let i = 0; i < +playerCounters[0].value; i++) {
        cardList.innerHTML += `<li>${cardHTML}</li>`
    }
    
    if (typeof(spy) === 'object') {
        for (let i = 0; i < cardList.children.length; i++) {
            spy.forEach(elem => {
                if (i === elem) {
                    cardList.children[i].isSpy = true
                }
            })
        }
    } else {
        cardList.children[spy].isSpy = true
    }

    for (let i = 0; i < cardList.children.length; i++) {
        cardList.children[i].addEventListener('click', showCard)
        cardList.children[i].children[0].children[1].textContent = 
        cardList.children[i].index = i + 1
    }
})

function showCard() {
    this.style.transform = 'rotateY(90deg)'
    this.style.transform = 'rotateY(180deg)'

    if (this.isSpy) {
        fillRotateCard(this, 'spy', 'Ты шпион')
    } else {
        fillRotateCard(this, 'grd-bg', randomLocation(locations))
    }

    dragCard(this)
}

function fillRotateCard(elem, className, text) {
    elem.classList.add(className)
    elem.children[0].innerHTML = `
        <p>Игрок ${elem.index}</p>
        <p>${text}</p>
    `
}

function dragCard(elem) {
    let hammer = new Hammer(elem)
    let position = []

    hammer.on('pan', e => {
        position = []

        elem.classList.add('no-transition')
        elem.classList.add('grab')
        elem.style.left = `${e.deltaX + elem.offsetWidth / 1.2}px`
        elem.style.top = `${e.deltaY + elem.offsetHeight / 4}px`

        position.push(
            elem.getBoundingClientRect().x,
            elem.getBoundingClientRect().y 
        )
    })

    hammer.on('panend', () => {
        elem.classList.remove('grab')
        elem.classList.remove('no-transition')

        if (position[0] <= 0 ) { 
            removeCard(elem, -elem.offsetWidth, 'X')
        } else if (position[0] >= window.innerWidth / 2) {
            removeCard(elem, elem.offsetWidth, 'X')
        } else if (position[1] <= 0) {
            removeCard(elem, -elem.offsetHeight, 'Y')
        } else if (position[1] >= window.innerHeight / 3) {
            removeCard(elem, elem.offsetHeight, 'Y')
        } else {
            elem.style.removeProperty('top')
            elem.style.removeProperty('left')
        }
    })
}

function removeCard(card, value, axis) {
    card.style.transform = `translate${axis}(${value}px)`

    setTimeout(() => {
        card.remove()

        if (!cardList.children.length) {
            shadowBtns[0].classList.remove('close')
            cardList.classList.remove('open')
            shadowBtns[0].textContent = 'завершить игру'
            shadowBtns[0].addEventListener('click', gameEnd)
        }
    }, 500)
}

function gameEnd() {
    shadowBtns[0].removeEventListener('click', gameEnd)
    shadowBtns[0].textContent = 'новая игра'
}