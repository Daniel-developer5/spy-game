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

    this.addEventListener('mousedown', makeDownTrue)
    this.addEventListener('touchstart', makeDownTrue)
    dragCard(this)
}

function fillRotateCard(elem, className, text) {
    elem.classList.add(className)
    elem.children[0].innerHTML = `
        <p>Игрок ${elem.index}</p>
        <p>${text}</p>
    `
}

let isMouseDown = false

document.addEventListener('mouseup', makeDownFalse)
document.addEventListener('touchend', makeDownFalse)

function makeDownTrue() {
    isMouseDown = true
}
function makeDownFalse() {
    isMouseDown = false
}

function dragCardProcess(e) {
    elem.style.left = `${e.clientX - elem.offsetWidth / 2}px`
    elem.style.top = `${e.clientY - elem.offsetHeight / 2}px`
}

let position

function dragCard(elem) {
    document.addEventListener('mousemove', dragCardProcess)
    document.addEventListener('touchmove', dragCardProcess)

    function dragCardProcess(e) {
        if (isMouseDown) {
            position = []

            elem.style.cursor = 'grabbing'
            elem.style.left = `${e.clientX - elem.offsetWidth / 2}px`
            elem.style.top = `${e.clientY - elem.offsetHeight / 2}px`
            
            position.push(
                elem.getBoundingClientRect().x,
                elem.getBoundingClientRect().y 
            )

            if (position[0] <= 0 ) { 
                removeCard(elem, -elem.offsetWidth, 'X')
            } else if (position[0] >= window.innerWidth / 2) {
                removeCard(elem, elem.offsetWidth, 'X')
            } else if (position[1] <= 0) {
                removeCard(elem, -elem.offsetHeight, 'Y')
            } else if (position[1] >= window.innerHeight / 3) {
                removeCard(elem, elem.offsetHeight, 'Y')
            }
        } else {
            elem.style.cursor = 'default'
        } 
    }
}

function removeCard(card, value, axis) {
    card.style.transform = `translate${axis}(${value}px)`
    setTimeout(() => {
        card.remove()

        if (!cardList.children.length) {
            shadowBtns[0].classList.remove('close')
            cardList.classList.remove('open')
            shadowBtns[0].textContent = 'завершить игру'
            shadowBtns[0].addEventListener('click', gameEnd, { once: true })
        }
    }, 500)
}

function gameEnd() {
    shadowBtns[0].textContent = 'новая игра'
}