function updateIcon(daysUntilNextBirthday) {
    let iconFile;
    console.log('daysUntilNextBirthday:', daysUntilNextBirthday); // Debugging line

    if (daysUntilNextBirthday <= 9) {
        iconFile = `images/icon${daysUntilNextBirthday}.png`;
    } else {
        iconFile = 'images/image128.png';
    }

    console.log('iconFile:', iconFile); // Debugging line
    chrome.browserAction.setIcon({ path: iconFile });
}


function displayUpcomingBirthday() {
    chrome.storage.local.get({ birthdays: [] }, function (result) {
        let birthdays = result.birthdays;
        if (birthdays.length === 0) return;

        let today = new Date();
        let todayStr = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

        birthdays.sort((a, b) => {
            let aMMDD = a.birthday.split('-').slice(1).join('-');
            let bMMDD = b.birthday.split('-').slice(1).join('-');
            return aMMDD.localeCompare(bMMDD);
        });

        let upcoming = birthdays.find(b => b.birthday.split('-').slice(1).join('-') >= todayStr) || birthdays[0];

        let upcomingDate = new Date(today.getFullYear(), parseInt(upcoming.birthday.split('-')[1]) - 1, parseInt(upcoming.birthday.split('-')[2]));
        if (upcomingDate < today) upcomingDate.setFullYear(today.getFullYear() + 1);

        // Here’s the new check:
        if (upcoming.birthday.split('-').slice(1).join('-') === todayStr) {
            document.getElementById('upcoming-name').textContent = `Happy Birthday, ${upcoming.name}!`;
            document.getElementById('countdown').textContent = `Today is the day! 🎉`;
            updateIcon(0); // Assuming 0 will represent today in your icon set
            return;
        }

        let diffTime = upcomingDate - today;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        document.getElementById('upcoming-name').textContent = `${upcoming.name}: ${upcoming.birthday.split('-').slice(1).join('-')}`;

        if (diffDays === 1) {
            document.getElementById('countdown').textContent = `In ${diffHours % 24} hours!`; // ${diffHours % 24} hours
        } else {
            document.getElementById('countdown').textContent = `In ${diffDays} days`; // ${diffHours % 24} hours
        }
        
        updateIcon(diffDays); // Your existing call to updateIcon
    });
}

function displayAllBirthdays() {
    let tableBody = document.querySelector('#birthdays-table tbody');
    tableBody.innerHTML = "";

    chrome.storage.local.get({ birthdays: [] }, function (result) {
        let birthdays = result.birthdays;
        if (birthdays.length === 0) return;
        
        birthdays.sort((a, b) => {
            let aMMDD = a.birthday.split('-').slice(1).join('-');
            let bMMDD = b.birthday.split('-').slice(1).join('-');
            return aMMDD.localeCompare(bMMDD);
        });
        
        birthdays.forEach(b => {
            let row = tableBody.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);

            cell1.textContent = b.name;
            cell2.textContent = b.birthday.split('-').slice(1).join('-');

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function () {
                birthdays = birthdays.filter(birthday => birthday !== b);
                chrome.storage.local.set({ birthdays }, function () {
                    displayUpcomingBirthday();
                    displayAllBirthdays();
                });
            });

            cell3.appendChild(deleteButton);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    displayUpcomingBirthday();
    displayAllBirthdays();
});

document.getElementById('birthday-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let birthday = document.getElementById('birthday').value;

    chrome.storage.local.get({ birthdays: [] }, function (result) {
        let birthdays = result.birthdays;
        birthdays.push({ name, birthday });
        chrome.storage.local.set({ birthdays }, function () {
            displayUpcomingBirthday();
            displayAllBirthdays();
        });
    });
});