// Function to generate input fields based on the number of years entered
function generateInputFields() {
  const yearCount = document.getElementById("yearCount").value;
  const salesInputContainer = document.getElementById("salesInputContainer");
  
  // Clear any previous inputs
  salesInputContainer.innerHTML = "";

  if (yearCount < 1) {
      alert("Please enter a valid number of years.");
      return;
  }

  // Create the input fields dynamically
  for (let i = 1; i <= yearCount; i++) {
      const inputField = document.createElement("input");
      inputField.type = "number";
      inputField.placeholder = `Enter sales for Year ${i}`;
      inputField.id = `salesYear${i}`;
      inputField.classList.add("dynamic-input");
      salesInputContainer.appendChild(inputField);
  }

  // Add a button to predict demand
  const predictButton = document.createElement("button");
  predictButton.classList.add("btn");
  predictButton.textContent = "Predict Next Year Demand";
  predictButton.onclick = predictDemand;
  salesInputContainer.appendChild(predictButton);
}

// Function to reset the input fields and results
function resetInputs() {
  document.getElementById("yearCount").value = "";
  document.getElementById("salesInputContainer").innerHTML = "";
  document.getElementById("predictedValues").innerHTML = "";
  document.getElementById("resultContainer").style.display = "none";

  // Reset the chart
  const ctx = document.getElementById("forecastChart").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Exponential Smoothing Function
function exponentialSmoothing(data, alpha) {
  let smoothedData = [data[0]]; // Initialize with the first value
  for (let i = 1; i < data.length; i++) {
      smoothedData.push(alpha * data[i] + (1 - alpha) * smoothedData[i - 1]);
  }
  return smoothedData;
}

// Function to predict demand based on entered data
function predictDemand() {
  const salesInputs = document.querySelectorAll(".dynamic-input");
  const salesData = Array.from(salesInputs).map(input => Number(input.value));

  if (salesData.includes(NaN)) {
      alert("Please enter valid sales data.");
      return;
  }

  const alpha = 0.5; // Smoothing factor
  const smoothedData = exponentialSmoothing(salesData, alpha);
  const lastSmoothedValue = smoothedData[smoothedData.length - 1];

  // Predict next year's demand based on last smoothed value
  const predictedNextYear = lastSmoothedValue;

  // Display predicted demand
  displayPredictedValues(predictedNextYear);

  // Render the chart
  renderChart(salesData, predictedNextYear);
}

// Display Predicted Next Year Demand
function displayPredictedValues(predictedNextYear) {
  const predictedList = document.getElementById("predictedValues");
  predictedList.innerHTML = ""; // Clear previous values
  const li = document.createElement("li");
  li.textContent = `Next Year: ${predictedNextYear.toFixed(2)}`;
  predictedList.appendChild(li);

  document.getElementById("resultContainer").style.display = "block"; // Show result section
}

// Render Chart using Chart.js
function renderChart(salesData, predictedNextYear) {
  const ctx = document.getElementById("forecastChart").getContext("2d");
  const labels = [];
  for (let i = 0; i < salesData.length; i++) {
      labels.push(`Year ${i + 1}`);
  }
  labels.push("Next Year");

  new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Actual Sales',
              data: [...salesData],
              borderColor: 'blue',
              fill: false,
          }, {
              label: 'Predicted Demand',
              data: [...Array(salesData.length).fill(null), predictedNextYear],
              borderColor: 'red',
              borderDash: [5, 5],
              fill: false,
          }]
      },
      options: {
          responsive: true,
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Years'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Sales / Demand'
                  }
              }
          }
      }
  });
}
