interface RouteObject {
    to: string
    current: string
    event: Event
}

interface LinkHistory {
    target: HTMLElement,
    previous_target: HTMLElement | null,
    text_before: Element | null,
    text_after: HTMLDivElement | null
}

enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

enum NavigationDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward'
}

let audio = null as AudioBuffer | null;
let link_history = [] as LinkHistory[];
let link_tag_history = ['summary'] as string[];

const link_arrow = '&#10229;'
const link_end = '&#10577;'
const audio_context = new AudioContext()
const menu_item = '<span class="menu-parent-item show"> <i class="ph-fill ph-chat-teardrop menu-item menu-item-active"></i> <span class="separator separator-active"> | </span> </span>'

const social_links = [
    {
        icon: 'GitBranchPlus',
        link: 'https://github.com/fredrickmakoffu/pet-store',
        name: 'github'
    },
    {
        icon: 'Linkedin',
        link: 'https://www.linkedin.com/in/fredrick-makoffu/',
        name: 'linkedin'
    },
    {
        icon: 'Tent',
        link: 'https://room.findfred.com',
        name: 'a room'
    },
    {
        icon: 'AudioLines',
        link: 'https://open.spotify.com/artist/7Hoj9MRu3nFiYfbWy3Reot?si=MMANzcf8TR2WzKxVoTSC3g',
        name: 'spotify'
    },
    {
        icon: 'Library',
        link: 'https://medium.com/@wrathofsponge/list/cocaina-bed4b5519711',
        name: 'medium'
    }
] as Record<string, any>[];
const descriptions = {
    summary: [
      "other extra things; i love me a lecture on ethics or philosophy.",
      " i'm a sucker for a good manga (and i mean good manga, not the avg stuff). my current love is 'Dead Dead Demon's Dededede Destruction'",
      "i love having conversions with people. always feels like you're opening a door to a whole new world"
    ],
} as Record<string, string[]>;

// alert when page loads
window.onload = () => {
    document.querySelector('.menu-parent-item')?.classList.add('show')
    loadDescription(link_tag_history[0])
}

async function navigate($event: MouseEvent) {
    const to = ($event.currentTarget as HTMLElement).dataset.link as string
    const direction = chooseDirection($event)
    const navigate_route = {
        to: to,
        current: "summary",
        event: $event,
    } as RouteObject

    // @ts-ignore
    if (direction === NavigationDirection.FORWARD && !link_tag_history.includes(navigate_route.to)) {
        forward(navigate_route)
    } else {
        backward(navigate_route)
    }
}

function forward(route: RouteObject) {
    const target = route.event.currentTarget as HTMLElement
    const parent = target.parentElement as HTMLElement
    const textBefore = getTextBefore(target)
    const textAfter = getTextAfter(target)

    const previous_target = link_history[link_history.length - 1]?.target as HTMLElement | null

    link_history.push({
        target: target,
        previous_target: previous_target,
        text_before: textBefore,
        text_after: textAfter
    } as LinkHistory)

    // mute text
    updateLink(target, Status.INACTIVE)

    // remove the text before the strong element
    removeTextBefore(route, target, parent)

    // remove the text after the strong element
    removeTextAfter(route, target, parent)

    // load new text
    document.getElementById(route.to)?.classList.remove('d-none')

    // remove current description
    const description = document.getElementById('small-text')
    if(description) description.innerHTML = ''

    // load description if any
    loadDescription(route.to)

    // set separator
    loadSeparator()

    // store in link tag history
    link_tag_history.push(route.to)
}

function backward(route: RouteObject) {
    const target = route.event.currentTarget as HTMLElement
    const parent = target.parentElement as HTMLElement
    const from = link_history.pop()

    // hide new text
    document.getElementById(route.to)?.classList.add('d-none')

    // mute text
    updateLink(target, Status.ACTIVE)

    if (from?.previous_target) {
        // log the last item from link_tag_history
        const last_item = link_tag_history[link_tag_history.length - 3]
        document.getElementById(last_item)?.querySelector('strong')?.classList.remove('d-none')
    }

    // Create a text node for the text before the strong element
    const textBefore = from?.text_before?.innerHTML
    const currentParentHtml = parent.innerHTML
    const textafter = from?.text_after?.innerHTML

    parent.innerHTML = textBefore + currentParentHtml + textafter

    // remove description
    const description = document.getElementById('small-text')
    if(description) description.innerHTML = ''

    // get description of previous element
    let description_index = link_tag_history[link_tag_history.length - 2]
    loadDescription(description_index)

    // remove last menu item
    const menu_items = document.querySelectorAll('.menu-parent-item')
    menu_items[menu_items.length - 1].classList.remove('show')

    setTimeout(() => {
        // get latest menu item
        menu_items[menu_items.length - 1].remove()
    }, 400)

    // remove last element from link tag history
    link_tag_history.pop()
}

function updateLink(target: HTMLElement, status: Status) {
    if (status === Status.ACTIVE) {
        target.classList.remove('inactive')
        target.classList.add('active')

        // remove link arrow from text
        target.innerHTML = target.innerHTML.replace('⟵', '').replace('⥑', '').trim()
    } else {
        target.classList.remove('active')
        target.classList.add('inactive')

        target.innerHTML = `${link_arrow} ${target.innerHTML} ${link_end}`

        // hide two links back
        hideLink()
    }
}

function hideLink() {
    // get link to hide
    const attr = link_history[link_history.length - 2]?.target.dataset.link as string
    document.querySelector('strong[class="blue-active inactive"][data-link="' + attr + '"]')?.classList.add('d-none')
}

function chooseDirection($event: MouseEvent) {
    return ($event.currentTarget as HTMLElement).classList.contains('active')
        ? NavigationDirection.FORWARD
        : NavigationDirection.BACKWARD
}

function loadDescription(string: string) {
    const description =  descriptions[string]
    const small_text = document.getElementById('small-text')

    if (description && small_text) {
        description.forEach((text, index) => {
            const p = document.createElement('p')
            p.innerHTML = '<span class="description-star"> ☀ </span>' + text
            small_text.appendChild(p)
        })
    }
}

function loadSeparator() {
    // update menu item
    const menu_items = document.querySelectorAll('.menu-parent-item')
    document.getElementById('menu')?.appendChild(document.createRange().createContextualFragment(menu_item))

    setTimeout(() => {
        // get latest menu item
        const item = menu_items[menu_items.length] as HTMLElement
        item.style.backgroundColor = 'red'
    }, 200)
}

function removeTextBefore(route: RouteObject, target: HTMLElement, parent: HTMLElement) {
    const beforeWrapper = document.createElement('span');
    beforeWrapper.id = route.current + '-before-wrapper';
    let previousSibling = target.previousSibling;

    while (previousSibling) {
        const node = previousSibling.cloneNode(true);
        beforeWrapper.appendChild(node);
        const temp = previousSibling.previousSibling;
        parent.removeChild(previousSibling);

        previousSibling = temp
    }
}

function removeTextAfter(route: RouteObject, target: HTMLElement, parent: HTMLElement) {
    const wrapper = document.createElement('span');
    wrapper.id = route.current +  '-after-wrapper';
    let nextSibling = target.nextSibling;

    while (nextSibling) {
        const node = nextSibling.cloneNode(true);
        wrapper.appendChild(node);
        const temp = nextSibling.nextSibling;
        parent.removeChild(nextSibling);
        nextSibling = temp;
    }
}

function getTextBefore(target:HTMLElement) {
    let previousSibling = target.previousSibling;
    const tempDiv = document.createElement('div');
    let previousDivs = [] as HTMLElement[];

    while (previousSibling) {
        const node = previousSibling.cloneNode(true);
        previousDivs.push(node as HTMLElement);
        previousSibling = previousSibling.previousSibling;
    }

    for (let i = previousDivs.length - 1; i >= 0; i--) {
        tempDiv.appendChild(previousDivs[i]);
    }

    return tempDiv;
}

function getTextAfter(target:HTMLElement) {
    let nextSibling = target.nextSibling;
    const tempDiv = document.createElement('div');

    while (nextSibling) {
        const node = nextSibling.cloneNode(true);
        tempDiv.appendChild(node);
        nextSibling = nextSibling.nextSibling;
    }

    return tempDiv;
}
