// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    

    // Filter the metadata for the object with the desired sample number
    let metadata = data.metadata.find(obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata").html("");

    // Use `.html("") to clear any existing metadata
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleData = data.samples.find(obj => obj.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sampleValues = sampleData.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sampleValues,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"},
      showlegend: false
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let top10SampleValues = sampleValues.slice(0, 10).reverse();
    let top100tuIds = otu_ids.slice(0, 10).reverse();
    let top100tuLabels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    let barTrace = {
      x:top10SampleValues,
      y:top100tuIds.map(id => `OTU ${id}`),
      text:top100tuLabels,
      type: "bar",
      orientation: "h"
    };
    // Don't forget to slice and reverse the input data appropriately
    let barLayout = {
      title: "Top 10 OTUs",
      xaxis:{title: "Sample Values"},
      yaxis:{title: "OTU ID"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();
