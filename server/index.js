const express = require("express");
const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
const path = require("path");
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

const css = "<style>" + fs.readFileSync(path.join(__dirname, "../client/preview.css"), "utf8") + "</style>";


app.post("/convert", async (req, res) => {
  try {
    const content = css + " " + req.body.html;
    const htmlPDF = new PuppeteerHTMLPDF();
    //  width: 615px;
    //  height: 792px;
    const options = {
      path: `${__dirname}/sample.pdf`,
      width: "615px",
      height: "792px",
    };
    htmlPDF.setOptions(options);
    await htmlPDF.create(content);
    console.log("PDF made successfully! YAY")
  } catch (error) {
    console.log("PuppeteerHTMLPDF error", error);
  }
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));