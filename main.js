// console.log('main.js');

let elements = [...document.querySelectorAll('[role="listitem"]')].filter(item => item.children[0].hasAttribute("data-params"));
// console.log([...document.querySelectorAll('[role="heading"')].length > 0);
// console.log([...document.querySelectorAll('[role="list"]')][0] && [...document.querySelectorAll('[role="list"]')][0].children.length > 0 && elements.length > 0);
// console.log(document.getElementsByTagName("form").length > 0);

async function toggleLock(event) {
  let name = event.target.getAttribute('data');
  let getdata = await browser.storage.local.get(name)
  if (getdata.hasOwnProperty(name)) {
    browser.storage.local.remove(name);
    event.target.className = 'lock-btn unlocked';
    event.target.nextSibling.style.display = 'none';
  } else {
    if (document.querySelector(`[name="${name}"]`).value) {
      event.target.className = 'lock-btn locked';
      browser.storage.local.set({ [name]: document.querySelector(`[name="${name}"]`).value })
      event.target.nextSibling.style.display = 'block';
    }
  }
}
function start () {
  console.log('start');
  elements.forEach(element => {
    let str = element.children[0].getAttribute("data-params");
    let name = str.split(',[[')[1].match(/(\d+)*/)[1];
    let lockbtn = document.createElement("div");
    let blocker = document.createElement("div");
    browser.storage.local.get(`entry.${name}`, response => {
      if (response.hasOwnProperty(`entry.${name}`)) {
        // if (document.getElementsByName(`entry.${name}`)[0].value) {
          lockbtn.className = `lock-btn locked`;
          blocker.style.display = 'block';
        // } else {
          // console.log('1-2');
        //   lockbtn.className = `lock-btn unlocked`
        //   browser.storage.local.remove(`entry.${name}`);
        // }
      } else {
        lockbtn.className = `lock-btn unlocked`;
        // console.log('2-1');
      }
      element.children[0].appendChild(lockbtn);
      element.children[0].appendChild(blocker);
      element.children[0].style.position = 'relative';
      blocker.className = "blocker";
      lockbtn.setAttribute('data', `entry.${name}`);
      lockbtn.addEventListener("click", toggleLock, false);
    });
  });
}
async function createLink () {
  // console.log('createLink');
  let data = await browser.storage.local.get()
  if (Object.keys(data).length > 0) {
    let newlink = document.createElement('div');
    newlink.className = "freebirdFormviewerViewResponseLinksContainer";
    let newlinka = document.createElement('a');
    let splitted = document.location.pathname.split('/');
    let query = "";
    Object.keys(data).forEach(key => {
      query += `&${key}=${data[key]}`
    });
    newlinka.setAttribute('href', `https://docs.google.com/forms/u/${splitted[3]}/d/e/${splitted[6]}/viewform?usp=pp_url${query}`);
    newlinka.innerHTML = "Отправить еще один ответ с автозаполнением";
    newlink.appendChild(newlinka);
    // console.log(document.querySelectorAll('[role="heading"')[0].parentElement)
    // console.log(document.querySelectorAll('[role="heading"')[0].parentElement);
    [...document.querySelectorAll('[role="heading"')][0].parentElement.appendChild(newlink);
  }
}
async function createLink2 () {
  console.log('createLink2');
  let data = await browser.storage.local.get();
  if (Object.keys(data).length > 0) {
    let applyfill = document.createElement('div');
    applyfill.className = "applyfill";
    applyfill.innerHTML = "Применить автозаполнение";
    let splitted = document.location.pathname.split('/');
    let query = "";
    Object.keys(data).forEach(key => {
        query += `&${key}=${data[key]}`;
    });
    applyfill.setAttribute('data', `https://docs.google.com/forms/d/e/${splitted[4]}/viewform?usp=pp_url${query}`);
    applyfill.addEventListener("click", onclick, false);
    document.getElementsByTagName("form")[0].appendChild(applyfill);
  }
}
function onclick (event) {
  location.href = event.target.getAttribute('data');
}
if ([...document.querySelectorAll('[role="list"]')][0] && [...document.querySelectorAll('[role="list"]')][0].children.length > 0 && elements.length > 0) start()
else if (document.getElementsByTagName("form").length > 0) createLink2();
else if ([...document.querySelectorAll('[role="heading"')].length > 0) createLink();
// https://docs.google.com/forms/d/e/*/viewform?usp=pp_url&entry.609516594=Az-Forward
