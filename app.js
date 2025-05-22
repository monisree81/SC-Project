let employees = [];

// Login function
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);

      // Show dashboard
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');

      // Fetch employee data
      fetchEmployees();
    } else {
      document.getElementById('login-error').innerText = data.error || 'Login failed';
    }
  } catch (err) {
    document.getElementById('login-error').innerText = 'Server error. Try again later.';
  }
}

// Show specific dashboard page
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');

  if (pageId === 'salary') calculateSalaries();
  if (pageId === 'tax') calculateTaxes();
}

// Fetch employees from API
async function fetchEmployees() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/employees', {
      headers: {
        'Authorization': token
      }
    });

    if (!res.ok) throw new Error('Failed to fetch employees');

    employees = await res.json();
    renderEmployeeTable();
  } catch (error) {
    console.error(error);
    alert('Error fetching employees. Check API and login.');
  }
}

// Render employees in table
function renderEmployeeTable() {
  const table = document.getElementById('employeeTable');
  table.innerHTML = '<tr><th>Name</th><th>Hours</th><th>Rate</th><th>Tax %</th></tr>';
  employees.forEach(emp => {
    const row = `<tr><td>${emp.name}</td><td>${emp.hours}</td><td>${emp.rate}</td><td>${emp.tax}</td></tr>`;
    table.innerHTML += row;
  });
}

// Add new employee
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newEmp = {
    name: document.getElementById('empName').value,
    hours: parseFloat(document.getElementById('workingHours').value),
    rate: parseFloat(document.getElementById('salaryPerHour').value),
    tax: parseFloat(document.getElementById('taxPercent').value)
  };

  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(newEmp)
    });

    const data = await res.json();
    if (res.ok) {
      employees.push(data);
      renderEmployeeTable();
      document.getElementById('employeeForm').reset();
    } else {
      alert(data.error || 'Failed to add employee');
    }
  } catch (error) {
    console.error(error);
    alert('Error adding employee.');
  }
});

// Salary calculations
function calculateSalaries() {
  const output = document.getElementById('salaryOutput');
  let html = '<table><tr><th>Name</th><th>Monthly Salary</th><th>Annual Salary</th></tr>';
  let totalMonthly = 0;

  employees.forEach(emp => {
    const monthly = emp.hours * emp.rate;
    const annual = monthly * 12;
    totalMonthly += monthly;

    html += `<tr><td>${emp.name}</td><td>$${monthly.toFixed(2)}</td><td>$${annual.toFixed(2)}</td></tr>`;
  });

  html += `<tr><th>Total</th><th>$${totalMonthly.toFixed(2)}</th><th>$${(totalMonthly * 12).toFixed(2)}</th></tr></table>`;
  output.innerHTML = html;
}

// Tax calculations
function calculateTaxes() {
  const output = document.getElementById('taxOutput');
  let html = '<table><tr><th>Name</th><th>Monthly Tax</th></tr>';
  let totalAnnualTax = 0;

  employees.forEach(emp => {
    const tax = (emp.hours * emp.rate * emp.tax) / 100;
    totalAnnualTax += tax * 12;

    html += `<tr><td>${emp.name}</td><td>$${tax.toFixed(2)}</td></tr>`;
  });

  html += `<tr><th>Total Annual Tax</th><th>$${totalAnnualTax.toFixed(2)}</th></tr></table>`;
  output.innerHTML = html;
}

// Generate payslip PDF
function generatePayslip() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let yPosition = 20;

  employees.forEach(emp => {
    const gross = emp.hours * emp.rate;
    const tax = (gross * emp.tax) / 100;
    const net = gross - tax;

    doc.setFontSize(12);
    doc.text(`Payslip for ${emp.name}`, 20, yPosition);
    yPosition += 10;

    doc.text(`Gross Salary: $${gross.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Tax Deducted: $${tax.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Net Salary: $${net.toFixed(2)}`, 20, yPosition);
    yPosition += 15;

    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });

  doc.save('payslips.pdf');
}
