/* eslint-disable no-alert */

/*****************************************************************************************************************************
 *   SLICE 1
 *******************************************************************************************************************************************/
  //if big_coffee(this is id) is pressed coffeeQty increases by one
function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.querySelector('#coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  let coffeeIcon = document.querySelector('#big_coffee')
  coffeeIcon.addEventListener('click', () => {
    coffeeIcon += 1;
    // updateCoffeeView(data.coffee.count);
    // unlockProducers(data.producers, data.coffee.count);
    // renderProducers(data);
  });
}

/***************************************************************************************************************
 *   SLICE 2
 *****************************************************************************************************************************/

function unlockProducers(producers, coffeeCount) {
  let producerIds = Object.keys(producers);
  producerIds.forEach((producerId) => {
    let producer = producers[producerId];
    if (coffeeCount >= producer.price && !producer.unlocked) {
      producer.unlocked = true;
    }
  });

  return producers;
}

function getUnlockedProducers(data) {
  let unlockedProducers = [];
  let producerIds = Object.keys(data.producers);
  producerIds.forEach((producerId) => {
    let producer = data.producers[producerId];
    if (producer.unlocked) {
      unlockedProducers.push(producer);
    }
  });

  return unlockedProducers;
}

function makeDisplayNameFromId(id) {
  let displayName = id.split('_').map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  }).join(' ');

  return displayName;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  //let Element = document.querySelectorAll('div');
  let child = Element.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = Element.lastElementChild;
  }
  return parent;
}

function renderProducers(data) {
  let producersDiv = document.getElementById('producers');
  producersDiv = deleteAllChildNodes(producersDiv);
  let unlockedProducers = getUnlockedProducers(data);
  unlockedProducers.forEach((producer) => {
    let producerDiv = makeProducerDiv(producer);
    producersDiv.appendChild(producerDiv);
  });
}

/*******************************************************************************************************************************************
 *   SLICE 3
 *******************************************************************************************************************************************/

function getProducerById(data, producerId) {
  let producer = data.producers[producerId];
  return producer;
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  let coffeeCount = data.coffee.count;
  return coffeeCount >= producer.price;
}

function updateCPSView(cps) {
  let cpsCounter = document.getElementById('cps');
  cpsCounter.innerText = cps;
}

function updatePrice(oldPrice) {
  let newPrice = Math.round(oldPrice * 1.25);
  return newPrice;
}

function attemptToBuyProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  let canAfford = canAffordProducer(data, producerId);
  if (canAfford) {
    producer.qty += 1;
    producer.price = updatePrice(producer.price);
    data.coffee.count -= producer.price;
    data.coffee.cps += producer.cps;
    updateCPSView(data.coffee.cps);
  }

  return data;
}

function buyButtonClick(event, data) {
  // if (event.target.tagName === "BUTTON") {
  //   const producerId = event.target.id.slice(4)
  //   const canAfford = attemptToBuyProducer(data, producerId);
  //   if (!canAfford) {
  //     window.alert("Not enough coffee!");
  //   } else {
  //     renderProducers(data);
  //     updateCoffeeView(data.coffee);
  //     updateCPSView(data.totalCPS);
  //   }
  // }
  let producerId = event.target.id.split('_')[1];
  attemptToBuyProducer(data, producerId);
  renderProducers(data);
}

function tick(data) {
  let tick = setInterval(() => {
    let coffeeCount = data.coffee.count;
    coffeeCount += data.coffee.cps;
    data.coffee.count = coffeeCount;
    updateCoffeeView(coffeeCount);
    unlockProducers(data.producers, coffeeCount);
    renderProducers(tick);
  }, 1000);
}

/******************************************************************************************************************************************************
 *  Start your engines!
 ******************************************************************************************************************************************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
