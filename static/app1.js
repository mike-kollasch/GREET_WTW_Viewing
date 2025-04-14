// makePanel loads the dataset, drills down to data, filters the data to get emissions data
// and then creates a panel with the emissions data.

function makePanel(feedstock) {
    //load the dataset
    d3.json("../data/newest_data_array.json").then(function (data) {
        let dataArray = data.emissions;
        //drill down to correct feedstock data
        function selectFeedstock(id) {
            return id.id == feedstock;
        };
        console.log(dataArray); //this is successful
        console.log(feedstock); // this returns the correct feedstock name not an array

        let currentFeedstock = dataArray.filter(selectFeedstock);
        console.log(currentFeedstock); //now this returns the correct array based upon the dropdown menu
        console.log(`${currentFeedstock[0].GHG.WTP}`)//this returns the correct WTP value
        if (currentFeedstock.length > 0) {
            d3.select(".WTP").text(`Well-to-pump: ${currentFeedstock[0].GHG.WTP}`);
            d3.select(".PTW").text(`Pump-to-wake: ${currentFeedstock[0].GHG.PTW}`);
            d3.select(".WTW").text(`Well-to-wake: ${currentFeedstock[0].GHG.WTW}`);
            d3.select(".UNITS").text(`Units: ${currentFeedstock[0].GHG.units}`);
        } else {
            console.error("Feedstock not found in data.");
        }
    })
        .catch(function (error) {
            console.error("Error loading JSON file:", error);
        });
};
//makeBarChart loads the dataset, drills down to data, filters the data to get emissions data
function makeBarChart(feedstock) {
    //load the dataset
    d3.json("../data/newest_data_array.json").then(function (data) {
        let dataArray = data.emissions;
        //drill down to correct feedstock data
        function selectFeedstock(id) {
            return id.id == feedstock;
        };
        console.log(dataArray); // this is successful
        console.log(feedstock); // this returns the correct feedstock name not an array

        let currentFeedstock = dataArray.filter(selectFeedstock);
        console.log(currentFeedstock); //now this returns the correct array based upon the dropdown menu
        //drill down to the individual arrays for plotting
        let emiss_values = currentFeedstock[0].GHG;
        console.log(emiss_values.WTP); //this returns the correct emissions values
        //create the bar chart
        let trace1 = {
            x: [emiss_values.WTP],
            y: ['WTP'],
            type: 'bar',
            name: 'WTP',
            orientation: 'h',
            marker: { color: 'blue', width: 0.5 }
        };
        let trace2 = {
            x: [emiss_values.PTW],
            y: ['PTW'],
            type: 'bar',
            name: 'PTW',
            orientation: 'h',
            marker: { color: 'red' ,width: 0.5}
        };
        let trace3 = {
            x: [emiss_values.WTW],
            y: ['WTW'],
            type: 'bar',
            name: 'WTW',
            orientation: 'h',
            marker: { color: 'green', width: 0.5}
        };
        let plot = [trace3,trace2, trace1];
        let layout = {
            title: 'GHG Emissions by Feedstock',
            xaxis: { title: feedstock },
            yaxis: { title: 'GHG Emissions' },
            width: 1200
        };
        // Plot the chart
        Plotly.newPlot('bar', plot, layout);
    });
};
// optionChanged function takes the value of the selected option and passes it to makePanel and makeChart functions
function optionChanged(x) {
    makePanel(x);
    makeBarChart(x);
};

// init function   1.  reads in data, 2. drills down to feedstock, 3. selects the dataArray for the feedstock, 
//    4. builds the dropdown list in a for loop, 5. Takes the 1st item and sends it to other functions.

function init() {
    d3.json("data/newest_data_array.json").then(function (data) {
        let dropdownMenu = d3.select("#selDataset");
        let dataArray = data.feedstocks;
        for (let i = 0; i < dataArray.length; i++) {
            dropdownMenu.append("option").text(dataArray[i]).property("value", dataArray[i]);
        }
        makePanel(dataArray[0]);
        makeBarChart(dataArray[0]);  //added this back in to call the function
    });
}


init(); // call init function to load the data and create the dropdown list.