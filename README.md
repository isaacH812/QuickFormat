# Quick Format
Quick is a small text formater that runs locally. It's currently capable of basic formatting using a LaTeX + Tailwind like syntax.

## Starting
Enter the project and install the dependencies using ```npm install```, then just run the shell script ```./start.sh```. It should be running on localhost port 3000.

## Syntax
Quick works using two basic nodes: Tags and Text. The full library of avaible tags and attributes will have to eventually be turned into manual. For now look at the attributeMap.js and parser.js class. 

The general prinicpal is using tags to place text on the document using LaTeX sytnax for tags and Tailwind like names for attributes. For example, to display a collumn of text with some margin above would be:
```
\Col{ 
    \A{Text line 1}
    \A[mt-2]{ Text line 2}
    \A[mt-2]{ Text line 3}
}
```
Currently attribute values are parsed to pixels, so in the example margin top for line 2 and 3 is 2px. The main tag name 'Col' or 'A' are just divs with already given attributes like flex row. The idea is to have many tags that do the work for you with attributes for fine tuning. In this case, the tag 'A' doesn't map anything in which case it just returns a blank div.
