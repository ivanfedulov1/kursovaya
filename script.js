let perPage = 5;
let currentPage = 1;
let totalPage = 0;
const mainUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/';
const tbody = document.querySelector(".tbody");
let roadName;

//отрисовка маршрутов
function routes(orders) { 
    tbody.innerHTML = ''; 
    for (const result of orders) {
        const tr = document.createElement("tr"); 
        tr.id = result.id; 
        roadName = document.createElement("td"); 
        roadName.textContent = result.name; 
        tr.append(roadName); 
        const description = document.createElement("td"); 
        description.textContent = result.description; 
        tr.append(description); 
        const mainObject = document.createElement("td"); 
        mainObject.textContent = result.mainObject;
        tr.append(mainObject); 

        const changeBtn = document.createElement('button')
        changeBtn.classList.add('changeBtn');
        changeBtn.textContent = "Выбрать";
        changeBtn.addEventListener("click", event => guidsData(tr, event));
        tr.append(changeBtn);
        tbody.appendChild(tr);
       
    
    }
}
// Пагинация
function pagination() {
    const blockPagination = document.querySelector('.pagination');
    blockPagination.innerHTML = '';
    const prevBtn = document.createElement("button");
    prevBtn.classList.add('prevBtn');
    prevBtn.textContent = 'Назад';
    prevBtn.style.margin = '2px';
    prevBtn.addEventListener('click', (event) => {
        if (currentPage > 1) {
            currentPage--;
            service();
        }
    });
    blockPagination.append(prevBtn);

    for (let i = Math.max(parseInt(currentPage) - 2, 1); i <= Math.min(parseInt(currentPage) + 2, totalPage); i++) {
        const btn = document.createElement('button');
        btn.classList.add('pagBtn')
        btn.textContent = i;
        btn.addEventListener('click', (event)=>{
            const target = event.target;
            currentPage = target.textContent;
            service();
        });
        if (currentPage == i) {
            btn.style.backgroundColor = 'red';
        } else {
            btn.style.backgroundColor = 'none';
        }
        
        blockPagination.append(btn);   }

    const nextBtn = document.createElement("button");
    nextBtn.classList.add('nextBtn');
    nextBtn.textContent = 'Вперёд';
    nextBtn.style.margin = '2px';
    nextBtn.style.backgroundColor = 'none';
    nextBtn.addEventListener('click', (event) => {
        if (currentPage < totalPage) {
            currentPage++;
            service();
        }
    });
    blockPagination.append(nextBtn);
    
} 

//для получения данных сервиса и вызова некоторых функций
function service() {
    const url = new URL('routes', mainUrl);
    url.searchParams.set('api_key', 'e5b8685a-c7e4-4f99-9891-4257e1c84d33 ');
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        totalPage = Math.ceil(data.length / perPage);
        const start = currentPage * perPage - perPage;
        const end = currentPage * perPage;
        
        for (const order of data) {
            const select = document.querySelector('.form-select');
            //select.addEventListener('change', (event) => {
                //const selectedObject = event.target.value;  
                //filter(selectedObject);
           // });
            for (const elem of split(order.mainObject)) {
                const option = document.createElement("option");
                option.textContent = elem;
                select.append(option);
            };}
        routes(data.slice(start, end));
        pagination();
    };

    xhr.send();
}
//фильтрация основного объекта
function filter(selectedObject) {
    const rows = document.querySelectorAll('.tour.road tbody tr');
    rows.forEach((row) => {
        if (selectedObject === "Основной объект") {
            row.style.display = '';
        } else {
            if (row.textContent.includes(selectedObject)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

const select = document.querySelector('.form-select');
select.addEventListener('change', (event) => {
    const selectedObject = event.target.value;
    filter(selectedObject);
});

select.addEventListener('click', (event) => {
    const selectedObject = event.target.value;  
    if (selectedObject === "Основной объект") {
        const rows = document.querySelectorAll('.tour.road tbody tr');
        rows.forEach((row) => {
            row.style.display = ''; 
        });
    }
});

//разбиение строки
function split(value) {
    console.log(value.match(/,/g)?.length)
    if (value.match(/,/g)?.length>=value.match(/\./g)?.length && value.match(/,/g)?.length>value.match(/-/g)?.length) {
        return value.split(',');
    }
    if (value.match(/\./g)?.length>value.match(/-/g)?.length && value.match(/\./g)?.length>=value.match(/,/g)?.length) {
        return value.split('.');
    }
        return value.split('-')
}
// поиск по названию
function searchTable() {
    const input = document.getElementById('tableSearchInput');
    const filter = input.value.toUpperCase();
    const rows = tbody.getElementsByTagName('tr');
    for (let row of rows) {
        let nameColumn = row.getElementsByTagName('td')[0];
        if (nameColumn) {
            let textValue = nameColumn.textContent || nameColumn.innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}


// Список гидов
const tbodyguids = document.querySelector(".tbody-guids")

function guidsData(tr, event) {
    tbodyguids.innerHTML = "";
    const guidsRoad = tr.id;
    const guidesUrl = `/api/routes/${guidsRoad}/guides`;
    const xhr = new XMLHttpRequest();
    const newUrl = new URL(guidesUrl, mainUrl);
    newUrl.searchParams.set('api_key', 'e5b8685a-c7e4-4f99-9891-4257e1c84d33');
    xhr.open("get", newUrl);
    xhr.onload = function() {
        const records = JSON.parse(xhr.response);
        console.log(guidesUrl);
        for (const record of records) {
            console.log(record);
            guides(record);
        }
    };
    xhr.send();
}




// Список гидов
function guides(orders) {
    const tr = document.createElement('tr');
    tr.id = orders.id;
    const name = document.createElement('td');
    name.textContent = orders.name;
    tr.append(name);
    const language = document.createElement('td');
    language.textContent = orders.language;
    tr.append(language);
    const workExperience = document.createElement('td');
    workExperience.textContent = orders.workExperience;
    tr.append(workExperience);
    const pricePerHour = document.createElement('td');
    pricePerHour.textContent = `${orders.pricePerHour}₽`;
    tr.append(pricePerHour);
    const gidButton = document.createElement('button')
    gidButton.classList.add('gidButton')
    gidButton.textContent = "Выбрать";
    gidButton.addEventListener("click", event => modal(orders, roadName));
    gidButton.setAttribute("data-bs-toggle", "modal")
    gidButton.setAttribute("data-bs-target", "#exampleModal")
    tr.append(gidButton);
    tbodyguids.appendChild(tr)
}

// Модальное окно
function modal(orders) {
    const fio = document.querySelector('.guidname');
    fio.textContent = `ФИО гида: ${orders.name}`;

    const nameRoad = document.querySelector('.roadname');
    nameRoad.textContent = `Название маршрута: ${roadName.textContent}`;
}

window.addEventListener('DOMContentLoaded', service);