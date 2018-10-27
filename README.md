# chrome-beauty-extension
Chrome Extension for Cosmetics Ingredients

Available on the web store:
https://chrome.google.com/webstore/detail/beautyhelper/ffgflmclckheihbaejnnfodhjiegiicm

## src

### css
Custom css for dashboard and ingredients

### data
Scraped ingredients data in JSON format

### html
The popup pages, `dashboard.html` for searching products and `ingredients.html` for parsing ingredients

### img
Icon images

### js
`background.js` background script sets up context menus and fetches the data 
`dashboard.js` Setup event handlers for the dashboard links and activate them on enter
`ingredients.js` Parse ingredients text and search against the data
