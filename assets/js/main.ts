interface RouteObject {
  to: string;
  current: string;
  event: Event;
}

interface LinkHistory {
  target: HTMLElement;
  previous_target: HTMLElement | null;
  text_before: Element | null;
  text_after: HTMLDivElement | null;
}

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

enum NavigationDirection {
  FORWARD = "forward",
  BACKWARD = "backward",
}

interface LinkObject {
  text: string;
  link: string;
}

let dark_mode = false as boolean;
let link_history = [] as LinkHistory[];
let link_tag_history = ["summary"] as string[];
const link_arrow = "&#10229;";
const link_end = "&#10577;";
const menu_item = '<span class="menu-parent-item show"> <i class="ph-fill ph-chat-teardrop menu-item menu-item-active"></i> <span class="separator separator-active"> | </span> </span>';

const descriptions = {
  "summary": [
    "other extra things; i love me a lecture on ethics or philosophy.",
    " i'm a sucker for a good manga. my current love is 'Dead Dead Demon's Dededede Destruction'",
    "i love having conversions with people. always feels like you're opening a door to a whole new world"
  ],
  "living": [
    "fun things i've built 1: {Gsort https://gearhealthsystem.com}, a pharmacy e-commerce app store built as a PWA",
    "fun things i've built 2: a mockup of a {room https://github.com/fredrickmakoffu/svelte-room}, built with raw CSS",
    "fun things i've built 3: built a low-code platform to democratize the creation of software to small businesses (its super ded now)"
  ],
  "fun": [
    "(gotta thank {@theprimeagen https://www.youtube.com/@ThePrimeTimeagen} for the motivation to learn rust and look for hard things to code)",
    "(gotta thank {@eatonphil https://twitter.com/eatonphil} for all the motivation to read books and blogs about hard stuff)"
  ],
  "art": ["i'm very grateful. i am surrounded by artifacts of creation"]
} as Record<string, string[] >;

// alert when page loads
// window.onload = () => {
//   navigate({ currentTarget: document.querySelector(".menu-item-active") } as MouseEvent);
//   document.querySelector(".menu-parent-item")?.classList.add("show");
//   loadDescription(link_tag_history[0]);
// };

async function navigate($event: MouseEvent) {
  const to = ($event.currentTarget as HTMLElement).dataset.link as string;
  const direction = chooseDirection($event);
  const navigate_route = {
    to: to,
    current: "summary",
    event: $event,
  } as RouteObject;

  // @ts-ignore
  if (
    direction === NavigationDirection.FORWARD &&
    !link_tag_history.includes(navigate_route.to)
  ) {
    forward(navigate_route);
  } else {
    backward(navigate_route);
  }
}

function forward(route: RouteObject) {
  const target = route.event.currentTarget as HTMLElement;
  const parent = target.parentElement as HTMLElement;
  const textBefore = getTextBefore(target);
  const textAfter = getTextAfter(target);

  const previous_target = link_history[link_history.length - 1]
    ?.target as HTMLElement | null;

  link_history.push({
    target: target,
    previous_target: previous_target,
    text_before: textBefore,
    text_after: textAfter,
  } as LinkHistory);

  // mute text
  updateLink(target, Status.INACTIVE);

  // remove the text before the strong element
  removeTextBefore(route, target, parent);

  // remove the text after the strong element
  removeTextAfter(route, target, parent);

  // load new text
  document.getElementById(route.to)?.classList.remove("d-none");

  // remove current description
  const description = document.getElementById("small-text");
  if (description) description.innerHTML = "";

  // load description if any
  loadDescription(route.to);

  // set separator
  loadSeparator();

  // store in link tag history
  link_tag_history.push(route.to);
}

function backward(route: RouteObject) {
  const target = route.event.currentTarget as HTMLElement;
  const parent = target.parentElement as HTMLElement;
  const from = link_history.pop();

  // hide new text
  document.getElementById(route.to)?.classList.add("d-none");

  // mute text
  updateLink(target, Status.ACTIVE);

  if (from?.previous_target) {
    // log the last item from link_tag_history
    const last_item = link_tag_history[link_tag_history.length - 3];
    document
      .getElementById(last_item)
      ?.querySelector("strong")
      ?.classList.remove("d-none");
  }

  // Create a text node for the text before the strong element
  const textBefore = from?.text_before?.innerHTML;
  const currentParentHtml = parent.innerHTML;
  const textafter = from?.text_after?.innerHTML;

  parent.innerHTML = textBefore + currentParentHtml + textafter;

  // remove description
  const description = document.getElementById("small-text");
  if (description) description.innerHTML = "";

  // get description of previous element
  let description_index = link_tag_history[link_tag_history.length - 2];
  loadDescription(description_index);

  // remove last menu item
  const menu_items = document.querySelectorAll(".menu-parent-item");
  menu_items[menu_items.length - 1].classList.remove("show");

  setTimeout(() => {
    // get latest menu item
    menu_items[menu_items.length - 1].remove();
  }, 400);

  // remove last element from link tag history
  link_tag_history.pop();
}

function updateLink(target: HTMLElement, status: Status) {
  if (status === Status.ACTIVE) {
    target.classList.remove("inactive");
    target.classList.add("active");

    // remove link arrow from text
    target.innerHTML = target.innerHTML
      .replace("⟵", "")
      .replace("⥑", "")
      .trim();
  } else {
    target.classList.remove("active");
    target.classList.add("inactive");

    target.innerHTML = `${link_arrow} ${target.innerHTML} ${link_end}`;

    // hide two links back
    hideLink();
  }
}

function hideLink() {
  // get link to hide
  const attr = link_history[link_history.length - 2]?.target.dataset
    .link as string;
  document
    .querySelector(
      'strong[class="blue-active inactive"][data-link="' + attr + '"]',
    )
    ?.classList.add("d-none");
}

function chooseDirection($event: MouseEvent) {
  return ($event.currentTarget as HTMLElement).classList.contains("active")
    ? NavigationDirection.FORWARD
    : NavigationDirection.BACKWARD;
}

function loadDescription(string: string) {
  const description = descriptions[string];
  const small_text = document.getElementById("small-text");

  if (description && small_text) {
    description.forEach((text) => {
      let new_text = getLinksInDescription(text) as string;

      const p = document.createElement("p");
      p.innerHTML = '<span class="description-star"> ☀ </span>' + new_text;
      small_text.appendChild(p);
    });
  }
}

function getLinksInDescription(text: string) {
  if (!(text.includes("{") && text.includes("}"))) return text;

  let new_text = text.split(" ") as string[];
  let current_index = 0 as number;
  let current_link = {
    text: "" as string,
    link: "" as string,
  } as LinkObject;

  new_text.forEach((t, index) => {
    let first_letter = t.charAt(0) as string;
    if (first_letter == "{") {
      current_index = index;
      current_link = {
        text: t,
        link: new_text[index + 1]?.replace("}", "") as string,
      };
    }
  });

  // remove index 4 and 5 from array
  new_text.splice(current_index, 2);

  // insert link in array
  new_text.splice(
    current_index,
    0,
    `<a class="link small " href="${current_link?.link}" target="_blank">${current_link?.text.replace("{", "")}</a>`,
  );

  // join array to string
  return new_text.join(" ");
}

function loadSeparator() {
  // update menu item
  document
    .getElementById("menu")
    ?.appendChild(document.createRange().createContextualFragment(menu_item));
}

function removeTextBefore(
  route: RouteObject,
  target: HTMLElement,
  parent: HTMLElement,
) {
  const beforeWrapper = document.createElement("span");
  beforeWrapper.id = route.current + "-before-wrapper";
  let previousSibling = target.previousSibling;

  while (previousSibling) {
    const node = previousSibling.cloneNode(true);
    beforeWrapper.appendChild(node);
    const temp = previousSibling.previousSibling;
    parent.removeChild(previousSibling);

    previousSibling = temp;
  }
}

function removeTextAfter(
  route: RouteObject,
  target: HTMLElement,
  parent: HTMLElement,
) {
  const wrapper = document.createElement("span");
  wrapper.id = route.current + "-after-wrapper";
  let nextSibling = target.nextSibling;

  while (nextSibling) {
    const node = nextSibling.cloneNode(true);
    wrapper.appendChild(node);
    const temp = nextSibling.nextSibling;
    parent.removeChild(nextSibling);
    nextSibling = temp;
  }
}

function getTextBefore(target: HTMLElement) {
  let previousSibling = target.previousSibling;
  const tempDiv = document.createElement("div");
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

function getTextAfter(target: HTMLElement) {
  let nextSibling = target.nextSibling;
  const tempDiv = document.createElement("div");

  while (nextSibling) {
    const node = nextSibling.cloneNode(true);
    tempDiv.appendChild(node);
    nextSibling = nextSibling.nextSibling;
  }

  return tempDiv;
}

function darkMode() {
  const body = document.querySelector("html") as HTMLElement;

  if (dark_mode) {
    body.classList.remove("dark-mode");
  } else {
    body.classList.add("dark-mode");
  }

  dark_mode = !dark_mode;
}




