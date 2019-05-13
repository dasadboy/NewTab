# AnotherNewTab

A chrome extension that changes your new tab page. Allows you to use your own backgrounds and displays news articles from the sources you enter.

## Getting Started

Download or clone the directory.

Add backgrounds into the "backgrounds" folder then:
  * if you have windows, run "loadbgs.bat"
  * if you have mac or linux (or prefer to use a bash script over a batch script), run "loadbgs.sh"
  * if you have python installed you can choose to use "loadbgs.py" but it does the same as the other two
  The bgs.js file should now contain an array of the filenames in the "backgrounds" folder.

Add a cors proxy server.
  * Cors policy forbids access to resources without the proper headers
  * You'll need a proxy that will add the proper headers for you.
  * Find one online or create one yourself
  * A few exist such as https://crossorigin.me and https://cors.io but aren't all extremely reliable.
  * [Here](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347) is a list of available proxies.
  * There is a helpful resource [here](https://github.com/Rob--W/cors-anywhere) that gives you the code and instructions to make one yourself. They also provide a live demo server, but it's use is for *demo purposes only*. I strongly suggest you use the code to start your own server for general use purposes.

Add news feeds in options:
  1. Obtain url to an RSS feed.
  ```
  Example:
  CBC has a list of RSS feeds (https://rss.com/find-rss-feed/) that it hosts that can be obtained by simply googling "CBC rss".
  Some RSS feeds may be found in a similar way while others may require scouring a particular domain or even looking into a page's source code.
  Refer to https://rss.com/find-rss-feed/ for detailed instructions.
  ```
  2. Click the "Add Feed" button and enter a name of your choosing and the source feed
  ```
  Using the "Top Stories" feed out of the list of feeds by CBC News,
  "Top Stories" would go in the first box and "https://www.cbc.ca/cmlink/rss-topstories" would go in the second.
  ```
  *Alternatively* clicking the "Add Multiple" button takes you to a input text block. Here you can add multiple feeds.
  Feeds must be seperated by line. The feed name and url must be seperated by a comma
  ```
  Top Stories, https://rss.cbc.ca/lineup/topstories.xml
  World, https://rss.cbc.ca/lineup/world.xml
  Canada, https://rss.cbc.ca/lineup/canada.xml
  ```

Navigate through your bookmarks and select your favourite bookmarks by clicking them to display them on your new tab page. A maximum of 5 can be selected.

### Prerequisites

Google Chrome (version 70+)

### Installing

Go to settings and navigate to extensions.

Click on "Load unpacked" at the top right. Navigate to and select the folder containing the extension and press "Select Folder".

Right click the icon at the top and click on options, add sources, select favourite bookmarks as directed above.

## Acknowledgments

* The code [here](https://www.hongkiat.com/blog/rss-reader-in-javascript/) was used to fetch and parse feeds
* [Cors Anywhere](https://github.com/Rob--W/cors-anywhere) for the code and instructions to start my own server for testing purposes.
* Inspired by [this extension](https://chrome.google.com/webstore/detail/fullmetal-alchemist-broth/eabmpnbdcmnmckpcbcjflgndmgfifpnl?hl=en) that I stopped using for various reasons.
