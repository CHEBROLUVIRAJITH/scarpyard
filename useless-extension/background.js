chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({ url: "https://www.example.com" });
  });
  
