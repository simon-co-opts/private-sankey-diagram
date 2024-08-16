## Sankey Diagram Widget 

### Feature Overview
The Sankey diagram widget visually represents the flow and distribution of the most frequently used words by a patient during therapy sessions. This visualisation helps both the patient and therapist understand communication patterns, aiding in identifying concerns, avoiding bias, and improving the effectiveness of the treatment.

## Dependencies and Setup

## Libraries/Framework/Data Files:

### D3.js (Data-Driven Documents): 
Utilised for data computation and rendering of the Sankey Diagram.

### d3-sankey: 
A specific library used for generating the Sankey diagram.

### UI Framework: 
The widget's UI components is built using React

### Data Input: 
The widget reads data from JSON files, specifically those listed in sessionsList.json.

## Submodule Setup
To make the widget accessible on GitHub, a .gitmodules file has been created with the following content:

```
[submodule "my-sankey-diagram"]
path = my-sankey-diagram
url = https://github.com/simon-co-opts/private-sankey-diagram.git
```

## Table of Contents
1. [Overview](#sankey-diagram-widget-overview)
2. [Dependencies and Setup](#dependencies-and-setup)
3. [Detailed File Documentation](#detailed-file-documentation)
4. [Known Issues](#known-issues)
5. [Future Developments and Ideas](#future-developments-and-ideas)
6. [Contact Details](#contact-details)


## File Tree Structure

```
my-sankey-diagram
┣ 📂build
┃ ┣ 📂static
┃ ┃ ┣ 📂css
┃ ┃ ┃ ┣ 📜main.0f7fc86f.css
┃ ┃ ┃ ┗ 📜main.0f7fc86f.css.map
┃ ┃ ┗ 📂js
┃ ┃   ┣ 📜453.e8e2e93c.chunk.js
┃ ┃   ┣ 📜453.e8e2e93c.chunk.js.map
┃ ┃   ┣ 📜main.934f821b.js
┃ ┃   ┣ 📜main.934f821b.js.LICENSE.txt
┃ ┃   ┗ 📜main.934f821b.js.map
┃ ┣ 📂testData
┃ ┃ ┣ 📜Access Your Anger - Hayley Ep 5_pretty_tx.json
┃ ┃ ┣ 📜Celebrate Your Goodness - Hayley Ep 4_pretty_tx.json
┃ ┃ ┣ 📜Discover Your Hidden Strength - Hayley Ep 7_pretty_tx.json
┃ ┃ ┣ 📜haleysession1.json
┃ ┃ ┣ 📜haleysession2.json
┃ ┃ ┣ 📜haleysession3.json
┃ ┃ ┣ 📜haleysession4.json
┃ ┃ ┗ 📜Listen To Your Inner Child - Hayley Ep 6_pretty_tx.json
┃ ┣ 📜asset-manifest.json
┃ ┗ 📜index.html
┣ 📂public
┃ ┣ 📂testData
┃ ┃ ┣ 📜Access Your Anger - Hayley Ep 5_pretty_tx.json
┃ ┃ ┣ 📜Celebrate Your Goodness - Hayley Ep 4_pretty_tx.json
┃ ┃ ┣ 📜Discover Your Hidden Strength - Hayley Ep 7_pretty_tx.json
┃ ┃ ┣ 📜haleysession1.json
┃ ┃ ┣ 📜haleysession2.json
┃ ┃ ┣ 📜haleysession3.json
┃ ┃ ┣ 📜haleysession4.json
┃ ┃ ┗ 📜Listen To Your Inner Child - Hayley Ep 6_pretty_tx.json
┃ ┗ 📜index.html
┣ 📂src
┃ ┣ 📂components
┃ ┃ ┣ 📜ErrorBoundary.js
┃ ┃ ┣ 📜FilterComponent.js
┃ ┃ ┗ 📜Tooltip.js
┃ ┣ 📂data
┃ ┃ ┣ 📜Access Your Anger - Hayley Ep 5_pretty_tx.json
┃ ┃ ┣ 📜Celebrate Your Goodness - Hayley Ep 4_pretty_tx.json
┃ ┃ ┣ 📜Discover Your Hidden Strength - Hayley Ep 7_pretty_tx.json
┃ ┃ ┣ 📜Listen To Your Inner Child - Hayley Ep 6_pretty_tx.json
┃ ┃ ┣ 📜oldSessionsList.json
┃ ┃ ┗ 📜sessionsList.json
┃ ┣ 📂redux
┃ ┃ ┣ 📜sankeySlice.js
┃ ┃ ┗ 📜store.js
┃ ┣ 📂scripts
┃ ┃ ┗ 📜processJsonFiles.js
┃ ┣ 📂styling
┃ ┃ ┗ 📜Tooltip.css
┃ ┣ 📂visualisation
┃ ┃ ┗ 📜SankeyDiagram.js
┃ ┣ 📜App.css
┃ ┣ 📜App.test.js
┃ ┣ 📜index.css
┃ ┣ 📜index.html
┃ ┣ 📜index.jsx
┃ ┣ 📜reportWebVitals.js
┃ ┣ 📜SankeyApp.js
┃ ┣ 📜setupTests.js
┃ ┗ 📜sudoCode.js
┣ 📜.gitignore
┣ 📜package.json
┗ 📜README.md
```

## Detailed File Documentation

## 1. SankeyApp.js
The SankeyApp.js file serves as the main entry point for rendering the Sankey Diagram. It manages data fetching, user interaction, and passes processed data to the SankeyDiagram component for visualisation.

## Dependencies:

### React: 
Used for component creation and state management via hooks (useState, useEffect).

### SankeyDiagram: 
A custom component that handles the visualisation of the Sankey Diagram.

### sessionsList.json: 
Contains the list of JSON files representing session data.

## Key Components and Functions:

### State Management data: 
Holds the session data post-fetching and processing.

### topWords: 
Determines the number of top words to display in the Sankey Diagram, defaulting to 5, expandable to 25 words maximum.

### Data Fetching and Processing:
Data is fetched asynchronously from the JSON files listed in sessionsList.json and is processed to extract word frequencies.

### User Interaction:
A slider allows users to select the number of top words to display, which updates the topWords state.

### Session Management:
The getRecentSessions function selects recent and preceding sessions to ensure relevant data is displayed.

### Data Filtering:
The filterData function filters session data to display the most recent sessions and selects the top N words for each session.

### Rendering the Component:
The component renders a title, slider, and the SankeyDiagram component based on the filtered data.

### Export:
The App component is exported as the default export.

## 2. SankeyDiagram.js
This file contains a React component that uses D3.js to render a Sankey diagram, visualising data flow between sessions. Nodes represent top words, and links represent their connections across sessions.

## Dependencies:

### React: 
Utilised for component lifecycle management.

### D3.js: 
For handcling calcualtions, generating and customising the Sankey diagram.

### Tooltip Component: 
A custom React component used for displaying tooltips.

## Functionality:

### Colour Scheme:
Utilises D3's scaleOrdinal to map categories to specific colours, differentiating nodes by session.

### Data Transformation:
The transformDataToSankeyFormat function processes session data into a format suitable for D3’s Sankey layout.

### Rendering and Interactivity:
The component manages user interactions such as hovering over nodes, which triggers tooltips providing additional information.


## 3. Tooltip.js

The Tooltip component is a reusable React component that displays contextual information when hovering over elements like nodes or links in a chart or diagram.

### Dependencies:

### React: 
The component is built using React.

### Tooltip.css: 
Provides custom styling for the tooltip.

## Props:

### tooltipData: 
Contains data such as name, value, target, and session to be displayed within the tooltip.

### position: 
An object that specifies the x and y coordinates for positioning the tooltip.

### Usage:
The tooltip is positioned absolutely based on the position prop, making it versatile for various UI contexts.

### Styling: 
The visual appearance is controlled by the external Tooltip.css file.

## 4. index.js

### Imports: 
React, ReactDOM, App component, and Redux store are imported to enable rendering and state management.

### Root Creation: 
Utilises ReactDOM.createRoot to create a root for rendering the React application.

### Rendering: 
The App component is rendered into the root, wrapped with the Provider component to connect the Redux store to the application.

### Summary:

This file sets up the root node and integrates Redux for global state management, crucial for applications needing consistent state across multiple components.


## Known Issues with SankeyApp.js

This section outlines the current known issues associated with the SankeyApp.js file and its components. Each issue is described along with potential causes and solutions. This section should be updated as new issues are discovered or resolved.

## Data Fetching Delays

### Problem: 
There may be noticeable delays when fetching session data from multiple JSON files, especially if the files are large or the network is slow.

### Potential Cause:
The use of Promise.all for concurrent data fetching may result in longer delays when handling a large number of files or when individual files are particularly large.

### Possible Solution: 
Consider implementing lazy loading or pagination to fetch data in smaller, more manageable chunks, which may improve the responsiveness of the application.
 
## Tooltip Positioning on Small Screens

### Problem:
On smaller devices or screens, the tooltip may appear off-screen or in an unintended position.

### Potential Cause:
The position prop used to calculate the tooltip's location might not account for smaller viewport sizes, leading to improper placement.

### Possible Solution:
Enhance the positioning logic to ensure the tooltip remains within the viewport. Implementing a responsive design for the tooltip may also help resolve this issue.
 
## Top Words Slider Responsiveness

### Problem:
The slider controlling the number of top words might not respond smoothly, particularly on mobile devices.

### Potential Cause:
The default behaviour of the range input might not be optimised for touch events on mobile devices.

### Possible Solution:
Consider using a more mobile-friendly range slider component or library to enhance responsiveness.

## Inconsistent Colour Mapping

### Problem: 
The colour mapping of nodes in the Sankey Diagram may not be consistent across different sessions.

### Potential Cause:
The D3 scaleOrdinal function generates a new scale each time it is called, which may result in different colours being assigned to the same categories if the order or number of categories changes.

### Possible Solution:
To maintain consistent colour mapping, consider caching the scale or ensuring consistent input to the scaleOrdinal function.

## General Problems and Potential Solutions

### Incorrect Node Alignment in the Sankey Diagram Problem:
The alignment of nodes in the Sankey Diagram may not be set up correctly, resulting in nodes being displayed incorrectly. Below is an example of what the Sankey Diagram widget should look like when displaying the top 5 words for each session:

![Sankey Diagram Mock-Up](../public/testData/images/sankey_mockup.jpg)

### Potential Causes:
D3.js performs its own calculations for layout, which may not align with the transformations applied to the data before passing it to D3.

No alignment-specific functions (e.g., left, right, centre, justify) have been implemented.

### Possible Solutions:

Allow D3.js to handle the calculations for nodes and links without overriding them, as D3.js is generally reliable in this regard.

Add alignment options to the Sankey Diagram’s functionality and styling, and provide a selection option for alignment in the dashboard.

## Incorrect Source, Target, and Value Data for Links

### Problem:
The source, target, and value data for the links in the Sankey Diagram are not being generated correctly.

### Potential Causes:
The source and target data might be using full names and words instead of abbreviating session names and combining them with the index number of the word being displayed.

### Possible Solutions:
Investigate methods for pre-calculating nodes and links during the creation of the JSON data for a session. This would allow for a hardcoded version of the data to be fetched, ensuring that it is consistently displayed as intended.

## Future Developments and Ideas

### Dashboard Integration: 
The Sankey Diagram widget needs to be converted to Redux integrated into the dashboard within its assigned container.

### Word Tree Linking: 
When a word is clicked in the Sankey Diagram widget it needs to take the user to the word tree for that specific word within an utterance to provide the user with context.

### Emotional Arcs: 
Once this data becomes available, in the Tooltip it should have an additional symbol or statement added to show the sentiment along with the word.

### Total Usage Word Counter: 
As a user moves from session to session it might be worth showing the total amount of times the user said a particular word, which should increase as they move from session to session where a word has been used in the top 5-25 words. 

If you have questions regarding the widget and any information provided in this document, feel free to get in touch:

## Contact Details
Original developer: Simon McKenzie
GitHub: https://github.com/simon-co-opts
