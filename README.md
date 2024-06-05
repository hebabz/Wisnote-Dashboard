# Wisnote-Dashboard
## Description

Wasabi is a database that lists a very large number of songs, albums, and artists, with a number of errors due to the use of several different sources to gather as much information as possible about the musics. To overcome this, an annotation tool exists so that a user can notify any error, remark or question that they would like to raise on the Wasabi website. These annotations are retrieved in the form of a JSON file and are precisely listed, notably by type of annotation, by type of commented element, by author of the note, date of creation and modification...

This work is already done, all that remains is to process this JSON data to make a visualization and thus be able to exploit this feedback as best as possible.

The goal of the project is to generate a visual representation of these annotations to facilitate their management, to have statistics, to identify clusters. The desired format is a table representation, although a graphical one was also planned. There are many annotation tools such as LabelBox which is often cited and recommended in comparisons, Adobe Acrobat which allows you to annotate PDF files, or JIRA Capture created for the task manager of the same name, JIRA. However, the analytical aspect of these tools is much less exploited than what is planned here. The innovative part of this project lies in its ability to generate more advanced interactive analyses and statistics than the existing ones, which often limit themselves to presenting the proportion of annotations by type of annotation. Here, it is planned to allow the user to process the data with as many tools as possible, notably with filters and various ways to read information. The innovation mainly lies in the flexibility of the use of statistics allowed to users.

## Symbols of the types of annotations
| Comment | Defect | Question | Thesaurus | Other
| :---: | :---: | :---: | :---: | :---: |
| ![Square](src/images/square.png) | ![Triangle](src/images/triangle.png) | ![Diamond](src/images/diamond.png) | ![Resource](src/images/resource.png) |  ![Star](src/images/star.png) 

## Size of the symbols
| Size | Quantity of annotations |
| :---: | :---: |
| Small | 1 per type |
| Normal | 2 or more per type |

## Available features
- Upload by URL or by browsing your files.
- Consult an overview part in which various statistics are displayed.
- Consult a table representation in which are displayed data by web pages. The columns are: web page (name + link), total visible annotations, object annotations, web page annotations, website annotations.
- Each annotation type is represented once per cell, thus if there are many annotations of a same type they are automatically grouped in bigger symbols (size "Normal"). If not then a "Small" annotation is displayed.
- Each "Small" annotation is accompanied by a tooltip, and can be clicked to hide/show it.
- Each "Normal" annotation is accompanied with a counter of annotation (hidden or not), and can be clicked to generate single representations of these annotations.
- Filter by web page(s): show/hide rows
- Sort by: date (asc/desc), alphabetical (asc/desc), total (asc/desc)
- Summarize or show all: develop/regroup all "Normal" annotations
- Filter by annotation types: show/hide every annotations of the table of said type
- From/To: show/hide annotations whose dates don't match the slot
- Filter by object position: show/hide annotations 
- Filter by object description: show/hide annotations

## Enhancements possible
- Date should be a kind of a slider like in this example: ![image](https://github.com/hebabz/Wisnote-Dashboard/assets/42966652/fb7bbbc0-37e9-4677-82dc-14e4cda1b4fe).
- Lacks colors and liveliness, the design might feel a bit heavy UI-wise.
- Find a better logo

## Technologies
- Bootstrap
- Express

## How to launch
- Have `npm` installed.
- Run `npm install` to install dependencies.
- Run `npm start` to start the server.

## How to use
- Choose your favorite way to upload a way, fill the field, then click on "Upload".
- Find in the `src/examples` folder one example of a valid JSON file to upload.
- Consult the overview, and make use of the table.
- Once you refresh or leave the page, the data processing applied will be lost.

## Copyright
This is a university project, all rights are reserved to the I3S laboratory, especially the lead of the Wisnote project: [Maroua Tikat](https://univ-cotedazur.fr/annuaire/maroua-tikat).
