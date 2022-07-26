
const loc = window.location.href;
const len = loc.length;
const id = loc.substring(49, len);
console.log(id);


// Bring in the API
// We need the data and corresponding names
const xhttp = new XMLHttpRequest();


xhttp.onload = function () {
    // Here you can use the Data

    const response = JSON.parse(this.responseText);
    
    // console.log(this);
    // const response = this.responseText;
    // console.log(response);

    // get the names in an array
    const names = [];
    const price = [];

    response.forEach(element => {
        names.push(element.name);
        price.push(element.currentPrice);
    });

    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: names,
            datasets: [{
                label: 'CURRENT HOLDING',
                data: price,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Send a request
xhttp.open("GET", `https://my-portfolio8619.herokuapp.com/portfolio/chart/pie/${id}`);
xhttp.send();