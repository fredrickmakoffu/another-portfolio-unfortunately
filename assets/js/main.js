let active_elements = []

async function navigate(current_link, event) {
  // if we've already navigated somewhere, early exit
  if(active_elements.includes(current_link)) return
  
  active_elements.push(current_link)
  
  const nav_data = {
    id: event.currentTarget.id,
    update_to: event.currentTarget.id.split('_')[2]
  }

  // mute text
  await mute_text_before(nav_data);

  // set shape
  await activate_shape(event.target.innerText)
}

async function navigate_back() {
  if( !active_elements.includes(current_link)) return

  
}

async function activate_shape(text) {
  const shape = document.querySelector('.shape')  
  document.getElementById('shape-title').innerHTML = text

  await new Promise((resolve) => setTimeout(() => {
    shape.classList.remove('inactive-shape')
    shape.classList.add('active-shape')
    shape.querySelector('#items-in-shape').classList.remove('hide')

    resolve()
  }, 150));
}

async function mute_text_before(options) {
  const element = document.getElementById('summary');
  
  // get text before the strong tag
  const text = element.innerHTML.split('<strong id="' + options.id + '"')[0].trim()
  const second_text = document.getElementById(options.update_to).innerHTML

  const link_text = document.getElementById(options.id).innerText
  const link_arrow = '&#10229;'
  const link_end  ='&#10577;'
  
  setTimeout(() => {
    element.innerHTML = '<span class="previous-text">' + text + '</span>' + ' ' + second_text
    document.getElementById(options.id).innerHTML = '<span style="margin-right: 0.5rem">' + link_arrow + '</span>' + link_text + '<span style="margin-left: 0.5rem">' + link_end + '</span>'
  }, 30);
}












































function inactive_shape() {
  const shape = document.querySelector('.shape')
  setTimeout(() => {
    shape.classList.remove('active-shape');
    shape.classList.add('inactive-shape');

    shape.querySelector('#items-in-shape').classList.add('hide');
  }, 150);
}

