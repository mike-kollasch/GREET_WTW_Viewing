// makePanel loads the dataset, drills down to data, filters the data to get emissions data
// and then creates a panel with the emissions data.

function makePanel(feedstock, metric) {
    d3.json("https://mike-kollasch.github.io/GREET_WTW_Viewing/data/newest_data_array.json").then(function (data) {
        let dataArray = data.emissions;

        // Filter data based on feedstock and metric
        let currentFeedstock = dataArray.filter(d => d.id === feedstock);
        if (currentFeedstock.length > 0) {
            let currentMetric = currentFeedstock[0][metric];
            d3.select(".WTP").text(`Well-to-pump: ${currentMetric.WTP}`);
            d3.select(".PTW").text(`Pump-to-wake: ${currentMetric.PTW}`);
            d3.select(".WTW").text(`Well-to-wake: ${currentMetric.WTW}`);
            d3.select(".UNITS").text(`Units: ${currentMetric.units}`);
        } else {
            console.error("Feedstock or metric not found in data.");
        }
    });

};
// Update the bar chart with data
function makeBarChart(feedstock, metric) {
    d3.json("https://mike-kollasch.github.io/GREET_WTW_Viewing/data/newest_data_array.json").then(function (data) {
        let dataArray = data.emissions;

        // Filter data based on feedstock and metric
        let currentFeedstock = dataArray.filter(d => d.id === feedstock);
        if (currentFeedstock.length > 0) {
            let emiss_values = currentFeedstock[0][metric];

            // Create the bar chart
            let trace1 = {
                x: [emiss_values.WTP],
                y: ['WTP'],
                type: 'bar',
                name: 'WTP',
                orientation: 'h',
                marker: { color: 'blue', width: 1 }
            };
            let trace2 = {
                x: [emiss_values.PTW],
                y: ['PTW'],
                type: 'bar',
                name: 'PTW',
                orientation: 'h',
                marker: { color: 'red', width: 1 }
            };
            let trace3 = {
                x: [emiss_values.WTW],
                y: ['WTW = WTP+PTW'],
                type: 'bar',
                name: 'WTW',
                orientation: 'h',
                marker: { color: 'green', width: 1 }
            };

            let plot = [trace3, trace2, trace1];
            let layout = {
                title: 'Emissions for Selected Feedstock and Metric',
                barmode: 'overlay',
                xaxis: { title: emiss_values.units },
                yaxis: { title: 'Emissions by LCA Stage' },
                width: 500
            };

            Plotly.newPlot('bar', plot, layout);
        } else {
            console.error("Feedstock or metric not found in data.");
        }
    });
};
// Populate dropdown menus and initialize the page
function init() {
    d3.json("https://mike-kollasch.github.io/GREET_WTW_Viewing/data/newest_data_array.json").then(function (data) {
        // Populate feedstock dropdown from the list in the json file
        let feedstockDropdown = d3.select("#selFeedstock");
        let feedstocks = data.feedstocks;
        feedstocks.forEach(feedstock => {
            feedstockDropdown.append("option").text(feedstock).property("value", feedstock);
        });

        // Populate metric dropdown from the list in the json file
        let metricDropdown = d3.select("#selMetric");
        let metrics = data.metrics;
        metrics.forEach(metric => {
            metricDropdown.append("option").text(metric).property("value", metric);
        });

        // Initialize with the first feedstock and metric
        let initialFeedstock = feedstocks[0];
        let initialMetric = metrics[0];
        makePanel(initialFeedstock, initialMetric);
        makeBarChart(initialFeedstock, initialMetric);
    });
}

// Handle feedstock dropdown change, called whenever a new feedstock is selected, returns the new feedstock value and the current metric value
// and calls makePanel and makeBarChart with the new values
function feedstockChanged(feedstock) {
    let metric = d3.select("#selMetric").property("value"); // Get the current metric value
    makePanel(feedstock, metric);
    makeBarChart(feedstock, metric);
}

// Handle metric dropdown change
function metricChanged(metric) {
    let feedstock = d3.select("#selFeedstock").property("value"); // Get the current feedstock value
    makePanel(feedstock, metric);
    makeBarChart(feedstock, metric);
}


init(); // call init function to load the data and create the dropdown list.