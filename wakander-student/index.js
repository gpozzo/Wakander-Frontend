$(function () {
    $('[data-toggle="collapse"]').collapse();
    getBooks();
    getPoints();
});

window.onload = routing;
window.onhashchange = routing;

function navigation(tab) {
    window.location.hash = tab;
}

function routing() {
    let tab = window.location.hash.slice(1);
    if((tab == "cursos") || (tab == "leituras") || (tab == "vagas") || (tab == "conquistas") || (tab == "mensagens")) {
        let menuItem = `#${tab}-nav`;

        let allButtons = document.querySelectorAll("#secondary-navigation-menu > label");
        allButtons.forEach(button => {
            button.classList.remove('secondary-nav-item-container-active');
            button.classList.add('secondary-nav-item-container');
        });

        document.querySelector(menuItem).classList.add('secondary-nav-item-container-active');
        document.querySelector(menuItem).classList.remove('secondary-nav-item-container');

        let tabs = document.querySelectorAll(".navigation-tab");
        tabs.forEach(tab => tab.style.display = 'none');
        document.getElementById(tab).style.display = 'block';
    }
}

function toggleSubmitButton() {
    var input = document.getElementById('bookEntryInput');
    var button = document.getElementById('submitBookEntry');
    let value = input.value;

    if(value.length > 1) {
        button.classList.add('success-button');
        button.classList.remove('disabled-button');
    } else {
        button.classList.remove('success-button');
        button.classList.add('disabled-button');
    }
}

function getBooks() {
    var labels = ['SUGESTÕES', 'EM ANDAMENTO', 'CONCLUÍDO'];

    $.ajax({
        type: 'GET',
        url: `https://wakanderbackend.herokuapp.com/list/articles`,
        contentType: 'json',
        success: function (data) {
            var i = 0;
            document.getElementById('livros').innerHTML = '';
            data.results.forEach(book => {
                if(i == 3) { i = 0; }
                let label = labels[i];
                let additionalButton = '';
                let labelClass = 'tag-livro-em-andamento';
                if(label == 'CONCLUÍDO') labelClass = 'tag-pontos';
                if(label == 'SUGESTÕES') labelClass = 'tag-livro-sugestoes';

                if(label == 'EM ANDAMENTO') {
                    additionalButton = `<a href="#" onClick="markBookAsRead()" class="btn btn-primary btn-sm rounded-pill success-button">MARCAR COMO CONCLUÍDA</a><br>`; 
                }

                let html = `<div class="card-container">
                            <div class="card mb-3" style="border:0px">
                                <div class="row">
                                    <div class="col-md-3" style="padding:0">
                                        <div class="main-avatar"><img src="${book.imageUrl}" style="width:80%"></img></div>
                                    </div>
                                    <div class="col" style="padding:0">
                                        <div class="card-body"><br>
                                            <label class="btn btn-primary btn-sm rounded-pill tag ${labelClass}">${labels[i]}</label>
                                            <h5 class="card-title" style="margin-top:10px;"><b>${book.name}</b></h5>
                                            <p class="card-text muted-text" style="margin-bottom:0">Autor(a): ${book.author}</p>
                                            <p class="card-text muted-text">Ano: ${book.year}</p>
                                            ${additionalButton}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                document.getElementById('livros').insertAdjacentHTML('afterbegin', html);
                i = i + 1;
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function markBookAsRead() {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.toggle();
    addPoints(10);
}

function getPoints () {
    $.ajax({
        type: 'GET',
        url: `https://wakanderbackend.herokuapp.com/bylist/users/0/thamirisoliveira@gmail.com`,
        contentType: 'json',
        success: function (data) {
            document.getElementById('userRating').innerText = data.rating;
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function addPoints (points) {

    let obj = {
        "email": "thamirisoliveira@gmail.com",
        "password": "12345678",
        "addRating": points
    };

    let json = JSON.stringify(obj);

    console.log(json);

    $.ajax({
        type: 'PUT',
        url: `https://wakanderbackend.herokuapp.com/addRating`,
        data: json,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function getTrails() {
    $.ajax({
        type: 'GET',
        url: `https://wakanderbackend.herokuapp.com/list/trails`,
        contentType: 'json',
        success: function (data) {
            var results = data.results;
            results.sort((a, b) => a.name.localeCompare(b.name))
            results.forEach(trail => {
                var option = document.createElement("option");
                option.text = trail.name;
                option.value = trail.name;
                var select = document.getElementById("selectTrail");
                select.appendChild(option);
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
}

/* Logic for the dropdown menu in the home page */
$(function () {
    $('.sel').each(function() {
        $(this).children('select').css('display', 'none');
        
        var $current = $(this);
        
        $(this).find('option').each(function(i) {
        if (i == 0) {
            $current.prepend($('<div>', {
            class: $current.attr('class').replace(/sel/g, 'sel__box')
            }));

            var placeholder = $(this).text();
            $current.prepend($('<span>', {
            class: $current.attr('class').replace(/sel/g, 'sel__placeholder'),
            text: placeholder,
            'data-placeholder': placeholder
            }));
            
            return;
        }
        
        $current.children('div').append($('<span>', {
            class: $current.attr('class').replace(/sel/g, 'sel__box__options'),
            text: $(this).text()
        }));
        });
    });
  
    $('.sel').click(function() {
        $(this).toggleClass('active');
    });

    $('.sel__box__options').click(function() {
        var txt = $(this).text();
        var index = $(this).index();
        
        $(this).siblings('.sel__box__options').removeClass('selected');
        $(this).addClass('selected');

        var $currentSel = $(this).closest('.sel');
        $currentSel.children('.sel__placeholder').text(txt);
        $currentSel.children('select').prop('selectedIndex', index + 1);
    });
});