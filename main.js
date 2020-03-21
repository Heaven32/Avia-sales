// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
 inputCitiesFrom = document.querySelector('.input__cities-from'),
 dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
 inputCitiesTo = document.querySelector('.input__cities-to'),
 dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
 inputDateDepart = document.querySelector('.input__date-depart'),
 cheapestTicket = document.getElementById('cheapest-ticket'),
 otherCheapTickets = document.getElementById('other-cheap-tickets');

// Данные
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
            return fixItem.startsWith(input.value.toLowerCase());
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

const createCard = () => {
    const ticket = document.createElement('article')
    ticket.classList.add('ticket');

    let deep ='';
    if(data) {
        deep =`
        <h3 class="agent">Aviakassa</h3>
        <div class="ticket__wrapper">
	        <div class="left-side">
		        <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
                    за 19700₽</a>
	        </div>
	        <div class="right-side">
		        <div class="block-left">
			        <div class="city__from">Вылет из города
				        <span class="city__name">Екатеринбург</span>
			        </div>
			        <div class="date">29 мая 2020 г.</div>
		        </div>
		        <div class="block-right">
			        <div class="changes">Без пересадок</div>
			        <div class="city__to">Город назначения:
				        <span class="city__name">Калининград</span>
			        </div>
		        </div>
	        </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось</h3>';
    }
    ticket.insertAdjacentHTML('afterbegin', deep)

    return ticket;
};


const renderCheapDay = (cheapTicket) => {
   const ticket = createCard(cheapTicket[0]);
   console.log(ticket);
};

const renderCheapYear = (cheapTickets) => {

    cheapTickets.sort((a,b) => {
        if(a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });
    console.log(cheapTickets)
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
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    };

    if(formData.from && formData.to){
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

        getData(calendar + requestData, (data) => {
            renderCheap(data, formData.when);
        });
    }else {
        alert('Введите корректное название города!')
    }
});


// Вызовы функции
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);

    city.sort((a,b) => {
        if(a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });
});

// getData(proxy + calendar + 
//     '' + API_KEY, (data) => {
//     const cheapTicket = JSON.parse(data).best_price.filter(item => item.depart_date === '2020-05-29')
//     console.log(cheapTicket);
// });