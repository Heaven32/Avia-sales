// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
 inputCitiesFrom = document.querySelector('.input__cities-from'),
 dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
 inputCitiesTo = document.querySelector('.input__cities-to'),
 dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
 inputDateDepart = document.querySelector('.input__date-depart');

// База данных город
const citiesApi = 'dataBase/cities.json',
 proxy = 'https://cors-anywhere.herokuapp.com/',
 API_KEY = 'a81e4fc4cc83ee6fa5bfb0b3a5bee2ac',
 calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];
// Функции 

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;

        if(request.status === 200) {
            callback(request.response);
        }else {
            console.error(request.status);
        }
    });

    request.send();
};

const showCity = (input, list) => {
    list.textContent= '';

    if(input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__cities');
            li.textContent = item.name;
            list.append(li)
        });
    }
};

const clickLiForm = (q,v) => {
    q.addEventListener('click', (event) => {
        const target = event.target;
        v.value = target.textContent;
        q.textContent = '';
    })
};

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};

// Обработчики события
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

clickLiForm(dropdownCitiesFrom, inputCitiesFrom);
clickLiForm(dropdownCitiesTo, inputCitiesTo);

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name
    });
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name
    });
    
    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    };

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`;

    const requestData2 = '?depart_date=' + formData.when +
        '&origin=' + formData.from +
        '&destination=' + formData.to +
        '&one_way=true';

    getData(calendar + requestData, (data) => {
        renderCheap(data, formData.when);
    });
    
});


// Вызовы функции
getData(citiesApi,data => city = JSON.parse(data).filter(item => item.name));

// getData(proxy + calendar + 
//     '' + API_KEY, (data) => {
//     const cheapTicket = JSON.parse(data).best_price.filter(item => item.depart_date === '2020-05-29')
//     console.log(cheapTicket);
// });