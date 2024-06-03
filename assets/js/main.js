"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["INACTIVE"] = "inactive";
})(Status || (Status = {}));
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection["FORWARD"] = "forward";
    NavigationDirection["BACKWARD"] = "backward";
})(NavigationDirection || (NavigationDirection = {}));
let audio = null;
let link_history = [];
let link_tag_history = ['summary'];
const link_arrow = '&#10229;';
const link_end = '&#10577;';
const audio_context = new AudioContext();
const icons = {
    summary: { icon: 'Star', size: 16, color: '#c16e70' },
    kenya: { icon: 'Triangle', size: 16, color: '#c16e70' },
    writing: { icon: 'Moon', size: 16, color: '#c16e70' },
    music: { icon: 'Star', size: 16, color: '#c16e70' },
    coding: { icon: 'Star', size: 16, color: '#c16e70' },
    medium: { icon: 'Star', size: 16, color: '#c16e70' }
};
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
];
const descriptions = {
    summary: ['i think he\'s referring to the fact that there is a lot to be grateful for, but idk man he could be talking about anything', 'i had some time to think about it and i think he\'s talking about the fact that there is a lot to be grateful for'],
};
function navigate($event) {
    return __awaiter(this, void 0, void 0, function* () {
        const to = $event.currentTarget.dataset.link;
        const direction = chooseDirection($event);
        const navigate_route = {
            to: to,
            current: "summary",
            event: $event,
        };
        // @ts-ignore
        if (direction === NavigationDirection.FORWARD && !link_tag_history.includes(navigate_route.to)) {
            forward(navigate_route);
        }
        else {
            backward(navigate_route);
        }
    });
}
function forward(route) {
    var _a, _b;
    const target = route.event.currentTarget;
    const parent = target.parentElement;
    const textBefore = () => {
        let previousSibling = target.previousSibling;
        const tempDiv = document.createElement('div');
        let previousDivs = [];
        while (previousSibling) {
            const node = previousSibling.cloneNode(true);
            previousDivs.push(node);
            previousSibling = previousSibling.previousSibling;
        }
        for (let i = previousDivs.length - 1; i >= 0; i--) {
            tempDiv.appendChild(previousDivs[i]);
        }
        return tempDiv;
    };
    const textAfter = () => {
        let nextSibling = target.nextSibling;
        const tempDiv = document.createElement('div');
        while (nextSibling) {
            const node = nextSibling.cloneNode(true);
            tempDiv.appendChild(node);
            nextSibling = nextSibling.nextSibling;
        }
        return tempDiv;
    };
    const previous_target = (_a = link_history[link_history.length - 1]) === null || _a === void 0 ? void 0 : _a.target;
    link_history.push({
        target: target,
        previous_target: previous_target,
        text_before: textBefore(),
        text_after: textAfter()
    });
    // mute text
    updateLink(target, Status.INACTIVE);
    // remove the text before the strong element
    const beforeWrapper = document.createElement('span');
    beforeWrapper.id = route.current + '-before-wrapper';
    let previousSibling = target.previousSibling;
    while (previousSibling) {
        const node = previousSibling.cloneNode(true);
        beforeWrapper.appendChild(node);
        const temp = previousSibling.previousSibling;
        parent.removeChild(previousSibling);
        previousSibling = temp;
    }
    const wrapper = document.createElement('span');
    wrapper.id = route.current + '-after-wrapper';
    let nextSibling = target.nextSibling;
    // wrapper.classList.add('d-none');
    while (nextSibling) {
        const node = nextSibling.cloneNode(true);
        wrapper.appendChild(node);
        const temp = nextSibling.nextSibling;
        parent.removeChild(nextSibling);
        nextSibling = temp;
    }
    // load new text
    (_b = document.getElementById(route.to)) === null || _b === void 0 ? void 0 : _b.classList.remove('d-none');
    // store in link tag history
    link_tag_history.push(route.to);
}
function backward(route) {
    var _a, _b, _c, _d, _e;
    const target = route.event.currentTarget;
    const parent = target.parentElement;
    const from = link_history.pop();
    // hide new text
    (_a = document.getElementById(route.to)) === null || _a === void 0 ? void 0 : _a.classList.add('d-none');
    // mute text
    updateLink(target, Status.ACTIVE);
    if (from === null || from === void 0 ? void 0 : from.previous_target) {
        // log the last item from link_tag_history
        const last_item = link_tag_history[link_tag_history.length - 3];
        (_c = (_b = document.getElementById(last_item)) === null || _b === void 0 ? void 0 : _b.querySelector('strong')) === null || _c === void 0 ? void 0 : _c.classList.remove('d-none');
    }
    // Create a text node for the text before the strong element
    const textBefore = (_d = from === null || from === void 0 ? void 0 : from.text_before) === null || _d === void 0 ? void 0 : _d.innerHTML;
    const currentParentHtml = parent.innerHTML;
    const textafter = (_e = from === null || from === void 0 ? void 0 : from.text_after) === null || _e === void 0 ? void 0 : _e.innerHTML;
    parent.innerHTML = textBefore + currentParentHtml + textafter;
    // remove last element from link tag history
    link_tag_history.pop();
}
function updateLink(target, status) {
    if (status === Status.ACTIVE) {
        target.classList.remove('inactive');
        target.classList.add('active');
        // remove link arrow from text
        target.innerHTML = target.innerHTML.replace('⟵', '').replace('⥑', '').trim();
    }
    else {
        target.classList.remove('active');
        target.classList.add('inactive');
        target.innerHTML = `${link_arrow} ${target.innerHTML} ${link_end}`;
        // hide two links back
        hideLink();
    }
}
function hideLink() {
    var _a, _b;
    // get link to hide
    const attr = (_a = link_history[link_history.length - 2]) === null || _a === void 0 ? void 0 : _a.target.dataset.link;
    (_b = document.querySelector('strong[class="blue-active inactive"][data-link="' + attr + '"]')) === null || _b === void 0 ? void 0 : _b.classList.add('d-none');
}
function chooseDirection($event) {
    return $event.currentTarget.classList.contains('active')
        ? NavigationDirection.FORWARD
        : NavigationDirection.BACKWARD;
}
