

// Call populateEmployees function when page loads
document.addEventListener('DOMContentLoaded', populateEmployees);

async function populateEmployees(){
    /*
    Called when the page loads. Retrieves the employees data and populates the containers to display the retrieved data.
    */
    // Get element containers
    const insightsPanel = document.getElementById("insights-panel");
    const chartContainer = document.getElementById("chart-container");
    const incomeContainer = document.getElementById("income-container");

    try {
    const employeesData = await getEmployeesData();
    if (!employeesData || !employeesData.data) {
      insightsPanel.textContent = "Unable to load insights.";
      return;
    }
    if (insightsPanel) {
      insightsPanel.innerText = employeesData.data.insight;
    }

    if (incomeContainer) {
      let incomeNotes = "";
      employeesData.data.income_notes.forEach(note => {
        incomeNotes += `
          <div class="income-panel">
            <span>${note}</span>
          </div>`;
      });
      incomeContainer.innerHTML = incomeNotes;
    }

    if (chartContainer) {
      const ctx = chartContainer.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{
            label: "Revenue ($)",
            data: employeesData.data.revenue || [500, 700, 400, 900, 800, 600, 750],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  } catch (err) {
    console.error("Failed to populate employee data:", err);
  }
}

async function getEmployeesData() {
  try {
    const response = await fetch("http://localhost:8000/employees", {
      credentials: 'include'
    });

    if (!response.ok) {
      alert("Failed to retrieve employees data");
      return null;
    }

    const json = await response.json();

    if (json.status_code === 401) {
      window.location.href = "../login/index.html";
      return null;
    }

    return json;

  } catch (error) {
    console.error("Error fetching employee data:", error);
    return null;
  }
}

function showLeftPanel() {
  const leftPanel = document.getElementById("left-panel");
  if (leftPanel) {
    leftPanel.classList.toggle("open");
  }
}
// Function to handle logout
function logout() {
    // Send GET request to the /logout endpoint
    fetch("http://localhost:8000/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status_code === 200) {
            // Clear the session_token cookie
            document.cookie = "session_token=; path=/; max-age=0";

            // Redirect to the login page
            window.location.href = "../login/index.html";
        } else {
            console.error("Logout failed", data.message);
        }
    })
    .catch((error) => {
        console.error("Error during logout:", error);
    });
}

// place-holder employee info
const employees = [
    { name: "Alice Smith", pay: "$22.25", hours: "35h", position: "Bakery Manager" },
    { name: "Bob Johnson", pay: "$18.50", hours: "30h", position: "Cashier" },
    { name: "Charlie Brown", pay: "$25.00", hours: "40h", position: "Head Chef" },
    { name: "Diana Prince", pay: "$20.00", hours: "28h", position: "Barista" },
    { name: "Edward Blake", pay: "$19.75", hours: "32h", position: "Stock Clerk" },
  ];

  function selectEmployee(index) {
    const emp = employees[index];

    // Hide placeholder message, show details
    const placeholder = document.getElementById("placeholder-message");
    const details = document.getElementById("employee-details");

    if (placeholder) placeholder.style.display = "none";
    if (details) details.style.display = "flex";

    document.getElementById("employee-name").textContent = emp.name;
    document.getElementById("pay").textContent = emp.pay;
    document.getElementById("hours").textContent = emp.hours;
    document.getElementById("position").textContent = emp.position;
  }


  function changeLocation() {
    const selected = document.getElementById("location-select").value;
    console.log("Location changed to:", selected);
    // Optional: trigger employee filtering or backend call here
  }
