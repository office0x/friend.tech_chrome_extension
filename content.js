console.log('Twitter friend.tech extension loaded');

// Function to fetch data by nickname. It works and receives a response.
async function getFriendTechData(nickname) {
  console.log(nickname)
  try {
    // Make a request to the FriendTech API.
    // HTTPS is required here for debugging purposes.
    let api_url = `https://lensnames.xyz/user/` + nickname
    console.log(api_url)
    const response = await fetch(api_url);
    console.log(response)
    if (!response.ok) {
      throw new Error('Error while executing API request');
    }

    const json_response = await response.json();
    // Extract data from the API response.
    if (json_response.exists) {
      // Return account data in JSON format.
      return json_response.data;

    } else {
      return null; // Return null when the 'id' field is not found.
    }
  } catch (error) {
    console.error('Error while executing API request:', error);
    return null; // Return null in case of an error.
  }
}

// Function to insert data into the page body.
function insertFriendTechData(nickname) {
  getFriendTechData(nickname)
    .then((FriendTechData) => {
      if (FriendTechData !== null) {

        // Create a div for the account data.
        const newDiv = document.createElement('div');
        newDiv.className = 'friend-tech-container';

        // Create a table.
        const newTable = document.createElement('table');
        newTable.className = 'friend-tech-table';

        // Create a table row.
        const headerRow = document.createElement('tr');

        // Create column headers.
        const columnHeaders = ['Price', 'Holders', 'Supply', 'Last Seen', 'Last Message', 'Action'];

        // Create column headers and add them to the row.
        for (let headerText of columnHeaders) {
          const headerCell = document.createElement('th');
          headerCell.textContent = headerText;
          headerRow.appendChild(headerCell);
        }

        // Add the header row to the table.
        newTable.appendChild(headerRow);

        // Create a data row.
        const dataRow = document.createElement('tr');

        // Create data cells for each column.
        const priceCell = document.createElement('td');
        priceCell.textContent = `${(parseFloat(FriendTechData.displayPrice) / 1e18).toFixed(2)} ETH`;
        dataRow.appendChild(priceCell);

        const holdersCell = document.createElement('td');
        holdersCell.textContent = FriendTechData.holderCount;
        dataRow.appendChild(holdersCell);

        const supplyCell = document.createElement('td');
        supplyCell.textContent = FriendTechData.shareSupply;
        dataRow.appendChild(supplyCell);

        const currentTime = Date.now();
        const lastOnlineTime = parseInt(FriendTechData.lastOnline, 10);
        const lastMessageTime = parseInt(FriendTechData.lastMessageTime, 10);
        console.log(lastMessageTime)

        const lastSeenDiff = (lastOnlineTime > 0 && lastOnlineTime !== null) 
        ? Math.round((currentTime - lastOnlineTime) / (1000 * 60)) // In minutes
        : "-";

        const lastSeenCell = document.createElement('td');
        lastSeenCell.textContent = `${lastSeenDiff} min ago`;
        dataRow.appendChild(lastSeenCell);

        const lastMessageDiff = (lastMessageTime > 0 && lastMessageTime !== null) 
        ? Math.round((currentTime - lastMessageTime) / (1000 * 60)) // In minutes
        : "-";
        const lastMessageCell = document.createElement('td');
        lastMessageCell.textContent = `${lastMessageDiff} min ago`;
        dataRow.appendChild(lastMessageCell);

        // Create a "Buy" button with a link and add it to the last cell.
        const buyButtonCell = document.createElement('td');
        const buyButton = document.createElement('a');
        buyButton.id = 'buyButton'; // Add an identifier 'buyButton'
        buyButton.textContent = 'Buy';
        buyButton.href = 'https://www.friend.tech/rooms/' + FriendTechData.address;
        buyButton.target = '_blank';
        buyButtonCell.appendChild(buyButton);
        dataRow.appendChild(buyButtonCell);

        // Add the data row to the table.
        newTable.appendChild(dataRow);

        // Add the table to the div.
        newDiv.appendChild(newTable);
        
        // Proceed to add
        // If the page does not already have a friend-tech container, add it.
        if (!document.querySelector('.friend-tech-container')) {
            // Specify the class to which to add our container.
            const ClassForFriendTechData = document.querySelector('[data-testid="UserName"]');
            
            // If the desired div with the class is found
            if (ClassForFriendTechData) {
                // Append it to the end of the DIV.
                ClassForFriendTechData.appendChild(newDiv);
            }

        // If there is already a friend.tech data container
        } else {
            // The link already exists on the page, check it.
            let existingFriendTechData = document.querySelector('.friend-tech-container');
            const buyButton = existingFriendTechData.querySelector('#buyButton'); // Find the button by identifier

            if (buyButton) {
              const href = buyButton.getAttribute('href'); // Get the href attribute value
              const regex = /https:\/\/www\.friend\.tech\/rooms\/([^\s]+)/; // Regular expression for extracting the address
              const match = href.match(regex); // Find matches with the regular expression
            
              if (match) {
                const oldAddress = match[1];
                console.log(oldAddress);
                if (oldAddress !== FriendTechData.address) {
                  // Replace the content of the existing element with the content of newDiv
                  existingFriendTechData.innerHTML = newDiv.innerHTML;
                }
              } else {
                console.log('Address not found');
              }
            } else {
                console.log('Buy button not found.');
            }
          }
      } else {
        let existingFriendTechData = document.querySelector('.friend-tech-container');
        if (existingFriendTechData) {
          existingFriendTechData.remove();
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Main function in which other functions are executed sequentially.
function main() {
    let currentUrl = window.location.href;
    console.log(currentUrl);
    // If we are on the profile page
    if (currentUrl.startsWith('https://twitter.com/')) {
        // Extract the username from the URL.
        const regex = /twitter\.com\/([a-zA-Z0-9_]+)/;
        const match = currentUrl.match(regex);
        console.log(match[1]);

        if (match && match[1]) {
          const username = match[1];
          // Insert data
          insertFriendTechData(username);
        }
        
    }
}

// Periodically check the URL and add the link if necessary.
const intervalId = setInterval(main, 1000);
