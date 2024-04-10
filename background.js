// background.js

function loadTextFile(filePath) {
  // Get the URL of the text file within the extension directory
  const fileURL = chrome.runtime.getURL(filePath);

  // Use fetch to load the file content
  fetch(fileURL)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Failed to load file: ${filePath}`);
          }
          return response.text();
      })
      .then(fileContent => {
          // Process the loaded file content
          console.log(`Loaded content from ${filePath}:`, fileContent);

          try {
            getCampDataArray()
                .then(campDataArray => {
                    console.log('Existing camp data:', campDataArray);
                    let newCampDataArray = JSON.parse(fileContent)
                    // Merge the new camp data into the existing camp data array
                    newCampDataArray.forEach(newCamp => {
                        // Check if the new camp profileName does not exist in the existing campDataArray
                        const isProfileNameUnique = !campDataArray.some(oldCamp => oldCamp.profileName === newCamp.profileName);
    
                        if (isProfileNameUnique) {
                            // Add the new camp to the existing campDataArray
                            newCamp.isActive = false;
                            campDataArray.push(newCamp);
                        }
                    });
    
                    // Save the updated camp data array to local storage
                    chrome.storage.local.set({ 'campDataArray': campDataArray }, function() {
                        console.log('Camp data updated and saved successfully in init load');
                    });
                })
                .catch(error => {
                    console.error('Error retrieving camp data:', error);
                });
        } catch (error) {
            console.error('Error parsing clipboard content:', error);
        }

          // Perform operations with the loaded content (e.g., display in popup)
          // Example: document.getElementById('fileContent').textContent = fileContent;
      })
      .catch(error => {
          console.error('Error loading file:', error);
          // Handle error (e.g., display error message to user)
      });
}

function getCampDataArray() {
  return new Promise((resolve, reject) => {
      chrome.storage.local.get('campDataArray', function(data) {
          const campDataArray = data['campDataArray'] || [];

          resolve(campDataArray); // Resolve the Promise with campDataArray
      });
  });
}

// Usage: Load and read the content of myfile.txt




// Listen for the onInstalled event
chrome.runtime.onInstalled.addListener((details) => {
  // Check if the extension was newly installed
  if (details.reason === 'install') {
    // Perform initialization tasks when the extension is first installed
    console.log('Extension installed!');

    // Example: Set initial extension state or perform setup tasks
    chrome.storage.local.set({'autoCampaign': true});
    chrome.storage.local.set({'autoNext': true});
    loadTextFile('data/camp_template.txt');

  }
});


chrome.commands.onCommand.addListener(function(command) {
    if (command === "executeShortcut") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "logHello" });
          });
    }
  });


// chrome.action.onClicked.addListener
  chrome.action.onClicked.addListener(function(tab) {
    // chrome.tabs.executeScript(tab.id, { file: 'content.js' });

    // testStorage();
    
  });
  
  function injectJs() {
    // chrome.scripting.executeScript({
    //   target: {tabId: tab.id},
    //   files: ['content.js']
    // });
  }

  function testStorage() {
    const data = {
      username: 'exampleUser',
      userId: 12345,
      preferences: {
          theme: 'dark',
          notifications: true
      }
    };
    
    // Write data to local storage
    chrome.storage.local.set({ 'myData': data }, function() {
      console.log('Data saved to local storage');
    });
  }


//   // Example data to save


  // Listen for messages from content.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Send the received message to popup.js
  chrome.runtime.sendMessage({ dataFromContent: message.dataFromContent });
});



console.log('called bg');