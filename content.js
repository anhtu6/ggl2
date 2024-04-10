console.log('----content called');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'saveCampaign') {

        saveCampaignData(message.campName);
    }
});




async function waitForElementAndClick2(conditionCallback, callback = null) {
    const element = await findElementByCondition2(conditionCallback);
    if (element) {
        element.click();
        if (typeof callback === 'function') {
            callback();
        }
    }
}

function findElementByCondition2(callback) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const elements = document.querySelectorAll('*');
                    elements.forEach((element) => {
                        if (callback(element)) {
                            observer.disconnect();
                            resolve(element);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// 3e
async function waitForElementAndClick3(conditionCallback, callback = null) {
    try {
        const element = await findElementByCondition(conditionCallback);
        if (element) {
            element.click();
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            throw new Error('Element not found or condition not met.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function findElementByCondition3(callback) {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutationsList, observer) => {
            const elements = document.querySelectorAll('*');
            for (let element of elements) {
                if (callback(element)) {
                    observer.disconnect();
                    resolve(element);
                    return;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
// 3e


async function autoCampContentSteps() {
    await waitForElementAndClick3(
        (element) => element.tagName.toLowerCase() === 'material-fab' && element.getAttribute('aria-label') === 'Create', async() => {})

    await waitForElementAndClick3(
        (element) => element.tagName.toLowerCase() === 'material-select-item' && element.getAttribute('aria-label') === 'Campaign',
        async () => { // Make the callback function async
            console.log('Clicked on "Create" and "Campaign" successfully.');
            // Add more steps or actions here as needed
            // Use await for asynchronous operations

            await waitForElementAndClick3(
                (element) => element.tagName.toLowerCase() === 'material-icon' && element.classList.contains('edit-icon'),
                async () => {
                    console.log('Clicked on edit icon successfully.');
                    // Perform additional actions after clicking on edit icon

                    // chon account manual, then:
                    function waitForMarketingObjectives() {
                        const selectionView = document.querySelector('marketing-objective-selection-view-v4');
                        const objectiveCards = document.querySelectorAll('marketing-objective-card-v2');
                    
                        // Check if both elements are present
                        return selectionView && objectiveCards.length > 0;
                    }
                    async function clickFirstMarketingObjectiveCard() {
                        await waitForElementAndClick3(
                            waitForMarketingObjectives,
                            () => {
                                const firstCard = document.querySelectorAll('marketing-objective-card-v2')[0];
                                if (firstCard) {
                                    firstCard.click();
                                    console.log('Clicked on the first marketing objective card.');
                                } else {
                                    console.error('First marketing objective card not found.');
                                }
                            }
                        );
                    }
                    await clickFirstMarketingObjectiveCard();

                    function waitForChannelSelection() {
                        const selectionView = document.querySelector('channel-selection-view-v3');
                        const channelCards = document.querySelectorAll('channel-selection-card-v2');
                    
                        // Check if both elements are present
                        return selectionView && channelCards.length > 0;
                    }
                    
                    // Usage: Wait for channel selection elements to appear and then click the first card
                    async function clickFirstChannelSelectionCard() {
                        await waitForElementAndClick3(
                            waitForChannelSelection,
                            () => {
                                const firstCard = document.querySelectorAll('channel-selection-card-v2')[0];
                                if (firstCard) {
                                    firstCard.click();
                                    console.log('Clicked on the first channel selection card.');
                                } else {
                                    console.error('First channel selection card not found.');
                                }
                            }
                        );
                    }
                    
                    // Call the function to start waiting for the elements and perform the click action
                    await clickFirstChannelSelectionCard();

                    // tactic
                    function waitForTacticSelection() {
                        const selectionView = document.querySelector('tactics-selection');
                        const channelCards = document.querySelectorAll('material-checkbox');
                    
                        // Check if both elements are present
                        return selectionView && channelCards.length > 0;
                    }
                    
                    // Usage: Wait for channel selection elements to appear and then click the first card
                    async function clickFirstTactic() {
                        await waitForElementAndClick3(
                            waitForTacticSelection,
                            () => {
                                document.querySelectorAll('tactics-selection')[0].querySelectorAll('material-checkbox')[0].click()
                            }
                        );
                    }
                    
                    // Call the function to start waiting for the elements and perform the click action
                    await clickFirstTactic();
                    

                }
            );
        }
    );
}

chrome.storage.local.get('autoNext', function (data) {
    // Check if 'autoCampaign' exists in the stored data
    const isAutoNext = data.autoNext === undefined ? false : data.autoNext;
    if (!isAutoNext) return
    autoCampContentSteps()

});


function getActiveCamp() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('campDataArray', function (data) {
            const campDataArray = data['campDataArray'] || [];
            console.log('All campData:', campDataArray);

            for (let i = 0; i < campDataArray.length; i++) {
                try {
                    if (campDataArray[i].isActive) {
                        resolve(campDataArray[i]); // Resolve with the active campaign data
                        return;
                    }
                } catch (error) {
                    // Handle any error if needed
                }
            }

            resolve(null); // Resolve with null if no active campaign is found
        });
    });
}

function findElementByCondition(callback) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const elements = document.querySelectorAll('*');
                    for (let element of elements) {
                        if (callback(element)) {
                            observer.disconnect();
                            resolve(element);
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function waitForElementAndClick(conditionCallback, callback = null) {
    const element = await findElementByCondition(conditionCallback);
    if (element) {
        element.click();
        if (typeof callback === 'function') {
            callback();
        }
    }
}

// doi thu tu > bootloop
let previewText = "This preview shows potential ads assembled using your assets. Not all combinations are shown. Assets can be shown in any order, so make sure that they make sense individually or in combination, and don't violate our policies or local law. Some shortening may also occur in some formats. You can make sure certain text appears in your ad. Learn more"
waitForElementAndClick(element =>  element.tagName.toLowerCase() === 'div' && element.classList.contains('preview-info') && element.innerText == previewText, function () {
    setTimeout(() => {
        setCampaignData()
    }, 1000);
 })

function setCampaignData() {
    chrome.storage.local.get('autoCampaign', function (data) {
        // Check if 'autoCampaign' exists in the stored data
        const isExtensionOn = data.autoCampaign === undefined ? false : data.autoCampaign;
        if (!isExtensionOn) return
        getActiveCamp().then(activeCamp => {
            if (activeCamp) {
                setActiveCamp(activeCamp)
            }
        })

    });
}

function simulateCommaInput(inputElement, text) {
    // Focus on the input field
    inputElement.focus();

    // Simulate typing the text
    for (let i = 0; i < text.length; i++) {
        const keydownEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            key: text[i]
        });
        const keypressEvent = new KeyboardEvent('keypress', {
            bubbles: true,
            key: text[i]
        });
        const inputEvent = new Event('input', {
            bubbles: true
        });
        const keyupEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            key: text[i]
        });

        inputElement.dispatchEvent(keydownEvent);
        inputElement.dispatchEvent(keypressEvent);
        inputElement.value += text[i];
        inputElement.dispatchEvent(inputEvent);
        inputElement.dispatchEvent(keyupEvent);
    }

    // Simulate pressing the comma key
    // const commaKeydownEvent = new KeyboardEvent('keydown', {
    //     bubbles: true,
    //     key: ','
    // });
    // const commaKeypressEvent = new KeyboardEvent('keypress', {
    //     bubbles: true,
    //     key: ','
    // });
    // const commaInputEvent = new Event('input', {
    //     bubbles: true
    // });
    // const commaKeyupEvent = new KeyboardEvent('keyup', {
    //     bubbles: true,
    //     key: ','
    // });

    // inputElement.dispatchEvent(commaKeydownEvent);
    // inputElement.dispatchEvent(commaKeypressEvent);
    // inputElement.value += ',';
    // inputElement.dispatchEvent(commaInputEvent);
    // inputElement.dispatchEvent(commaKeyupEvent);
}

// function simulateInputEvents(inputElement, text) {
//     // Simulate events
//     const events = ['keydown', 'keypress', 'input', 'keyup', 'change'];

//     // Loop through each event and dispatch it
//     events.forEach(eventType => {
//         const event = new Event(eventType, { bubbles: true });
//         inputElement.dispatchEvent(event);
        
//         // For 'input' event, also update the input value
//         if (eventType === 'input') {
//             inputElement.value = text;
//         }
//     });

//     // Dispatch a final 'change' event
//     const changeEvent = new Event('change', { bubbles: true });
//     inputElement.dispatchEvent(changeEvent);
// }

function simulateInputEvents(inputElement, text) {
    // Simulate events
    const events = ['keydown', 'keypress', 'input', 'keyup', 'change'];

    // Loop through each event and dispatch it
    events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        inputElement.dispatchEvent(event);
        
        // For 'input' event, also update the input value
        if (eventType === 'input') {
            inputElement.value = text;
        }
    });

    // Dispatch a final 'change' event
    const changeEvent = new Event('change', { bubbles: true });
    inputElement.dispatchEvent(changeEvent);

    // Simulate pressing the space key (key code: 32)
    const spaceKeyDownEvent = new KeyboardEvent('keydown', { key: ' ' });
    inputElement.dispatchEvent(spaceKeyDownEvent);

    const spaceKeyUpEvent = new KeyboardEvent('keyup', { key: ' ' });
    inputElement.dispatchEvent(spaceKeyUpEvent);

    setTimeout(() => {
         // Simulate pressing the delete key (key code: 46)
    const deleteKeyDownEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    inputElement.dispatchEvent(deleteKeyDownEvent);

    const deleteKeyUpEvent = new KeyboardEvent('keyup', { key: 'Delete' });
    inputElement.dispatchEvent(deleteKeyUpEvent);
    }, 500);
}


function fillExpandableInputs(panelText, inputType ,addIconText, dataSource) {
     // Descriptions
     let panel = findInnermostExpansionPanelWithSpanText('material-expansionpanel', panelText)
     let inputs = panel.querySelectorAll(inputType)
     if(dataSource.length > inputs.length) {
         // max 15
         let addInputButton = findMaterialIconWithNextSibling('material-icon', 'add-icon', addIconText)
         let maxInputIterate = Math.max(6, dataSource.length - inputs.length)
         for(let i =0; i < maxInputIterate; i++){
             try {
                setTimeout(() => {
                    addInputButton.click()
                }, 200*maxInputIterate);
             } catch (error) {
                 
             }
         }
     }
     for(let i=0; i <dataSource.length; i++) {
         try {
            //  inputs[i].value = dataSource[i]
            // setTimeout(() => {
                // simulateInputEvents(inputs[i], dataSource[i])
                simulateCommaInput(inputs[i], dataSource[i])
            // }, 1000*i);
         } catch (error) {
             console.log(error);
         }
     }
}



function setActiveCamp(activeCamp) {
    try {
        let data = activeCamp.data
        simulateCommaInput(document.querySelector('material-input[minerva-id="keywords-url-input"]').querySelector('input'), data.mainSite)



        let targetInput = document.querySelector('multi-suggest-input[minerva-id="keywords-product-service-input"]').querySelector('input')
        let tags = data.keywordTag
        for (let i = 0; i < tags.length; i++) {
            setTimeout(() => {
                simulateCommaInput(targetInput, tags[i])
            }, i*800);
        }

        // list keyword
        simulateCommaInput(document.querySelector('textarea[aria-label="Enter or paste keywords. You can separate each keyword by commas or enter one per line."]'),data.keywords)
        // document.querySelector('textarea[aria-label="Enter or paste keywords. You can separate each keyword by commas or enter one per line."]').value = data.keywords

        simulateCommaInput(document.querySelector('input[aria-label="Final URL"]'), data.showToUserFinalUrl)
        // document.querySelector('input[aria-label="Final URL"]').value = data.showToUserFinalUrl

        // headlines

        // let headlinePanel = findInnermostExpansionPanelWithSpanText('material-expansionpanel', 'Headlines')
        // let headlines = data.headlines
        // let headlineInputs = headlinePanel.querySelectorAll('input')
        // if(headlines.length > headlineInputs.length) {
        //     // max 15
        //     let addHeadlineButton = findMaterialIconWithNextSibling('material-icon', 'add-icon', 'Headline')
        //     let maxHeadlineIterate = Math.max(6, headlines.length - headlineInputs.length)
        //     for(let i =0; i < maxHeadlineIterate; i++){
        //         addHeadlineButton.click()
        //     }
        // }
        // for(let i=0; i <headlines.length; i++) {
        //     try {
        //         headlineInputs[i].value = headlines[i]
        //         setTimeout(() => {
        //             headlineInputs[i].focus()
        //         }, 500*i);
        //     } catch (error) {
                
        //     }
        // }

        fillExpandableInputs('Headlines', 'input' , 'Headline', data.headlines)

        // fillExpandableInputs('Descriptions', 'textarea' , 'Description', data.descriptionTexts)

        

        

    } catch (error) {
        console.log(error);
    }
}

function findMaterialIconWithNextSibling(materialType, className, siblingText) {
    const elements = document.querySelectorAll(`${materialType}.${className}`);
    for (let element of elements) {
        const nextSibling = element.nextSibling;
        if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.trim() === siblingText) {
            return element;
        }
    }
    return null;
}

function findInnermostExpansionPanelWithSpanText(panelType, spanText) {
    const panels = document.querySelectorAll(panelType);
    let innermostPanel = null;
    for (let panel of panels) {
        const spans = panel.querySelectorAll('span');
        for (let span of spans) {
            if (span.innerText.includes(spanText)) {
                // Check if this panel is the innermost one so far
                if (!innermostPanel || innermostPanel.contains(panel)) {
                    innermostPanel = panel;
                }
            }
        }
    }
    return innermostPanel;
}

function saveCampaignData(campName) {
    let mainSite = document.querySelector('material-input[minerva-id="keywords-url-input"]').querySelector('input').value
    // tags
    let multiInput = document.querySelector('multi-suggest-input[minerva-id="keywords-product-service-input"]')
    let allTags = []
    let tags = multiInput.querySelectorAll('div[focusitem].content')
    for (let i = 0; i < tags.length; i++) {
        allTags.push(tags[i].innerText)
    }

    let keywordsNewline = document.querySelector('textarea[aria-label="Enter or paste keywords. You can separate each keyword by commas or enter one per line."]').value

    let showToUserFinalUrl = document.querySelector('input[aria-label="Final URL"]').value

    // headline

    let headlinePanel = findInnermostExpansionPanelWithSpanText('material-expansionpanel', 'Headlines')
    let headLineTexts = []
    let headLines = headlinePanel.querySelectorAll('input')
    headLines.forEach(headline => {
        if (headline.value != '') {
            headLineTexts.push(headline.value)
        }
    });

    // description
    let descriptionsPanel = findInnermostExpansionPanelWithSpanText('material-expansionpanel', 'Descriptions')
    let descriptionTexts = []
    let descriptions = descriptionsPanel.querySelectorAll('textarea')
    descriptions.forEach(description => {
        descriptionTexts.push(description.value)
    });

    //
    // let campName = 'testcampt' //document.getElementById('campaign-name-input').value
    let campData = {
        isActive: false,
        profileName: campName,
        data: {
            mainSite: mainSite,
            headlines: headLineTexts,
            siteUrl: mainSite,
            keywordTag: allTags,
            showToUserFinalUrl: showToUserFinalUrl,
            keywords: keywordsNewline,
            descriptionTexts: descriptionTexts
        }
    };
    console.log('-------camp', campData)
    // Send message from content.js to background.js
    chrome.runtime.sendMessage({
        dataFromContent: campData
    });


}