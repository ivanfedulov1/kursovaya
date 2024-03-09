let perPage = 5;
let currentPage = 1;
let totalPage = 0;
const mainUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/';
const tbody = document.querySelector(".tbody");
let roadName;

//отрисовка маршрутов
function routes(orders) { // это мы отрисовываем маршруты
    tbody.innerHTML = ''; 
    for (const result of orders) { //перебор массива orders
        const tr = document.createElement("tr"); 
        tr.id = result.id; //  уникальный идентификатор строки таблицы будет равен значению id, которое содержится в объекте result.
        roadName = document.createElement("td"); 
        roadName.textContent = result.name; 
        tr.append(roadName);  // добавили имя дороги
        const description = document.createElement("td"); 
        description.textContent = result.description; 
        tr.append(description); // добавили описание 
        const mainObject = document.createElement("td"); 
        mainObject.textContent = result.mainObject;
        tr.append(mainObject); //добавили главные объекты

        const changeBtn = document.createElement('button') //создаем кнопку,
        changeBtn.classList.add('changeBtn'); //добавляем класс к кнопке
        changeBtn.textContent = "Выбрать";
        changeBtn.addEventListener("click", event => guidsData(tr, event)); // стрелочная функция
        tr.append(changeBtn); //Кнопка добавляется как дочерний элемент к строке таблицы (<tr>). Таким образом, кнопка будет отображаться внутри этой строки таблицы.
        tbody.appendChild(tr); //в нашу таблицу добавляем строки как дочерний элемент
       
    
    }
}
// Пагинация
function pagination() {
    const blockPagination = document.querySelector('.pagination');
    blockPagination.innerHTML = '';
    const prevBtn = document.createElement("button"); //создание кнопки Назад
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
       // мы берем максимум между текущей страницей минус 2 и 1. Это гарантирует, что начальное значение i для цикла будет не меньше 1.
        //далее мы берем минимум между текущей страницей плюс 2 и общим количеством страниц. Это гарантирует, что конечное значение i для цикла не превысит общее количество страниц.
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

    const nextBtn = document.createElement("button"); // создание кнопки вперед
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
    const url = new URL('routes', mainUrl); //создаем URL
    url.searchParams.set('api_key', 'e5b8685a-c7e4-4f99-9891-4257e1c84d33 '); //добавляем параметр api_key
    let xhr = new XMLHttpRequest(); //создаем новый объект для выполнения запросов к серверу
    xhr.open('get', url); //инициализируем
    xhr.send();
    xhr.onload = function() {
        const data = JSON.parse(this.response); // преобразуем полученный ответ от сервера в формат JSON и сохраняем его в переменной data.
        totalPage = Math.ceil(data.length / perPage); // Мы вычисляем общее количество страниц для отображения данных, округляя в большую сторону.
        const start = currentPage * perPage - perPage; //определяем начальный и конечный индексы для отображения данных на текущей странице.
        const end = currentPage * perPage;
        
        for (const order of data) {
            const select = document.querySelector('.form-select');
            select.addEventListener('change', (event) => {
                const selectedObject = event.target.value;  // Когда происходит событие change, мы получаем значение, которое было выбрано в выпадающем списке, и сохраняем его в переменной selectedObject. event.target указывает на элемент, который вызвал событие, а .value возвращает значение этого элемента.
                filter(selectedObject); // Мы вызываем функцию filter и передаем ей выбранное значение selectedObject. Это позволяет фильтровать данные на основе выбранного значения.
            });
            for (const elem of split(order.mainObject)) { //перебираем разделенные наши главные объекты и сохраняем в elem
                const option = document.createElement("option");
                option.textContent = elem;
                select.append(option); // с помощью этого фрагмента мы добавили все проходимые объекты в наш селект
            };}
        routes(data.slice(start, end)); // . В данном случае, data.slice(start, end) создает подмассив данных, начиная с индекса start и заканчивая индексом end, который будет отображаться на текущей странице. ( метод slice() используется для создания нового массива путем извлечения части существующего массива.)
        pagination();
    };

    xhr.send();
}
//фильтрация основного объекта
function filter(selectedObject) {
    const rows = document.querySelectorAll('.tour.road tbody tr'); // получает все строки таблицы с классами
    rows.forEach((row) => { //перебирает каждую строку таблицы с помощью forEach
        if (selectedObject === "Основной объект") {
            row.style.display = ''; // display это стиль, который устанавливается на пустую строку, из за этого видно все строки
        } else {
            if (row.textContent.includes(selectedObject)) { //если выбранный обьект содержится в строке проходимое мест, то строка остается видимой
                row.style.display = ''; // Метод includes проверяет, содержит ли строка заданную подстроку.
            } else {
                row.style.display = 'none'; //иначе если не нашлось среди проходимых мест то, что мы выбрали в селекте, то ничего не отображается
            }
        }
    });
}

const select = document.querySelector('.form-select'); //присвоили наш селект, где Основной обеькт
select.addEventListener('change', (event) => { //При изменении значения в селекте, сохраняется выбранное значение в переменную selectedObject и вызывается функция filter(selectedObject).
    const selectedObject = event.target.value;
    filter(selectedObject);
});

select.addEventListener('click', (event) => {
    const selectedObject = event.target.value; //ссылается на значение элемента, который мы выбрали , хз 
    if (selectedObject === "Основной объект") { //если выбрано Основной объект, то все строки таблицы с этими классами становятся видимыми
        const rows = document.querySelectorAll('.tour.road tbody tr');
        rows.forEach((row) => {
            row.style.display = ''; 
        });
    }
});

//разбиение строки
function split(value) { // короче эта функция я так понимаю применяется для выбора обьекта, через который будет проходить маршрут, дабы разделить строки в селекте типа
    console.log(value.match(/,/g)?.length) //g говорит, что это глобальный поиск
    if ( (value.match(/,/g)?.length >= value.match(/\./g)?.length)  &&  (value.match(/,/g)?.length > value.match(/-/g)?.length) ) { //match - это метод, который ищет совпадения в строке (например мы ищем . или ,) и возвращает нам массив из этих совпадений
        return value.split(','); // Знак вопроса (?) используется, чтобы избежать ошибки, если результат match равен null
    }
    if ( (value.match(/\./g)?.length > value.match(/-/g)?.length)  &&  (value.match(/\./g)?.length >= value.match(/,/g)?.length)) {
        return value.split('.');
    }
        return value.split('-')
}


// поиск по названию
function searchTable() {
    const input = document.getElementById('tableSearchInput'); //получаем элемент с айди tableSearchInput
    const filter = input.value.toUpperCase(); //получаем значение которое мы ввели в поле, и преобразуем его в верхний регистр (нужно для того чтобы сделать поиск регистронезависимым)
    const rows = tbody.getElementsByTagName('tr'); //это метод, для получания всеъ элементов с тегом tr
    for (let row of rows) {
        let nameColumn = row.getElementsByTagName('td')[0]; //тут мы получаем первую ячейку, где название
        if (nameColumn) {
            let textValue = nameColumn.textContent || nameColumn.innerText; // получение текстового значения из колонки имени (В некоторых случаях текстовое содержимое может быть доступно через свойство textContent, а в других через свойство innerText.)
            if (textValue.toUpperCase().indexOf(filter) > -1) { //тут мы тоже поднимаем в верхний регистр (ЗНАЧЕНИЕ ИЗ СТОЛБЦА НАЗВАНИЯ, КОТОРОЕ МЫ ПОЛУЧИЛИ ИЗ АПИШКИ) -- indexOf ищет в строке заданный символ или строку и возвращает их индекс --
                row.style.display = '';
            } else {
                row.style.display = 'None';
            }
        }
    }
}


// Список гидов
const tbodyguids = document.querySelector(".tbody-guids")

function guidsData(tr, event) { //функция guidsData используется для загрузки данных о гидах для конкретного маршрута, обновления содержимого страницы и отображения информации о гидах на странице.
    tbodyguids.innerHTML = "";
    const guidsRoad = tr.id;
    const guidesUrl = `/api/routes/${guidsRoad}/guides`;
    const xhr = new XMLHttpRequest(); // С помощью XMLHttpRequest() можно отправлять запросы на сервер и получать ответы от него без перезагрузки страницы
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
    tr.append(name); // создаем и добавляем в ячейку строки имя нащего гида
    const language = document.createElement('td');
    language.textContent = orders.language;
    tr.append(language); // добавляем язык
    const workExperience = document.createElement('td');
    workExperience.textContent = orders.workExperience;
    tr.append(workExperience); // добавляем опыт работы
    const pricePerHour = document.createElement('td');
    pricePerHour.textContent = `${orders.pricePerHour}₽`;
    tr.append(pricePerHour); //добавляем цену в час (все значения берутся из обьекта orders)
    const gidButton = document.createElement('button')
    gidButton.classList.add('gidButton')
    gidButton.textContent = "Выбрать"; // создаем кнопку и называем ее Выбрать
    gidButton.addEventListener("click", event => modal(orders, roadName)); // при нажатии на кнопку вызывается функция modal котора открывает моальное окно
    gidButton.setAttribute("data-bs-toggle", "modal") // это специальный атрибут в HTML, который говорит браузеру, что при событии (например, нажатии на кнопку) нужно показать или скрыть какой-то элемент на странице.
    gidButton.setAttribute("data-bs-target", "#exampleModal") //указывает на модальное окно в html с id=exampleModal, чтобы оно открылось
    tr.append(gidButton);
    tbodyguids.appendChild(tr) // строка добавляется в тело таблицы 
}

// Модальное окно
function modal(orders) {
    const fio = document.querySelector('.guidname');
    fio.textContent = `ФИО гида: ${orders.name}`;

    const nameRoad = document.querySelector('.roadname');
    nameRoad.textContent = `Название маршрута: ${roadName.textContent}`;
}

window.addEventListener('DOMContentLoaded', service);



