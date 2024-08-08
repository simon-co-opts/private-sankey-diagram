# This Example Will Be Used As A Reference

## Titanic Parallel Sets Visualisation Example

This project provides a data and script example for visualising Titanic passenger data using D3 Sankey diagrams. The data is structured to show the flow from survival status to gender, age group, and class.

## Overview

The visualisation uses parallel sets to represent the relationships between different categories of Titanic passenger data:

1. Survival Status
2. Gender
3. Age Group
4. Class

## Data Structure

The data is represented in a JSON structure with nodes and links to map the relationships between different categories.

### Nodes

The nodes represent unique values in each category:

* Survival Status: 
  - Perished (0)
  - Survived (1)
* Gender: 
  - Male (2)
  - Female (3)
* Age Group: 
  - Adult (4)
  - Child (5)
* Class: 
  - Crew (6)
  - Third Class (7)
  - Second Class (8)
  - First Class (9)

### Links

The links define the connections between these nodes with source and target indices, and the number of individuals represented by the value.

## Example JSON Structure

```json
{
  "nodes": [
    { "name": "Perished" },  // 0
    { "name": "Survived" },  // 1
    { "name": "Male" },      // 2
    { "name": "Female" },    // 3
    { "name": "Adult" },     // 4
    { "name": "Child" },     // 5
    { "name": "Crew" },      // 6
    { "name": "Third Class" }, // 7
    { "name": "Second Class" }, // 8
    { "name": "First Class" }   // 9
  ],
  "links": [
    // Links from Survived/Perished to Male/Female
    { "source": 0, "target": 2, "value": 670 }, // Perished -> Male
    { "source": 0, "target": 2, "value": 387 }, // Perished -> Male
    { "source": 0, "target": 2, "value": 154 }, // Perished -> Male
    { "source": 0, "target": 2, "value": 118 }, // Perished -> Male
    { "source": 0, "target": 2, "value": 35 },  // Perished -> Male
    { "source": 0, "target": 2, "value": 17 },  // Perished -> Male
    { "source": 0, "target": 2, "value": 5 },   // Perished -> Male
    { "source": 0, "target": 3, "value": 98 },  // Perished -> Female
    { "source": 0, "target": 3, "value": 13 },  // Perished -> Female
    { "source": 0, "target": 3, "value": 4 },   // Perished -> Female
    { "source": 0, "target": 3, "value": 17 },  // Perished -> Female
    { "source": 0, "target": 3, "value": 4 },   // Perished -> Female
    { "source": 0, "target": 3, "value": 1 },   // Perished -> Female
    { "source": 1, "target": 2, "value": 192 }, // Survived -> Male
    { "source": 1, "target": 2, "value": 75 },  // Survived -> Male
    { "source": 1, "target": 2, "value": 14 },  // Survived -> Male
    { "source": 1, "target": 2, "value": 57 },  // Survived -> Male
    { "source": 1, "target": 2, "value": 13 },  // Survived -> Male
    { "source": 1, "target": 2, "value": 5 },   // Survived -> Male
    { "source": 1, "target": 3, "value": 20 },  // Survived -> Female
    { "source": 1, "target": 3, "value": 76 },  // Survived -> Female
    { "source": 1, "target": 3, "value": 80 },  // Survived -> Female
    { "source": 1, "target": 3, "value": 140 }, // Survived -> Female
    { "source": 1, "target": 3, "value": 14 },  // Survived -> Female
    { "source": 1, "target": 3, "value": 14 },  // Survived -> Female
    { "source": 1, "target": 3, "value": 1 },   // Survived -> Female
    
    // Links from Male/Female to Adult/Child
    { "source": 2, "target": 4, "value": 670 }, // Male -> Adult
    { "source": 2, "target": 4, "value": 387 }, // Male -> Adult
    { "source": 2, "target": 4, "value": 154 }, // Male -> Adult
    { "source": 2, "target": 4, "value": 118 }, // Male -> Adult
    { "source": 2, "target": 4, "value": 35 },  // Male -> Adult
    { "source": 2, "target": 4, "value": 17 },  // Male -> Adult
    { "source": 2, "target": 4, "value": 5 },   // Male -> Adult
    { "source": 2, "target": 4, "value": 192 }, // Male -> Adult
    { "source": 2, "target": 4, "value": 75 },  // Male -> Adult
    { "source": 2, "target": 4, "value": 14 },  // Male -> Adult
    { "source": 2, "target": 4, "value": 57 },  // Male -> Adult
    { "source": 2, "target": 4, "value": 13 },  // Male -> Adult
    { "source": 2, "target": 4, "value": 5 },   // Male -> Adult
    { "source": 2, "target": 5, "value": 35 },  // Male -> Child
    { "source": 2, "target": 5, "value": 17 },  // Male -> Child
    { "source": 2, "target": 5, "value": 5 },   // Male -> Child
    { "source": 2, "target": 5, "value": 13 },  // Male -> Child
    { "source": 2, "target": 5, "value": 5 },   // Male -> Child
    { "source": 2, "target": 5, "value": 13 },  // Male -> Child
    { "source": 2, "target": 5, "value": 5 },   // Male -> Child
    { "source": 2, "target": 5, "value": 13 },  // Male -> Child
    { "source": 3, "target": 4, "value": 98 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 13 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 4 },   // Female -> Adult
    { "source": 3, "target": 4, "value": 17 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 4 },   // Female -> Adult
    { "source": 3, "target": 4, "value": 1 },   // Female -> Adult
    { "source": 3, "target": 4, "value": 20 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 76 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 80 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 140 }, // Female -> Adult
    { "source": 3, "target": 4, "value": 14 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 14 },  // Female -> Adult
    { "source": 3, "target": 4, "value": 1 },   // Female -> Adult
    { "source": 3, "target": 5, "value": 17 },  // Female -> Child
    { "source": 3, "target": 5, "value": 4 },   // Female -> Child
    { "source": 3, "target": 5, "value": 1 },   // Female -> Child
    { "source": 3, "target": 5, "value": 14 },  // Female -> Child
    { "source": 3, "target": 5, "value": 14 },  // Female -> Child
    { "source": 3, "target": 5, "value": 1 },   // Female -> Child

    // Links from Adult/Child to Class
    { "source": 4, "target": 6, "value": 670 },  // Adult -> Crew
    { "source": 4, "target": 7, "value": 387 },  // Adult -> Third Class
    { "source": 4, "target": 8, "value": 154 },  // Adult -> Second Class
    { "source": 4, "target": 9, "value": 118 },  // Adult -> First Class
    { "source": 5, "target": 7, "value": 35 },   // Child -> Third Class
    { "source": 5, "target": 8, "value": 17 },   // Child -> Second Class
    { "source": 5, "target": 9, "value": 5 },    // Child -> First Class
    { "source": 4, "target": 6, "value": 192 },  // Adult -> Crew
    { "source": 4, "target": 7, "value": 75 },   // Adult -> Third Class
    { "source": 4, "target": 8, "value": 14 },   // Adult -> Second Class
    { "source": 4, "target": 9, "value": 57 },   // Adult -> First Class
    { "source": 5, "target": 7, "value": 13 },   // Child -> Third Class
    { "source": 5, "target": 9, "value": 5 }     // Child -> First Class
  ]
}
```

## Usage

To use this JSON data in a D3 Sankey diagram:

1. **Prepare the Data**: Ensure the JSON data is available and correctly formatted.
2. **Load the Data**: Load the JSON data into your D3 script.
3. **Create the Sankey Diagram**: Use the D3 Sankey layout to create and render the diagram based on the loaded data.

## Example Visualisation

For a working example of this visualisation, see the [ObservableHQ Parallel Sets](https://observablehq.com/@d3/parallel-sets) project.

## Contributing

To contribute to this feature:

1. Pull the latest version to your branch.
2. Create a new folder in the root for your version.
3. Copy all the folders and files into your folder.
4. Run `git pull` to check for any updates.
5. Push your version to the branch.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
