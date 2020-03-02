(function () {

  function checkPrime(number) {
    if (number < 2) return false;

    for (let i = 2; i <= Math.sqrt(number); i++)
      if (number % i == 0) return false;

    return true;
  }

  const staticForm = document.getElementById("static-form");

  if (staticForm) {
    const number = document.getElementById("number");
    const ol = document.getElementById("attempts");

    staticForm.addEventListener("submit", event => {
      event.preventDefault();

      const numberValue = number.value;

      if (!numberValue) {
        alert("Please enter number to be checked!");
      } else {
        // hide containers by default
        ol.classList.add("hidden");

        const parsedNumberValue = parseInt(numberValue);
        const isPrime = checkPrime(parsedNumberValue);
        var li = document.createElement("li");
        if (isPrime) {
          li.setAttribute("class", "is-prime");
          li.appendChild(document.createTextNode(numberValue + " is a prime number"));
          ol.appendChild(li);
        } else {
          li.setAttribute("class", "not-prime");
          li.appendChild(document.createTextNode(numberValue + " is NOT a prime number"));
          ol.appendChild(li);
        }
        ol.classList.remove("hidden");
        number.value = "";
      }

      number.focus();
    });
  }
})();
