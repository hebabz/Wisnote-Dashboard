# Wisnote-Dashboard
## Description

Wasabi is a database that lists a very large number of songs, albums, and artists, with a number of errors due to the use of several different sources to gather as much information as possible about the musics. To overcome this, an annotation tool exists so that a user can notify any errors, remarks or questions that they would like to raise on the Wasabi website. These annotations are retrieved in the form of a JSON file and are precisely listed, notably by type of annotation, by type of commented element, by author of the note, date of creation and modification...

This work is already done, all that remains is to process this JSON data to make a visualization and thus be able to exploit this feedback as best as possible.

The goal of the project is to generate a visual representation of these annotations to facilitate their management, to have statistics, to identify trends. The desired format is twofold: a table and a graphical representation. There are many annotation tools such as LabelBox which is often cited and recommended in comparisons, Adobe Acrobat which allows you to annotate PDF files, or JIRA Capture created for the task manager of the same name, JIRA. However, the analytical aspect of these tools is much less exploited than what is planned here. The innovative part of this project lies in its ability to generate more advanced interactive analyses and statistics than the existing ones, which often limit themselves to presenting the proportion of annotations by type of annotation. Here, it is planned to allow the user to realize other clusters such as a concentration of annotations on an artist's page, which would indicate that the data on the page is probably to be redone from scratch. The innovation mainly lies in the flexibility of the use of statistics allowed to users.

## Symbols of the types of annotations
| Comment | Defect | Question | Other
| :---: | :---: | :---: | :---: |
| ![Square](src/images/square.png) | ![Triangle](src/images/triangle.png) | ![Circle](src/images/circle.png) | ![Star](src/images/star.png) |

## How to launch
- Have `npm` installed.
- Run `npm install` to install dependencies.
- Run `npm start` to start the server.

## How to use
- Click on the `Upload file` button then 'Choose file' to select the JSON file to upload (the URL version of the upload is not compeltely ready).
- Find in the `src/examples` folder one example of a valid JSON file to upload.

## Incoming features
- Tooltip for each symbol in the table and the graph to display more information.
- The arrangement is going to evolve to introduce a totally vertical layout with accordion interactions.
- A color palette will be chosen
- Both visualizations will be more interactive.
- Introduction of a legend zone to explain the meaning of the symbols.

## Technologies
- D3.js
- Bootstrap
- Express

## Copyright
This is a university project, all rights are reserved to the I3S laboratory, especially the lead of the Wisnote project: [Maroua Tikat](https://univ-cotedazur.fr/annuaire/maroua-tikat).