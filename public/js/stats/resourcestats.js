// Function to draw bar charts
function drawBarChart(chartId, data, xLabel, yLabel, chartTitle) {
    // Sort data numerically in ascending order based on the count
    data.sort((a, b) => a.count - b.count);

    // Set up SVG dimensions and margins
    const svg = d3.select(chartId);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };

    // Create scales for the x and y axes
    const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(chartTitle);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("class", "axis-label");

    // Create a tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "white")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("opacity", 0);

    // Draw the bars and add hover tooltip functionality
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.label))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth())
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${xLabel}: ${d.label}<br>${yLabel}: ${d.count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Add x-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text(xLabel);

    // Add y-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("dy", ".75em")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(yLabel);
}

// Draw the original bar charts for resources per year and per tag
const resourcesPerYearData = <%- JSON.stringify(totalPerYear.map(({ year, count }) => ({ label: year, count }))) %>;
const resourcesPerTagData = <%- JSON.stringify(totalPerTag.map(({ tag, count }) => ({ label: tag, count }))) %>;

drawBarChart("#resourcesPerYearChart", resourcesPerYearData, "Year", "Count", "Resources per Year");
drawBarChart("#resourcesPerTagChart", resourcesPerTagData, "Tag", "Count", "Resources per Tag");

// Function to draw the author bar chart and link it with the table
function drawAuthorBarChart(chartId, data, xLabel, yLabel, chartTitle) {
    // Sort data numerically in ascending order based on the count
    data.sort((a, b) => a.count - b.count);

    // Set up SVG dimensions and margins
    const svg = d3.select(chartId);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };

    // Create scales for the x and y axes
    const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(chartTitle);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("class", "axis-label");

    // Draw bars with brushing
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.label))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth())
        .on("click", function (_, d) {
            // Highlight the clicked bar
            d3.selectAll(".bar").classed("highlight", false);
            d3.select(this).classed("highlight", true);

            // Highlight the matching row in the table
            d3.selectAll("#resourcesPerAuthorTable tbody tr")
                .classed("highlight", false)
                .filter(function () {
                    return d3.select(this).attr("data-author") === d.label;
                })
                .classed("highlight", true);
        });

    // Add x-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text(xLabel);

    // Add y-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("dy", ".75em")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(yLabel);
}

// Data for the author chart, from the controller
const resourcesPerAuthorData = <%- JSON.stringify(totalPerAuthor.map(({ authorName, count }) => ({ label: authorName, count }))) %>;

// Draw author bar chart with brushing and linking
drawAuthorBarChart("#resourcesPerAuthorChart", resourcesPerAuthorData, "Author", "Count", "Resources per Author");