console.log("Before observing the DOM");

var observeDOM = (function () {
  console.log("Setting up oberver iffe");
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || !obj.nodeType === 1) return; // validation

    if (MutationObserver) {
      // define a new observer
      var obs = new MutationObserver(function (mutations, observer) {
        callback(mutations);
      });
      // have the observer observe foo for changes in children
      obs.observe(obj, { childList: true, subtree: true });
    } else if (window.addEventListener) {
      obj.addEventListener("DOMNodeInserted", callback, false);
      obj.addEventListener("DOMNodeRemoved", callback, false);
    }
  };
})();

// Observe a specific DOM element:
observeDOM(document.body, function (mutations) {
  //   var allGridElements = [];
  //   const allGridElements = document.getElementsByClassName("grid-stack")[0]
  //     .children;
  //   for (const key in allGridElementsDOMObj) {
  //     if (allGridElementsDOMObj.hasOwnProperty(key)) {
  //       const element = allGridElementsDOMObj[key];
  //       allGridElementsDOMObj.push(allGridElementsDOMObj[key].ariaLabel);
  //     }
  //   }
  //   console.log("All grid elements ", allGridElements);

  console.log("dom changed", mutations);

  // getting all dom mutation based on select2-results on filter open
  var domElementsForIFUL = mutations
    .filter(function (el) {
      return el.target.className === "select2-results";
    })
    .filter(function (el) {
      return el.target.nodeName === "UL";
    })
    .filter(function (el) {
      return el.addedNodes.length > 1;
    });
  console.log("required mutaions regarding dropdown open", domElementsForIFUL);

  // add event listners to the appended interactive filter elements
  if (domElementsForIFUL.length === 1) {
    console.log(
      "The Dropdown is opened for the interactive filter",
      domElementsForIFUL[0].target
    );
  }

  // getting all dom mutation based on select2-choices on selection of filter
  var mutationForAdditionOrRemoval = mutations
    .filter(function (el) {
      return el.target.className === "select2-choices";
    })
    .filter(function (el) {
      return el.target.nodeName === "UL";
    });

  var afterSelectionMutaions = mutationForAdditionOrRemoval.filter(function (
    el
  ) {
    return el.addedNodes.length === 1;
  });
  console.log(
    "required mutaions on selected option in filter",
    afterSelectionMutaions
  );
  const selectedOptions = [
    ...new Set(
      afterSelectionMutaions.map((mutation) =>
        mutation.addedNodes[0].innerText.trim()
      )
    ),
  ];
  if (selectedOptions.length) {
    console.log("selected options from interactive filter", selectedOptions);
  }
});
